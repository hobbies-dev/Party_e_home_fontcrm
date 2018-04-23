const {Router} = require('express')
const router = Router();
const news = require('../database/model/news');
//个人量化积分
const scores = require('../database/model/scores')

//前台接口
//新闻获取 接口
router.get('/get', (req, res, next) => {
    "use strict";
    let {page =1, pageSize=10, id, type} = req.query;
    page = parseInt(page);
    pageSize = parseInt(pageSize);

    if(!id){
        //未传id
        news.find({type}).skip((page-1)*pageSize).limit(pageSize).sort({_id:-1}).then( data => {
            res.json({
                data,
                code:200,
                msg:'查询成功',
                ret:true
            })
        }).catch( err => {
            new Error(err)  //使用Error构造方法创建自定义的Error对象
            next(err)
        })
    }else{
        //传id
        news.findOne({_id: id}).then(data => {
            //浏览量
            parseInt(data.browse)
            // console.log(data.browse)
            var num = data.browse + 1
            // console.log(num)
            news.update({_id :id}, {$set: {browse:num}}).then( data => {
                // console.log(data.browse)
            })
            //当登录时，在localStorage上会自动存储一个user
            if(req.user){
                scores.create({userId:req.user.userId, type:6, scoreName:'查看通知',score:2})
            }
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
})

module.exports = router;
