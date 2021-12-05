
const express = require('express');
const fs = require('fs');
const path = require('path');
const bodyParser = require('body-parser');
const cookieparser = require('cookie-parser');
var util = require('util');
 
const app = express();

var jsonParser = bodyParser.json()
var urlencodedParser = bodyParser.urlencoded({ extended: false })

// 指定模板存放目录
app.set('views', path.resolve(__dirname ,'../template'));
app.set('view engine', 'hbs');
 
app.use('/pbulic', express.static(path.join(__dirname + '../../pbulic')));
app.use(jsonParser)
app.use(urlencodedParser)
// 使用cookie中间件，没使用时req上cookie没有挂载，req.cookie为undefined, 使用该中间件后req.cookies以对象的形式呈现
// 对cookie进行签名传入密钥secret，之后的res.cookie可以通过req.secret获取改密钥对齐进行签名
app.use(cookieparser('secret'))

app.use(function (req, res, next) {  
  // cookie设置：使用Express的内置方法res.cookie。
  // cookie解析：使用cookie-parser中间件。
  res.cookie('cc-cookie', 'abcdefj');
  res.cookie('aaa', 'abcdd');
  res.cookie('bbb', 'abcdd', {signed: true});
  // 签名之后的效果
  // console.log(unescape('s%3Aabcdd.vgWfKS%2FZP3yhcnkuahmDZRahQgfMjDSM2Q4LQifjbGo'))
  // s:abcdd.vgWfKS/ZP3yhcnkuahmDZRahQgfMjDSM2Q4LQifjbGo
  res.cookie('ccc', '123243454', {signed: true});
  next()
});


app.get('/', function (req, res) {
  res.sendFile(path.join(__dirname + "../../html/cookie.html"))
})

// get请求响应
app.get('/get',(req,res)=>{
  console.log('psot请求路径/post')
  console.log(req.cookies)
  console.log(req.signedCookies)
  // utils.inspect 形如 JSON.stringify,对象为function，不可枚举的也能显示出来，用于node的bug调试。。。
  console.log("Cookies: " + util.inspect(req.cookies));
  // 这里的req和res对象和http中的相同，都是
  let sendData = {
    code:200,
    data:{
      age:100,
      name:'cc'
    },
    msg:'success'
  }
  res.end(JSON.stringify(sendData))
})

app.post('/post',(req,res)=>{
  console.log('psot请求路径/post')
  console.log(req.body)
  let sendData = {
    code:200,
    data:{
      age:100,
      name:'cc'
    },
    msg:'success'
  }
  res.end(JSON.stringify(sendData))
})
 

// 自定义404中间件
app.use('*', (req, res) => {
  res.status(404).render('404', { url: req.originalUrl });
});

app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).render('500');
});

const server = app.listen(8000,(err)=>{
  var host = server.address().address
  var port = server.address().port
  console.log("应用实例，访问地址为 http://%s:%s", host, port)
})
 