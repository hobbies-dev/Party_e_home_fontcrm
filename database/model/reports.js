const mongoose = require('mongoose');

//心得总结和思想汇报以及个人总结
const reportSchema = mongoose.Schema({
    img:{
        type:String,
        require:true
    },
    userName:{
        type:String
    },
    examine:{
        type:Number,  //0 正在审核 1审核通过 2审核不通过
        default:0
    },
    reason:{
        type:String
    },
    type:{   //用来区别是心得总结还是思想汇报
        type:String  // 1 心得总结  2 思想汇报
    }
},{versionKey:false,timestamp:{createAt:'createTime',updateAt:'updateTime'} });

module.exports = mongoose.model('reports', reportSchema, 'reports')
