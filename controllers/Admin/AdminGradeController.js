const { StatusCodes } = require("http-status-codes");
const CustomError = require("../../errors");
const Grade = require("../../models/Grade");


/*--------------manage grade------------------*/
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

  
const updateGrade = async (req, res) => {
    const submissionId = req.params.subId
    const gradeId = req.params.gId
    const { mark,remark } = req.body;
    if (!mark || !remark) {
      throw new CustomError.BadRequestError("Please provide all values");
    }
    try {
      const grade = await Grade.findOne({_id:gradeId ,submission: submissionId });
      grade.mark = mark
      grade,remark = remark 
      await grade.save();
      res.status(StatusCodes.OK).json({grade });
    } catch (error) {
      res.status(StatusCodes.FORBIDDEN).json({ msg: "error in update" });
    }
  };
  
  const deleteGrade = async (req, res) => {
    const submissionId = req.params.subId
    const gradeId = req.params.gId
    const grade = await Grade.findByIdAndDelete({_id:gradeId ,submission: submissionId });
    if (!grade) {
      throw new CustomError.NotFoundError(`No user with id : ${gradeId}`);
    }
    res.status(StatusCodes.OK).json({ user: null, status: "successfull" });
  };

  
module.exports = {
    addGrade,
    updateGrade,
    deleteGrade
  };