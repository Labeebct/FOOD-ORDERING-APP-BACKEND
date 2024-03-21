const mongoose = require('mongoose')

const foodSchema = new mongoose.Schema({
    foodname: {
        type:String,
        required:true
    },
    foodprice: {
        type:Number,
        required:true
    },
    foodcharge: {
        type:Number,
        required:true
    },
    fooddelivery: {
        type:Number,
        required:true
    },
    foodImg:{
        type:String,
    },
    blocked:{
        type:Boolean,
        default:false
    }
},{timestamps:true})

const foodModel = new mongoose.model('foods',foodSchema) 

module.exports = foodModel