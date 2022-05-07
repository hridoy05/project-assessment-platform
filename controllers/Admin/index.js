const {
  createAdmin,
  updateAdmin,
  deleteAdmin,
  createMentor,
  updateMentor,
  deleteMentor,
  createStudent,
  updateStudent,
  deleteStudent,
} = require("./adminAllUserController");
const {
  addAssessment,
  updateAssessment,
  deleteAssessment,
} = require("./adminAssessmentController");

const {
  addSubmission,
  updateSubmission,
  deleteSubmission,
} = require("./AdminsubmissionController");

const {
  addGrade,
  updateGrade,
  deleteGrade,
} = require("./AdminGradeController");

module.exports = {
  updateAdmin,
  deleteAdmin,
  createAdmin,
  createMentor,
  updateMentor,
  deleteMentor,
  createStudent,
  updateStudent,
  deleteStudent,
  addAssessment,
  updateAssessment,
  deleteAssessment,
  addSubmission,
  updateSubmission,
  deleteSubmission,
  addGrade,
  updateGrade,
  deleteGrade,
};
