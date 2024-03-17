const express = require('express')
const router = express.Router()
const adminAuth = require('../controller/adminAuth')

router.post('/signup',adminAuth.postSignup)
router.post('/login',adminAuth.postLogin)


module.exports = router