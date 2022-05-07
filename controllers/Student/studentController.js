const Student = require("../../models/Student");
const Submission = require("../../models/Submission");
const { StatusCodes } = require("http-status-codes");
const CustomError = require("../../errors");
const Assessment = require("../../models/Assessment");



/*------------- assessment submission ------------ */
const addSubmission= async (req, res) => {
  const assessmentId = req.params.id
  let newSubmission = new Submission({
    ...req.body,
    student: req.studentInfo.studentId,
    assessment: assessmentId
  });

  try {
    const submission = await newSubmission.save();
    await Student.updateOne({_id:req.studentInfo.studentId },{
      $push:{
        submission: submission._id
      }
    })
    await Assessment.updateOne({_id: assessmentId },{
      $push:{
        submission: submission._id
      }
    })
    res.status(201).json({
      message: "subssion added successfully",
    });
  } catch (error) {
    res.status(500).json({ error: "There was a error" });
  }
};
const getSubmissions =async (req, res)=> {
  const assessmentId = req.params.id

  try {
    const submissions = await Submission.find({assessment: assessmentId, student: req.studentInfo.studentId})
    res.status(200).json({
      message: "subssions get successfully",
      submissions
    });
  } catch (error) {
    res.status(500).json({ error: "There was a error" });
  }
}
module.exports = {
  addSubmission,
  getSubmissions
};
