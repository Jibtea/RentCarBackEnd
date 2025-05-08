const express = require('express');
const router = express.Router();

const { register, login, getMe, deleteuser, updateUser, logout } = require('../controller/auth');

const { protect } = require('../middleware/auth');

router.post('/register', register);
router.post('/login', login);
router.route('/me')
  .get(protect, getMe)
  .delete(protect, deleteuser)
  .put(protect, updateUser);
router.get('/logout', protect, logout);
module.exports = router;

