const express = require('express');
const router = express.Router();

const userController = require('../controller/user')
const userAuth = require('../controller/userAuth')

//USER AUTHENTICATION
router.post('/signup',userAuth.postSignup)
router.post('/otp-verification/:email',userAuth.postOtpverification)
router.post('/login',userAuth.postLogin)
router.post('/forget-password',userAuth.postForgetpassword)
router.post('/forget-otp-verification/:email',userAuth.postForgetPasswordOtp)
router.post('/reset-password',userAuth.postResetPassword)

module.exports = router;
      