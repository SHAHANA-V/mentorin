import React, { useState, useEffect, useRef } from 'react';
import Layout from '../components/Layout';

const Chat = () => {
  const [messages, setMessages] = useState([
    { text: "Hi! How can I help you with your career?", type: "received" }
  ]);
  const [inputMessage, setInputMessage] = useState('');
  const [user, setUser] = useState(null);
  const [isMockActive, setIsMockActive] = useState(false);
  const [simulationReport, setSimulationReport] = useState(null);
  const messagesEndRef = useRef(null);

  useEffect(() => {
    const userData = localStorage.getItem("user");
    if (userData) {
      setUser(JSON.parse(userData));
    }
  }, []);

  // 🤖 SIMULATION POLLING ENGINE
  useEffect(() => {
    let interval;
    if (user && user.role === 'mentor') {
      interval = setInterval(async () => {
        try {
          const res = await fetch(`https://mentorin-backend.onrender.com/chat/mock_sync/${user.id}`);
          if (res.ok) {
            const data = await res.json();
            setIsMockActive(data.mockActive);
            if (data.message) {
              setMessages(prev => [...prev, { text: data.message, type: "received mock" }]);
            }
          }
        } catch(err) { /* ignore error on polling loop */ }
      }, 3000);
    }
    return () => clearInterval(interval);
  }, [user]);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  const sendMessage = async () => {
    const msg = inputMessage.trim();
    if (!msg) return;

    // 🤖 IF SIMULATION IS ACTIVE, BYPASS NORMAL CHAT LOGIC
    if (isMockActive) {
      try {
        const res = await fetch("https://mentorin-backend.onrender.com/simulate/reply", {
          method: "POST", headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ user_id: user?.id, message: msg })
        });
        
        if (!res.ok) {
           const errData = await res.json();
           if (res.status === 400) {
             alert(`Simulation Error: ${errData.error}. Please ask the Admin to Stop and Re-Start your simulation session!`);
             setIsMockActive(false);
             return;
           }
           throw new Error("API Failure");
        }
        
        const data = await res.json();

        setMessages(prev => [...prev, { text: msg, type: "sent" }]);
        setInputMessage("");

        if (data.status === "completed") {
          setIsMockActive(false);
          setSimulationReport(data.report);
        }
      } catch (err) { alert("Failed to connect to Simulation Engine"); }
      return;
    }

    try {
      const res = await fetch("https://mentorin-backend.onrender.com/analyze_chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          user_id: user?.id,
          message: msg
        })
      });

      if (!res.ok) {
        if (res.status === 403) {
          const errData = await res.json();
          if (errData.status === "blocked") {
            alert("This mentor has been blocked due to policy violations and sent for admin review.");
            const blockedUser = { ...user, status: "blocked" };
            setUser(blockedUser);
            localStorage.setItem("user", JSON.stringify(blockedUser));
            return;
          }
        }
        throw res;
      }
      
      const data = await res.json();

      // ✅ SHOW MESSAGE
      setMessages(prev => [...prev, { text: msg, type: "sent" }]);
      setInputMessage("");

      if (data.warning) {
        alert("Only professional communication is allowed. This behavior affects trust score.");
      }

      if (data.blocked) {
        alert("This mentor has been blocked due to policy violations and sent for admin review.");
        const blockedUser = { ...user, status: "blocked", trustScore: data.updated_trust_score };
        setUser(blockedUser);
        localStorage.setItem("user", JSON.stringify(blockedUser));
      } else if (data.updated_trust_score !== undefined && user) {
        const updatedUser = { ...user, trustScore: data.updated_trust_score };
        setUser(updatedUser);
        localStorage.setItem("user", JSON.stringify(updatedUser));
      }

    } catch (err) {
      alert("⚠ Message failed or user blocked");
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      sendMessage();
    }
  };

  return (
    <div className="chat-page">
      {/* LEFT : CONTACT LIST */}
      <aside className="chat-sidebar">
        <h3>Messages</h3>

        {/* MOCK STUDENT NOTIFIER */}
        {isMockActive && (
          <div className="chat-user active fade-in-up" style={{background: '#fef2f2', border: '1px solid #fca5a5'}}>
            <div style={{fontSize: "28px", display:"flex", alignItems:"center"}}>🤖</div>
            <div>
              <h4 style={{color: '#991b1b'}}>Aarav (Student)</h4>
              <span style={{color: '#dc2626'}}>Test Mode Active</span>
            </div>
          </div>
        )}

        <div className={`chat-user ${!isMockActive ? 'active' : ''}`}>
          <img src="https://i.pravatar.cc/40?img=12" />
          <div>
            <h4>Ravi Kumar</h4>
            <span>Mentor · Software</span>
          </div>
        </div>

        <div className="chat-user">
          <img src="https://i.pravatar.cc/40?img=32" />
          <div>
            <h4>Anita Sharma</h4>
            <span>Mentor · Data Science</span>
          </div>
        </div>

        <div className="chat-user">
          <img src="https://i.pravatar.cc/40?img=45" />
          <div>
            <h4>Rahul Verma</h4>
            <span>Mentor · Product</span>
          </div>
        </div>

        <div className="chat-user">
          <img src="https://i.pravatar.cc/40?img=57" />
          <div>
            <h4>Priya Patel</h4>
            <span>Mentor · UX Design</span>
          </div>
        </div>

        <div className="chat-user">
          <img src="https://i.pravatar.cc/40?img=68" />
          <div>
            <h4>Arjun Nair</h4>
            <span>Mentor · DevOps</span>
          </div>
        </div>

        <div className="chat-user">
          <img src="https://i.pravatar.cc/40?img=15" />
          <div>
            <h4>Sneha Iyer</h4>
            <span>Mentor · AI / ML</span>
          </div>
        </div>

        <div className="chat-user">
          <img src="https://i.pravatar.cc/40?img=22" />
          <div>
            <h4>Karan Mehta</h4>
            <span>Mentor · Finance</span>
          </div>
        </div>

        <div className="chat-user">
          <img src="https://i.pravatar.cc/40?img=51" />
          <div>
            <h4>Divya Reddy</h4>
            <span>Mentor · Cybersecurity</span>
          </div>
        </div>
      </aside>

      {/* RIGHT : CHAT WINDOW */}
      <main className="chat-main">
        {/* HEADER */}
        <div className="chat-header">
          <div className="chat-header-user">
            {isMockActive ? (
              <>
                <div style={{fontSize: "34px"}}>🤖</div>
                <div>
                  <h4>Aarav (Student)</h4>
                  <span style={{color: '#ef4444', fontWeight: 'bold'}}>System Administrator Test</span>
                </div>
              </>
            ) : (
              <>
                <img src="https://i.pravatar.cc/45?img=12" />
                <div>
                  <h4>Ravi Kumar</h4>
                  <span>Senior Software Engineer</span>
                </div>
              </>
            )}
          </div>
          <span className={`badge ${isMockActive ? 'warning' : 'verified'}`}>{isMockActive ? '⚠ Test Mode' : '✔ Verified'}</span>
        </div>

        {/* MESSAGES */}
        <div className="chat-messages">
          {messages.map((message, index) => (
            <div key={index} className={`message ${message.type}`}>
              {message.text}
            </div>
          ))}
          <div ref={messagesEndRef} />
        </div>

        {/* INPUT */}
        <div className="chat-input" style={{position: 'relative'}}>
          
          {/* SIMULATION REPORT OVERLAY MODAL */}
          {simulationReport && (() => {
            const score = simulationReport.finalScore > 10 ? simulationReport.finalScore : Math.round(simulationReport.finalScore * 10);
            const tier = simulationReport.verificationTier || (score >= 76 ? 'Trusted Mentor' : score >= 51 ? 'Verified' : 'Needs Improvement');
            const tierColor = tier === 'Trusted Mentor' ? '#15803d' : tier === 'Verified' ? '#1d4ed8' : '#b91c1c';
            const tierBg = tier === 'Trusted Mentor' ? '#dcfce7' : tier === 'Verified' ? '#dbeafe' : '#fee2e2';
            const commQ = simulationReport.communicationQuality ?? Math.round(simulationReport.professionalism * 10);
            const respA = simulationReport.responseAccuracy ?? Math.round(simulationReport.helpfulness * 10);
            const engL = simulationReport.engagementLevel ?? 100;
            return (
              <div className="modal-overlay" style={{position: 'fixed', inset: 0, zIndex: 9999}}>
                <div className="modal-content fade-in-up" style={{textAlign:'center', background:'white', padding:'40px', borderRadius:'15px', color:'#1e293b', maxWidth: '460px', width: '90%'}}>
                  <h2 style={{color: '#3b82f6', marginBottom:'4px'}}>Simulation Completed 🎉</h2>
                  <p style={{color: '#64748b', marginBottom:'20px', fontSize: '14px'}}>Your responses were recorded and evaluated by the AI examiner.</p>

                  {/* Tier badge */}
                  <div style={{background: tierBg, color: tierColor, border: `1px solid`, borderRadius: '30px', padding: '8px 20px', display: 'inline-block', fontWeight: '700', fontSize: '15px', marginBottom: '24px'}}>
                    {tier === 'Trusted Mentor' ? '🟢' : tier === 'Verified' ? '🔵' : '🔴'} {tier}
                  </div>

                  {/* Sub-scores grid */}
                  <div style={{background:'#f8fafc', padding:'16px', borderRadius:'10px', display:'grid', gridTemplateColumns: '1fr 1fr 1fr', gap:'12px', marginBottom:'20px'}}>
                    <div>
                      <span style={{fontSize:'22px', fontWeight:'bold', display:'block'}}>{commQ}</span>
                      <span style={{fontSize:'11px', color:'#64748b', textTransform:'uppercase', letterSpacing:'0.5px'}}>Comm. Quality</span>
                    </div>
                    <div style={{borderLeft:'1px solid #e2e8f0', borderRight:'1px solid #e2e8f0'}}>
                      <span style={{fontSize:'22px', fontWeight:'bold', display:'block'}}>{respA}</span>
                      <span style={{fontSize:'11px', color:'#64748b', textTransform:'uppercase', letterSpacing:'0.5px'}}>Response Acc.</span>
                    </div>
                    <div>
                      <span style={{fontSize:'22px', fontWeight:'bold', display:'block'}}>{engL}</span>
                      <span style={{fontSize:'11px', color:'#64748b', textTransform:'uppercase', letterSpacing:'0.5px'}}>Engagement</span>
                    </div>
                  </div>

                  {/* Score bar */}
                  <div style={{textAlign:'left', marginBottom:'24px'}}>
                    <div style={{display:'flex', justifyContent:'space-between', marginBottom:'6px'}}>
                      <span style={{fontWeight:'600', fontSize:'14px'}}>Overall Score</span>
                      <b style={{color: tierColor}}>{score} / 100</b>
                    </div>
                    <div style={{height:'8px', background:'#e2e8f0', borderRadius:'4px', overflow:'hidden'}}>
                      <div style={{width:`${score}%`, height:'100%', background: score >= 76 ? '#16a34a' : score >= 51 ? '#2563eb' : '#dc2626', transition:'width 0.8s ease', borderRadius:'4px'}} />
                    </div>
                  </div>

                  <button className="btn primary" style={{width:'100%'}} onClick={() => setSimulationReport(null)}>Acknowledge &amp; Return</button>
                </div>
              </div>
            );
          })()}

          <input 
            id="chatInput"
            value={inputMessage}
            onChange={(e) => setInputMessage(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder={user?.status === "blocked" ? "Chat is disabled due to policy violations" : "Type a professional message..."}
            disabled={user?.status === "blocked"}
          />
          <button 
             onClick={sendMessage}
             disabled={user?.status === "blocked"}
             style={{ opacity: user?.status === "blocked" ? 0.5 : 1, cursor: user?.status === "blocked" ? "not-allowed" : "pointer" }}
          >Send</button>
        </div>
      </main>
    </div>
  );
};

export default Chat;
