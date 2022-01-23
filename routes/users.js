let express = require('express');
let router = express.Router();
let User = require('../models/user')

/* GET users listing. */
router.post('/', async (req, res, next) => {
    const {account,password} = req.body
    console.log(account, password);
    User.findOne({account,password}, function (err, doc) {
        if (doc) {
            res.json({
                code: 0,
                data: doc
            });
        }else{
            res.json({
                code:-1,
                message:'请检查账户密码！'
            })
        }
    })
});

//嵌套路由
router.get('/name', function (req, res, next) {
    console.log('调用一次');
    res.json({
        code: 0,
        data: {
            array: [1]
        }
    })
});

module.exports = router;
