const express = require("express");
const router = express.Router();
const Question = require("../models/Questions");

// GET QUESTIONS
router.get("/", async (req, res) => {
  const questions = await Question.find();
  res.json(questions);
});

// ADD / UPDATE QUESTIONS (from admin)
router.post("/", async (req, res) => {
  await Question.deleteMany(); // clear old

  await Question.insertMany(req.body); // save new

  res.json({ message: "Questions updated" });
});

module.exports = router;