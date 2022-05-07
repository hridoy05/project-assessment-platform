const express = require('express');
const router = express.Router();

const { authenticateAdmin } = require("../../middleware/authentication");

const {
  register,
  login,
  logout,
  handleRefreshToken
} = require('../../controllers/Admin/AdminAuthController');

router.post('/register', register);
router.post('/login', login);
router.get('/refresh',handleRefreshToken);
router.delete('/logout', authenticateAdmin, logout);



module.exports = router;
