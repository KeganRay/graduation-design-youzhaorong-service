let {nanoid} = require('nanoid')
let express = require('express');
let router = express.Router();
let userModels = require('../models/user')
let {createToken,jwtAuth} = require('../jwt/token')

//导入用于生成JWT字符串的包
const jwt = require('jsonwebtoken');
//导入用于将客户端发送过来的JWT字符串解析还原成JSON对象的包

// 登录接口
router.post('/login', async (req, res, next) => {
  const {account, password} = req.body
  console.log(account, password);
  userModels.findOne({account, password}, function (err, doc) {
    if (doc) {
      let tokenStr = createToken({account,password})
      res.cookie("token",tokenStr,{maxAge:1000*3600*24*7,httpOnly:true,path:'/'})//设置JWT在cookie中
      res.cookie("hhh","123")//设置JWT在cookie中
      res.json({
        code: 0,
        data: doc,
        token:tokenStr
      });
    } else {
      res.json({
        code: -1,
        message: '请检查账户密码！'
      })
    }
  })
});

//注册接口
router.post('/register', function (req, res, next) {
  const param = {...req.body, userId: nanoid(), account: req.body.phone}
  console.log(param);
  if (param) {
    userModels.create(param, (err) => {
      if (err) {
        return console.log(err)
      } else {
        res.json({
          code: 0,
          message: "注册成功！"
        })
      }
    })
  } else {
    res.json({
      code: -1
    })
  }
});

/* 通过用户id查询用户 */
router.get('/query-by-userId', async (req, res, next) => {
  console.log(req.query);
  const {userId} = req.query//
  userModels.findOne({userId}, function (err, doc) {
    console.log(doc);
    if (doc) {
      res.json({
        code: 0,
        data: doc
      });
    } else {
      res.json({
        code: -1,
        message: '暂无该数据！'
      })
    }
  })
})

router.get('/query-all-users', async (req, res, next) => {
  userModels.find((err, doc) => {
    if (doc) {
      if (doc) {
        res.json({
          code: 0,
          data: doc
        });
      } else if (err) {
        res.json({
          code: -1,
          message: '系统故障，请联系开发人员！'
        })
      }
    }
  })
})

/* 通过用户身份证查询用户 */
router.get('/query-by-idCardNmber', async (req, res, next) => {

  const {IDcardNumber} = req.query//身份证
  userModels.find({IDcardNumber}, function (err, doc) {
    console.log(doc);
    if (doc) {
      res.json({
        code: 0,
        data: doc
      });
    } else {
      res.json({
        code: -1,
        message: '没有此用户！'
      })
    }
  })
})

//根据用户Id获取所有通知
router.get('/getNotices', async (req, res, next) => {
  const {userId} = req.query
  userModels.findOne({userId}, (err, doc) => {
    if (doc) {
      res.json({
        code: 0,
        data: doc.notices
      });
    } else {
      res.json({
        code: -1,
        message: '系统出现故障，请联系开发人员！'
      })
    }
  })
})

//根据消息Id设为已读
router.post('/handle-read-notice', async (req, res, next) => {
  const {userId, noticeId} = req.body
  userModels.updateOne({userId, "notices.noticeId": noticeId}, {$set: {"notices.$.isRead": true}}, (err, doc) => {
    console.log(doc)
    if (doc.ok === 1) {
      res.json({
        code: 0,
        data: "已阅读此信息"
      });
    } else {
      res.json({
        code: -1,
        message: '系统出现故障，请联系开发人员！'
      })
    }
  })
})

//更新用户信息
router.post('/updateUserInfo', async (req, res, next) => {
  console.log(req.body);
  const {userId} = req.body
  userModels.updateOne({userId}, {...req.body}, (err, doc) => {
    if (doc.ok === 1) {
      res.json({
        code: 0,
        data: "更新成功！"
      });
    } else {
      res.json({
        code: -1,
        message: '系统出现故障，请联系开发人员！'
      })
    }
  })
})

//删除指定用户信息
router.post('/delete-user', async (req, res, next) => {
  console.log(req.body);
  const {userId} = req.body
  userModels.remove({userId}, (err, doc) => {
    console.log(doc);
    if (doc.deletedCount) {
      res.json({
        code: 0,
        message: "删除成功！"
      });
    } else {
      res.json({
        code: -1,
        message: '系统出现故障，请联系开发人员！'
      })
    }
  })
})


module.exports = router;
