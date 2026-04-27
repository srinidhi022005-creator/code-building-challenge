/* ========================= */
/* ✅ SAFE QUESTION LOADING */
/* ========================= */
let isSubmitted = false;
console.log("TEAM NAME FROM STORAGE:", localStorage.getItem("teamName"));

const defaultQuestions = [
  {
    question: "Print numbers from 0 to 2 using a loop",
    lines: [
      [
        "for i in range(3):\n",
        "while True:\n",
        "for(i=0;i<3;i++)\n",
        "loop 3 times\n"
      ],
      [
        "    print(i)\n",
        "    echo(i)\n",
        "    System.out.println(i);\n",
        "    cout << i;\n"
      ]
    ]
  }
];

let questions = [];

/* ========================= */

let currentQuestion = 0;
let selectedLines = {};
let allPrograms = [];
let userAnswers = [];

let username = localStorage.getItem("teamName");

/* 🔥 TIMER VARIABLES */
let compTimeLeft = 0;
let timerInterval;

/* ========================= */
/* LOAD QUESTION */
/* ========================= */

function loadQuestion() {

  const container = document.querySelector(".question-container");

  if (!questions[currentQuestion]) {
    container.innerHTML = "<h2>No Questions Available</h2>";
    return;
  }

  selectedLines = userAnswers[currentQuestion] || {};

  const q = questions[currentQuestion];

  container.innerHTML = `<h2 class="question">${q.question}</h2>`;

  q.lines.forEach((lineOptions, index) => {

    const wrapper = document.createElement("div");
    wrapper.style.marginTop = "20px";

    const optionsDiv = document.createElement("div");
    optionsDiv.classList.add("options");

    lineOptions.forEach(option => {

      const btn = document.createElement("button");
      btn.innerText = option.trim();

      if (selectedLines[index] === option) {
        btn.style.background = "#7c3aed";
      }

      btn.onclick = () => {
        selectedLines[index] = option;

        optionsDiv.querySelectorAll("button")
          .forEach(b => b.style.background = "");

        btn.style.background = "#7c3aed";
      };

      optionsDiv.appendChild(btn);
    });

    wrapper.appendChild(optionsDiv);
    container.appendChild(wrapper);
  });

  const submitBtn = document.createElement("button");
  submitBtn.className = "btn primary";
  submitBtn.innerText = "Submit";
  submitBtn.style.marginTop = "30px";
  submitBtn.onclick = submitProgram;

  container.appendChild(submitBtn);
}

/* ========================= */
/* SUBMIT QUESTION */
/* ========================= */

function submitProgram() {

  const q = questions[currentQuestion];

  if (Object.keys(selectedLines).length !== q.lines.length) {
    showPopup("error", "Incomplete Submission", "Please select all options.");
    return;
  }

  let program = "";

  q.lines.forEach((_, index) => {
    program += selectedLines[index];
  });

  userAnswers[currentQuestion] = selectedLines;
  allPrograms[currentQuestion] = program;

  currentQuestion++;

  if (currentQuestion < questions.length) {
    loadQuestion();
  } else {
    showFinalPage();
  }
}

/* ========================= */
/* FINAL PAGE */
/* ========================= */

function showFinalPage() {

  const container = document.querySelector(".question-container");

  container.innerHTML = `
    <div class="final-box">
      <h2 class="success-title">All Problems Completed</h2>
      <p class="success-text">Check your answers before submitting</p>

      <div class="review-buttons">
        <button class="btn primary" onclick="reviewAnswers()">
          Check Once Again
        </button>

        <button class="btn primary" onclick="submitAllResults()">
          Submit Results
        </button>
      </div>
    </div>
  `;
}

function reviewAnswers() {
  currentQuestion = 0;
  loadQuestion();
}

/* ========================= */
/* ✅ FINAL SUBMIT */
/* ========================= */

async function submitAllResults() {

  if (isSubmitted) return;
  isSubmitted = true;

  localStorage.setItem(`submitted_${username}`, "true");

  try {
    console.log("Submitting:", username);
    console.log("Sending to server:", {
  name: username,
  code: allPrograms.map((prog, i) => ({
  question: questions[i].question,
  answer: prog
}))
});
    await fetch("/submit", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
  name: username,
  answers: allPrograms.map((prog, i) => ({
    question: questions[i].question,
    answer: prog
  }))
})
    });

    showSuccessPage();

  } catch {
    showPopup("error", "Error", "Submission failed");
  }
}

/* ========================= */

function showSuccessPage() {

  const container = document.querySelector(".question-container");

  container.innerHTML = `
    <div class="final-box">
      <h1 class="success-title">Challenge is Completed!</h1>

      <p class="success-text">
        Thank you <span class="user-name">${username}</span>.<br>
        Your responses have been recorded successfully.
      </p>

      <button class="btn primary" onclick="logout()">
        Sign Out
      </button>
    </div>
  `;
}

/* ========================= */

function logout() {
  window.location.href = "index.html";
}

/* ========================= */
/* TIMER */
/* ========================= */

window.onload = async function () {

  // 🔥 STEP 4: SERVER CHECK (ANTI-REFRESH / ANTI-CHEAT)
try {
  const res = await fetch(`/check-participant/${username}`);
  const data = await res.json();

  if (data.exists) {
    window.location.href = "index.html"; // redirect to login
    return;
  }
} catch (err) {
  console.error("Check participant error:", err);
}
  // block only if already submitted
  if (localStorage.getItem(`submitted_${username}`) === "true") {
  window.location.href = "index.html"; // 🔥 redirect to login page
  return;
}

  /* ========================= */
  /* 🔥 FETCH QUESTIONS */
  /* ========================= */

  try {
    const res = await fetch("/questions");
    questions = await res.json();

    console.log("Questions from DB:", questions); // ✅ DEBUG

    if (!questions || questions.length === 0) {
      questions = defaultQuestions;
    }

  } catch (err) {
    console.error("Question fetch error:", err);
    questions = defaultQuestions;
  }

  /* ========================= */
  /* 🔥 FETCH TIMER FIRST */
  /* ========================= */

  try {
    const res = await fetch("/get-timer2");
    const data = await res.json();

    console.log("Timer2 from server:", data); // ✅ DEBUG

    compTimeLeft = data.time || 60;

  } catch (err) {
    console.error("Timer fetch error:", err);
    compTimeLeft = 60;
  }

  /* ========================= */
  /* ✅ LOAD UI AFTER DATA */
  /* ========================= */

  loadQuestion();
  startCompetitionTimer();
};

function startCompetitionTimer() {

  const timerDisplay = document.getElementById("comp-timer");

  timerInterval = setInterval(() => {

    let minutes = Math.floor(compTimeLeft / 60);
    let seconds = compTimeLeft % 60;

    timerDisplay.innerText =
      `${String(minutes).padStart(2, "0")}:${String(seconds).padStart(2, "0")}`;

    compTimeLeft--;

    if (compTimeLeft < 0) {
      clearInterval(timerInterval);
      autoSubmit();
    }

  }, 1000);
}

/* ========================= */
/* AUTO SUBMIT */
/* ========================= */

function autoSubmit() {

  if (isSubmitted) return;
  isSubmitted = true;
localStorage.setItem(`submitted_${username}`, "true");
  
console.log("Submitting:", username);
console.log("Sending to server:", {
  name: username,
  code: allPrograms.join("\n\n")
});
  fetch("/submit", {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify({
  name: username,
  code: allPrograms.join("\n\n")
})
  });

  showTimeOverPopup();
}

/* ========================= */

function showTimeOverPopup() {

  const container = document.querySelector(".question-container");

  container.innerHTML = `
    <div class="final-box">
      <h1 class="success-title">⏰ Time Over</h1>
      <p class="success-text">Your results submitted successfully</p>

      <button class="btn primary" onclick="logout()">
        Sign Out
      </button>
    </div>
  `;
}

/* ========================= */
/* TAB SWITCH */
/* ========================= */

document.addEventListener("visibilitychange", () => {

  if (document.hidden) {
    clearInterval(timerInterval);
    autoSubmit();
  }

});

/* ========================= */

function showAlreadySubmittedPopup() {

  const container = document.querySelector(".question-container");

  container.innerHTML = `
    <div class="final-box">
      <h1 class="success-title">⚠️ Already Submitted</h1>

      <p class="success-text">
        Your answers are already submitted
      </p>

      <button class="btn primary" onclick="logout()">
        Sign Out
      </button>
    </div>
  `;
}