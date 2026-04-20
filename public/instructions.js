let timerDisplay = document.getElementById("timer");
let startBtn = document.getElementById("startBtn");

function startTimer() {

  // 🔥 GET TIMER FROM SERVER
  fetch("/get-timer")
    .then(res => res.json())
    .then(data => {

      let timeLeft = data.time;

      const interval = setInterval(() => {

        let minutes = Math.floor(timeLeft / 60);
        let seconds = timeLeft % 60;

        timerDisplay.innerText =
          `${String(minutes).padStart(2, "0")}:${String(seconds).padStart(2, "0")}`;

        timeLeft--;

        if (timeLeft < 0) {
          clearInterval(interval);

          startBtn.classList.remove("hidden");
        }

      }, 1000);

    })
    .catch(() => {
      timerDisplay.innerText = "Server error";
    });

}

function startCompetition() {
  window.location.href = "competition.html";
}

window.onload = startTimer;