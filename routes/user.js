const express = require('express');
const router = express.Router();
const userCtrl = require('../controllers/user')
const passwordValidator = require ('../middleware/password')
const emailValidator = require ('../middleware/email')

router.post('/signup', passwordValidator,emailValidator, userCtrl.signup)
router.post('/login', userCtrl.login)

module.exports = router;