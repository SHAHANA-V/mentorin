import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import API_BASE_URL from '../apiConfig';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setError('');

    try {
      const res = await fetch(`${API_BASE_URL}/login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          email: email,
          password: password
        })
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.message);
        return;
      }

      // Save user to localStorage
      localStorage.setItem("user", JSON.stringify(data.user));

      // Go to dashboard based on role
      if (data.user.role === "admin") {
        navigate("/admin");
      } else {
        navigate("/dashboard");
      }

    } catch (err) {
      setError("Server not reachable");
      console.error(err);
    }
  };

  // 🔥 LOAD DATA FROM BACKEND
  const loadAnalytics = () => {
    fetch(`${API_BASE_URL}/analytics/all`)
      .then(res => res.json())
      .then(data => {
        // Assuming setMentors is defined elsewhere or this is a placeholder
        // setMentors(data); 
        console.log("Analytics data:", data); // Log data as setMentors is not defined
      })
      .catch(err => {
        console.error("Analytics error", err);
      });
  };

  const handleAdminQuickLogin = async (e) => {
    e.preventDefault();
    setError('');

    try {
      const res = await fetch(`${API_BASE_URL}/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: "admin@mentorin.com", password: "admin" })
      });

      const data = await res.json();
      if (!res.ok) {
        setError(data.message);
        return;
      }
      localStorage.setItem("user", JSON.stringify(data.user));
      navigate("/admin");
    } catch (err) {
      setError("Server not reachable");
    }
  };

  return (
    <div className="auth-bg">
      <div className="auth-card">
        {/* LOGO / BRAND */}
        <h2>Welcome Back 👋</h2>
        <p style={{textAlign: "center", color: "#6b7280", marginBottom: "25px"}}>
          Login to continue your mentorship journey
        </p>

        {error && <p style={{color: "#ef4444", textAlign: "center", marginBottom: "15px"}}>{error}</p>}

        {/* EMAIL */}
        <input 
          type="email" 
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="Email address" 
          required 
        />

        {/* PASSWORD */}
        <input 
          type="password" 
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="Password" 
          required 
        />

        {/* EXTRA OPTIONS */}
        <div style={{display: "flex", justifyContent: "space-between", alignItems: "center", fontSize: "14px", marginBottom: "15px"}}>
          <label style={{display: "flex", gap: "6px", alignItems: "center"}}>
            <input type="checkbox" /> Remember me
          </label>
          <a href="#" style={{color: "#2563eb", textDecoration: "none"}}>Forgot?</a>
        </div>

        {/* LOGIN BUTTON */}
        <button className="btn" onClick={handleLogin}>Login</button>

        {/* DIVIDER */}
        <div style={{textAlign: "center", margin: "20px 0", color: "#9ca3af"}}>
          ── or ──
        </div>

        {/* SOCIAL LOGIN (UI ONLY) */}
        <button className="btn" style={{background: "#111827", marginBottom: "10px"}}>
          Continue with Google
        </button>

        {/* QUICK ADMIN LOGIN */}
        <button className="btn" style={{background: "#1e3a8a"}} onClick={handleAdminQuickLogin}>
          Login as Admin 
        </button>

        {/* SWITCH */}
        <p className="switch">
          New to Mentorin?
          <Link to="/register">Create an account</Link>
        </p>
      </div>
    </div>
  );
};

export default Login;


