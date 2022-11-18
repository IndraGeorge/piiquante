const express = require('express');
const router = express.Router();
const userCtrl = require('../controllers/user')
const passwordValidator = require ('../middleware/password')
const emailValidator = require ('../middleware/email')
const max = require('../middleware/limiter')

router.post('/signup', passwordValidator,emailValidator, userCtrl.signup)
router.post('/login', max.apiLimiter, userCtrl.login)

module.exports = router;