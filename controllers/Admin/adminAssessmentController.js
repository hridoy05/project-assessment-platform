const { StatusCodes } = require("http-status-codes");
const CustomError = require("../../errors");
const Assessment = require("../../models/Assessment");

/*--------------manage assessment------------------*/
const addAssessment = async (req, res) => {
    let newAssessment = new Assessment({
      ...req.body,
      mentor: req.mentorInfo.mentorId,
    });
  
    try {
      const assessment = await newAssessment.save();
      await Admin.updateOne({_id:req.adminInfo.adminId },{
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
  
  const updateAssessment = async (req, res) => {
    const assessmentId = req.params.id
    const { title, description,deadline } = req.body;
    if (!title || !description || !deadline) {
      throw new CustomError.BadRequestError("Please provide all values");
    }
    try {
      const assessment = await Assessment.findOne({ _id: assessmentId });
      assessment.title = title
      assessment.description = description
      assessment.deadline = deadline
  
      await assessment.save();
      res.status(StatusCodes.OK).json({assessment });
    } catch (error) {
      res.status(StatusCodes.FORBIDDEN).json({ msg: "error in update" });
    }
  };
  
  const deleteAssessment = async (req, res) => {
    const assessmentId = req.params.id
    const assessment = await Assessment.findByIdAndDelete({ _id: assessmentId });
    if (!assessment) {
      throw new CustomError.NotFoundError(`No user with id : ${assessmentId}`);
    }
    res.status(StatusCodes.OK).json({ user: null, status: "successfull" });
  };

  
module.exports = {
    addAssessment,
    updateAssessment,
    deleteAssessment
  };