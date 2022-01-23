// 引入mongodb
let mongoose = require('mongoose')
// 建立用户表
const userSchema = new mongoose.Schema({
    // account: {
    //     type: String,
    //     // unique: true
    // },
    // password: {
    //     type: String,
    //     // unique: true
    // }
    account:String,
    password:String
})

// 建立用户数据库模型
module.exports = mongoose.model("user",userSchema);



