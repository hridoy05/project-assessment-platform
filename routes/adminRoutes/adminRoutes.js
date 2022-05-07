const express = require('express');
const router = express.Router();
const {
  authenticateAdmin,
} = require('../../middleware/authentication');
const {
  updateAdmin,
  deleteAdmin,
  createAdmin,
  addAssessment,
  updateAssessment,
  deleteAssessment,
  createMentor,
  updateMentor,
  deleteMentor,
  createStudent,
  updateStudent,
  deleteStudent,
  addSubmission,
  updateSubmission,
  deleteSubmission,
  addGrade,
  updateGrade,
  deleteGrade
} = require("../../controllers/Admin");
const verifyRoles = require('../../middleware/verifyRoles');

/*--------- manage admin ----------*/
router.route('/createAdmin').post(authenticateAdmin,verifyRoles('Admin'), createAdmin)

router.route('/updateAdmin').patch(authenticateAdmin,verifyRoles('Admin'), updateAdmin);

router.route('/deleteAdmin').delete(authenticateAdmin,verifyRoles('Admin'),deleteAdmin )

/*--------- manage mentor ----------*/
router.route('/createStudent').post(authenticateAdmin,verifyRoles('Admin'), createMentor)

router.route('/updateStudent').patch(authenticateAdmin,verifyRoles('Admin'), updateMentor)

router.route('/deleteStudent').delete(authenticateAdmin,verifyRoles('Admin'),deleteMentor )


/*--------- manage student ----------*/ 
router.route('/createStudent').post(authenticateAdmin,verifyRoles('Admin'), createStudent)

router.route('/updateStudent').patch(authenticateAdmin,verifyRoles('Admin'), updateStudent)

router.route('/deleteStudent').delete(authenticateAdmin,verifyRoles('Admin'),deleteStudent )

/*--------- manage assessment route----------*/ 
router.route("/addAssessment").post(authenticateAdmin, verifyRoles("Admin"),addAssessment)

router.route('/assessment/:id').patch(authenticateAdmin,verifyRoles('Admin'), updateAssessment)

router.route('/assessment/:id').delete(authenticateAdmin,verifyRoles('Admin'),deleteAssessment )

/*--------- manage assessment submission route----------*/ 
router.route("/assessment/:id/addSubmission").post(authenticateAdmin, verifyRoles("Admin"),addSubmission)

router.route('/assessment/:id/updateSubmission/:subId').patch(authenticateAdmin,verifyRoles('Admin'), updateSubmission)

router.route('/assessment/:id/updateSubmission/:subId').delete(authenticateAdmin,verifyRoles('Admin'),deleteSubmission )

/*-----------------manage grade route------------------------*/
router.route("submissions/:id/addGrade").post(authenticateAdmin, verifyRoles("Admin"),addGrade)

router.route("submissions/:id/updateGrade/:gId").post(authenticateAdmin, verifyRoles("Admin"),updateGrade)

router.route("submissions/:id/deleteGrade/:gId").post(authenticateAdmin, verifyRoles("Admin"),deleteGrade)


module.exports = router;
