console.log("main.js loaded");



function register() {
  alert("Registration successful! Please login.");
}

async function login() {
  const email = document.getElementById("email").value;
  const password = document.getElementById("password").value;

  try {
    const res = await fetch("https://mentorin-backend.onrender.com/login", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        email: email,
        password: password
      })
    });

    const data = await res.json();

    if (!res.ok) {
      alert(data.message);
      return;
    }

    // ✅ Save user to localStorage
    localStorage.setItem("user", JSON.stringify(data.user));

    // ✅ Go to dashboard
    window.location.href = "dashboard.html";

  } catch (err) {
    alert("Server not reachable");
    console.error(err);
  }
}

// ===== PASSWORD TOGGLE =====
function togglePassword() {
  const input = document.getElementById("password");
  input.type = input.type === "password" ? "text" : "password";
}

// ===== PASSWORD STRENGTH =====
// ===== PASSWORD TOGGLE =====
function togglePassword() {
  const input = document.getElementById("password");
  input.type = input.type === "password" ? "text" : "password";
}

// ===== PASSWORD STRENGTH =====
// ===== PASSWORD STRENGTH =====
const passwordInput = document.getElementById("password");

if (passwordInput) {
  const strengthFill = document.getElementById("strengthFill");
  const strengthText = document.getElementById("strengthText");

  passwordInput.addEventListener("input", () => {
    const val = passwordInput.value;
    let strength = 0;

    if (val.length >= 6) strength++;
    if (/[A-Z]/.test(val)) strength++;
    if (/[0-9]/.test(val)) strength++;
    if (/[^A-Za-z0-9]/.test(val)) strength++;

    if (strength <= 1) {
      strengthFill.style.width = "25%";
      strengthFill.style.background = "#ef4444";
      strengthText.innerText = "Weak password";
    } else if (strength === 2) {
      strengthFill.style.width = "50%";
      strengthFill.style.background = "#f59e0b";
      strengthText.innerText = "Medium password";
    } else {
      strengthFill.style.width = "100%";
      strengthFill.style.background = "#22c55e";
      strengthText.innerText = "Strong password";
    }
  });
}
function register() {
  const name = document.getElementById("name").value;
  const email = document.getElementById("email").value;
  const password = document.getElementById("password").value;
  const role = document.getElementById("role").value;

  if (!name || !email || !password || !role) {
    alert("Please fill all fields");
    return;
  }

  fetch("https://mentorin-backend.onrender.com/register", {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify({
      name: name,
      email: email,
      password: password,
      role: role
    })
  })
  .then(res => res.json())
  .then(data => {
    alert(data.message);
    window.location.href = "login.html";
  })
  .catch(err => {
    console.error(err);
    alert("Registration failed");
  });
}


function checkPassword() {
  const password = document.getElementById("password").value;
  const confirm = document.getElementById("confirmPassword").value;
  const error = document.getElementById("confirmError");

  error.style.display = password !== confirm ? "block" : "none";
}
