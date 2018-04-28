const mongoose = require('mongoose');

var interSchema = mongoose.Schema({
    isParent: {
        type: Number,
        default: 0,    //0 是帖子， 1 是回复
        index: true
    },
    parentId: {     //_id :parentId表示帖子， parentId：parentId 表示回复
        type: String,
        defalut: ''
    },
    userId: {        //登录的用户_id  可以使发帖用户，也可以是评论人
        type: String
    },
    userName: {
        type: String
    },
    userAvatar: {
        type: String
    },
    toUserId: {      // 被评论的用户_id
        type: String
    },
    toUserName: {
        type: String
    },
    toUserAvatar: {
        type: String
    },
    content: {      //留言内容
        type: String
    }
}, {versionKey: false, timestamps: {createdAt: "createTime", updatedAt: "updateTime"}})

module.exports = mongoose.model('interaction',interSchema,'interaction');
