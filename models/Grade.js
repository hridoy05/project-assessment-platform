const mongoose  = require("mongoose");


const GradeShcema = new mongoose.Schema({
        mark:{
            type: Number,
            default: 0
        },
        remark:{
            type: String,
            trim: true
            
        },
        submission: {
            type: mongoose.Schema.ObjectId,
            ref: "Submission",
        }
        
})

module.exports = mongoose.model('Grade', GradeShcema)