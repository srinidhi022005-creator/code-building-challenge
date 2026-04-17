const isCompetitionPage = window.location.pathname.includes("competition");
const canvas = document.getElementById("bgCanvas");
const ctx = canvas.getContext("2d");

canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

/* Coding Words Instead of Letters */

const words = [ 
  "HTML","CSS","JavaScript","Python","React","Node","API","Function",
  "Loop","Array","Object","Class","Code","Debug","Compile","Execute",
  "Binary","Frontend","Backend","Algorithm"
];

const fontSize = 16;
const columns = canvas.width / 30;

const drops = [];

for (let i = 0; i < columns; i++) {
  drops[i] = Math.random() * canvas.height;
}

function draw() {

  ctx.fillStyle = "rgba(7, 0, 24, 0.08)";
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  if (isCompetitionPage) {
    ctx.fillStyle = "rgba(124, 58, 237, 0.7)";
    ctx.shadowBlur = 3;
    ctx.shadowColor = "#450da7";
  } else {
    ctx.fillStyle = "#7c3aed";
    ctx.shadowBlur = 0;
  }

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

  // 🔥 ensure button closes popup
  btn.onclick = closePopup;
}

function closePopup() {
  document.getElementById("popup").classList.add("hidden");
}

/* ========================= */
/* AUTH UI */
/* ========================= */

function showSignup() {
  document.getElementById("signupForm").classList.remove("hidden");
  document.getElementById("loginForm").classList.add("hidden");
}

function showLogin() {
  document.getElementById("loginForm").classList.remove("hidden");
  document.getElementById("signupForm").classList.add("hidden");
}

/* ========================= */
/* SIGNUP */
/* ========================= */

function signupUser() {

  const name = document.getElementById("signupName").value.trim();
  const password = document.getElementById("signupPassword").value;
  const confirmPassword = document.getElementById("confirmPassword").value;

  if (!name || !password || !confirmPassword) {
    showPopup("error", "Missing Fields", "Please fill all the fields.");
    return;
  }

  if (password !== confirmPassword) {
    showPopup("error", "Password Error", "Password is Mis-matching");
    return;
  }

  fetch("/signup", {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify({ name, password })
  })
  .then(response => response.json())
  .then(data => {

    showPopup("success", "Account Created", data.message);

    document.getElementById("signupName").value = "";
    document.getElementById("signupPassword").value = "";
    document.getElementById("confirmPassword").value = "";

  })
  .catch(() => {
    showPopup("error", "Error", "Signup failed. Try again.");
  });
}

/* ========================= */
/* LOGIN */
/* ========================= */

function loginUser() {

  const name = document.getElementById("loginName").value.trim();
  const password = document.getElementById("loginPassword").value;

  if (!name || !password) {
    showPopup("error", "Missing Fields", "Please enter username and password.");
    return;
  }

  fetch("/login", {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify({ name, password })
  })
  .then(response => response.json())
  .then(data => {

    if (data.message === "Login successful") {

      // ✅ STEP 7 (IMPORTANT)
      localStorage.setItem("username", name);

      showPopup("success", "Login Successful", "Welcome to the competition!");

     window.location.href = "instructions.html";

    } else {

      showPopup(
        "error",
        "Invalid Username or Password",
        "The name or password you entered is incorrect. Please try again."
      );

    }

  })
  .catch(() => {
    showPopup("error", "Error", "Login failed. Try again.");
  });

}
/* ========================= */
/* 🔐 ADMIN SHORTCUT FINAL */
/* ========================= */

window.onload = function () {

  document.addEventListener("keydown", function(e) {

    console.log("Key:", e.key); // debug

    // Ctrl + Shift + A
    if (
      e.ctrlKey &&
      e.shiftKey &&
      (e.key === "A" || e.key === "a")
    ) {
      e.preventDefault();

      console.log("✅ Admin shortcut triggered");

      window.location.href = "/admin.html";
    }

  });

};