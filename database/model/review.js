const mongoose = require('mongoose');

const reviewSchema = mongoose.Schema({
    title:{
        type:String,
        require:true
    },
    desc:{
        type:String,
        require:true
    },
    status:{
        type:Number,   //民主评议的状态 0 未进行， 1进行中， 2已结束
        default:0
    }
},{versionKey:false,timestamp:{createAt:'createTime',updateAt:'updateTime'}});

module.exports = mongoose.model('review', reviewSchema, 'review');
