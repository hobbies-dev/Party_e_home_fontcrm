const mongoose = require('mongoose')

var carouselsSchema = mongoose.Schema({
    img:{
        type:String,
    },
    createTime:{
        type:Date,
        default:Date.now()
    },
    updateTime:{
        type:Date,
        default:Date.now()
    }
},{versionKey:false,timestamps:{createdAt:'createTime', updatedAt:'updateTime'}})

module.exports = mongoose.model('carousels',carouselsSchema,'carousels')