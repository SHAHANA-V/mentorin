import React from 'react';
import { Link } from 'react-router-dom';

const Home = () => {
  return (
    <div>
      {/* HERO */}
      <section style={{padding: "120px 40px", textAlign: "center", maxWidth: "1100px", margin: "auto"}}>
        <h1 style={{fontSize: "48px", fontWeight: "800"}}>
          Mentorin
        </h1>

        <p style={{fontSize: "20px", color: "#475569", margin: "20px 0"}}>
          A Secure AI-Driven Mentorship Platform<br />
          Connecting Students with Trusted Industry Experts
        </p>

        <div style={{marginTop: "30px"}}>
          <Link to="/login" className="btn">Get Started</Link>
          <Link to="/register" className="btn" style={{marginLeft: "15px", background: "#e5e7eb", color: "#1f2937"}}>
            Create Account
          </Link>
        </div>
      </section>

      {/* FEATURES */}
      <section style={{background: "#f8fafc", padding: "80px 40px"}}>
        <div style={{maxWidth: "1100px", margin: "auto"}}>
          <h2 style={{textAlign: "center", fontSize: "32px", marginBottom: "50px"}}>
            Why Choose Mentorin?
          </h2>

          <div style={{display: "flex", gap: "30px", flexWrap: "wrap"}}>
            <div className="card" style={{flex: "1", minWidth: "250px"}}>
              <h3>✔ Verified Mentors</h3>
              <p style={{marginTop: "10px", color: "#475569"}}>
                Multi-level verification ensures only genuine industry experts
                mentor students.
              </p>
            </div>

            <div className="card" style={{flex: "1", minWidth: "250px"}}>
              <h3>🤖 AI-Driven Safety</h3>
              <p style={{marginTop: "10px", color: "#475569"}}>
                NLP-based chat monitoring detects abusive, unethical, or scam
                behavior in real-time.
              </p>
            </div>

            <div className="card" style={{flex: "1", minWidth: "250px"}}>
              <h3>📊 Trust Scoring</h3>
              <p style={{marginTop: "10px", color: "#475569"}}>
                Dynamic trust scores based on behavior analysis and interaction
                history.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* HOW IT WORKS */}
      <section style={{padding: "80px 40px"}}>
        <div style={{maxWidth: "1000px", margin: "auto", textAlign: "center"}}>
          <h2 style={{fontSize: "32px", marginBottom: "40px"}}>
            How Mentorin Works
          </h2>

          <div style={{display: "flex", gap: "30px", flexWrap: "wrap", justifyContent: "center"}}>
            <div className="card" style={{width: "260px"}}>
              <h4>1️⃣ Register</h4>
              <p style={{marginTop: "10px", color: "#475569"}}>
                Create a student or mentor account with basic verification.
              </p>
            </div>

            <div className="card" style={{width: "260px"}}>
              <h4>2️⃣ Connect</h4>
              <p style={{marginTop: "10px", color: "#475569"}}>
                Students connect with mentors based on trust score and expertise.
              </p>
            </div>

            <div className="card" style={{width: "260px"}}>
              <h4>3️⃣ Safe Mentorship</h4>
              <p style={{marginTop: "10px", color: "#475569"}}>
                AI continuously monitors chats to ensure ethical communication.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* FOOTER */}
      <footer style={{background: "#1e3a8a", color: "white", padding: "25px", textAlign: "center"}}>
        <p>
          © 2026 Mentorin • Secure AI-Driven Mentorship Platform
        </p>
      </footer>
    </div>
  );
};

export default Home;

