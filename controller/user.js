const foodModel = require('../models/food')

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

        //Foods finding and assigning to a variable
        const foods = await foodModel.find()
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