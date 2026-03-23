import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const Admin = () => {
  const [activeTab, setActiveTab] = useState('overview');
  const [users, setUsers] = useState([]);
  const [reports, setReports] = useState([]);
  const [stats, setStats] = useState({ totalMentors: 0, pending: 0, blocked: 0 });
  const [modal, setModal] = useState({ isOpen: false, type: '', user: null });
  const navigate = useNavigate();

  useEffect(() => {
    const localUser = localStorage.getItem("user");
    if (!localUser || JSON.parse(localUser).role !== "admin") {
      navigate("/login");
      return;
    }
    fetchData(activeTab);
  }, [activeTab]);

  const fetchData = async (tab) => {
    try {
      let filter = 'all';
      if (tab === 'pending') filter = 'pending';
      if (tab === 'blocked') filter = 'blocked';

      if (tab === 'reports') {
        const res = await fetch(`https://mentorin-backend.onrender.com/admin/simulation/history`);
        if (!res.ok) throw new Error("API Error");
        setReports(await res.json());
        return;
      }

      const res = await fetch(`https://mentorin-backend.onrender.com/admin/users?type=${filter}`);
      if (!res.ok) throw new Error("Failed connecting to API");
      const data = await res.json();
      setUsers(data);

      if (tab === 'overview') {
        const total = data.filter(u => u.role === "mentor").length;
        const pendingCount = data.filter(u => u.status === "pending").length;
        const blockedCount = data.filter(u => u.status === "blocked").length;
        setStats({ totalMentors: total, pending: pendingCount, blocked: blockedCount });
      }
    } catch(err) {
      console.error(err);
    }
  };

  const handleAction = async (userId, action) => {
    try {
      const res = await fetch("https://mentorin-backend.onrender.com/admin/mentor/action", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ user_id: userId, action })
      });
      if (res.ok) {
        setModal({ isOpen: false, type: '', user: null });
        fetchData(activeTab); // refresh list
      }
    } catch(err) {
      alert("Failed to process action");
    }
  };

  const handleToggleSimulation = async (userId) => {
    try {
      const res = await fetch("https://mentorin-backend.onrender.com/admin/simulate/toggle", {
        method: "POST", headers: {"Content-Type":"application/json"},
        body: JSON.stringify({ user_id: userId })
      });
      if(res.ok) {
        fetchData(activeTab);
        setModal(prev => ({...prev, user: {...prev.user, mockActive: !prev.user.mockActive}}));
      }
    } catch(err) { console.error(err); }
  };

  const handleTriggerMessage = async (userId, type) => {
    try {
      await fetch("https://mentorin-backend.onrender.com/admin/simulate/trigger", {
        method: "POST", headers: {"Content-Type":"application/json"},
        body: JSON.stringify({ user_id: userId, type })
      });
      alert(`Simulation queued: ${type} test message`);
    } catch(err) { console.error(err); }
  };

  const openConfirmation = (type, user) => {
    setModal({ isOpen: true, type, user });
  };

  const renderOverview = () => (
    <div className="admin-overview">
      <div className="card stat-card" style={{borderLeft: "4px solid #3b82f6"}}>
        <h3>Total Mentors</h3>
        <p className="stat-number">{stats.totalMentors}</p>
      </div>
      <div className="card stat-card" style={{borderLeft: "4px solid #f59e0b"}}>
        <h3>Pending Approvals</h3>
        <p className="stat-number">{stats.pending}</p>
      </div>
      <div className="card stat-card" style={{borderLeft: "4px solid #ef4444"}}>
        <h3>Blocked Users</h3>
        <p className="stat-number">{stats.blocked}</p>
      </div>
    </div>
  );

  const renderTable = () => (
    <div className="card admin-table-container">
      <table className="admin-table">
        <thead>
          <tr>
            <th>Name</th>
            <th>Email</th>
            <th>Status</th>
            <th>Trust Score</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {users.filter(u => u.role === "mentor").map(user => (
            <tr key={user.id}>
              <td>{user.name}</td>
              <td>{user.email}</td>
              <td>
                <span className={`badge ${user.status}`}>
                  {user.status.charAt(0).toUpperCase() + user.status.slice(1)}
                </span>
                {user.underReview && <span className="warning-text"> (Review)</span>}
              </td>
              <td>{user.trustScore}</td>
              <td>
                {user.status === 'pending' && (
                  <>
                    <button className="btn-sm success" onClick={() => openConfirmation('approve', user)}>Approve</button>
                    <button className="btn-sm danger" onClick={() => openConfirmation('reject', user)}>Reject</button>
                  </>
                )}
                {user.status === 'blocked' && (
                  <>
                    <button className="btn-sm primary" onClick={() => openConfirmation('unblock', user)}>Unblock</button>
                    <button className="btn-sm danger" onClick={() => openConfirmation('ban', user)}>Ban</button>
                  </>
                )}
                {user.status === 'active' && activeTab === 'all' && (
                  <>
                    <button className="btn-sm warning" onClick={() => openConfirmation('ban', user)}>Ban</button>
                    <button className="btn-sm" style={{background:"#93c5fd", color:"#1e3a8a"}} onClick={() => openConfirmation('simulate', user)}>🤖 Simulate</button>
                  </>
                )}
              </td>
            </tr>
          ))}
          {users.filter(u => u.role === "mentor").length === 0 && (
            <tr><td colSpan="5" style={{textAlign: "center", padding: "20px"}}>No mentors found</td></tr>
          )}
        </tbody>
      </table>
    </div>
  );

  const renderReports = () => {
    const tierStyle = (tier) => {
      if (tier === 'Trusted Mentor') return { background: '#dcfce7', color: '#15803d', border: '1px solid #86efac' };
      if (tier === 'Verified') return { background: '#dbeafe', color: '#1d4ed8', border: '1px solid #93c5fd' };
      return { background: '#fee2e2', color: '#b91c1c', border: '1px solid #fca5a5' };
    };
    const tierIcon = (tier) => tier === 'Trusted Mentor' ? '🟢' : tier === 'Verified' ? '🔵' : '🔴';

    if (reports.length === 0) return (
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '80px 20px', textAlign: 'center' }}>
        <div style={{ fontSize: '64px', marginBottom: '16px' }}>📋</div>
        <h3 style={{ color: '#1e293b', margin: '0 0 8px' }}>No Reports Yet</h3>
        <p style={{ color: '#64748b', maxWidth: '320px' }}>Start a simulation on any active mentor from the <b>All Users</b> tab to generate their performance report here.</p>
      </div>
    );

    return (
      <div className="card admin-table-container">
        <table className="admin-table">
          <thead>
            <tr>
              <th>Date</th>
              <th>Mentor</th>
              <th>Comm. Quality</th>
              <th>Response Acc.</th>
              <th>Engagement</th>
              <th>Score /100</th>
              <th>Tier</th>
            </tr>
          </thead>
          <tbody>
            {reports.map((rep, idx) => {
              const s = rep.scores;
              const tier = s.verificationTier || (s.finalScore >= 7.6 ? 'Trusted Mentor' : s.finalScore >= 5.1 ? 'Verified' : 'Needs Improvement');
              const displayScore = s.finalScore > 10 ? s.finalScore : Math.round(s.finalScore * 10);
              const commQ = s.communicationQuality ?? Math.round(s.professionalism * 10);
              const respA = s.responseAccuracy ?? Math.round(s.helpfulness * 10);
              const engL = s.engagementLevel ?? 100;
              return (
                <tr key={idx}>
                  <td style={{ whiteSpace: 'nowrap' }}>{new Date(rep.timestamp).toLocaleDateString()}</td>
                  <td style={{ fontWeight: 'bold', color: '#1e293b' }}>{rep.mentorName}</td>
                  <td><b>{commQ}</b><span style={{ color: '#94a3b8', fontSize: '12px' }}>/100</span></td>
                  <td><b>{respA}</b><span style={{ color: '#94a3b8', fontSize: '12px' }}>/100</span></td>
                  <td><b>{engL}</b><span style={{ color: '#94a3b8', fontSize: '12px' }}>/100</span></td>
                  <td>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <div style={{ flex: 1, height: '6px', background: '#e2e8f0', borderRadius: '3px', overflow: 'hidden', minWidth: '60px' }}>
                        <div style={{ width: `${displayScore}%`, height: '100%', background: displayScore >= 76 ? '#16a34a' : displayScore >= 51 ? '#2563eb' : '#dc2626', transition: 'width 0.5s ease' }} />
                      </div>
                      <b style={{ minWidth: '32px' }}>{displayScore}</b>
                    </div>
                  </td>
                  <td>
                    <span style={{ ...tierStyle(tier), padding: '4px 10px', borderRadius: '20px', fontSize: '12px', fontWeight: '600', whiteSpace: 'nowrap' }}>
                      {tierIcon(tier)} {tier}
                    </span>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    );
  };

  return (
    <div className="container" style={{background: "#f1f5f9"}}>
      <aside className="sidebar admin-sidebar">
        <h2 className="logo">Admin Console</h2>
        <ul className="menu">
          <li className={activeTab === 'overview' ? 'active' : ''} onClick={() => setActiveTab('overview')}>📊 Overview</li>
          <li className={activeTab === 'pending' ? 'active' : ''} onClick={() => setActiveTab('pending')}>⏳ Pending Mentors</li>
          <li className={activeTab === 'blocked' ? 'active' : ''} onClick={() => setActiveTab('blocked')}>🚫 Blocked Mentors</li>
          <li className={activeTab === 'all' ? 'active' : ''} onClick={() => setActiveTab('all')}>👥 All Users</li>
          <li className={activeTab === 'reports' ? 'active' : ''} onClick={() => setActiveTab('reports')}>📝 AI Score Reports</li>
          <li><a href="/login" style={{textDecoration: "none", color: "inherit"}}>🚪 Logout</a></li>
        </ul>
      </aside>

      <main className="main">
        <div className="topbar">
          <h2>
            {activeTab === 'overview' && 'Dashboard Overview'}
            {activeTab === 'pending' && 'Pending Approvals'}
            {activeTab === 'blocked' && 'Blocked Accounts'}
            {activeTab === 'all' && 'All Users Registry'}
            {activeTab === 'reports' && 'Mentor Evaluation Metrics'}
          </h2>
        </div>

        {activeTab === 'overview' && renderOverview()}
        {(activeTab === 'pending' || activeTab === 'blocked' || activeTab === 'all') && renderTable()}
        {activeTab === 'reports' && renderReports()}

      </main>

      {/* MODAL overlay */}
      {modal.isOpen && (
        <div className="modal-overlay">
          <div className="modal-content fade-in-up">
            {modal.type === 'simulate' ? (
              <>
                <h3>Simulation Control: {modal.user?.name}</h3>
                <p>Status: {modal.user?.mockActive ? <span style={{color:'green', fontWeight:'bold'}}>Active 🟢</span> : <span style={{color:'red'}}>Inactive 🔴</span>}</p>
                
                <div style={{display:'flex', flexDirection:'column', gap:'12px', marginBottom:'24px', padding:'0 20px'}}>
                  <button className="btn" style={{background: modal.user?.mockActive ? '#ef4444' : '#22c55e', color:'white'}} onClick={() => handleToggleSimulation(modal.user?.id)}>
                    {modal.user?.mockActive ? '⏹ Stop Simulation' : '▶️ Start Simulation'}
                  </button>
                  
                  {modal.user?.mockActive && (
                    <div style={{display:'flex', flexDirection:'column', gap:'8px', marginTop:'15px', borderTop:'1px solid #e2e8f0', paddingTop:'15px'}}>
                      <button className="btn" style={{background:'#f8fafc', color:'#1e293b', border:'1px solid #cbd5e1'}} onClick={() => handleTriggerMessage(modal.user.id, 'professional')}>Send Professional Q</button>
                      <button className="btn" style={{background:'#fef3c7', color:'#92400e'}} onClick={() => handleTriggerMessage(modal.user.id, 'technical')}>Send Technical Request</button>
                      <button className="btn" style={{background:'#fee2e2', color:'#b91c1c'}} onClick={() => handleTriggerMessage(modal.user.id, 'unethical')}>Send Unethical Test ⚠️</button>
                    </div>
                  )}
                </div>

                <div className="modal-actions">
                  <button className="btn" style={{background: "#64748b", width:'100%'}} onClick={() => setModal({isOpen: false, type: '', user: null})}>Close Panel</button>
                </div>
              </>
            ) : (
              <>
                <h3>Confirm Action</h3>
                <p>Are you sure you want to <b>{modal.type}</b> {modal.user?.name}?</p>
                <div className="modal-actions">
                  <button className="btn" style={{background: "#64748b"}} onClick={() => setModal({isOpen: false, type: '', user: null})}>Cancel</button>
                  <button className="btn" onClick={() => handleAction(modal.user.id, modal.type)}>Confirm {modal.type}</button>
                </div>
              </>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default Admin;


