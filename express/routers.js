const express = require('express');
const path = require('path');
const bodyParser = require('body-parser');
const multer = require('multer');
const cookieparser = require('cookie-parser');
// express中的分类：// 应用级中间件// 路由器级中间件// 错误处理中间件// 内置中间件 // 第三方中间件
// 使用中间件的两种方式：全局使用，路由使用
// 对于app.method()和router.method(),可以使用next('route')跳到路由分组的下一个。
const app = express();

// 应用级中间件
app.use(function (req, res, next) { // 这种方式也可以一次调用多个路由
  console.log('Time:', Date.now())
  console.log('Request URL:', req.originalUrl)
  next()
},(req,res,next)=>{
  console.log(1111)
  next()
})

 // 于同一个路由可以使用app.use同时定义多个无影响。
app.use('/user/:id', function (req, res, next) {
  console.log('Request URL:', req.originalUrl)
  //next('route')只能用于app.METHOD()或router.METHOD()函数加载的中间件函数。
  next('route')
}, function (req, res, next) {
  console.log('Request Type1:', req.method)
  res.sendFile(path.join(__dirname ,"../html/post.html"))
  // 即使res已经相应请求，只要next()就会向下执行
  next()
})
app.use('/user/:id', function (req, res, next) {
  console.log('Request Type2:', req.method)
  // 多次返回无效，返回最后一个
  res.send('这个路由从此处结束。。。。aging')
  next()
})

app.use('/post_process', function (req, res, next) {
  console.log('该路由下同时相应post和get请求')
  next()
})


// 中间件数组，
function logOriginalUrl (req, res, next) {
  console.log('middleware1')
  next()
}
function logMethod (req, res, next) {
  console.log('middleware2')
  next()
}
app.get('/middleware', [logOriginalUrl,logMethod], function (req, res, next) {
  res.send('User Info')
})

app.get('/cc/:id', function (req, res, next) {
  if (req.params.id === '0') next('route')
  // 会跳入下一个app.get('/cc/:id')路由，next("route")只能用于app.method()和route.method() 
  // otherwise pass the control to the next middleware function in this stack
  else next()
}, function (req, res, next) {
  // send a regular response
  res.send('regular')
})
app.get('/aaaa', function (req, res, next) {
  console.log('aaaaaa')
  res.send('aaaaa')
})

app.get('/cc/:id', function (req, res, next) {
  res.send('special')
})
app.use((req,res,nex)=>{
  console.log('最后一个中间件。。。。。')
})



// 路由器级中间件
// 错误处理中间件
// 内置中间件
// 第三方中间件


const server = app.listen(8000,(err)=>{
  var host = server.address().address
  var port = server.address().port
  console.log("应用实例，访问地址为 http://%s:%s", host, port)
})