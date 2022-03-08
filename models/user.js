// 引入mongodb
let mongoose = require('mongoose')
// 建立用户表
const userSchema = new mongoose.Schema({
    account:String,//账号
    password:String,//密码

    userId: String,//用户id
    name:String,//姓名
    age:Number,//年龄
    sex:Number,//性别值 男1 女0
    IDcardNumber:String,//身份证号码
    sexDetail:String,//性别详情
    phone: String,//联系电话
    email: String,//电子邮箱
    ContactAddress: String,//联系地址
    userType:Number,//用户类型 超级0 房东1 房客2
    landlordMessage:Object,//房东的信息

})

// 建立用户数据库模型
module.exports = mongoose.model("user",userSchema);



