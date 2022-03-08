let express = require('express');
let router = express.Router();
let houseModel = require('../models/house')
let userModel = require('../models/user')
let {nanoid} = require('nanoid')

//增加房源
router.post('/create-house', async (req, res, next) => {
  console.log(req.body);
  const param = {...req.body, houseId: nanoid()}//房子的参数
  const {houseName, houseAddress} = param
  const {tenantPhone, tenantName, tenantIDcardNumber} = param.tenantMessage//租客信息
  const {landlordName, landlordPhone, landlordId} = param//房东信息
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
          if (updateResult.matchedCount === 1) {
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

router.get('/queryUserHouseList', async (req, res, next) => {
  const {userId} = req.query//根据房东的id查数据库的房源表
  console.log(userId);
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
  console.log(houseId);
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
  console.log(param);
  const {houseId} = req.body
  houseModel.findOne({houseId}, {}, (err, doc) => {
    if (err) {
      res.json({
        code: -1,
        msg: err.message
      });
    } else {
      if (doc) {
        console.log(doc);
        const updatedPrice = [...doc.waterPrice, param]
        houseModel.updateOne({houseId}, {waterPrice: updatedPrice}, (error, doc) => {
          if (error) {
            error.json({
              code: -1,
              msg: error.message
            });
          } else {
            res.json({
              code: 0,
              msg: '更新成功'
            });
          }
        })
      }
    }
  })
})

//增加房屋电费
router.post('/submit-electricity-price', async (req, res, next) => {
  const param = req.body
  const {houseId} = req.body
  houseModel.findOne({houseId}, {}, (err, doc) => {
    if (err) {
      res.json({
        code: -1,
        msg: err.message
      });
    } else {
      if (doc) {
        const updatedPrice = [...doc.elePrice, param]
        houseModel.updateOne({houseId}, {elePrice: updatedPrice}, (error, doc) => {
          if (error) {
            error.json({
              code: -1,
              msg: error.message
            });
          } else {
            res.json({
              code: 0,
              msg: '更新成功'
            });
          }
        })
      }
    }
  })
})


//修改房屋水电标准
router.post('/submit-water-electricity-unit', async (req, res, next) => {
  const {houseId,waterUnitPrice,electricityUnitPrice} = req.body
  houseModel.updateOne({houseId}, {waterUnitPrice,electricityUnitPrice}, (err, doc) => {
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
module.exports = router;
