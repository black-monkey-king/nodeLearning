const express = require('express')
const fs = require('fs');
const path = require('path')
const mysql = require('mysql');



var serverapp = express()


const connection = mysql.createConnection({
  host:'127.0.0.1',
  port:'3308',
  user:'root',
  password:'869211571',
  database:'test'
})
connection.connect(function(){
  console.log('server is working')
})
let sql,resulte;
sql = 'select * from websites'
connection.query(sql,(err,res)=>{
  if(err){
    console.log(err.message);
    return;
  }
  console.log(res)
  resulte = JSON.stringify(res)
})


/**
参数1： 要读取的文件路径 --- 必须绝对路径
参数2： 配置项，可选，一般不用
参数3： 读取完成后的回调函数，该函数中有一个参数 --- 错误对象
*/
/* res.sendFile(var1, var2, var3);
// 参数2示例：
const config = {
    root: __dirname + '/view/',   // 配置模板文件跟路径
    headers: {                    // 配置头信息
        'content-type':'text/html;charset=utf-8'
    }
} */


// 使用中间键实现静态资源托管
// url地址中以 /public 开头的，都会去 public 目录下读取对应的文件并返回给浏览器
// 资源只要是在pbulic目下就可以(非该目录下资源不会自动去取)，不用管嵌套多少层
// 可指定全局资源路径
serverapp.use( express.static(path.join(__dirname + '../../pbulic')));
// 也可指定特定资源路径
serverapp.use('/pbulic', express.static(path.join(__dirname + '../../pbulic')));

console.log(path.join(__dirname + '../../pbulic'))
// express 中req和 http 服务中的 res和res是否相同？？？
//  主页输出 "Hello World"
serverapp.get('/', function (req, res) {
  console.log("主页 GET 请求");
  // res.send('Hello GET');
  res.sendFile(path.join(__dirname + "../../html/index.html"))
})


// 通过// req.params：请求 URI 中的路径参数
serverapp.get('/users/:userId/books/:bookId', function (req, res) {
  console.log(req.params,req.query)
  res.send(req.params)
})

//  POST 请求
serverapp.post('/', function (req, res) {
  console.log("主页 POST 请求");
  res.send('Hello POST');
})

//  /del_user 页面响应
serverapp.get('/del_user', function (req, res) {
  console.log("/del_user 响应 DELETE 请求");
  // res.send('删除页面');
  res.send(resulte)

})

//  /list_user 页面 GET 请求
serverapp.get('/list_user', function (req, res) {
  console.log("/list_user GET 请求");
  res.send('用户列表页面');
})

// 对页面 abcd, abxcd, ab123cd, 等响应 GET 请求
serverapp.get('/ab*cd', function(req, res) {   
  console.log("/ab*cd GET 请求");
  res.send('正则匹配');
})

serverapp.use((req,res,nex)=>{
  console.log('最后一个中间件。。。。。')
})

var server = serverapp.listen(8000,function(err){
  var host = server.address()
  console.log(server.address())
})
