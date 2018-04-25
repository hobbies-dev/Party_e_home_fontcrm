const {Router} = require('express');  //var express = require('express');
const router = Router() ;  //var router = express.Router();
const jwt = require('express-jwt');//导入jwt
const getData = require('./getData');//导入爬虫
const tokenConfig = require("../config/tokenConfig");
const getToken = require("./function/verifyToken");
const jwtVerify = require('../config/jwtVerify');

const isRevoked = require('./function/isRevoked')

router.use('/news',require('./news'));
// router.use('/news/get',jwt({ secret: 'zxx'}),require('./news'));
router.use('/upload',require('./upload/qiniu'));   //七牛token
router.use('/carousels', require('./carousels'));
router.use('/login', require('./login'));
router.use('/revise', jwtVerify,require('./revisePwd'));
router.use('/scores', jwtVerify, require('./scores'));
// router.use('/userInfo',jwt({ secret: 'zxx'}));   //这样就是jwt的中间件
router.use('/userInfo',require('./userInfo'));   //或者写成这样
router.use('/review', jwtVerify, require('./review'));
router.use('/branches', jwtVerify, require('./branches'));
router.use('/reports', jwtVerify, require('./reports'));
router.use('/scores', jwtVerify, require('./scores'));

router.use('/perSummary',
    jwt({
        secret: tokenConfig.secret,
        getToken
    }),
    require('./perSummary')
)

router.use('/interaction', jwtVerify, require('./interaction'));

router.get('/getData', (req, res, next) => {
    "use strict";
    getData().then(data => {
        res.json({
            data,
            code:200,
            msg:'success',
            ret:true
        })
    })
});
router.use('/logout', jwtVerify,
    // jwt({
    //     secret: tokenConfig.secret,
    //     isRevoked
    // }),
    require('./logout'));

module.exports = router;