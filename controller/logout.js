const {Router} = require('express');
const router = Router();
const users = require('../database/model/users');
// const jwt = require('jsonwebtoken');
// const tokenConfig = require('../config/tokenConfig');

//退出登录
router.get('/', (req, res, next) => {
    "use strict";
    // console.log(req.user)

    if(req.user){
        res.json({
            data:'success',
            code:200,
            msg:'退出登录成功',
            ret:true
        })
        req.user = null
        // console.log(req.user)
    }else {
        res.json({
            data:'你还未登录',
            code:401,
            msg:'你还未登录',
            ret:true
        })
    }
})

module.exports = router