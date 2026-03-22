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
        const res = await fetch(`http://127.0.0.1:5000/admin/simulation/history`);
        if (!res.ok) throw new Error("API Error");
        setReports(await res.json());
        return;
      }

      const res = await fetch(`http://127.0.0.1:5000/admin/users?type=${filter}`);
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
      const res = await fetch("http://127.0.0.1:5000/admin/mentor/action", {
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
      const res = await fetch("http://127.0.0.1:5000/admin/simulate/toggle", {
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
      await fetch("http://127.0.0.1:5000/admin/simulate/trigger", {
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

  const renderReports = () => (
    <div className="card admin-table-container">
      <table className="admin-table">
        <thead>
          <tr>
            <th>Date</th>
            <th>Mentor Assessed</th>
            <th>Professionalism</th>
            <th>Helpfulness</th>
            <th>Final AI Grade</th>
          </tr>
        </thead>
        <tbody>
          {reports.map((rep, idx) => (
            <tr key={idx}>
              <td>{new Date(rep.timestamp).toLocaleDateString()}</td>
              <td style={{fontWeight: 'bold', color: '#1e293b'}}>{rep.mentorName}</td>
              <td style={{color: rep.scores.professionalism >= 7 ? '#16a34a' : '#ef4444', fontWeight: 'bold'}}>{rep.scores.professionalism} / 10</td>
              <td style={{color: rep.scores.helpfulness >= 7 ? '#16a34a' : '#ef4444', fontWeight: 'bold'}}>{rep.scores.helpfulness} / 10</td>
              <td><span className={`badge ${rep.scores.finalScore >= 7 ? 'active' : 'blocked'}`}>{rep.scores.finalScore}</span></td>
            </tr>
          ))}
          {reports.length === 0 && (
            <tr><td colSpan="5" style={{textAlign: "center", padding: "20px"}}>No simulation reports generated yet.</td></tr>
          )}
        </tbody>
      </table>
    </div>
  );

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
