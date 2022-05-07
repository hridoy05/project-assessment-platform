const mongoose = require("mongoose");

const SubmissionSchema = mongoose.Schema({
  Url: {
    type: String,
    required: true,
  },
  DOS: {
    type: Date,
    required: [true, "date of submission is required"],
  },
  student: {
    type: mongoose.Schema.ObjectId,
    ref: "Student",
  },
  admin: {
    type: mongoose.Schema.ObjectId,
    ref: "Admin",
  },
  assessment: {
    type: mongoose.Schema.ObjectId,
    ref: "Assessment",
  },
});
module.exports = mongoose.model("Submission", SubmissionSchema);
