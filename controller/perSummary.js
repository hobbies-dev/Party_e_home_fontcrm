const {Router} = require('express');
const router = Router();
const perSummary = require('../database/model/personalSummary')
const scores = require('../database/model/scores')

//
// //获取个人总结列表
// router.get('/get',(req, res, next) => {
//     "use strict";
//     // let {id, page =1, pageSize =10} = req.body
//     let {reviewId, branchId, page =1, pageSize =5, id} = req.query;
//     let params = branchId ? {reviewId, branchId} : {reviewId};
//     // console.log(params)
//
//     if(id){  //个人总结
//         perSummary.findOne({_id :id}).then( data => {
//             res.json({
//                 data,
//                 code:200,
//                 msg:'查找总结成功',
//                 ret:true
//             })
//         })
//     }else {
//         perSummary.find(params).sort({_id:-1}).skip((page-1)*pageSize).limit(pageSize).then( data => {
//             res.json({
//                 data,
//                 code:200,
//                 msg:'查找成功',
//                 ret:true
//             })
//         }).catch(err => {
//             new Error(err);
//             next(err)
//         })
//     }
// });
//用户获取他人的个人总结
router.get('/getOther',(req, res, next) => {
    "use strict";
    // let {id, page =1, pageSize =10} = req.body
    let {reviewId, otherUserId} = req.query;
    // let params = branchId ? {reviewId, branchId} : {reviewId}

    if(!reviewId){
        res.json({
            data:"未找到民主评议",
            code:400,
            msg:'未找到民主评议',
            ret:false
        })
    }else if(!otherUserId){
        res.json({
            data:'未找到他人的个人总结',
            code:400,
            msg:'未找到他人的个人总结',
            ret:false
        })
    }else {
        perSummary.findOne({reviewId, userId:otherUserId, status: 1}).then( data => {
            if(data == null){
                res.json({
                    data:null,
                    code:200,
                    msg:'该用户没有完善个人总结',
                    ret:true
                })
                return
            }else {
                res.json({
                    data,
                    code:200,
                    msg:'获取他人总结成功'
                })
            }
        })
    }
});
//添加个人总结
router.post('/add',(req, res, next) => {
    "use strict";
    let {pic, reviewId, branchId} = req.body;
    let userId = req.user.userId   //用户登录，userId = data._id 获取该用户的id   楼主的id

    perSummary.findOne({reviewId, userId}).then( dt => {   //当前民主评议id和登录的该用户id  查重
        if(dt == null ){
            perSummary.create({pic, reviewId, branchId, userId, common: []}).then( data => {
                //积分
                if(req.user){
                    scores.create({userId:req.user.userId, type:9, scoreName:'提交个人总结',score:2})
                }

                res.json({
                    data:'success',
                    code:200,
                    msg:'发表总结成功',
                    ret:true
                })
                return
            }).catch( err => {
                new Error(err);
                next(err)
            })
        }else {
            res.json({
                data:'个人总结不能重复提交',
                code:400,
                msg:'个人总结不能重复提交',
                ret:false
            })
        }
    }).catch( err => {
        next (new Error(err))
    })
});
//用户给他人总结评分
router.post('/giveMark', (req, res, next) => {
    "use strict";
    let {id, content} = req.body;   //id 为他人的 个人总结的_id
    let userId = req.user.userId;   //评论人的id
    let userName = req.user.userName;   //评论人的名字
    let branchName = req.user.branchName;   //评论人的名字

    perSummary.findOne({_id: id, common:{$elemMatch:{userId} } }).then( dt => {   //只能评论一次
        if(dt == null){
            perSummary.update({_id: id}, {$push: {common: {userId, userName, branchName, content} }} ).then( data => {
                res.json({
                    data:'评论成功',
                    code:200,
                    msg:'评论成功',
                    ret:true
                })
            }).catch( err => {
                next(new Error(err))
            })
        }else {
            res.json({
                data:'您已经评论过了',
                code:400,
                msg:'您已经评论过了',
                ret:false
            })
        }
    })
})
module.exports = router;
