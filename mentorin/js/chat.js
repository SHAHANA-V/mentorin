function sendMessage() {
  const input = document.getElementById("chatInput");
  const msg = input.value.trim();
  if (!msg) return;

  const user = JSON.parse(localStorage.getItem("user"));

  fetch("https://mentorin-backend.onrender.com/analyze_chat", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      user_id: user.id,
      message: msg
    })
  })
  .then(res => {
    if (!res.ok) throw res;
    return res.json();
  })
  .then(data => {

    // 🚫 BLOCKED MESSAGE
    if (data.severity === "high" || data.severity === "medium") {
  alert("🚫 This message is not allowed on Mentorin platform");
  return;
}


    // ✅ SHOW MESSAGE
    addMessage(msg, "sent");
    input.value = "";

  })
  .catch(err => {
    alert("⚠ Message not allowed or user blocked");
  });
}


function addMessage(text, type) {
  const box = document.getElementById("chatMessages");
  const div = document.createElement("div");
  div.className = "message " + type;
  div.innerText = text;
  box.appendChild(div);
  box.scrollTop = box.scrollHeight;
}

