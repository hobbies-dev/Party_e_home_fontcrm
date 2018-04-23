const {Router} = require('express');
const router = Router();
const scores = require('../database/model/scores')

//前台
//个人积分获取接口
router.get('/get', (req, res, next) => {
    "use strict";
    let userId = req.user.userId

    scores.find({userId}).then( data => {
        //积分
        if(req.user){
            scores.create({userId:req.user.userId, type:3, scoreName:'查看个人积分',score:1})
        }
        var total = 0;
        for(var index in data){
             total += parseInt( data[index].score)
        }
        //total为积分的总和
        res.json({
            data,
            total,
            code:200,
            msg:'查询成功',
            ret:true
        })
    }).catch(err => {
        new Error(err);
        next(err)
    })
});

module.exports = router
