const {Router} = require('express')
const router = Router();
const users = require('../database/model/users');
const validator = require('validator');
const md5 = require('blueimp-md5');
const jwt = require('jsonwebtoken');
const scores = require('../database/model/scores');
const tokenConfig = require('../config/tokenConfig');

//前台
//用户登录接口  存储localStorage
router.post('/',(req, res, next) => {
    "use strict";
    //身份证号验证
    let regId = /(^\d{15}$)|(^\d{18}$)|(^\d{17}(\d|X|x)$)/
    //密码验证
    var regPwd =/^(?![0-9]+$)(?![a-zA-Z]+$)[0-9A-Za-z]{3,16}$/

    let {idCard, pwd} = req.body
    // console.log(req.body)

    if(!idCard || validator.isEmpty(idCard.trim()) || !regId.test(idCard)  ){
        res.json({
            data:'身份证号不合法',
            code:400,
            msg:'用户名不合法',
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
    }else{
        users.findOne({idCard}).then( data => {
            if(data == null){
                res.json({
                    data:'用户名不存在',
                    code:400,
                    msg:'用户名不存在',
                    ret:false
                })
                return
            }else if(data.pwd != md5(pwd) ){
                res.json({
                    data:'密码不正确',
                    code:400,
                    msg:'密码不正确',
                    ret:false
                })
                return
            }else if(data.isCanLogin == false){
                res.json({
                    data: "用户名已被禁用",
                    code: 401,
                    msg: "用户名已被禁用",
                    ret:false
                })
                return
            }else if(data.pwd == md5(pwd) ){
                // req.localStorage.user = data   localStorage是前端浏览器才有的，在后台不能使用
                let userInfo = {
                    userId: data._id,
                    userName: data.userName,
                    idCard: data.idCard,
                    level: data.level,
                    avatar:data.avatar,
                    branchName:data.branchName,
                }
                // var token = jwt.sign({
                //     data:{    //这里的是保存在req.user里的
                //         data,
                //         userId:data._id
                //     }
                // },'zxx',{ expiresIn:'2h' });
                let token = jwt.sign(userInfo, tokenConfig.secret, {expiresIn: tokenConfig.exp});
                res.cookie('token', token, { maxAge: 900000, httpOnly: true }); //把token传到cookies里
                // console.log(req.user)   //没有经过jwt中间件的req.user是undefined ，后台不能使用，有经过jwt中间件的req.user就是用户的信息，后台可以使用

                //积分
                scores.create({type:1, userId:data._id, scoreName:'登录',score:5}).then( data => {
                    // console.log(data)
                })

                res.json({
                    data:{     //这里的是直接返回给前端浏览器的
                        message:"登录成功",
                        token:token,
                    },
                    code:200,
                    msg:'登录成功',
                    ret:true
                });
                return    //如果这里没有加上return,在发送一个请求后，就会报一个Error: Can't set headers after they are sent
                        //解决的办法就是在res.end或者res.send，res.json等结束请求的操作时要调用return
            }
        }).catch( err => {
            // console.log(err);
            new Error(err);
            next(err)
        })
    }
})


module.exports = router;