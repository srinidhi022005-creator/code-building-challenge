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
// 🔥 INIT FILES
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

app.post("/set-timer", (req, res) => {
  const newTime = req.body.time;

  fs.writeFileSync(
    timerFile,
    JSON.stringify({ time: newTime }, null, 2)
  );

  res.json({ message: "Timer updated successfully" });
});

app.get("/get-timer", (req, res) => {
  try {
    const data = JSON.parse(fs.readFileSync(timerFile));
    res.json({ time: data.time });
  } catch {
    res.json({ time: 10 });
  }
});

// TIMER 2
let timer2 = 60;

app.post("/set-timer2", (req, res) => {
  timer2 = req.body.time;
  res.json({ message: "Timer2 updated" });
});

app.get("/get-timer2", (req, res) => {
  res.json({ time: timer2 });
});

// =========================
// 🔥 AUTH APIs
// =========================

// SIGNUP ✅ FIXED
app.post("/signup", (req, res) => {

  const { name1, name2, password } = req.body;

  if (!name1 || !name2 || !password) {
    return res.json({ message: "Missing data" });
  }

  const combinedName = name1 + " & " + name2;

  const insertQuery = "INSERT INTO users (name, password) VALUES (?, ?)";

  db.run(insertQuery, [combinedName, password], function (err) {

    if (err) {
      return res.json({ message: "User already exists" });
    }

    res.json({ message: "Signup successful" });

  });

});

// LOGIN
app.post("/login", (req, res) => {

  const { name, password } = req.body;

  const selectQuery = "SELECT * FROM users WHERE name = ? AND password = ?";

  db.get(selectQuery, [name, password], (err, row) => {

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

  // ✅ CHECK duplicate using single name
  if (
    participants.find(
      p => p.name.toLowerCase().trim() === req.body.name.toLowerCase().trim()
    )
  ) {
    return res.json({ message: "Already submitted" });
  }

  // ✅ SAVE properly
  participants.push({
  name: req.body.name || "UNKNOWN",
  code: req.body.code || ""
});

  fs.writeFileSync(
    participantsFile,
    JSON.stringify(participants, null, 2)
  );

  res.json({ message: "Submission saved successfully" });
  console.log("Received from frontend:", req.body);

});
// =========================
// GET PARTICIPANTS
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
// DELETE PARTICIPANT
// =========================

app.post("/delete-participant", (req, res) => {

  const { index, name } = req.body;

  let participants = [];

  try {
    participants = JSON.parse(fs.readFileSync(participantsFile));
  } catch {
    participants = [];
  }

  participants.splice(index, 1);

  fs.writeFileSync(
    participantsFile,
    JSON.stringify(participants, null, 2)
  );

  const deleteQuery = "DELETE FROM users WHERE name = ?";

  db.run(deleteQuery, [name], function (err) {

    if (err) {
      console.error(err);
      return res.json({ message: "Error deleting user" });
    }

    res.json({ message: "User fully deleted" });

  });

});

// =========================
// CLEAR ALL
// =========================

app.post("/clear-all", (req, res) => {
  fs.writeFileSync(participantsFile, "[]");
  res.json({ message: "All data cleared" });
});

// DELETE ONLY DATA
app.post("/delete-data-only", (req, res) => {

  const { index } = req.body;

  let participants = [];

  try {
    participants = JSON.parse(fs.readFileSync(participantsFile));
  } catch {
    participants = [];
  }

  participants.splice(index, 1);

  fs.writeFileSync(
    participantsFile,
    JSON.stringify(participants, null, 2)
  );

  res.json({ message: "Submission data deleted" });

});

// =========================
// CHECK PARTICIPANT ✅ FIXED
// =========================

app.get("/check-participant/:name", (req, res) => {

  const name = req.params.name.toLowerCase().trim();

  let participants = [];

  try {
    participants = JSON.parse(fs.readFileSync(participantsFile));
  } catch {
    participants = [];
  }

  const exists = participants.some(
    p => p.name.toLowerCase().trim() === name
  );

  res.json({ exists });

});

// =========================
// START SERVER
// =========================

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});