const mongoose = require("mongoose");

const participantSchema = new mongoose.Schema({
  name: String,
  code: String,
  submittedAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model("Participant", participantSchema);