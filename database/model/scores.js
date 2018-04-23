const mongoose = require('mongoose');

const scoresSchema = mongoose.Schema({
    userId:{
        type:String
    },
    type:{     //1，登录 2，完成个人信息  3，查看个人积分  4，缴费  5，查看通知  6，查看新闻  7，思想汇报  8,心得总结  9个人总结  10，互动  11，修改密码
        type:String
    },
    scoreName:{
        type:String
    },
    score:{
        type:String
    }
},{versionKey:false,timestamp:{createAt:'createTime',updateAt:'updateTime'} });

module.exports = mongoose.model('scores', scoresSchema, 'scores');
