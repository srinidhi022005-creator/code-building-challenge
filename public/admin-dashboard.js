const canvas = document.getElementById("bgCanvas");
const ctx = canvas.getContext("2d");

canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

const words = [
  "ADMIN","CONTROL","ACCESS","DATA","SERVER",
  "SYSTEM","PANEL","SECURE","ROOT"
];

const drops = [];
const columns = canvas.width / 30;

for (let i = 0; i < columns; i++) {
  drops[i] = Math.random() * canvas.height;
}

function draw() {

  ctx.fillStyle = "rgba(7, 0, 24, 0.08)";
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  ctx.fillStyle = "#1111fb";
  ctx.font = "16px monospace";

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
function loadDatabase() {

  fetch("/participants") // ✅ FIXED
    .then(res => res.json())
    .then(data => {
      showDatabase(data);
    })
    .catch((err) => {
      console.error(err);
      alert("Error loading data");
    });


}
function showDatabase(data) {

  const container = document.querySelector(".container");

  if (data.length === 0) {
    container.innerHTML = "<h2>No submissions yet</h2>";
    return;
  }

  let html = `
    <h1>📊 Participant Data</h1>
    <div class="data-table">
  `;

  data.forEach((user, index) => {
  html += `
    <div class="card">
      <h3>${user.name}</h3>
      <pre>${user.code}</pre>
      <p>Score: ${user.score}</p>

      <button class="btn secondary"
  onclick="deleteData(${index})">
  Delete Data
</button>

<button class="btn primary"
  onclick="deleteParticipant(${index}, '${user.name}')">
  Delete Full
</button>
    </div>
  `;
});

  html += `</div>`;

  container.innerHTML = html;
}
function openCustomize() {
  window.location.href = "customize.html";
}
function setTimer1() {

  let time = prompt("Enter Timer (in seconds):");

  if (!time || isNaN(time) || time <= 0) {
    alert("Invalid input");
    return;
  }

  fetch("/set-timer", {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify({ time: parseInt(time) })
  })
  .then(res => res.json())
  .then(() => {
    alert("Timer updated globally ✅");
  });

}
function deleteParticipant(index, name) {

  if (!confirm("Delete full participant (account + data)?")) return;

  fetch("/delete-participant", {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify({ index, name })
  })
  .then(() => {
    loadDatabase();
  });

}


function deleteData(index) {

  if (!confirm("Delete only submission data?")) return;

  fetch("/delete-data-only", {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify({ index })
  })
  .then(() => {
    loadDatabase();
  });

}
function setTimer2() {

  let time = prompt("Enter Competition Timer (in seconds):");

  if (!time || isNaN(time) || time <= 0) {
    alert("Invalid input");
    return;
  }

  fetch("/set-timer2", {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify({ time: parseInt(time) })
  })
  .then(() => {
    alert("Competition timer updated ✅");
  });

}