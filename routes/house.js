let express = require('express');
let router = express.Router();
let userModel = require('../models/user')
let houseModel = require('../models/house')
let {nanoid} = require('nanoid')

//增加房源
router.post('/create-house', async (req, res, next) => {
  console.log(req.body);
  const param = {...req.body, houseId: nanoid()}//房子的参数
  const {houseName, houseAddress} = param
  const {tenantPhone, tenantName, tenantIDcardNumber} = param.tenantMessage//租客信息
  const {landlordName, landlordPhone, landlordId} = param//房东信息
  console.log(tenantPhone, tenantName, tenantIDcardNumber);
  if (houseName && houseAddress && tenantPhone && tenantName) {
    //在用户的数据表找到电话以及名字匹配的以及用户id匹配的然后给租客添加房东的id，电话号码，以及名字
    userModel.updateOne({name: tenantName, phone: tenantPhone, IDcardNumber: tenantIDcardNumber},
        {
          landlordMessage: {
            landlordName: param.landlordName,
            landlordPhone: param.landlordPhone,
            landlordId: param.landlordId
          }
        },
        (error, updateResult) => {
          console.log(updateResult);
          //有更改才创建房子
          if (updateResult.nModified === 1) {
            //创建房子
            houseModel.create(param, (err) => {
              if (err) {
                res.json({
                  code: -1,
                  message: "创建房源失败,请联系超级管理员！"
                })
              } else {
                res.json({
                  code: 0,
                  message: "房源添加成功！"
                })
              }
            })
          } else {
            res.json({
              code: -1,
              message: "请检查租客的姓名以及租客的电话填写是否正确！"
            })
          }
        })
  } else {
    res.json({
      code: -1,
      message: "添加房源失败，请检查房源的地址以及租客的信息"
    })
  }
});

//删除房源
router.post('/del-house', async (req, res, next) => {
  const {houseId} = req.body//房源名字
  console.log(houseId);
  houseModel.remove({houseId}, (err, result) => {
    if (err) {
      return console.log(err)
    } else {
      res.json({
        code: 0,
        message: "删除房源成功！"
      })
    }
  })
})

//修改房源信息
router.post('/update-house', async (req, res, next) => {
  console.log(req.body);
  const {houseName, housePrice} = req.body
  console.log(houseName, housePrice);
  houseModel.updateOne({houseName}, {housePrice}, (err, doc) => {
    if (err) {
      res.json({
        code: -1,
        msg: err.message
      });
    } else {
      res.json({
        code: 0,
        msg: '更新成功'
      });
    }
  })
})

//查询房东旗下的房源列表
router.get('/queryUserHouseList', async (req, res, next) => {
  const {userId} = req.query//根据房东的id查数据库的房源表
  houseModel.find({landlordId: userId}, function (err, doc) {
    if (doc) {
      res.json({
        code: 0,
        data: doc
      });
    } else {
      res.json({
        code: -1,
        message: '暂无该房源数据！'
      })
    }
  })
})

//查询房源
router.get('/query-by-houseId', async (req, res, next) => {
  const {houseId} = req.query//根据房源的名字查数据库的房源表
  houseModel.findOne({houseId}, function (err, doc) {
    if (doc) {
      res.json({
        code: 0,
        data: doc
      });
    } else {
      res.json({
        code: -1,
        message: '暂无该房源数据！'
      })
    }
  })
})

//增加房屋水费
router.post('/submit-water-price', async (req, res, next) => {
  const param = req.body
  const {houseId} = req.body
  houseModel.updateOne({houseId}, {$push: {'waterPrice': param}}, {}, (err, doc) => {
    if (err) {
      res.json({
        code: -1,
        msg: err.message
      });
    } else {
      res.json({
        code: 0,
        msg: '水费更新成功'
      });
    }
  })
})

//增加房屋电费
router.post('/submit-electricity-price', async (req, res, next) => {
  const param = req.body
  const {houseId} = req.body
  houseModel.updateOne({houseId}, {$push: {'elePrice': param}}, {}, (err, doc) => {
    if (err) {
      res.json({
        code: -1,
        msg: err.message
      });
    } else {
      res.json({
        code: 0,
        msg: '电费更新成功'
      });
    }
  })
})


//修改房屋水电标准
router.post('/submit-water-electricity-unit', async (req, res, next) => {
  const {houseId, waterUnitPrice, electricityUnitPrice} = req.body
  houseModel.updateOne({houseId}, {waterUnitPrice, electricityUnitPrice}, (err, doc) => {
    if (err) {
      res.json({
        code: -1,
        msg: err.message
      });
    } else {
      res.json({
        code: 0,
        msg: '更新成功'
      });
    }
  })
})

//提交房屋公告
router.post('/submit-announcement', async (req, res, next) => {
  const {houseId, announcement} = req.body
  houseModel.updateOne({houseId}, {announcement}, (err, doc) => {
    if (err) {
      res.json({
        code: -1,
        msg: err.message
      })
    } else {
      res.json({
        code: 0,
        msg: '公告更新成功！'
      });
    }
  })
})

//租客根据账号查询房子
router.get('/tenantFindHouseByAccount', async (req, res, next) => {
  const {account} = req.query
  houseModel.findOne({'tenantMessage.tenantPhone': account}, (err, doc) => {
    if (err) {
      res.json({
        code: -1,
        msg: err.message
      })
    } else {
      res.json({
        code: 0,
        data: doc
      })
    }
  })
})

//给房东的消息列表添加消息
router.post('/submit-message', async (req, res, next) => {
      const param = {noticeId: nanoid(), ...req.body}
      const {landlordId} = req.body

      userModel.updateOne({userId: landlordId}, {$push: {'notices': param}}, {}, (error, doc) => {
        console.log(error);
        if (error) {
          res.json({
            code: -1,
            msg: error.message
          })
        } else {
          res.json({
            code: 0,
            msg: '发布信息成功！'
          })
        }
      })
    }
)

//租客缴纳费用
router.post('/pay-fee', async (req, res, next) => {
      const param = {noticeId: nanoid(), ...req.body}
      const {landlordId} = req.body

      userModel.updateOne({userId: landlordId}, {$push: {'notices': param}}, {}, (error, doc) => {
        if (error) {
          res.json({
            code: -1,
            msg: error.message
          })
        } else {
          res.json({
            code: 0,
            msg: '缴纳成功！'
          })
        }
      })
    }
)

module.exports = router
