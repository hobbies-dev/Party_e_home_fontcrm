const mongoose = require('mongoose')

var newsSchema = new mongoose.Schema({
    img:{
        type:String
    },
    title:{
        type:String
    },
    type:{     //根据type查找不同Type类型的新闻   1，轮播图新闻 2，信工新闻眼 3，政治学习 4，党建一点通  5，党员亮身份  6，随时随地学 7，随时随地拍  8，制度建设  9，特色活动 10，通知早知道
      type:String
    },
    content:{
        type:String
    },
    browse:{
        type:Number,
        default:0
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

module.exports = mongoose.model('news',newsSchema,'news')
