const express = require('express')
const router = express.Router()
const adminAuth = require('../controller/adminAuth')
const adminController = require('../controller/admin')

//Multer configuration
const upload = require('../middleware/multer')

//ADMIN AUTHENTICATION
router.post('/signup',adminAuth.postSignup)
router.post('/login',adminAuth.postLogin)

//ADMIN USER MANAGEMENT
router.get('/users',adminController.postAdmin)
router.patch('/block-user',adminController.patchBlockUser)

//ADMIN FOOD MANAGEMENT
router.get('/all-foods',adminController.getAllfoods)
router.post('/add-food',upload.single('foodImg'),adminController.postAddFood)
router.patch('/block-food',adminController.patchBlockproducts)

module.exports = router  