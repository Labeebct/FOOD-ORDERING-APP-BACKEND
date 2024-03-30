const foodModel = require('../models/food')
const orderModel = require('../models/order')

exports.getHome = async(req,res) => {
    try {

        //Finding 5 foods for showing in home
        const foods = await foodModel.find().limit(5)
        res.status(200).json({foods})
        
    } catch (error) {
        console.log('Error in get home',error);
    }
}   

exports.getFoods = async(req,res) => {
    try {

        let foods;

        //Checking whether price query exist
        const price = req.query.price

        //If price exist assiging finded product to food
        price !== 'null' ? foods = await foodModel.find({foodprice:price}) : foods = await foodModel.find()
        res.status(200).json({foods})
            
    } catch (error) {
        console.log('Error in get home',error);  
    }
}         
  
exports.getViewFood = async(req,res) => {   
    try {

        //Taking foodid to find the food
        const foodId = req.params.foodId

        if(!foodId) return res.status(404).json({msg:'Food not found'})

        //Finding the opened food using food id
        const food = await foodModel.findById(foodId)

        //Passing the finded food and pass to frontent along with ok status
        if(food) res.status(200).json({food})
        
    } catch (error) {
        console.log('Error in get view food',error);
    }
}

exports.getCheckout = async(req,res) => {    
    try {

        //Destructuring foodId and quantity from query
        const { foodId } = req.query

        //Finding food by id
        const food = await foodModel.findById(foodId)

        //Passing 404 if food not found
        if(!food) return res.status(404).json({msg:'Food not found'})

        //Passing succes message with finde food
        res.status(200).json({food})
        
    } catch (error) {
        console.log('Error in get checkout',error);
    }
}   

exports.postCheckout = async(req,res) => {    
    try {

        //Destructuring foodId and quantity from query
        const {foodId , quantity} = req.query
        const {_id , userName} = req.user
        const {address} = req.body
        const {firstname,lastname,email,mobilenum,state,district,pin,city,landmark,houseno} = req.body.address

        //Finding food by id
        const food = await foodModel.findById(foodId)

        if(!food) return res.status(404).json({msg:'Food not found'})

        //Validaating address whether all field contains
        if(!firstname) return res.status(422).json({msg:'Please Enter First Name'})
        else if (!lastname) return res.status(422).json({msg:'Please Enter Last Name'})
        else if (!email) return res.status(422).json({msg:'Please Enter Email Address'})
        else if (!mobilenum) return res.status(422).json({msg:'Please Enter Mobilenum Number'})
        else if (!state) return res.status(422).json({msg:'Please Enter State'})
        else if (!district) return res.status(422).json({msg:'Please Enter District'})
        else if (!pin) return res.status(422).json({msg:'Please Enter Pin Number'})
        else if (!city) return res.status(422).json({msg:'Please Enter City'})
        else if (!landmark) return res.status(422).json({msg:'Please Enter Landmark'})
        else if (!houseno) return res.status(422).json({msg:'Please Enter House Number'})
        else {
         
        //Creating a order obj model
        const foodOrder = {
            userId:_id,
            userName,
            quantity,
            foodId,
            price:food.foodprice * quantity,
            charge:food.foodcharge,
            deliveryTime:food.fooddelivery,
            address,
        }     
        await orderModel.create(foodOrder)  
        res.status(200).json({msg:'Order success'})

        }
    } catch (error) {
        console.log('Error in get checkout',error);
    }
}   

exports.getOrders = async(req,res) => {
    try {

        //Taking userid from req
        const {userId} = req

        //Finding orders of the users
        const orders = await orderModel.find({userId}).populate('foodId')
        
        //Sending 404 if no orders found
        if(!orders) return res.status(404).json({msg:'No orders Found'})

        res.status(200).json({orders})
        
    } catch (error) {
        console.log('Error in getcheckout',error);
        res.status(500).json({msg:'Internal server error'})
    }
}        