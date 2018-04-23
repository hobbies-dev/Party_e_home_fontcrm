const {Router} = require('express');
const router = Router();
const reports = require('../database/model/reports');
const scores = require('../database/model/scores');

//后台
//思想汇报 提交接口
router.post('/add', (req, res, next) => {
    "use strict";
    let {img, type} = req.body;
    let userName = req.user.userName

        reports.create({userName, img, type, examine: 0}).then( data => {
        //积分
        if(req.user){
            if(type == 1){
                scores.create({userId:req.user.userId, type:8, scoreName:'提交个人心得总结',score:5})
            }else if(type == 2){
                scores.create({userId:req.user.userId, type:7, scoreName:'提交个人思想汇报',score:5})
            }
        }

        res.json({
            data:'success',
            code:200,
            msg:'提交成功',
            ret:true
        })
    }).catch(err => {
        new Error(err);
        next(err)
    })
});

module.exports = router;
