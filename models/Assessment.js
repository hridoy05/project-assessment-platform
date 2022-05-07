const mongoose = require("mongoose");

const AssessmentSchema = mongoose.Schema({
  title: {
    type: String,
    trim: true,
    required: [true, "Please provide review title"],
    maxlength: 30,
  },
  description: {
    type: String,
    trim: true,
    required: [true, "Please provide description"],
  },
  mentor: {
    type: mongoose.Schema.ObjectId,
    ref: "Mentor",
  },
  mentor: {
    type: mongoose.Schema.ObjectId,
    ref: "Admin",
  },
  createdAt: { type: Date, required: true, default: Date.now },
  deadline: {
      type: String,
      required: true
  },
  submission: [{
    type: mongoose.Schema.ObjectId,
    ref: "Submission",
  }]
  
});

module.exports = mongoose.model('Assessment', AssessmentSchema) 
