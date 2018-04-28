const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const usersSchema = new mongoose.Schema({
    idCard:{
        type:String,   //声明数据类型
        require:true,   //设定是否必填
        unique:true,   //索引值唯一
        index:true,   //设定索引值    增加索引，优化查询速度
    },
    pwd:{
        type:String,
        default:'123456'
    },
    avatar:{             //默认分配一个头像
        type:String,
        default:"http://pbl.yaojunrong.com/icon_default.png"   //设定默认值
    },
    userName:{
        type:String,
        require:true
    },
    phone:{
        type:String,
        default:''
    },
    homeAddr:{
        type:String,
        default:''
    },
    workAddr:{
        type:String,
        default:''
    },
    nation:{
        type:String,
        default:''
    },
    weChat:{
        type:String,
        default:''
    },
    qq:{
        type:String,
        default:''
    },
    sex:{            //男性为1 ， 女性为0 ， 默认是男性
        type:Number,
        default:1
    },
    edu:{
        type:String,
        default:''
    },
    position:{
        type:String,
        default:''
    },
    salary:{
        type:String,
        default:''
    },
    joinTime:{
        type:Date,
        default:null
    },
    payTime:{
        type:Date,
        default:null
    },
    status:{
        type:Number,   //当前身份 1 为党员 ，2 为预备党员  ，3位积极分子
        default:1
    },
    level:{           //等级，level 0 管理员 。 level 1 用户
        type:Schema.Types.Mixed,
        default(){
            "use strict";
            return{
                type:1,
                levelName:'普通用户'
            }
        }
    },
    isCanLogin:{           //是否被管理员禁用  ，true没被禁用
        type:Boolean,
        default:true
    },
    branchId:{     //分支id
        type:String,
        default:"5ad59ea06b5b131489f0044d"
    },
    branchName:{   //分支名
        type:String,
        default:'信息工程学院学生流动党支部（北京）'
    }
},{versionKey:false,timestamps:{createdAt:'createTime',updatedAt:'updateTime'}}); //MongoDB自动生成和管理createTime和updateTime字段
//在每次更新文档时自动更新updateTime字段的值
module.exports = mongoose.model('users',usersSchema,'users')