const mongoose = require('mongoose');
const validator = require('validator');
const bcrypt = require('bcryptjs');

const StudentSchema = new mongoose.Schema({
  name: {
    type: String,
    trim: true,
    required: [true, 'Please provide name'],
    minlength: 3,
    maxlength: 50,
  },
  email: {
    type: String,
    trim: true,
    unique: true,
    required: [true, 'Please provide email'],
    validate: {
      validator: validator.isEmail,
      message: 'Please provide valid email',
    },
  },
  password: {
    type: String,
    trim: true,
    required: [true, 'Please provide password'],
    minlength: 6,
  },
  refreshToken: String,
  userType:{
    type:String,
    default: 'Student'
},
submission: [{
  type: mongoose.Schema.ObjectId,
  ref: "Submission",
}]
  
});

StudentSchema.pre('save', async function () {
  if (!this.isModified('password')) return;
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
});

StudentSchema.methods.comparePassword = async function (canditatePassword) {
  const isMatch = await bcrypt.compare(canditatePassword, this.password);
  return isMatch;
};

module.exports = mongoose.model('Student', StudentSchema);
