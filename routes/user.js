const express = require('express');
const router = express.Router();

const userController = require('../controller/user')
const userAuth = require('../controller/userAuth')

router.post('/signup',userAuth.postSignup)
router.post('/otp-verification/:email',userAuth.postOtpverification)


module.exports = router;
