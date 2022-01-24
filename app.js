let createError = require('http-errors');
let express = require('express');
let cookieParser = require('cookie-parser');
let logger = require('morgan');
const cors = require('cors');
let path = require('path');
let mongoose = require('mongoose')
let app = express();

let indexRouter = require('./routes/index');
let usersRouter = require('./routes/users');
let houseRouter = require('./routes/house')


/*********************************************************************************************************/
//连接数据库
//连接MongoDB数据库
mongoose.connect('mongodb://localhost:27017/graduation-design');

mongoose.connection.on("connected", function () {
    console.log("MongoDB connected success.")
});

mongoose.connection.on("error", function () {
    console.log("MongoDB connected fail.")
});

mongoose.connection.on("disconnected", function () {
    console.log("MongoDB connected disconnected.")
});

// mongoose.connect('mongodb://localhost:1011/graduation-design')     //连接本地数据库blog
//
// let db = mongoose.connection;

// // 连接成功
// db.on('open', function () {
//     console.log('MongoDB Connection Successed');
// });
// // 连接失败
// db.on('error', function () {
//     console.log('MongoDB Connection Error');
// });
/*********************************************************************************************************/

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({extended: false}));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', indexRouter);
app.use('/getuser', usersRouter)
app.use('/gethouse',houseRouter)


// catch 404 and forward to error handler
app.use(function (req, res, next) {
    next(createError(404));
});

// error handler
app.use(function (err, req, res, next) {
    // set locals, only providing error in development
    res.locals.message = err.message;
    res.locals.error = req.app.get('env') === 'development' ? err : {};

    // render the error page
    res.status(err.status || 500);
    res.render('error');
});

//允许跨域
app.use(cors())
// app.all('*', function (req, res, next) {
//     res.header('Access-Control-Allow-Origin', '*');
//     res.header('Access-Control-Allow-Headers', 'Content-Type, Content-Length, Authorization, Accept, X-Requested-With');
//     res.header('Access-Control-Allow-Methods', 'PUT, POST, GET, DELETE, OPTIONS');
//     res.header('Cache-Control', "no-store")
//     if (req.method == 'OPTIONS') {
//         res.send(200);
//     } else {
//         next();
//     }
// });

module.exports = app;
