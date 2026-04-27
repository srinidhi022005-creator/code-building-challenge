const mongoose = require("mongoose");

const questionSchema = new mongoose.Schema({
  question: String,
  lines: [[String]] // array of array of options
});

module.exports = mongoose.model("Question", questionSchema);