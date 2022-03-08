// 引入mongodb
let mongoose = require('mongoose')
// 建立用户表
const houseSchema = new mongoose.Schema({
  houseName: String,//房子名字
  houseAddress: String,//房子地址省市区
  houseAddressDetail: String,//房子详细地址
  housePrice: Number,//房子价格
  houseArea: Number,//房子可用面积
  houseId: String,//房子id
  contractTime: Array,//房子签约时间
  landlordName: String,//房东名字
  landlordPhone: String,//房东联系电话
  landlordId: String,//房东的Id
  housePic: Array,//房子的照片
  tenantMessage: Object,//租客信息
  waterUnitPrice: Number,//每吨水费
  electricityUnitPrice: Number,//每吨电费
  // 本年度水费
  waterPrice: [
    {
      year: Number,//年份
      month: Number,//月份
      waterNum:Number,//用水量
      waterPrice: Number//水费
    }
  ],
  // 本年度电费
  elePrice: [
    {
      year: Number,//年份
      month: Number,//月份
      eleNum:Number,//用电量
      elePrice: Number//电费
    }
  ]
})

// 建立用户数据库模型
module.exports = mongoose.model("house", houseSchema);



