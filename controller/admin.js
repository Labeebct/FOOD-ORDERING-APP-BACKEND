const signupModel = require('../models/signup')
const foodModel = require('../models/food')
const orderModel = require('../models/order')
const {blockUser,unblockUser} = require('../utils/userBlockUnblock')
const { Types } = require('mongoose')

exports.postAdmin = async(req,res) => {
    try {
  
        //Finding all users and assigning to a variable to pass frontent
        const signupDatas = await signupModel.find()
        const orders = await orderModel.find()
        
        //Passing the datas
        res.status(200).json({signupDatas,orders})
        
    } catch (error) {
        console.log('Error in get admin users',error);
    }
}  

exports.patchBlockUser = async(req,res) => {
    try {
        //Taking user id from query
        const userId = req.query.userId

        //Finding user to find the current status
        const user = await signupModel.findById(userId)

        if(!user) return res.status(404).json({msg:'User not Found'})

        const newStatus = user.status == 'active' ? 'blocked' : 'active'

        //Change status of user to Blocked
        const changeStatus = await signupModel.findOneAndUpdate({_id:userId},{$set:{status:newStatus}},{new:true})

        //Sending blocked email if user get blocked and unblocked mail if user unblocked
        if(newStatus == 'blocked') blockUser(user.userName,user.email)
        else unblockUser(user.userName,user.email)

        const setStatus = newStatus == 'active' ? 'BLOCKED' :  'UNBLOCKED'

        if(changeStatus.status == newStatus) return res.status(200).json({msg:'user block or unblock success',status:newStatus,setStatus})
        
    } catch (error) {
        console.log('Error in patch block user',error);
    }
}

exports.getAllfoods = async(req,res) => {
    try {

        //Finding unblocked foods to the variable
        const foods = await foodModel.find()

        //Passing the unblocked foods to the server
        res.status(200).json({foods})
    } catch (error) {
        console.log('Error in admin show all food section',error);
    }
}

exports.postAddFood = async(req,res) => {
    try {

        //Checking whether image exist or not
        if(!req.file){
            return res.status(422).json({msg:'Please provide Food Image'})
        }
        
        //Destructuring datas
        const { foodname, foodprice, foodcharge, fooddelivery , foodImg } = req.body;
       
        //Making sure that all fields are filled
        if ((!foodname || !foodprice || !foodcharge || !fooddelivery)) {
            return res.status(422).json({msg:'Please Fill all fields'})
        } else {         
            
        //Making full path by removing public which is served with the server
        const imagePath = req.file.destination.replace('./public','') + '/' + req.file.filename
        
        const newSchema = new foodModel({
            foodname,
            foodprice,
            foodcharge,
            fooddelivery,
            foodImg:imagePath
        })
        
        //Saving the schema and passing the success message
        await newSchema.save()
        res.status(200).json({msg:'Food added Success'})
        }
    } catch (error) {
        console.log('Error in admin show all food section',error); 
    }
}

exports.getEditFood = async(req,res) => {
    try {

        const foodId = req.params.foodId

        //Finding the food uding provided id
        const food = await foodModel.findById(foodId)
        
        if(food) return res.status(200).json({food})
        else return res.status(404).json({msg:'Food not found with provided id'})
        
    } catch (error) {
        console.log('Error in edit food post',error);
    }
}

exports.postEditFood = async(req,res) => {
    try {

        const foodId = req.params.foodId

        const findFood = await foodModel.findById(foodId)

        //Destructuring datas
        const { foodname, foodprice, foodcharge, fooddelivery} = req.body;
       
        //Making sure that all fields are filled
        if ((!foodname || !foodprice || !foodcharge || !fooddelivery)) {
            return res.status(422).json({msg:'Please Fill all fields'})
        } else {         
            
        //Making full path by removing public which is served with the server
        const imagePath = req.file ? req.file.destination.replace('./public','') + '/' + req.file.filename : findFood.foodImg
    
        //Making to obj to update
        const foodObj ={
            foodname,
            foodprice,
            foodcharge,
            fooddelivery,    
            foodImg:imagePath
        }

        await foodModel.findByIdAndUpdate(foodId,foodObj) 
        res.status(200).json({msg:'Food Edited Success'})
        }
    } catch (error) {
        console.log('Error in admin show all food section',error); 
    }   
}

exports.patchBlockproducts = async(req,res) => {
    try {

        //Taking foodid from query
        const foodId = req.query.foodId

        //Finding the food the find the current status
        const findFood = await foodModel.findById(foodId)

        //finding the current status and setting the new status
        const newStatus = findFood.blocked ? false : true
        const updateStatus = await foodModel.findOneAndUpdate({_id:foodId},{$set:{blocked:newStatus}},{new:true})

        //Passing succes msg if blocked success
        if(updateStatus.blocked == newStatus) return res.status(200).json({msg:'Food has been blocked',newStatus})
        else return res.status(404).json({msg:'food blocking failed failed'})
        
    } catch (error) {
        console.log('Error in patch block products',error);
        res.status(500).send('Internal server error')
    }
}

exports.getOrders = async(req,res) => {
    try {

        //Taking userid from req
        const {userId} = req

        //Finding orders of the users
        const orders = await orderModel.find().populate('foodId').populate('userId')
        
        //Sending 404 if no orders found
        if(!orders) return res.status(404).json({msg:'No orders Found'})

        res.status(200).json({orders})
        
    } catch (error) {
        console.log('Error in getcheckout',error);
        res.status(500).json({msg:'Internal server error'})
    }
}        

exports.patchChangestatus = async(req,res) => {
    try {

        //Taking userid from req
        const {orderId} = req.query
        const {status} = req.body

        //Finding orders by id
        const orders = await orderModel.findById(orderId)
        
        //Sending 404 if no orders found
        if(!orders) return res.status(404).json({msg:'No orders Found'})

        const changeStatus = await orderModel.findOneAndUpdate({_id:orderId},{$set:{status}},{new:true})

        //Sending status is status updated
        if(changeStatus.status == status) res.status(200).json({msg:'Order status updated'})
        else  res.status(500).json({msg:'internal server error'})
        
    } catch (error) {
        console.log('Error in getcheckout',error);
        res.status(500).json({msg:'Internal server error'})
    }
}        

exports.getDailySale = async (req, res) => {
    try {

          // Calculate the start and end dates for the week
        const currentDate = new Date();
        const firstDayOfWeek = new Date(currentDate.setDate(currentDate.getDate() - currentDate.getDay()));
        const lastDayOfWeek = new Date(firstDayOfWeek);
        lastDayOfWeek.setDate(lastDayOfWeek.getDate() + 6);

        const weeklyOrders = await orderModel.find({
            orderDate: {
                $gte: firstDayOfWeek,
                $lte: lastDayOfWeek
            }
        });

        // Calculate the number of orders
        const weeklyOrderCount = weeklyOrders.length;
        res.status(200).json({weeklyOrderCount})
        
    } catch (error) {
        console.log('Error in getDaily sale',error);
        res.status(500).json({msg:'Internal server error',error})
    }
       
}
