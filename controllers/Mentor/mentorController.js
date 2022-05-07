const Mentor = require("../../models/Mentor");
const { StatusCodes } = require("http-status-codes");
const CustomError = require("../../errors");
const Admin = require("../../models/Admin");
const Assessment = require("../../models/Assessment");
const Grade = require("../../models/Grade");



/*--------- manage assessments------ */

const addAssessment = async (req, res) => {
  let newAssessment = new Assessment({
    ...req.body,
    mentor: req.mentorInfo.mentorId,
  });

  try {
    const assessment = await newAssessment.save();
    await Mentor.updateOne({_id:req.mentorInfo.mentorId },{
      $push:{
        assessment: assessment._id
      }
    })
    res.status(201).json({
      message: "assessment created successfully",
      assessment,
    });
  } catch (error) {
    res.status(500).json({ error: "There was a error" });
  }
};

/*--------- manage submission------ */
const getAllSubmissions = async(req, res)=> {
  const assessmentId = req.params.id

  try {
    const submissions = await Assessment.find({_id: assessmentId}).populate("submission").select("submission")
    res.status(200).json({
      message: "subssions get successfully",
      submissions
    });
  } catch (error) {
    res.status(500).json({ error: "There was a error" });
  }
}

/*--------- manage grade------ */

const addGrade = async(req,res)=> {
  const submissionId = req.params.id
  let newGrade = new Grade({
    ...req.body,
    submission: submissionId,
  });

  try {
    const grade = await newGrade.save();
    res.status(201).json({
      message: "grade added successfully",
      grade,
    });
  } catch (error) {
    res.status(500).json({ error: "There was a error" });
  }
}

module.exports = {
  addAssessment,
  getAllSubmissions,
  addGrade
};
