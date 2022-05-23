const { StatusCodes } = require("http-status-codes");
const CustomError = require("../../errors");
const Admin = require("../../models/Admin");
const Assessment = require("../../models/Assessment");

/*--------------manage assessment------------------*/
const addAssessment = async (req, res) => {
  let newAssessment = new Assessment({
    ...req.body,
    admin: req.admin.adminId,
  });
  try {
    const assessment = await newAssessment.save();
    console.log(req.admin.adminId, assessment._id);
    await Admin.updateOne(
      { _id: req.admin.adminId },
      {
        $push: {
          assessment: assessment._id,
        },
      }
    );
    res.status(201).json({
      message: "assessment created successfully",
      assessment,
    });
  } catch (error) {
    res.status(500).json({ error: "There was a error" });
  }
};

const updateAssessment = async (req, res) => {
  const assessmentId = req.params.id;
  const { title, description, deadline } = req.body;
  if (!title || !description || !deadline) {
    throw new CustomError.BadRequestError("Please provide all values");
  }
  try {
    const assessment = await Assessment.findOne({ _id: assessmentId });
    assessment.title = title;
    assessment.description = description;
    assessment.deadline = deadline;
    await assessment.save();
    res.status(StatusCodes.OK).json({ assessment });
  } catch (error) {
    res.status(StatusCodes.FORBIDDEN).json({ msg: "error in update" });
  }
};

const deleteAssessment = async (req, res) => {
  const assessmentId = req.params.id;
  const adminId = req.admin.adminId;
  const assessment = await Assessment.findByIdAndDelete({ _id: assessmentId });
  console.log(assessment);
  if (!assessment) {
    throw new CustomError.NotFoundError(`No user with id : ${assessmentId}`);
  }
  await Admin.updateOne(
    { _id: adminId },
    { $pull: { assessment: assessmentId } }
  )
  //await foundAdmin.assessment.pull({assessment: assessmentId})
  res.status(StatusCodes.OK).json({ user: null, status: "successfull" });
};

module.exports = {
  addAssessment,
  updateAssessment,
  deleteAssessment,
};
