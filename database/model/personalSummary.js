const mongoose = require("mongoose");

const perSummary = new mongoose.Schema({
    pic: {
        type: String,
        require: true
    },
    status: {
        type: Number,     //0代表未审核刚添加 1代表审核通过 2代表审核不通过
        default: 0
    },
    userId: {       //发个人总结的人
        type: String,
        index: true
    },
    reviewId: {      //当前评议的id
        type: String,
        index: true
    },
    branchId: {      //当前分支的id
        type: String,
        index: true
    },
    common: [{
        userId: {   //评论的人
            type: String
        },
        userName: {   //评论的人
            type: String
        },
        branchId:{
            type: String
        },
        content: {  //评论内容 0优1良2中3差
            type: Number,
            default: 0
        }
    }]
}, {versionKey: false, timestamps: {createdAt: "createTime", updateAt: "updateTime"}})

module.exports = mongoose.model("personalSummary", perSummary, 'personalSummary')
