const express = require('express');
const fs = require('fs');
const path = require('path');
const bodyParser = require('body-parser');
const multer = require('multer');
const cookieparser = require('cookie-parser');
var util = require('util');
// 常见的请求参数
// req.body：客户端请求体的数据，可能是表单或 JSON 数据
// req.params：请求 URI 中的路径参数
// req.query：请求 URI 中的查询参数
// req.cookies：客户端的 cookies

// 常用组件
/* body-parser - node.js 中间件，用于处理 JSON, Raw, Text 和 URL 编码的数据。
cookie-parser - 这就是一个解析Cookie的工具。通过req.cookies可以取到传过来的cookie，并把它们转成对象。
multer - node.js 中间件，用于处理 enctype="multipart/form-data"（设置表单的MIME编码）的表单数据。 */

// 使用中间件的两种方式：全局使用，路由使用
// ruoter 也可以看作是一个大的中间件，
// app.use(someMiddleware);
// app.get('/middleware', someMiddleware, (req, res) => {
//   res.send('Hello World');
// });

const app = express();
const server = app.listen(8000,(err)=>{
  var host = server.address().address
  var port = server.address().port
  console.log("应用实例，访问地址为 http://%s:%s", host, port)
})

// 指定模板存放目录
app.set('views', path.resolve(__dirname ,'../template'));
// 指定模板引擎为 Handlebars
app.set('view engine', 'hbs');

// 定义中间件的使用需要有next进去下一个中间件，或者res直接返回结果，或者抛出错误不然会卡在这里
function someMiddleware(req, res, next) {
  console.log('路由中间件1.....')
  next();
}
function someMiddleware1(req, res, next) {
  console.log('路由中间件2.....')
  next();
}
function globalMiddleware(req, res, next) {
  console.log('全局中间件.....')
  next();
}

// 使用中间键实现静态资源托管
// url地址中以 /public 开头的，都会去 public 目录下读取对应的文件并返回给浏览器
// 资源只要是在pbulic目下就可以，不用管嵌套多少层
app.use('/pbulic', express.static(path.join(__dirname + '../../pbulic')));
app.use(globalMiddleware)
// 使用中间件处理cookie
app.use(cookieparser())



// get请求响应
app.get('/get',someMiddleware,someMiddleware1,(req,res)=>{
  console.log("Cookies: " + util.inspect(req.cookies));
  // 这里的req和res对象和http中的相同，都是
  res.sendFile(path.join(__dirname + "../../html/get.html"))
})
app.get('/get_process',(req,res)=>{
  console.log(req.query)
  var respose = {
    name:req.query.name,
    password:req.query.password
  }
  res.end(JSON.stringify(respose))
})

// post请求
// 创建 application/x-www-form-urlencoded 编码解析
var urlencodedParser = bodyParser.urlencoded({ extended: false })

app.get('/post',(req,res)=>{
  // 这里的req和res对象和http中的相同 ？？？？
  res.sendFile(path.join(__dirname + "../../html/post.html"))
})
app.post('/post_process',urlencodedParser,(req,res)=>{
   var response = {
     name:req.body.name,
     password:req.body.password
   }
   res.end(JSON.stringify(response))
})

// 文件上传
// 使用中间件处理得出文件信息
app.use(multer({ dest: '/tmp/'}).array('image'));
app.get('/file.html', function (req, res) {
   res.sendFile( path.join(__dirname + "../../html/file-upload.html") );
})

// 上传文件信息
/* {
  fieldname: 'image',
  originalname: '灵魂拷问月读程超.txt',
  encoding: '7bit',
  mimetype: 'text/plain',
  destination: '/tmp/',
  filename: '88d3f2e32cb85a22589cc5d5ef69c042',
  path: '\\tmp\\88d3f2e32cb85a22589cc5d5ef69c042',
  size: 2212
} */
app.post('/file_upload', function (req, res) {
   console.log(req.files[0]);  // 上传的文件信息
   // 文件名称
   var des_file = __dirname + "/" + req.files[0].originalname;
   // 获取本地文件路径
   fs.readFile( req.files[0].path, function (err, data) {
        fs.writeFile(des_file, data, function (err) {
         if( err ){
              console.log( err );
         }else{
               response = {
                   message:'File uploaded successfully', 
                   filename:req.files[0].originalname
              };
          }
          console.log( response );
          res.end( JSON.stringify( response ) );
       });
   });
})

// 错误处理
app.get('/broken', (req, res) => {
  throw new Error('Broken!');
});

// 注意注册中间件的位置！！！！！！！！！！！
// 自定义404中间件
app.use('*', (req, res) => {
  res.status(404).render('404', { url: req.originalUrl });
});
// 如果该错误捕获中间件注册在报错之前，错误不会被捕获！！！！！！！！！！
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).render('500');
});


// 对页面 abcd, abxcd, ab123cd, 等响应 GET 请求
app.get('/ab*cd', function(req, res) {   
  console.log("/ab*cd GET 请求");
  res.send('正则匹配');
})