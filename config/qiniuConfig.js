var qiniu = require('qiniu') //引入七牛

module.exports = function () {   //用function包裹起来以保证在其他地方调用这个方法时，uploadToken都是新的
    var accessKey = 'hiaSMM1QqBT-0Q0KywiDrpp_tXbgBz8p1mFXkoil';  //定义许可秘钥
    var secretKey = 'A4to1dxJHlKuQ_HuoKWhdf34-J3B_dYzt4eIT5tl';  //定义秘钥
    var mac = new qiniu.auth.digest.Mac(accessKey, secretKey);  //签名


    var options = {
        scope: 'didi',
        expires: 10800 , //设置失效时间3小时
        deadline:Math.round( new Date().getTime()/1000)+10800, //设置截止时间
        returnBody:' {"key": $(key), "hash": $(etag), "url" :"http://image.yaojunrong.com/$(key)"}' ,//上传成功后，自定义返回的数据
        detectMime:0 //开启 MimeType 侦测功能。设为非 0 值，则忽略上传的文件 MimeType (扩展名)信息
    };
    var putPolicy = new qiniu.rs.PutPolicy(options);
    var uploadToken=putPolicy.uploadToken(mac);  //uploadToken就是上传凭证
    return uploadToken
}
