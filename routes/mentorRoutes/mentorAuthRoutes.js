const express = require('express');
const router = express.Router();

const { authenticateMentor } = require("../../middleware/authentication");

const {
  register,
  login,
  logout,
  handleRefreshToken
} = require('../../controllers/Mentor/MentorAuthController');

router.post('/register', register);
router.post('/login', login);
router.get('/refresh',handleRefreshToken);
router.delete('/logout', authenticateMentor, logout);



module.exports = router;
