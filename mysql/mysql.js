const http = require('http');
const mysql = require('mysql');

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
http.createServer(function(req,res){
  console.log(req.url)
  // 不设置响应头会乱码的
  res.setHeader('content-type', 'text/html;charset=utf-8');
  if(req.url === '/'){
    res.end(resulte)
  }
}).listen(8000,function(){
  console.log('server is working on port 8000')
})