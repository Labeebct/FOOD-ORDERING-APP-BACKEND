const mongoose = require('mongoose');
const { Schema } = mongoose

const addressObj = {
    firstname:{
        type:String,
        required:true
    },
    lastname:{
        type:String,
        required:true
    },
    email:{
        type:String,
        required:true
    },
    mobilenum:{
        type:Number,
        required:true
    },
    state:{
        type:String,
        required:true
    },
    district:{
        type:String,
        required:true
    },
    pin:{
        type:Number,
        required:true
    },
    city:{
        type:String,
        required:true
    },
    landmark:{
        type:String,
        required:true
    },
    houseno:{
        type:Number,
        required:true
    }
}

const orderShema = new Schema({
    userId:{
        type: Schema.Types.ObjectId,
        required:true,
        ref:'signup'
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
        required:true,
        ref:'foods'
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
    address:addressObj,
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
