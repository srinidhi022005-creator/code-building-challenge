/* ========================= */
/* 🔥 BACKGROUND EFFECT */
/* ========================= */

const canvas = document.getElementById("bgCanvas");
const ctx = canvas.getContext("2d");

canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

const words = [
  "ADMIN","SECURE","ACCESS","CONTROL","DATA",
  "SERVER","AUTH","ROOT","SYSTEM","PANEL"
];

const fontSize = 16;
const columns = canvas.width / 30;

const drops = [];

for (let i = 0; i < columns; i++) {
  drops[i] = Math.random() * canvas.height;
}

function draw() {
  ctx.fillStyle = "rgba(0, 1, 24, 0.08)";
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  ctx.fillStyle = "#1111fb"; // 🔴 admin theme
  ctx.font = fontSize + "px monospace";

  for (let i = 0; i < drops.length; i++) {

    const word = words[Math.floor(Math.random() * words.length)];

    ctx.fillText(word, i * 70, drops[i]);

    if (drops[i] > canvas.height && Math.random() > 0.975) {
      drops[i] = 0;
    }

    drops[i] += 0.5;
  }
}

setInterval(draw, 5);

window.addEventListener("resize", () => {
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
});


/* ========================= */
/* 🔥 POPUP FUNCTIONS */
/* ========================= */

function showPopup(type, title, message) {

  const popup = document.getElementById("popup");
  const icon = document.getElementById("popup-icon");
  const btn = document.getElementById("popup-btn");

  popup.classList.remove("success", "error");
  popup.classList.add(type);

  if (type === "success") {
    icon.innerText = "✔";
    btn.innerText = "OK";
  } else {
    icon.innerText = "!";
    btn.innerText = "Retry";
  }

  document.getElementById("popup-title").innerText = title;
  document.getElementById("popup-message").innerText = message;

  popup.classList.remove("hidden");

  btn.onclick = closePopup;
}

function closePopup() {
  document.getElementById("popup").classList.add("hidden");
}


/* ========================= */
/* 🔐 ADMIN LOGIN */
/* ========================= */

function adminLogin() {

  const username = document.getElementById("adminUser").value.trim();
  const password = document.getElementById("adminPass").value;

  const ADMIN_USER = "admin";
  const ADMIN_PASS = "1234";

  // ❌ Empty check
  if (!username || !password) {
    showPopup("error", "Missing Fields", "Please enter admin credentials");
    return;
  }

  // ✅ Correct credentials
  if (username === ADMIN_USER && password === ADMIN_PASS) {

    showPopup("success", "Access Granted", "Welcome Admin");

    // 🔥 Save admin session
    localStorage.setItem("isAdmin", "true");

    setTimeout(() => {
      window.location.href = "admin-dashboard.html"; // ✅ FIXED
    }, 1000);

  } else {

    showPopup(
      "error",
      "Access Denied",
      "Invalid admin username or password"
    );

  }
}
function setTimer() {

  let time = prompt("Enter timer in seconds:");

  if (!time || isNaN(time)) {
    alert("Invalid time ❌");
    return;
  }

  // ✅ Save timer for participants
  localStorage.setItem("contestTimer", time);

  alert("Timer set successfully ✅");
}