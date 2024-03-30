const mongoose = require('mongoose');
const { Schema } = mongoose

const orderShema = new Schema({
    userId:{
        type: Schema.Types.ObjectId,
        required:true
    },
    userName:{
        type:String,
        required:true
    },
    quantity:{
        type:Number,
        required:true
    },
    foodId:{
        type: Schema.Types.ObjectId,
        required:true
    },
    price:{
        type:Number,
        required:true
    },
    charge:{
        type:Number,
        required:true
    },
    deliveryTime:{
        type:Number,
        required:true
    },
    address:{
        type:Object,
        required:true
    },
    status:{
        type:String,
        default:'confirmed'
    },
    orderDate:{
        type:Date,
        default:Date.now
    }
})

module.exports = new mongoose.model('orders',orderShema)
