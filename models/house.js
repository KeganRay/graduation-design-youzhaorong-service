// 引入mongodb
let mongoose = require('mongoose')
// 建立用户表
const houseSchema = new mongoose.Schema({
    houseName:String,//房子名字
    houseAddress:String,//房子地址
    housePrice:Number,//房子价格
    landlord:String,//房东
    landlordPhone:String,//房东联系电话
    // 本年度水电
    WEcharges:[
        {
            month:Number,//月份
            fee:Number//费用
        }
    ]
})

// 建立用户数据库模型
module.exports = mongoose.model("house",userSchema);



