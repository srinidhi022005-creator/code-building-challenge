let timerDisplay = document.getElementById("timer");
let startBtn = document.getElementById("startBtn");

function startTimer() {

  // 🔥 GET TIMER FROM SERVER
  fetch("/get-timer")
    .then(res => res.json())
    .then(data => {

      let timeLeft = data.time;

      // ✅ SHOW INITIAL VALUE IMMEDIATELY
      updateDisplay(timeLeft);

      const interval = setInterval(() => {

        timeLeft--;

        // ✅ STOP EXACTLY AT 0 (no negative)
        if (timeLeft < 0) {
          clearInterval(interval);

          timerDisplay.innerText = "00:00";   // final display
          startBtn.classList.remove("hidden"); // show start button

          return;
        }

        updateDisplay(timeLeft);

      }, 1000);

    })
    .catch(() => {
      timerDisplay.innerText = "Server error";
    });

}

/* ========================= */
/* ✅ FORMAT FUNCTION */
/* ========================= */

function updateDisplay(timeLeft) {

  let minutes = Math.floor(timeLeft / 60);
  let seconds = timeLeft % 60;

  timerDisplay.innerText =
    `${String(minutes).padStart(2, "0")}:${String(seconds).padStart(2, "0")}`;

}

/* ========================= */

function startCompetition() {
  window.location.href = "competition.html";
}

/* ========================= */

window.onload = startTimer;