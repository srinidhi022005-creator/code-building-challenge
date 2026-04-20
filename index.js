const db = require("./db");
const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const fs = require("fs");
const path = require("path");

const app = express();
const PORT = 3000;

// Middleware
app.use(cors());
app.use(bodyParser.json());
app.use(express.static("public"));
app.use(express.json());

// =========================
// 🔥 FILE PATHS
// =========================

const participantsFile = path.join(__dirname, "participants.json");
const timerFile = path.join(__dirname, "timer.json");

// =========================
// 🔥 INIT FILES (IF NOT EXIST)
// =========================

if (!fs.existsSync(participantsFile)) {
  fs.writeFileSync(participantsFile, JSON.stringify([]));
}

if (!fs.existsSync(timerFile)) {
  fs.writeFileSync(timerFile, JSON.stringify({ time: 10 }));
}

// =========================
// TEST ROUTE
// =========================

app.get("/", (req, res) => {
  res.send("Server is running!");
});

// =========================
// 🔥 TIMER APIs
// =========================

// SET TIMER (ADMIN)
app.post("/set-timer", (req, res) => {

  const newTime = req.body.time;

  fs.writeFileSync(
    timerFile,
    JSON.stringify({ time: newTime }, null, 2)
  );

  res.json({ message: "Timer updated successfully" });

});

// GET TIMER (PARTICIPANT)
app.get("/get-timer", (req, res) => {

  try {
    const data = JSON.parse(fs.readFileSync(timerFile));
    res.json({ time: data.time });
  } catch {
    res.json({ time: 10 });
  }

});
// 🔥 TIMER 2 (COMPETITION TIMER)
let timer2 = 60; // default seconds

// SET TIMER 2 (ADMIN)
app.post("/set-timer2", (req, res) => {
  timer2 = req.body.time;
  res.json({ message: "Timer2 updated" });
});

// GET TIMER 2 (PARTICIPANT)
app.get("/get-timer2", (req, res) => {
  res.json({ time: timer2 });
});

// =========================
// 🔥 AUTH APIs
// =========================

// SIGNUP
app.post("/signup", (req, res) => {

  const { name, password } = req.body;

  if (!name || !password) {
    return res.json({ message: "Missing data" });
  }

  const query = "INSERT INTO users (name, password) VALUES (?, ?)";

  db.run(query, [name, password], function (err) {

    if (err) {
      return res.json({ message: "User already exists" });
    }

    res.json({ message: "Signup successful" });

  });

});

// LOGIN
app.post("/login", (req, res) => {

  const { name, password } = req.body;

  const query = "SELECT * FROM users WHERE name = ? AND password = ?";

  db.get(query, [name, password], (err, row) => {

    if (err) {
      return res.json({ message: "Error occurred" });
    }

    if (!row) {
      return res.json({ message: "Invalid Username or Password" });
    }

    res.json({ message: "Login successful" });

  });

});

// =========================
// 🔥 SUBMISSION API
// =========================

app.post("/submit", (req, res) => {

  let participants = [];

  try {
    const data = fs.readFileSync(participantsFile);
    participants = JSON.parse(data);
  } catch {
    participants = [];
  }

  participants.push(req.body);

  fs.writeFileSync(
    participantsFile,
    JSON.stringify(participants, null, 2)
  );

  res.json({ message: "Submission saved successfully" });

});

// =========================
// 🔥 GET PARTICIPANTS (ADMIN)
// =========================

app.get("/participants", (req, res) => {

  try {
    const data = fs.readFileSync(participantsFile);
    res.json(JSON.parse(data));
  } catch {
    res.json([]);
  }

});

// =========================
// 🚀 START SERVER
// =========================

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});

app.post("/delete-participant", (req, res) => {

  const { index, name } = req.body;

  let participants = [];

  try {
    participants = JSON.parse(fs.readFileSync("participants.json"));
  } catch {
    participants = [];
  }

  // ✅ Remove from participants.json
  participants.splice(index, 1);

  fs.writeFileSync(
    "participants.json",
    JSON.stringify(participants, null, 2)
  );

  // ✅ VERY IMPORTANT: Remove from USERS TABLE
  const query = "DELETE FROM users WHERE name = ?";

  db.run(query, [name], function (err) {

    if (err) {
      console.error(err);
      return res.json({ message: "Error deleting user" });
    }

    res.json({ message: "User fully deleted" });

  });

});


/* 🔥 CLEAR ALL DATA */
app.post("/clear-all", (req, res) => {

  fs.writeFileSync("participants.json", "[]");

  res.json({ message: "All data cleared" });

});
/* 🟡 DELETE ONLY SUBMISSION DATA */
app.post("/delete-data-only", (req, res) => {

  const { index } = req.body;

  let participants = [];

  try {
    participants = JSON.parse(fs.readFileSync("participants.json"));
  } catch {
    participants = [];
  }

  // remove only submission
  participants.splice(index, 1);

  fs.writeFileSync(
    "participants.json",
    JSON.stringify(participants, null, 2)
  );

  res.json({ message: "Submission data deleted" });

});