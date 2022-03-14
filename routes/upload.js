let express = require('express');
let router = express.Router();
const path = require('path')
const crypto = require('crypto')
let mongoose = require('mongoose')
const multer = require('multer')
const GridFsStorage = require('multer-gridfs-storage').GridFsStorage
const Grid = require('gridfs-stream')
const bodyParser = require('body-parser')
let ObjectId = require("mongodb").ObjectID;


//创建连接
const conn = mongoose.createConnection('mongodb://localhost:27017/uploads', {
  useNewUrlParser: true,
  useUnifiedTopology: true
})

conn.once('open', () => {
  gfs = Grid(conn.db, mongoose.mongo)
  gfs.collection('uploads')
})
//成功连接数据库
mongoose.connection.on("connected", function () {
  console.log('成功连接upload');
});

//初始化gfs
let gfs

//实例化storage对象
const storage = new GridFsStorage({
  url: 'mongodb://localhost:27017/uploads',
  file: (req, file) => {
    return new Promise(((resolve, reject) => {
      crypto.randomBytes(16, (err, buf) => {
        if (err) {
          return reject(err)
        }
        const filename = buf.toString('hex') + path.extname(file.originalname)
        const fileInfo = {
          filename,
          bucketName: 'uploads'
        }
        console.log(fileInfo);
        resolve(fileInfo)
      })
    }))
  }
})

const upload = multer({storage})

// 创建路由
router.get('/', (req, res) => {
  // res.render('index');
  gfs.files.find().toArray((err, files) => {
    // 验证文件是否存在
    if (!files || files.length === 0) {
      res.render('index', { files: false });
    } else {
      files.map((file) => {
        if (file.contentType === 'image/png') {
          file.isImage = true;
        } else {
          file.isImage = false;
        }
      });
      console.log('到这');
      // res.render('index', { files: files });
    }
  });
});

//上传图片
router.post('/upload-photo', upload.single('file'), async (req, res, next) => {
      //上传图片
      res.json({file: req.file})
    }
)

//查找所有图片
router.get('/getImages', (req, res) => {
  gfs.files.find().toArray((err, files) => {
    //验证是否有files
    if (!files || files.length === 0) {
      console.log('找不到这图片');
      return res.status(404).json({
        err: "文件不存在"
      })
    } else {
      //文件存在
      return res.json({files})
    }
  })
})


//获取图片
router.get('/getImages/:_id', (req, res) => {
  console.log(req.params._id);
  gfs.files.findOne({"_id": ObjectId(req.params._id)}, (err, file) => {
    console.log(file);
    if (!file || file.length === 0) {
      console.log('没找到此文件');
      return res.status(404).json({error: "不存在此文件!"})
    } else {
      console.log(file);
      //是否是图片格式
      if (file.contentType === "image/png" || file.contentType === "image/jpg" || file.contentType === "image/jpeg") {
        const readStream = gfs.createReadStream(file._id)
        readStream.pipe(res)
      }else{
        res.status(404).json({err: "不存在此文件!"})
      }
    }
  })
})


module.exports = router;