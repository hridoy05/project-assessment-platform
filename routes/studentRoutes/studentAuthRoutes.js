const express = require('express');
const router = express.Router();

const { authenticatestudent } = require("../../middleware/authentication");

const {
  register,
  login,
  logout,
  handleRefreshToken
} = require('../../controllers/Student/StudebtAuthController');

router.post('/register', register);
router.post('/login', login);
router.get('/refresh',handleRefreshToken);
router.delete('/logout', authenticatestudent, logout);



module.exports = router;
