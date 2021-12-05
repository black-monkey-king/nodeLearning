const http = require('http');
const fs = require('fs');


/* // 直接在传入回调监听
http.createServer((req,res)=>{
  console.log('req:',req)
  console.log('res:',res)
}).listen(8000,(err)=>{
  console.log('server is running');
}) */

const server = http.createServer()
server.listen(8001,(err)=>{
  console.log('server is running...')
})


// 同过eventEmitter的方式监听事件
server.on('request',(req,res)=>{
  console.log(req)
  const url = req.url;
  res.setHeader('content-type', 'text/html;charset=utf-8');
  if(url === '/' || url === '/index'){
    console.log(__dirname)
    fs.readFile(__dirname + '/html/index.html',(err,data)=>{
      if(err) return res.end('404 is not found');
      res.end(data);
    })
  } else if(url === '/list'){
    res.end('列表页');
  } else if(url === '/detail'){
    res.end ('详情页');
  } else if(url.startsWith('/pbulic')){ // 设定公共资源
    fs.readFile(__dirname  + url ,(err,data)=>{
      console.log('imsg backing')
      if(err) return res.end('is not found');
      res.end(data)
    })
  } else {  
    res.end('404 is not found')
  }
 })