const express = require('express')
const router = express.Router()
const adminAuth = require('../controller/adminAuth')
const adminController = require('../controller/admin')
const verifyToken = require('../middleware/verifyTokens')


//Multer configuration
const upload = require('../middleware/multer')

//ADMIN AUTHENTICATION
router.post('/signup',adminAuth.postSignup)
router.post('/login',adminAuth.postLogin)

//ADMIN USER MANAGEMENT
router.get('/users',adminController.postAdmin)
router.patch('/block-user',adminController.patchBlockUser)

//ADMIN FOOD MANAGEMENT
router.get('/all-foods',verifyToken,adminController.getAllfoods)
router.post('/add-food',verifyToken,upload.single('foodImg'),adminController.postAddFood)
router.get('/edit-food/:foodId',verifyToken,adminController.getEditFood)
router.post('/edit-food/:foodId',verifyToken,upload.single('foodImg'),adminController.postEditFood)
router.patch('/block-food',verifyToken,adminController.patchBlockproducts)
router.get('/orders',verifyToken,adminController.getOrders)
router.get('/daily-sales',verifyToken,adminController.getDailySale)
router.patch('/change-order-status',verifyToken,adminController.patchChangestatus)


module.exports = router  