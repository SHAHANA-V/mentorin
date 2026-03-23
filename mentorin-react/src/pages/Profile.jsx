import React, { useState } from 'react';
import { useParams } from 'react-router-dom';

const Profile = () => {
  const { id } = useParams();
  const [showToast, setShowToast] = useState(false);

  const handleRequestClick = () => {
    setShowToast(true);
    setTimeout(() => {
      setShowToast(false);
    }, 3500);
  };

  const mentorData = {
    1: {
      name: "Ravi Kumar",
      role: "Senior Software Engineer",
      trustScore: 82,
      verified: true,
      experience: "10+ Years",
      domain: "Software Engineering",
      mentoredStudents: "320+",
      trustLevel: "High",
      about: "Ravi is a senior software engineer with 10+ years of experience in building scalable systems, mentoring students, and guiding professionals into top tech roles.",
      skills: ["Java & Spring Boot", "System Design", "Backend Architecture", "Career Mentorship"],
      img: "12"
    },
    2: {
      name: "Anita Sharma", 
      role: "Data Scientist",
      trustScore: 55,
      verified: false,
      experience: "8+ Years",
      domain: "Data Science",
      mentoredStudents: "150+",
      trustLevel: "Medium",
      about: "Anita is a data scientist with expertise in machine learning and analytics, helping students navigate the data science career path.",
      skills: ["Python", "Machine Learning", "Data Analysis", "Statistics"],
      img: "32"
    },
    3: {
      name: "Rahul Verma",
      role: "Product Manager", 
      trustScore: 90,
      verified: true,
      experience: "12+ Years",
      domain: "Product Management",
      mentoredStudents: "450+",
      trustLevel: "High",
      about: "Rahul is an experienced product manager who has led multiple successful products and mentors aspiring PMs.",
      skills: ["Product Strategy", "User Research", "Agile", "Leadership"],
      img: "45"
    }
  };

  const mentor = mentorData[id] || mentorData[1];

  return (
    <div className="container">
      {/* SIDEBAR */}
      <aside className="sidebar">
        <div className="logo">Mentorin</div>
        <ul className="menu">
          <li>
            <a href="/dashboard" className="menu-link">🏠 Dashboard</a>
          </li>
          <li className="active">👤 Mentor Profile</li>
          <li className="menu-item"><a href="/chat">💬 Chat</a></li>
          <li className="menu-item"><a href="/analytics">📊 Analytics</a></li>
        </ul>
      </aside>

      {/* MAIN */}
      <main className="main">
        {/* PROFILE HEADER */}
        <div className="card profile-header">
          <img 
            src={`https://i.pravatar.cc/120?img=${mentor.img}`} 
            className="profile-pic" 
            alt={mentor.name}
          />

          <div>
            <h2>{mentor.name}</h2>
            <p className="domain">{mentor.role}</p>

            <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
              <span className={`trust-badge ${mentor.trustScore >= 70 ? 'trust-good' : 'trust-medium'}`}>
                Trust Score: {mentor.trustScore}
              </span>
              <div style={{ width: '150px', height: '8px', background: '#e2e8f0', borderRadius: '4px', overflow: 'hidden' }}>
                <div style={{ width: `${mentor.trustScore}%`, height: '100%', background: mentor.trustScore >= 70 ? '#10b981' : '#f59e0b', transition: 'width 1s ease-in-out' }}></div>
              </div>
            </div>
            {mentor.verified && (
              <span className="badge verified">✔ Verified Mentor</span>
            )}
          </div>
        </div>

        {/* PROFILE CONTENT */}
        <div className="profile-grid">
          {/* LEFT */}
          <div className="card">
            <h3>About Mentor</h3>
            <p>{mentor.about}</p>

            <h3 style={{marginTop: "20px"}}>Specialization</h3>
            <ul className="skills">
              {mentor.skills.map((skill, index) => (
                <li key={index}>{skill}</li>
              ))}
            </ul>
          </div>

          {/* RIGHT */}
          <div className="card">
            <h3>Mentor Stats</h3>

            <div className="stat">
              <span>Experience</span>
              <b>{mentor.experience}</b>
            </div>

            <div className="stat">
              <span>Domain</span>
              <b>{mentor.domain}</b>
            </div>

            <div className="stat">
              <span>Mentored Students</span>
              <b>{mentor.mentoredStudents}</b>
            </div>

            <div className="stat">
              <span>Trust Level</span>
              <b>{mentor.trustLevel}</b>
            </div>

            <div style={{ marginTop: '24px', display: 'flex', flexDirection: 'column', gap: '12px' }}>
              <a href="/chat" className="btn" style={{ width: '100%', textAlign: 'center', display: 'block', boxSizing: 'border-box', background: 'linear-gradient(135deg, #2563eb, #1e40af)', color: 'white', textDecoration: 'none', padding: '12px', borderRadius: '10px', fontWeight: '600', fontSize: '15px', letterSpacing: '0.3px' }}>
                💬 Start Chat
              </a>
              <button className="btn" style={{ background: 'linear-gradient(135deg, #0ea5e9, #0284c7)', color: 'white', width: '100%', padding: '12px', borderRadius: '10px', fontWeight: '600', fontSize: '15px', border: 'none', cursor: 'pointer' }} onClick={handleRequestClick}>
                🤝 Request Mentorship
              </button>
            </div>
          </div>
        </div>
      </main>

      {/* TOAST NOTIFICATION */}
      {showToast && (
        <div className="toast-notification fade-in-up">
          <div className="toast-icon">✅</div>
          <div className="toast-content">
            <h4>Success</h4>
            <p>Mentorship request sent successfully.</p>
          </div>
        </div>
      )}
    </div>
  );
};

export default Profile;

