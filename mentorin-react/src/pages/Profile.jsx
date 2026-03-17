import React from 'react';
import { useParams } from 'react-router-dom';

const Profile = () => {
  const { id } = useParams();

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

            <span className={`trust-badge ${mentor.trustScore >= 70 ? 'trust-good' : 'trust-medium'}`}>
              Trust Score: {mentor.trustScore}
            </span>
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

            <a href="/chat" className="btn" style={{marginTop: "20px"}}>
              Start Chat
            </a>
            <button className="btn" style={{background: "#0ea5e9", marginTop: "10px"}}>
              Request Mentorship
            </button>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Profile;
