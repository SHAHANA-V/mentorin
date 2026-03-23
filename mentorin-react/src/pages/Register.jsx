import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';

const Register = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    role: '',
    password: '',
    confirmPassword: '',
    skills: '',
    experience: '',
    domain: '',
    bio: '',
    linkedin: ''
  });
  const [error, setError] = useState('');
  const [passwordStrength, setPasswordStrength] = useState({
    text: 'Password strength',
    width: '0%',
    color: 'red'
  });
  const [confirmError, setConfirmError] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const val = formData.password;
    let strength = 0;

    if (val.length >= 6) strength++;
    if (/[A-Z]/.test(val)) strength++;
    if (/[0-9]/.test(val)) strength++;
    if (/[^A-Za-z0-9]/.test(val)) strength++;

    if (strength <= 1) {
      setPasswordStrength({
        text: 'Weak password',
        width: '25%',
        color: '#ef4444'
      });
    } else if (strength === 2) {
      setPasswordStrength({
        text: 'Medium password',
        width: '50%',
        color: '#f59e0b'
      });
    } else {
      setPasswordStrength({
        text: 'Strong password',
        width: '100%',
        color: '#22c55e'
      });
    }
  }, [formData.password]);

  useEffect(() => {
    setConfirmError(formData.password !== formData.confirmPassword && formData.confirmPassword !== '');
  }, [formData.password, formData.confirmPassword]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    setError('');

    if (!formData.name || !formData.email || !formData.password || !formData.role) {
      setError("Please fill all fields");
      return;
    }

    if (formData.password !== formData.confirmPassword) {
      setError("Passwords do not match");
      return;
    }

    try {
      const payload = {
        name: formData.name,
        email: formData.email,
        password: formData.password,
        role: formData.role
      };

      if (formData.role === 'mentor') {
        payload.skills = formData.skills;
        payload.experience = formData.experience;
        payload.domain = formData.domain;
        payload.bio = formData.bio;
        payload.linkedin = formData.linkedin;
        payload.trustScore = 60; // Default trust score
      }

      const res = await fetch("https://mentorin-backend.onrender.com/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify(payload)
      });

      const data = await res.json();
      
      if (!res.ok) {
        setError(data.message || "Registration failed");
        return;
      }

      alert(data.message);
      navigate("/login");

    } catch (err) {
      console.error(err);
      setError("Registration failed");
    }
  };

  return (
    <div className="auth-bg">
      <div className="auth-card">
        {/* HEADER */}
        <h2>Create Account 🚀</h2>
        <p style={{textAlign: "center", color: "#6b7280", marginBottom: "25px"}}>
          Join Mentorin and start your trusted mentorship journey
        </p>

        {error && <p style={{color: "#ef4444", textAlign: "center", marginBottom: "15px"}}>{error}</p>}

        {/* FULL NAME */}
        <input 
          type="text" 
          name="name"
          value={formData.name}
          onChange={handleInputChange}
          placeholder="Full Name" 
          required 
        />

        {/* EMAIL */}
        <input 
          type="email" 
          name="email"
          value={formData.email}
          onChange={handleInputChange}
          placeholder="Email Address" 
          required 
        />

        {/* ROLE */}
        <select 
          name="role"
          value={formData.role}
          onChange={handleInputChange}
          required
        >
          <option value="">Select your role</option>
          <option value="student">Student</option>
          <option value="mentor">Mentor</option>
        </select>

        {/* DYNAMIC MENTOR FIELDS */}
        {formData.role === 'mentor' && (
          <div className="mentor-fields fade-in">
            <input 
              type="text" 
              name="domain"
              value={formData.domain}
              onChange={handleInputChange}
              placeholder="Domain (e.g., Software Engineering)" 
              required 
            />
            <input 
              type="text" 
              name="skills"
              value={formData.skills}
              onChange={handleInputChange}
              placeholder="Skills / Expertise (comma separated)" 
              required 
            />
            <input 
              type="text" 
              name="experience"
              value={formData.experience}
              onChange={handleInputChange}
              placeholder="Years of Experience (e.g., 5+ Years)" 
              required 
            />
            <textarea
              name="bio"
              value={formData.bio}
              onChange={handleInputChange}
              placeholder="Short Bio"
              className="form-textarea"
              required
            ></textarea>
            <input 
              type="url" 
              name="linkedin"
              value={formData.linkedin}
              onChange={handleInputChange}
              placeholder="LinkedIn / Portfolio URL" 
              required 
            />
          </div>
        )}

        {/* PASSWORD */}
        <input 
          type="password" 
          name="password"
          value={formData.password}
          onChange={handleInputChange}
          placeholder="Create Password" 
          required 
        />
        
        <div className="password-strength">
          <span id="strengthText">{passwordStrength.text}</span>
          <div className="strength-bar">
            <div 
              id="strengthFill" 
              style={{
                width: passwordStrength.width,
                background: passwordStrength.color,
                transition: 'width 0.3s, background 0.3s'
              }}
            />
          </div>
        </div>

        {/* CONFIRM PASSWORD */}
        <div className="input-group">
          <input 
            type="password" 
            name="confirmPassword"
            value={formData.confirmPassword}
            onChange={handleInputChange}
            placeholder="Re-enter password" 
            required
          />
          {confirmError && (
            <small style={{color: "#ef4444", display: "block"}}>
              Passwords do not match
            </small>
          )}
        </div>

        {/* TERMS */}
        <div className="terms">
          <input type="checkbox" id="terms" required />
          <label htmlFor="terms">
            I agree to the <a href="#">Terms & Privacy</a>
          </label>
        </div>

        {/* REGISTER BUTTON */}
        <button className="btn" onClick={handleRegister}>Create Account</button>

        {/* DIVIDER */}
        <div style={{textAlign: "center", margin: "20px 0", color: "#9ca3af"}}>
          ── or ──
        </div>

        {/* SOCIAL */}
        <button className="btn" style={{background: "#111827"}}>
          Sign up with Google
        </button>

        {/* SWITCH */}
        <p className="switch">
          Already have an account?
          <Link to="/login">Login</Link>
        </p>
      </div>
    </div>
  );
};

export default Register;


