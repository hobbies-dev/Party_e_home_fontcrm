const {Router} = require('express');
const router = Router();
const branches = require('../database/model/branches');

//用户获取分支
router.get('/get', (req, res, next) => {
    "use strict";
    branches.find().sort({_id: -1}).then( data => {
        res.json({
            data,
            code:200,
            msg:'查找成功',
            ret:true
        })
    })
})

module.exports = router
