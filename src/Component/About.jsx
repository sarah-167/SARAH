import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './About.css';
import './Dashboard.css'; // Reusing dashboard styles for consistency

function About() {
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const navigate = useNavigate();

    const toggleMenu = () => {
        setIsMenuOpen(!isMenuOpen);
    };

    return (
        <div className="dashboard">
            <header className="dashboard-header">
                <div className="nav-container">
                    <div className="menu-icon" onClick={toggleMenu}>
                        ☰
                    </div>
                    {isMenuOpen && (
                        <nav className="nav-menu">
                            <div className="nav-menu-header">
                                <div className="close-icon" onClick={toggleMenu}>
                                    ×
                                </div>
                            </div>
                            <ul>
                                <li onClick={() => navigate('/dashboard')}>Home</li>
                                <li onClick={() => navigate('/about')}>About</li>
                                <li onClick={() => navigate('/team')}>Team</li>
                                <li onClick={() => navigate('/login')}>Logout</li>
                            </ul>
                        </nav>
                    )}
                </div>
                <h1>About Us</h1>
            </header>

            <main className="about-content">
                <section className="about-hero">
                    <h2>Our Mission</h2>
                    <p>We are dedicated to providing the best analytical tools for modern businesses.</p>
                </section>

                <section className="about-details">
                    <div className="detail-box">
                        <h3>Our Story</h3>
                        <p>Founded in 2024, we started with a simple goal: making data accessible and actionable for everyone. Our journey has been driven by innovation and a passion for excellence.</p>
                    </div>
                    <div className="detail-box">
                        <h3>Our Values</h3>
                        <ul>
                            <li><strong>Integrity:</strong> We believe in honest and transparent data practices.</li>
                            <li><strong>Innovation:</strong> Constantly pushing the boundaries of what's possible.</li>
                            <li><strong>Collaboration:</strong> Success is a team sport.</li>
                        </ul>
                    </div>
                </section>
            </main>

            <footer className="dashboard-footer">
                <div className="footer-content">
                    <div className="contact-info">
                        <h4>Contact Us</h4>
                        <p>Email: support@example.com</p>
                        <p>Phone: +1 (123) 456-7890</p>
                    </div>
                    <div className="social-media">
                        <h4>Follow Us</h4>
                        <div className="social-links">
                            <a href="#" aria-label="Facebook">
                                <svg viewBox="0 0 24 24" width="24" height="24" fill="currentColor">
                                    <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"></path>
                                </svg>
                            </a>
                            <a href="#" aria-label="GitHub">
                                <svg viewBox="0 0 24 24" width="24" height="24" fill="currentColor">
                                    <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.041-1.416-4.041-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/>
                                </svg>
                            </a>
                            <a href="mailto:support@example.com" aria-label="Email">
                                <svg viewBox="0 0 24 24" width="24" height="24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                    <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"></path>
                                    <polyline points="22,6 12,13 2,6"></polyline>
                                </svg>
                            </a>
                            <a href="#" aria-label="Instagram">
                                <svg viewBox="0 0 24 24" width="24" height="24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                    <rect x="2" y="2" width="20" height="20" rx="5" ry="5"></rect>
                                    <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path>
                                    <line x1="17.5" y1="6.5" x2="17.51" y2="6.5"></line>
                                </svg>
                            </a>
                        </div>
                    </div>
                </div>
                <div className="footer-bottom">
                    <p>&copy; 2024 Your Company. All rights reserved.</p>
                </div>
            </footer>
        </div>
    );
}

export default About;
