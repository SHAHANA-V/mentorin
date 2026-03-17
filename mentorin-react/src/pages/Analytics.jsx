import React, { useEffect, useRef, useState } from 'react';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';
import { Bar } from 'react-chartjs-2';

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

const Analytics = () => {
  const [mentors, setMentors] = useState([]);
  const chartRef = useRef(null);

  // 🔥 LOAD DATA FROM BACKEND
  const loadAnalytics = () => {
    fetch("https://mentorin-backend.onrender.com/analytics/all")
      .then(res => res.json())
      .then(data => {
        setMentors(data);
      })
      .catch(err => {
        console.error("Analytics error", err);
      });
  };

  useEffect(() => {
    loadAnalytics();
    const interval = setInterval(loadAnalytics, 5000); // ⏱ AUTO REFRESH EVERY 5 SECONDS
    return () => clearInterval(interval);
  }, []);

  // 🎨 CHART DATA
  const chartData = {
    labels: mentors.map(m => m.name),
    datasets: [{
      label: "Trust Score",
      data: mentors.map(m => m.trust_score),
      backgroundColor: mentors.map(m => 
        m.trust_score >= 70 ? "#22c55e" :
        m.trust_score >= 40 ? "#facc15" :
        "#ef4444"
      ),
      borderRadius: 8,
      barThickness: 60,      // 🔥 THIS FIXES FAT BAR
      maxBarThickness: 70
    }]
  };

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,   // 🔥 IMPORTANT
    scales: {
      y: {
        beginAtZero: true,
        max: 100
      }
    },
    plugins: {
      legend: {
        display: false
      }
    }
  };

  return (
    <div className="layout">
      {/* SIDEBAR */}
      <aside className="sidebar">
        <h2 className="logo">Mentorin</h2>

        <ul className="menu">
          <li><a href="/dashboard">🏠 Dashboard</a></li>
          <li><a href="/chat">💬 Chat</a></li>
          <li className="active"><a href="/analytics">📊 Analytics</a></li>
          <li><a href="/login">🚪 Logout</a></li>
        </ul>
      </aside>

      {/* MAIN CONTENT */}
      <main className="content">
        <h2>📊 Mentor Trust Analytics</h2>
        <p className="subtitle">
          Real-time trust score comparison of mentors
        </p>

        {/* GRAPH CARD */}
        <div className="chart-card">
          <div style={{ height: "300px" }}>
            <Bar ref={chartRef} data={chartData} options={chartOptions} />
          </div>
        </div>
      </main>
    </div>
  );
};

export default Analytics;
