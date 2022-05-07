const express = require('express');
const { addSubmission,getSubmissions } = require('../../controllers/Student/studentController');
const router = express.Router();
const {
  authenticatestudent,
} = require('../../middleware/authentication');
const verifyRoles = require('../../middleware/verifyRoles');

router.route("/assessment/:id/addSubmission").post(authenticatestudent, verifyRoles("Student"),addSubmission)
router.route("/assessment/:id/getSubmissions").get(authenticatestudent, verifyRoles("Student"),getSubmissions)

module.exports = router;



