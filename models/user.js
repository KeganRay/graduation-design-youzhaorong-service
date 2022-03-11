// 引入mongodb
let mongoose = require('mongoose')
// 建立用户表
const userSchema = new mongoose.Schema({
  account: String,//账号
  password: String,//密码

  userId: String,//用户id
  name: String,//姓名
  age: Number,//年龄
  sex: Number,//性别值 男1 女0
  IDcardNumber: String,//身份证号码
  sexDetail: String,//性别详情
  phone: String,//联系电话
  email: String,//电子邮箱
  ContactAddress: String,//联系地址
  userType: Number,//用户类型 超级0 房东1 房客2
  landlordMessage: Object,//房东的信息
  notices: [
    {
      noticeId:String,//通知ID
      avatar:String,//logo
      title: String,//标题
      description:String,//描述
      noticeType:String,//通知类型 message为租客给房东发的信息 feeInfo为缴费信息
      isRead:Boolean,//是否已读
      date:String//时间
    }
  ]
})

// 建立用户数据库模型
module.exports = mongoose.model("user", userSchema);



