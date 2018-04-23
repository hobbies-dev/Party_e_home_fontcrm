const {Router} = require('express')
const router = Router();
const users = require('../database/model/users');
const validator = require('validator');
const md5 = require('blueimp-md5');
const jwt = require('jsonwebtoken');
const tokenConfig = require('../config/tokenConfig');
const scores = require('../database/model/scores')

//前台
// 用户获取个人信息接口
router.get('/get',(req, res, next) => {
    "use strict";
    let userToken = req.query.token || req.headers.token
    // let {id } = req.body   // 在前端，让id = req.localStorage.user

    //判断是否登录
    jwt.verify(userToken, tokenConfig.secret, (err, decode) => {
        if(err){
            res.json({
                data: "登录状态失效，请重新登录",
                code: 401,
                msg: "登录状态失效，请重新登录",
                ret:false
            })
        }else {
            users.findOne({_id:decode.userId}, {pwd:0, isCanLogin:0, level:0}).then( data => {
                res.json({
                    data,
                    code:200,
                    msg:'查询成功',
                    ret:true
                })
            }).catch(err =>{
                new Error(err)
                next(err)
            })
        }
    })
})
//用户编辑个人信息
router.post('/update',(req, res, next) => {
    "use strict";
    //身份证号验证
    let regId = /(^\d{15}$)|(^\d{18}$)|(^\d{17}(\d|X|x)$)/
    //密码验证
    var regPwd =/^(?![0-9]+$)(?![a-zA-Z]+$)[0-9A-Za-z]{3,16}$/

    let userToken = req.query.token || req.headers.token
    let {id, idCard, pwd, avatar, userName, homeAddr, workAddr, nation, weChat, qq, sex, edu, position, salary, joinTime, payTime,status, level} = req.body

    jwt.verify(userToken, tokenConfig.secret, (err, decode) => {
        if(err){
            res.json({
                data: "登录状态失效，请重新登录",
                code: 401,
                msg: "登录状态失效，请重新登录"
            })
            return
        }

        if(!idCard || validator.isEmpty(idCard.trim()) || !regId.test(idCard) ){
            res.json({
                data:'身份证号不合法',
                code:400,
                msg:'身份证号不合法',
                ret:false
            })
            return
        }else if(!pwd || validator.isEmpty(pwd.trim() ) || !regPwd.test(pwd) ){
            res.json({
                data:'密码不合法',
                code:400,
                msg:'密码不合法',
                ret:false
            })
            return
        }else if(!id){
            res.json({
                data:'未找到指定的id',
                code:400,
                msg:'未找到指定的id',
                ret:false
            })
            return
        }else{
            users.update({_id:id},{$set:{
                id,
                idCard,
                pwd:md5(pwd),
                avatar,
                userName,
                homeAddr,
                workAddr,
                nation,
                weChat,
                qq,
                sex,
                edu,
                position,
                salary,
                joinTime,
                payTime,
                status,
                level} }).then( data => {
                //积分
                if(req.user){
                    scores.create({userId:req.user.data.userId, type:2, scoreName:'完善个人信息', score:2})
                }

                res.json({
                    data:'success',
                    code:200,
                    msg:'个人信息修改成功',
                    ret:true
                })
            }).catch( err => {
                var error = new Error('id无效');
                next(error)    //出错时，就只会报error ->id无效这个错误，相比，new Error（err）,next(err)他就会报err里的各种错误
            });
        }
    })
});
//用户获取分支用户列表
router.get('/getBranchUser', (req, res, next) => {
    "use strict";
    let userToken = req.headers.token || req.body.token || req.query.token || req.cookies.token;
    let {branchId, page =1, pageSize= 10} = req.query;

    jwt.verify(userToken, tokenConfig.secret, (err, decode) => {
        if(!branchId){
            res.json({
                data:'没找到指定的分支id',
                code:400,
                msg:'没找到指定的分支id',
                ret:false
            })
            return
        }else {
            users.find({branchId}).sort({_id: -1}).skip((page-1)*pageSize).limit(pageSize).then( data => {
                res.json({
                    data,
                    code:200,
                    msg:'查找成功',
                    ret:true
                })
            }).catch( err => {
                next(new Error(err))
            })
        }
    })
});
module.exports = router;