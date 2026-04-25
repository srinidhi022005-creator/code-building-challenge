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

  btn.onclick = closePopup;
}

function closePopup() {

  document.getElementById("popup").classList.add("hidden");

  // logout after clicking OK
  localStorage.removeItem("username");
  window.location.href = "index.html";

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

  let name1 = document.getElementById("signupName1").value.trim();
  let name2 = document.getElementById("signupName2").value.trim();
  let password = document.getElementById("signupPassword").value;
  const confirmPassword = document.getElementById("confirmPassword").value;

  if (!name1 || !name2) {
    showPopup("error", "Missing Fields", "Enter both participant names");
    return;
  }

  const passwordPattern =
    /^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*#?&]).{8,}$/;

  if (!passwordPattern.test(password)) {
    showPopup(
      "error",
      "Invalid Password",
      "Password must be at least 8 characters and include alphabets, numbers & special character"
    );
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
    body: JSON.stringify({
      name1: name1,
      name2: name2,
      password: password
    })
  })
  .then(response => response.json())
  .then(data => {

    showPopup("success", "Account Created", data.message);

    document.getElementById("signupName1").value = "";
    document.getElementById("signupName2").value = "";
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

  const name1 = document.getElementById("loginName1").value.trim();
  const name2 = document.getElementById("loginName2").value.trim();
  const password = document.getElementById("loginPassword").value;

  if (!name1 || !name2 || !password) {
    showPopup("error", "Missing Fields", "Enter both names and password.");
    return;
  }

  // ✅ same format as signup
  const combinedName = name1 + " & " + name2;

  fetch("/login", {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify({ name: combinedName, password })
  })
  .then(response => response.json())
  .then(data => {

    if (data.message === "Login successful") {

      showPopup("success", "Login Successful", "Welcome to the competition!");
      afterLoginSuccess(combinedName);

    } else {

      showPopup(
        "error",
        "Invalid Credentials",
        "Names or password are incorrect."
      );

    }

  })
  .catch(() => {
    showPopup("error", "Error", "Login failed. Try again.");
  });

}

/* ========================= */
/* 🔐 ADMIN SHORTCUT */
/* ========================= */

window.onload = function () {

  document.addEventListener("keydown", function(e) {

    if (
      e.ctrlKey &&
      e.shiftKey &&
      (e.key === "A" || e.key === "a")
    ) {
      e.preventDefault();
      window.location.href = "/admin.html";
    }

  });

};

/* ========================= */
/* CHECK PARTICIPANT */
/* ========================= */

async function afterLoginSuccess(username) {

  const res = await fetch(`/check-participant/${username}`);
  const data = await res.json();

  if (data.exists) {

    showPopup(
      "error",
      "Access Denied",
      "You already completed the competition"
    );

    return;
  }

  // ✅ STEP 1 FIX (RESET SUBMISSION FLAG)
  localStorage.removeItem(`submitted_${username}`);

  localStorage.setItem("teamName", username);
  console.log("Saved teamName:", localStorage.getItem("teamName"));
  window.location.href = "instructions.html";
}