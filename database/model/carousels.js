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
},{versionKey:false})

module.exports = mongoose.model('carousels',carouselsSchema,'carousels')