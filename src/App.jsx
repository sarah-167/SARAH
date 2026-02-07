import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import Login from "./Component/Login";
import Register from "./Component/Register";
import Dashboard from "./Component/Dashboard";
import About from "./Component/About";
import Team from "./Component/Team";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Navigate to="/login" />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/about" element={<About />} />
        <Route path="/team" element={<Team />} />
      </Routes>
    </Router>
  );
}

export default App;
