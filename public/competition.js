/* ========================= */
/* ✅ SAFE QUESTION LOADING */
/* ========================= */

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

let stored = localStorage.getItem("questions");

let questions;
try {
  questions = stored ? JSON.parse(stored) : defaultQuestions;

  if (!questions || questions.length === 0) {
    questions = defaultQuestions;
  }
} catch {
  questions = defaultQuestions;
}

/* ========================= */

let currentQuestion = 0;
let selectedLines = {};
let allPrograms = [];
let userAnswers = [];
let username = localStorage.getItem("username") || "player";

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

/* ========================= */

function reviewAnswers() {
  currentQuestion = 0;
  loadQuestion();
}

/* ========================= */

async function submitAllResults() {

  try {

    await fetch("/submit", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        name: username,
        code: allPrograms.join("\n\n"),
        score: 0
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
/* TIMER START */
/* ========================= */

window.onload = async function () {

  loadQuestion();

  try {
    const res = await fetch("/get-timer2");
    const data = await res.json();

    compTimeLeft = data.time;

  } catch {
    compTimeLeft = 60;
  }

  startCompetitionTimer();
};

/* ========================= */

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

  let attemptedPrograms = [];

  userAnswers.forEach((ans, i) => {

    if (ans && Object.keys(ans).length > 0) {

      let program = "";

      questions[i].lines.forEach((_, index) => {
        if (ans[index]) {
          program += ans[index];
        }
      });

      attemptedPrograms.push(program);
    }

  });

  fetch("/submit", {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify({
      name: username,
      code: attemptedPrograms.join("\n\n"),
      score: 0
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

      <p class="success-text">
        Your results submitted successfully
      </p>

      <button class="btn primary" onclick="logout()">
        Sign Out
      </button>
    </div>
  `;
}

/* ========================= */
/* TAB SWITCH DETECTION */
/* ========================= */

document.addEventListener("visibilitychange", () => {

  if (document.hidden) {

    clearInterval(timerInterval);

    // ✅ use same auto submit
    autoSubmit();

  }

});