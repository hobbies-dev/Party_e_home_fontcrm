const {Router} = require('express');
const router = Router();
const users = require('../database/model/users');
const validator = require('validator');
const md5 = require('blueimp-md5');
const scores = require('../database/model/scores');


//前台
//修改密码接口
router.post('/', (req, res, next) => {
    "use strict";
    //密码验证
    var regPwd =/^(?![0-9]+$)(?![a-zA-Z]+$)[0-9A-Za-z]{3,16}$/

    // console.log(req.user)    有经过jwt中间件的可以在后台使用req.user,此时的req.user是在登录时存储的用户的信息

    let userId = req.user.userId
    let{pwd, newPwd} = req.body

    if(!pwd || validator.isEmpty(pwd.trim()) || !regPwd.test(pwd) ){
        res.json({
            data:'请输入原密码',
            code:400,
            msg:'请输入原密码',
            ret:false
        })
        return
    }else if(!newPwd || validator.isEmpty(newPwd.trim()) || !regPwd.test(newPwd)) {
        res.json({
            data:'请输入新密码',
            code:400,
            msg:'请输入新密码',
            ret:false
        })
        return
    }else{
        users.findOne({_id:userId}).then( data => {
            if(data.pwd !== md5(pwd)){
                res.json({
                    data:'旧密码不正确',
                    code:400,
                    msg:'旧密码不正确',
                    ret:false
                })
                return
            }else if(pwd == newPwd){
                res.json({
                    data:'新密码不能与旧密码相同',
                    code:400,
                    msg:'新密码不能与旧密码相同',
                    ret:false
                })
                return
            }else {
                users.update({_id:userId},{$set:{pwd:md5(newPwd)} }).then( backData => {
                    //积分
                    // console.log(req.user)
                    if(req.user){
                        scores.create({userId:req.user.userId, type:11, scoreName:'修改密码',score:10})
                    }

                    res.json({
                        data:'密码修改成功',
                        code:200,
                        msg:'密码修改成功',
                        ret:true
                    })
                }).catch( err => {
                    new Error(err);
                    next(err)
                })
            }
        }).catch( err => {
            new Error(err)
            next(err)
        })
    }
})

module.exports = router
