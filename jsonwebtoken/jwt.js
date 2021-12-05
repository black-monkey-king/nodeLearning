const express = require('express')
const fs = require('fs');
const path = require('path')
const bodyParser = require('body-parser');
// jwt 用于生成校验token 用于多系统的单点登录
const jwt = require('jsonwebtoken')
// jwt 检测node中间件，是jsonwebtoken的封装，但是二者得同时引用
const expressJwt = require('express-jwt');

var serverapp = express()

let secret = 'abcdef';

// 中间件
// 处理http请求为application/json的请求，传参的时候必须json.stringify(),不然req.body中的值会丢失，使用了jsonParser 还会报错
var jsonParser = bodyParser.json()
var urlencodedParser = bodyParser.urlencoded({ extended: false })

const jwtAuth = expressJwt({
  // 设置密钥
  secret: secret,
  // 设置为true表示校验，false表示不校验
  credentialsRequired: true,
  // 自定义获取token的函数
  algorithms:['HS256'],
  getToken: (req) => {
    if (req.headers.authorization) {
      return req.headers.authorization
    } else if (req.query && req.query.token) {
      return req.query.token
    } else if(req.body && req.body.token){
      console.log('jwtAuth')
      console.log(req.body.token)
      return req.body.token
    }
  }
  // 设置jwt认证白名单，比如/api/login登录接口不需要拦截
}).unless({
  path: [
    '/',
    '/get',
    '/form'
  ]
})

serverapp.use('/pbulic', express.static(path.join(__dirname + '../../pbulic')));
// 解析请求体json的中间件必须在，jwtAuth中间件的前面不然，getToken方法中req.body.token携带的token解析失败无法通过
serverapp.use(jsonParser)
serverapp.use(jwtAuth)


serverapp.get('/', function (req, res) {
  res.sendFile(path.join(__dirname + "../../html/token.html"))
})

serverapp.get('/get', function (req, res) {
  console.log("主页 GET 请求");
  console.log('req.query',req.query);
  
  let getToken = jwt.sign({
    name: 'kongzhi',
    // 过期时间为过期时间点的秒数
    exp: Math.floor(Date.now() / 1000) + (60 * 60),
    // exp: Math.floor(Date.now() / 1000) + 1
  }, secret);
  console.log(getToken)
  res.end(JSON.stringify({status:200,token:getToken,data:111,msg:'success'}));
})


serverapp.post('/post',function (req, res) {
  console.log("主页 post 请求");
  console.log('headerToken',req.headers['authorization']);
  console.log('req.body',req.body);
  
  jwt.verify(req.headers['authorization'], secret, (error, decoded) => {
    if (error) {
      console.log(error.message);
      res.end(JSON.stringify({status:403,data:null,msg:'无token请重新登录'}));
    }
    console.log(decoded)
    res.end(JSON.stringify({status:200,data:{age:100,name:'cc'},msg:'success'}));
    // 报错：必须范围序列化json
    // res.end({status:200,data:{age:100,name:'cc'},msg:'success'});
  });
})

serverapp.post('/post-json',jsonParser,function (req, res) {
  console.log("主页 post-json 请求");
  console.log('headerToken',req.headers['authorization']);
  console.log('req.body',req.body);
  
  jwt.verify(req.headers['authorization'], secret, (error, decoded) => {
    if (error) {
      console.log(error.message);
      res.end(JSON.stringify({status:403,data:null,msg:'无token请重新登录'}));
    }
    console.log(decoded)
    res.end(JSON.stringify({status:200,data:{age:100,name:'cc'},msg:'success'}));
  });
})

serverapp.post('/form',urlencodedParser,function (req, res) {
  console.log("主页 post-form 请求");
  console.log(req.body);
  res.end(JSON.stringify({status:200,data:{txt:'ahhahah'},msg:'success'}));
})

serverapp.use((err, req, res, next) => {
  console.log(err)
  // console.error(err.stack);
  if(err.name === 'UnauthorizedError'){
    res.status(401).end(JSON.stringify({status:403,data:null,msg:err.message}));
  }
  res.status(500).end('服务器多少有点贱毛病........')
});

var server = serverapp.listen(8000,function(err){
  var host = server.address()
  console.log(server.address())
})
