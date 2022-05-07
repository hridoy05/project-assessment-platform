const { StatusCodes } = require("http-status-codes");
const CustomError = require("../../errors");
const Assessment = require("../../models/Assessment");
const Submission = require("../../models/Submission");

/*--------------manage assessment------------------*/
const addSubmission= async (req, res) => {
    const assessmentId = req.params.id
    let newSubmission = new Submission({
      ...req.body,
      admin: req.adminInfo.adminId,
      assessment: assessmentId
    });
  
    try {
      const submission = await newSubmission.save();
      await Admin.updateOne({_id:req.adminInfo.adminId },{
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

  
const updateSubmission = async (req, res) => {
    const submissionId = req.params.subId
    const { url,DOS } = req.body;
    if (!url || !DOS) {
      throw new CustomError.BadRequestError("Please provide all values");
    }
    try {
      const submission = await Submission.findOne({ _id: submissionId });
      submission.url = url
      submission.DOS = DOs
      
  
      await submission.save();
      res.status(StatusCodes.OK).json({submission });
    } catch (error) {
      res.status(StatusCodes.FORBIDDEN).json({ msg: "error in update" });
    }
  };
  
  const deleteSubmission = async (req, res) => {
    const submissionId = req.params.subId
    const submission = await Assessment.findByIdAndDelete({ _id: submissionId });
    if (!submission) {
      throw new CustomError.NotFoundError(`No user with id : ${assessmentId}`);
    }
    res.status(StatusCodes.OK).json({ user: null, status: "successfull" });
  };

  
module.exports = {
    addSubmission,
    updateSubmission,
    deleteSubmission
  };