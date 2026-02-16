import express from 'express';
import mysql from 'mysql2/promise';
import cors from 'cors';
import dotenv from 'dotenv';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config({ path: path.join(__dirname, '../.env') });

const app = express();
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Request logging middleware
app.use((req, res, next) => {
    console.log(`${new Date().toISOString()} - ${req.method} ${req.url}`);
    console.log('Body:', req.body);
    next();
});

const dbConfig = {
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0
};

let db;

async function connectDB() {
    console.log('Connecting to database...');
    try {
        // First connect without database to ensure it exists
        console.log('Checking if database exists...');
        const connection = await mysql.createConnection({
            host: process.env.DB_HOST,
            user: process.env.DB_USER,
            password: process.env.DB_PASSWORD,
        });
        
        await connection.query(`CREATE DATABASE IF NOT EXISTS \`${process.env.DB_NAME}\``);
        await connection.end();
        console.log('Database check complete.');

        // Now connect using a pool for reliability
        db = mysql.createPool(dbConfig);
        console.log('Connected to MySQL database pool');

        // Create table if not exists
        console.log('Ensuring users table exists...');
        await db.execute(`
            CREATE TABLE IF NOT EXISTS users (
                id INT AUTO_INCREMENT PRIMARY KEY,
                username VARCHAR(255) NOT NULL UNIQUE,
                email VARCHAR(255) NOT NULL UNIQUE,
                password VARCHAR(255) NOT NULL,
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            )
        `);
        console.log('Database initialization complete.');
    } catch (error) {
        console.error('Database initialization failed:', error.message);
        process.exit(1);
    }
}

connectDB();

// Register Endpoint
app.post('/api/register', async (req, res) => {
    const { username, email, password } = req.body;
    console.log(`[REGISTER] attempt for ${email}`);
    
    if (!username || !email || !password) {
        console.log(`[REGISTER] missing fields for ${email}`);
        return res.status(400).json({ error: 'All fields are required' });
    }
    
    try {
        const hashedPassword = await bcrypt.hash(password, 10);
        await db.execute(
            'INSERT INTO users (username, email, password) VALUES (?, ?, ?)',
            [username, email, hashedPassword]
        );
        console.log(`[REGISTER] success for ${email}`);
        res.status(201).json({ message: 'User registered successfully' });
    } catch (error) {
        console.error('[REGISTER] error:', error.message);
        if (error.code === 'ER_DUP_ENTRY') {
            return res.status(409).json({ error: 'Username or email already exists' });
        }
        res.status(500).json({ error: error.message });
    }
});

// Login Endpoint
app.post('/api/login', async (req, res) => {
    const { email, password } = req.body;
    console.log(`[LOGIN] attempt for ${email}`);
    
    if (!email || !password) {
        console.log(`[LOGIN] missing fields for ${email}`);
        return res.status(400).json({ message: 'Email and password are required' });
    }
    
    try {
        const [rows] = await db.execute('SELECT * FROM users WHERE email = ?', [email]);
        if (rows.length === 0) {
            console.log(`[LOGIN] user not found: ${email}`);
            return res.status(401).json({ message: 'Invalid email or password' });
        }
        const user = rows[0];
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            console.log(`[LOGIN] password mismatch for ${email}`);
            return res.status(401).json({ message: 'Invalid email or password' });
        }
        
        const secret = process.env.JWT_SECRET || 'fallback_secret';
        const token = jwt.sign({ id: user.id, username: user.username }, secret, { expiresIn: '1h' });
        console.log(`[LOGIN] success for ${email}`);
        res.json({ token, user: { id: user.id, username: user.username, email: user.email } });
    } catch (error) {
        console.error('[LOGIN] error:', error.message);
        res.status(500).json({ message: error.message });
    }
});

// Middleware to verify JWT
const authenticateToken = (req, res, next) => {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];
    if (!token) return res.sendStatus(401);

    jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
        if (err) return res.sendStatus(403);
        req.user = user;
        next();
    });
};

// Dashboard Endpoints
app.get('/api/users', authenticateToken, async (req, res) => {
    try {
        const [rows] = await db.execute('SELECT id, username, email, created_at FROM users');
        res.json(rows);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

app.put('/api/users/:id', authenticateToken, async (req, res) => {
    const { id } = req.params;
    const { username, email } = req.body;
    try {
        await db.execute('UPDATE users SET username = ?, email = ? WHERE id = ?', [username, email, id]);
        res.json({ message: 'User updated successfully' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

app.delete('/api/users/:id', authenticateToken, async (req, res) => {
    const { id } = req.params;
    try {
        await db.execute('DELETE FROM users WHERE id = ?', [id]);
        res.json({ message: 'User deleted successfully' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

const PORT = 5001;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
