
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
// 使用中间件处理cookie
app.use(cookieparser())

app.get('/', function (req, res) {
  res.sendFile(path.join(__dirname + "../../html/token.html"))
})

// get请求响应
app.get('/get',(req,res)=>{
  console.log("Cookies: " + util.inspect(req.cookies));
  // 这里的req和res对象和http中的相同，都是
  let sendData = {
    code:200,
    data:{

    },
    msg:'success'
  }
  res.end(JSON.stringify(sendData))
})

app.post('/post',(req,res)=>{
  console.log(req.body)
  let sendData = {
    code:200,
    data:{

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
 