let timerDisplay;
let startBtn;

window.onload = () => {

  timerDisplay = document.getElementById("timer");
  startBtn = document.getElementById("startBtn");

  startTimer();
};

function startTimer() {

  fetch("/get-timer")
    .then(res => {
      if (!res.ok) throw new Error("Server response not OK");
      return res.json();
    })
    .then(data => {

      console.log("Timer1 fetched:", data); // DEBUG

      let timeLeft = data.time || 10;

      updateDisplay(timeLeft);

      const interval = setInterval(() => {

        timeLeft--;

        if (timeLeft < 0) {
          clearInterval(interval);
          timerDisplay.innerText = "00:00";
          startBtn.classList.remove("hidden");
          return;
        }

        updateDisplay(timeLeft);

      }, 1000);

    })
    .catch((err) => {
      console.error("Timer error:", err);
      timerDisplay.innerText = "Server error";
    });
}

function updateDisplay(timeLeft) {

  let minutes = Math.floor(timeLeft / 60);
  let seconds = timeLeft % 60;

  timerDisplay.innerText =
    `${String(minutes).padStart(2, "0")}:${String(seconds).padStart(2, "0")}`;
}

function startCompetition() {
  window.location.href = "competition.html";
}