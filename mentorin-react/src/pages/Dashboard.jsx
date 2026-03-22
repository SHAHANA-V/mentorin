import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import Layout from '../components/Layout';

const Dashboard = () => {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const userData = localStorage.getItem("user");
    if (userData) {
      setUser(JSON.parse(userData));
    }
  }, []);

  const mentors = [
    {
      id: 1,
      name: "Ravi Kumar",
      role: "Senior Software Engineer",
      trustScore: 82,
      verified: true,
      warning: false,
      img: "12",
      bio: "10+ years building scalable backend systems."
    },
    {
      id: 2,
      name: "Anita Sharma",
      role: "Data Scientist",
      trustScore: 55,
      verified: false,
      warning: true,
      img: "32",
      bio: "Machine learning and analytics expert."
    },
    {
      id: 3,
      name: "Rahul Verma",
      role: "Product Manager",
      trustScore: 90,
      verified: true,
      warning: false,
      img: "45",
      bio: "Guiding product strategy from idea to launch."
    },
    {
      id: 4,
      name: "Priya Patel",
      role: "UX Researcher",
      trustScore: 88,
      verified: true,
      warning: false,
      img: "23",
      bio: "Passionate about user-centric design & accessibility."
    }
  ];

  return (
    <Layout>
      {/* TOP BAR */}
      <div className="topbar">
        <h2>Discover Trusted Mentors</h2>
        <img src="https://i.pravatar.cc/40" alt="profile" />
      </div>

      {/* HERO */}
      <section className="welcome card">
        <div>
          <h1>Your mentorship journey starts here ✨</h1>
          <p>Connect only with <b>AI-verified mentors</b> for safe & ethical guidance.</p>
        </div>
      </section>

      {/* SUMMARY CARDS */}
      <section className="summary-cards" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '20px', marginTop: '30px' }}>
        <div className="card" style={{ padding: '20px', textAlign: 'center' }}>
          <h3 style={{ fontSize: '24px', color: '#2563eb' }}>124</h3>
          <p style={{ color: '#64748b', fontSize: '14px' }}>Active Mentors</p>
        </div>
        <div className="card" style={{ padding: '20px', textAlign: 'center' }}>
          <h3 style={{ fontSize: '24px', color: '#10b981' }}>850+</h3>
          <p style={{ color: '#64748b', fontSize: '14px' }}>Mentorship Sessions</p>
        </div>
        <div className="card" style={{ padding: '20px', textAlign: 'center' }}>
          <h3 style={{ fontSize: '24px', color: '#8b5cf6' }}>98%</h3>
          <p style={{ color: '#64748b', fontSize: '14px' }}>Positive Feedback</p>
        </div>
      </section>

      {/* MENTORS */}
      <section style={{marginTop: "40px"}}>
        <h3 style={{marginBottom: "20px"}}>Top Trusted Mentors</h3>

        <div className="cards" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))', gap: '26px' }}>
          {mentors.map((mentor) => (
            <div key={mentor.id} className="card mentor-card">
              <img 
                src={`https://i.pravatar.cc/80?img=${mentor.img}`} 
                className="mentor-img" 
                alt={mentor.name}
              />
              <h4>{mentor.name}</h4>
              <p className="domain">{mentor.role}</p>

              <span className={`trust-badge ${mentor.trustScore >= 70 ? 'trust-good' : 'trust-medium'}`}>
                Trust {mentor.trustScore}
              </span>
              
              {mentor.verified ? (
                <span className="badge verified" style={{display: 'block', margin: '5px auto', width: 'max-content'}}>✔ Verified</span>
              ) : mentor.warning ? (
                <span className="badge warning" style={{display: 'block', margin: '5px auto', width: 'max-content'}}>⚠ Warning</span>
              ) : null}

              <p style={{ fontSize: '13px', color: '#4b5563', margin: '15px 0', minHeight: '40px' }}>
                {mentor.bio}
              </p>

              <Link to={`/profile/${mentor.id}`} className="btn" style={{display: 'block', width: '100%', marginTop: '10px'}}>
                View Profile
              </Link>
            </div>
          ))}
        </div>
      </section>
    </Layout>
  );
};

export default Dashboard;
