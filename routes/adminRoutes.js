const express = require('express');
const router = express.Router();
const adminController = require('../controllers/adminController');

router.post('/Adminsignup', adminController.signup);
router.post('/Adminlogin', adminController.login);

module.exports = router;
