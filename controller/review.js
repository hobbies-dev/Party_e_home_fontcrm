const {Router} = require('express');
const router = Router();
const review = require('../database/model/review')

//后台
//获取当前开启的民主评议
router.get('/get',(req, res, next) => {
    "use strict";
    review.find({status: 1}).then( data => {
        if(data == null){
            res.json({
                data:null,
                code:200,
                msg:'当前没有开启的民主评议'
            })
            return
        }else {
            res.json({
                data,
                code:200,
                msg:'查找成功',
                ret:true
            })
        }
    }).catch(err => {
        new Error(err);
        next(err)
    })
});

// //添加
// router.post('/add',(req, res, next) => {
//     "use strict";
//     let {type} = req.body;
//
//     review.create({type, img:req.user.data.data.img, name:req.user.data.data.name, userId:req.user.data.userId}).then( data => {
//         res.json({
//             data:'success',
//             code:200,
//             msg:'参评成功',
//             ret:true
//         })
//     }).catch( err => {
//         new Error(err);
//         next(err)
//     })
// });

module.exports = router;
