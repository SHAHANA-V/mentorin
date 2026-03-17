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
      img: "12"
    },
    {
      id: 2,
      name: "Anita Sharma",
      role: "Data Scientist",
      trustScore: 55,
      verified: false,
      warning: true,
      img: "32"
    },
    {
      id: 3,
      name: "Rahul Verma",
      role: "Product Manager",
      trustScore: 90,
      verified: true,
      warning: false,
      img: "45"
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

      {/* MENTORS */}
      <section style={{marginTop: "40px"}}>
        <h3 style={{marginBottom: "20px"}}>Top Trusted Mentors</h3>

        <div className="cards">
          {mentors.map((mentor) => (
            <div key={mentor.id} className="card mentor-card">
              <img 
                src={`https://i.pravatar.cc/80?img=${mentor.img}`} 
                className="mentor-img" 
                alt={mentor.name}
              />
              <h4>{mentor.name}</h4>
              <p>{mentor.role}</p>

              <span className={`trust-badge ${mentor.trustScore >= 70 ? 'trust-good' : 'trust-medium'}`}>
                Trust {mentor.trustScore}
              </span>
              
              {mentor.verified ? (
                <span className="badge verified">✔ Verified</span>
              ) : mentor.warning ? (
                <span className="badge warning">⚠ Warning</span>
              ) : null}

              <Link to={`/profile/${mentor.id}`} className="btn">
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
