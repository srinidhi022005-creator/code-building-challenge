const mongoose = require("mongoose");

const timerSchema = new mongoose.Schema({
  name: String, // "timer1" or "timer2"
  value: Number
});

module.exports = mongoose.model("Timer", timerSchema);