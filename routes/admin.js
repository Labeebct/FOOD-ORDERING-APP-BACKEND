const express = require('express')
const router = express.Router()
const adminAuth = require('../controller/adminAuth')
const adminController = require('../controller/admin')

//ADMIN AUTHENTICATION
router.post('/signup',adminAuth.postSignup)
router.post('/login',adminAuth.postLogin)

router.get('/users',adminController.postAdmin)

module.exports = router