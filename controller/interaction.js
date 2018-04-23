const {Router} = require('express');
const router = Router();
const interaction = require('../database/model/interaction')
const users = require('../database/model/users')
const scores = require('../database/model/scores')


//前台
//用户获取帖子列表接口
router.get('/get', (req, res, next) => {
    "use strict";
    let { page=1, pageSize=10, id} = req.query
    page = parseInt(page)
    pageSize =parseInt(pageSize)

    if(!id){
        //未传id
        interaction.find({isParent: 0}).sort({_id:-1}).skip((page-1)*pageSize).limit(pageSize).then( data => {
            res.json({
                data,
                code:200,
                msg:'获取数据成功',
                ret:true
            })
        }).catch( err => {
            new Error(err);
            next(err)
        })
    }else {
        //传id
        interaction.findOne({_id: id}).then( data => {
            res.json({
                data,
                code:200,
                msg:'获取帖子列表成功',
                ret:true
            })
        }).catch( err => {
            next(new Error(err))
        })
    }
});

//用户发表帖子接口
router.post('/add', (req, res, next) => {
    "use strict";
    let {content} = req.body;
    let {userId, userName, avatar} = req.user   //获取登录用户的_id， 用户名， 头像

    interaction.create({userId, userName, userAvatar: avatar, content}).then( data => {
        //积分
        if(req.user){
            scores.create({userId:req.user.userId, type:10, scoreName:'参与互动',score:5})
        }

        res.json({
            data:'发帖成功',
            code:200,
            msg:'发帖成功',
            ret:true
        })
    }).catch( err => {
        next(new Error(err))
    })
});

//用户回复帖子
router.post('/reply', (req, res, next) => {
    "use strict";
    let {userId, userName, avatar} = req.user   //评论人
    let {toUserId, parentId, content} = req.body  //被评论人的_id

    //帖子_id: 2333  -> parentId: 2333  ->  parentId: 2333
    //找到帖子     1,回复帖子   找帖子   被评论人：楼主    2,用户回复用户 找回复  被评论人：层主      //例如：A发了一条帖子，_id为111，（这时，数据库里的userId即为A的_id）；  B 来评论A帖子，首先要先找帖子id即parentId是否存在，然后判断帖子里是否有A这个要被评论的人即userId里是否有A的_id :toUserId
    interaction.findOne({$or: [{_id:parentId, userId: toUserId}, {parentId, userId: toUserId}]}).then( dt => {
        //dt里存的该帖子下是被评论人的信息
        if(dt == null){
            res.json({
                data:'非法参数',
                code:400,
                msg:"非法参数",
                ret:false
            })
            return
        }else {
            interaction.create({
                isParent: 1,
                toUserId,
                toUserName:dt.userName,
                toUserAvatar:dt.userAvatar,
                content,
                parentId,
                userId,
                userName,
                userAvatar:avatar
            }).then( data => {
                //积分
                scores.create({userId:req.user.userId, type:10, scoreName:'参与互动',score:5})

                res.json({
                    data:"回复成功",
                    code:200,
                    msg:'回复成功',
                    ret:true
                })
            }).catch( err => {
                next(new Error(err))
            })
        }
    }).catch( err => {
        next(new Error(err))
    })
});

//获取回复
router.get('/getReply', (req, res, next) => {
    "use strict";
    let {parentId, pageSize =10, page =1 } = req.query;

    interaction.find({parentId}).skip((page-1)*pageSize).limit(pageSize).then( data => {
        res.json({
            data,
            code:200,
            msg:"获取回复成功",
            ret:true
        })
    }).catch( err => {
        next(new Error(err))
    })
});

//帖子删除接口
router.post('/del', (req, res, next) => {
    "use strict";
    let {id} = req.body

    if(!id){
        res.json({
            data:'该帖子不存在',
            code:400,
            msg:'该帖子不存在',
            ret:false
        })
        return
    }else{
        interaction.remove({_id:id}).then( data => {
            res.json({
                data:'success',
                code:200,
                msg:'删除成功',
                ret:true
            })
        }).catch( err => {
            new Error(err);
            next(err)
        })
    }
})
module.exports = router;
