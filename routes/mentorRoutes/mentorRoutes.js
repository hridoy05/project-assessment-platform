const express = require('express');
const { addAssessment, getAllSubmissions, addGrade } = require('../../controllers/Mentor/mentorController');
const router = express.Router();
const {
  authenticateMentor,
} = require('../../middleware/authentication');
const verifyRoles = require('../../middleware/verifyRoles');

/*------assessment route------ */
router.route("/addAssessment").post(authenticateMentor, verifyRoles("Mentor"),addAssessment)

/*------submission route------ */
router.route("/assessment/:id/getAllSubmissions").get(authenticateMentor, verifyRoles("Mentor"),getAllSubmissions)


/*------Grade route------ */
router.route("submissions/:id/addGrade").post(authenticateMentor, verifyRoles("Mentor"),addGrade)

module.exports = router;
