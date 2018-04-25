var express = require('express');
var router =express.Router();
var qiniuConfig = require('../../config/qiniuConfig')

router.get('/', (req, res) => {
    "use strict";
    // console.log(res)
    var token = qiniuConfig()
    // 或者在json里面 data:qiniuConfig()  或者这样简便写法
    res.json({
        data:token,
        code:200,
        msg:'success',
        ret:true
    })
})

module.exports = router