let express = require('express');
let router = express.Router();
let houseModel = require('../models/house')

/* GET users listing. */
router.get('/', async (req, res, next) => {
  const {houseName} = req.body
  houseModel.findOne({houseName}, function (err, doc) {
    console.log(doc);
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


//增加房源
router.post('/create-house', async (req, res, next) => {
  const {houseName, houseAddress} = req.body
  console.log(houseName, houseAddress);
  let newHouse = [{
    houseName,
    houseAddress
  }]
  houseModel.create(newHouse, (err) => {
    if (err) {
      return console.log(err)
    } else {
      res.json({
        code: 0,
        message: "房源添加成功！"
      })
    }
  })
});

//删除房源
router.post('/del-house', async (req, res, next) => {
  const {houseName} = req.body
  console.log(houseName);
  houseModel.remove({houseName}, (err, result) => {
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
  const {houseName, housePrice} = req.body
  console.log(houseName, housePrice);
  houseModel.updateOne({houseName}, {housePrice}, (err, doc) => {
    if (err) {
      res.json({
        status: -1,
        msg: err.message
      });
    } else {
      res.json({
        status: 0,
        msg: '更新成功'
      });
    }
  })
})


module.exports = router;
