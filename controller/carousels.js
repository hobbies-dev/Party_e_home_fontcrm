const {Router} = require('express');
const router = Router();
const carousels = require('../database/model/carousels')

//前台接口
//轮播图获取接口
router.get('/get', (req,res, next) => {
    "use strict";
    let {id ,page=1,pageSize =10} = req.query;
    page = parseInt(page);
    pageSize = parseInt(pageSize);

    if(!id){
        //不传id
        carousels.find().skip((page-1)*pageSize).limit(pageSize).sort({_id:-1}).then( data => {
            res.json({
                data,
                code:200,
                msg:'查询成功',
                ret:true
            })
        }).catch(err => {
            new Error(err);
            next(err)
        })
    }else{
        //传id
        carousels.findOne({_id:id}).then( data => {
            res.json({
                data,
                code:200,
                msg:'查询成功',
                ret:true
            })
        }).catch( err => {
            new Error(err);
            next(err)
        })
    }
});



module.exports = router