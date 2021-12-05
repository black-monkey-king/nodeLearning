// 使用router分割功能，使用template
const express = require('express');
const path = require('path');
const app = express();
const helloRouter = require('../routers/hello')
const tryRouter = require('../routers/try')

// 指定模板存放目录
app.set('views', path.resolve(__dirname ,'../template'));
// 指定模板引擎为 Handlebars
app.set('view engine', 'hbs');

app.use('/pbulic', express.static(path.join(__dirname , '../pbulic')));

app.get('/', (req, res) => {
  console.log('使用模板渲染idnex.html')
  // 使用res.render的方式，app必须配置模板引擎
  res.render('index');
});

app.get('/contact', (req, res) => {
  console.log('使用模板渲染contact.html')
  res.render('contact');
})

app.use('/hello',helloRouter)
app.use('/try',tryRouter)

const appserver = app.listen(8000,(err)=>{
  var host = appserver.address().address
  var port = appserver.address().port
  console.log("应用实例，访问地址为 http://%s:%s", host, port)
})