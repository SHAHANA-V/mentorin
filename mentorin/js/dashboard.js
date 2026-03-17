const user = JSON.parse(localStorage.getItem("user"));

document.getElementById("userInfo").innerHTML = `
  <h3>${user.name}</h3>
  <p>Role: ${user.role}</p>
  <p>Trust Score: ${user.trust_score}</p>
  <p>Status: <b>${user.status}</b></p>
`;
