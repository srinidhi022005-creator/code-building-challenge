const mongoose = require("mongoose");

const submissionSchema = new mongoose.Schema({
  name: String,

  answers: [
    {
      question: String,
      answer: String
    }
  ],

  submittedAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model("Submission", submissionSchema);