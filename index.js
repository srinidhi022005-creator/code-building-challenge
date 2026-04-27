require("./backend/mongo");

const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const path = require("path");
const Timer = require("./backend/models/Timer");
const app = express();
const PORT = 3000;
async function initTimers() {

  let t1 = await Timer.findOne({ name: "timer1" });
  let t2 = await Timer.findOne({ name: "timer2" });

  if (!t1) {
    await Timer.create({ name: "timer1", value: 10 });
    console.log("✅ Timer1 created");
  }

  if (!t2) {
    await Timer.create({ name: "timer2", value: 60 });
    console.log("✅ Timer2 created");
  }

  console.log("✅ Timers initialized");
}

// ✅ Mongo Models
const User = require("./backend/models/User");
const Submission = require("./backend/models/Submission");
const Question = require("./backend/models/Questions");
const questionRoutes = require("./backend/routes/questions");


// Middleware
app.use(cors());
app.use(bodyParser.json());
app.use(express.static("public"));
app.use(express.json());
app.use("/questions", questionRoutes);

async function initTimers() {

  const t1 = await Timer.findOne({ name: "timer1" });
  const t2 = await Timer.findOne({ name: "timer2" });

  if (!t1) {
    await Timer.create({ name: "timer1", value: 10 });
    console.log("✅ Timer1 created");
  }

  if (!t2) {
    await Timer.create({ name: "timer2", value: 60 });
    console.log("✅ Timer2 created");
  }

}

app.get("/", (req, res) => {
  res.send("Server is running!");
});

// =========================
// 🔥 TIMER APIs (UNCHANGED)
// =========================


app.post("/set-timer", async (req, res) => {

  await Timer.findOneAndUpdate(
    { name: "timer1" },
    { value: req.body.time },
    { upsert: true }   // 🔥 THIS FIX
  );

  res.json({ message: "Timer1 updated" });
});

app.post("/set-timer2", async (req, res) => {

  await Timer.findOneAndUpdate(
    { name: "timer2" },
    { value: req.body.time },
    { upsert: true }   // 🔥 THIS FIX
  );

  res.json({ message: "Timer2 updated" });
});

app.get("/get-timer", async (req, res) => {

  const timer = await Timer.findOne({ name: "timer1" });

  res.json({ time: timer ? timer.value : 10 });

});
app.get("/get-timer2", async (req, res) => {

  const timer = await Timer.findOne({ name: "timer2" });

  res.json({ time: timer ? timer.value : 60 });

});
// =========================
// 🔥 AUTH APIs (FIXED TO MONGO)
// =========================

// SIGNUP
app.post("/signup", async (req, res) => {

  const { name1, name2, password } = req.body;

  if (!name1 || !name2 || !password) {
    return res.json({ message: "Missing data" });
  }

  const combinedName = name1 + " & " + name2;

  try {
    const existing = await User.findOne({ name: combinedName });

    if (existing) {
      return res.json({ message: "User already exists" });
    }

    await User.create({
      name: combinedName,
      password: password
    });

    res.json({ message: "Signup successful" });

  } catch {
    res.json({ message: "Error creating user" });
  }

});

// LOGIN
app.post("/login", async (req, res) => {

  const { name, password } = req.body;

  try {
    const user = await User.findOne({ name, password });

    if (!user) {
      return res.json({ message: "Invalid Username or Password" });
    }

    res.json({ message: "Login successful" });

  } catch {
    res.json({ message: "Error occurred" });
  }

});

// =========================
// 🔥 SUBMISSION API (FIXED)
// =========================

app.post("/submit", async (req, res) => {

  try {

    // ✅ CHECK duplicate
    const exists = await Submission.findOne({
      name: req.body.name
    });

    if (exists) {
      return res.json({ message: "Already submitted" });
    }

    // ✅ SAVE
    await Submission.create({
  name: req.body.name,
  answers: req.body.answers
});

    console.log("Received from frontend:", req.body);

    res.json({ message: "Submission saved successfully" });

  } catch (err) {
    console.error(err);
    res.json({ message: "Error saving data" });
  }

});

// =========================
// GET PARTICIPANTS
// =========================

app.get("/participants", async (req, res) => {

  try {
    const data = await Submission.find();
    res.json(data);
  } catch {
    res.json([]);
  }

});

// =========================
// DELETE PARTICIPANT
// =========================

app.post("/delete-participant", async (req, res) => {

  const { id, name } = req.body;

  try {

    await Submission.findByIdAndDelete(id);

    // delete user also
    await User.deleteOne({ name });

    res.json({ message: "User fully deleted" });

  } catch (err) {
    console.error(err);
    res.json({ message: "Error deleting user" });
  }

});

// =========================
// CLEAR ALL
// =========================

app.post("/clear-all", async (req, res) => {

  await Submission.deleteMany();
  res.json({ message: "All data cleared" });

});

// =========================
// DELETE ONLY DATA
// =========================

app.post("/delete-data-only", async (req, res) => {

  const { id } = req.body;

  try {
    await Submission.findByIdAndDelete(id);
    res.json({ message: "Submission data deleted" });
  } catch {
    res.json({ message: "Error deleting data" });
  }

});

// =========================
// CHECK PARTICIPANT
// =========================

app.get("/check-participant/:name", async (req, res) => {

  const name = req.params.name;

  try {
    const exists = await Submission.findOne({ name });
    res.json({ exists: !!exists });
  } catch {
    res.json({ exists: false });
  }

});

app.post("/add-questions", async (req, res) => {

  try {

    await Question.deleteMany(); // clear old questions

    await Question.insertMany(req.body.questions);

    res.json({ message: "Questions updated successfully" });

  } catch (err) {
    console.error(err);
    res.json({ message: "Error saving questions" });
  }

});
app.get("/get-questions", async (req, res) => {

  try {

    const questions = await Question.find();

    res.json(questions);

  } catch (err) {
    console.error(err);
    res.json([]);
  }

});
initTimers();
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});