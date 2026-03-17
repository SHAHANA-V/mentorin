import React, { useState, useEffect, useRef } from 'react';
import Layout from '../components/Layout';

const Chat = () => {
  const [messages, setMessages] = useState([
    { text: "Hi! How can I help you with your career?", type: "received" }
  ]);
  const [inputMessage, setInputMessage] = useState('');
  const [user, setUser] = useState(null);
  const messagesEndRef = useRef(null);

  useEffect(() => {
    const userData = localStorage.getItem("user");
    if (userData) {
      setUser(JSON.parse(userData));
    }
  }, []);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  const sendMessage = async () => {
    const msg = inputMessage.trim();
    if (!msg) return;

    try {
      const res = await fetch("https://mentorin-backend.onrender.com/analyze_chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          user_id: user?.id,
          message: msg
        })
      });

      if (!res.ok) throw res;
      
      const data = await res.json();

      // 🚫 BLOCKED MESSAGE
      if (data.severity === "high" || data.severity === "medium") {
        alert("🚫 This message is not allowed on Mentorin platform");
        return;
      }

      // ✅ SHOW MESSAGE
      setMessages(prev => [...prev, { text: msg, type: "sent" }]);
      setInputMessage("");

    } catch (err) {
      alert("⚠ Message not allowed or user blocked");
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

        <div className="chat-user active">
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
      </aside>

      {/* RIGHT : CHAT WINDOW */}
      <main className="chat-main">
        {/* HEADER */}
        <div className="chat-header">
          <div className="chat-header-user">
            <img src="https://i.pravatar.cc/45?img=12" />
            <div>
              <h4>Ravi Kumar</h4>
              <span>Senior Software Engineer</span>
            </div>
          </div>
          <span className="badge verified">✔ Verified</span>
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
        <div className="chat-input">
          <input 
            id="chatInput"
            value={inputMessage}
            onChange={(e) => setInputMessage(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder="Type a professional message..."
          />
          <button onClick={sendMessage}>Send</button>
        </div>
      </main>
    </div>
  );
};

export default Chat;
