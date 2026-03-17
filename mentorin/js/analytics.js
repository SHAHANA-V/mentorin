const ctx = document.getElementById("mentorTrustChart").getContext("2d");

let mentorChart;

// 🔥 LOAD DATA FROM BACKEND
function loadAnalytics() {
  fetch("https://mentorin-backend.onrender.com/analytics/all") 
    .then(res => res.json())
    .then(data => {
      renderChart(data);
    })
    .catch(err => {
      console.error("Analytics error", err);
    });
}

// 🎨 RENDER GRAPH
function renderChart(mentors) {

  const names = mentors.map(m => m.name);
  const scores = mentors.map(m => m.trust_score);

  if (mentorChart) {
    mentorChart.destroy();
  }

 mentorChart = new Chart(ctx, {
  type: "bar",
  data: {
    labels: names,
    datasets: [{
      label: "Trust Score",
      data: scores,
      backgroundColor: scores.map(score =>
        score >= 70 ? "#22c55e" :
        score >= 40 ? "#facc15" :
        "#ef4444"
      ),
      borderRadius: 8,
      barThickness: 60,      // 🔥 THIS FIXES FAT BAR
      maxBarThickness: 70
    }]
  },
  options: {
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
  }
});

}

// ⏱ AUTO REFRESH EVERY 5 SECONDS
loadAnalytics();
setInterval(loadAnalytics, 5000);
