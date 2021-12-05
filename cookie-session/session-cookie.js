var express = require('express');
var app = express();
const path = require('path');
// express-session和cookie-parser中间件使用后可使用res.cookie方法，都会挂载res.cookie
// cookie-parser中间件使用后才可以获取res.cookies
// 使用了cookie-parser后才能解析到res.cookies
var session = require('express-session');
var FileStore = require('session-file-store')(session);
var bodyParser = require('body-parser');
var cookieParser = require('cookie-parser');
var util = require('util');

var users = [
    {name: 'chengchao', password: '123456'},
    {name: 'wangaidi', password: '123456'},
	]

var findUser = function(name, password){
	return users.find(function(item){
		return item.name === name && item.password === password;
	});
};

app.set('views', path.resolve(__dirname ,'../template'));
app.set('view engine', 'hbs');

app.use(express.static( path.join(__dirname ,'/../pbulic')));

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser('chyingp'));

// app.set('trust proxy', 1) // trust first proxy

// 由于同一浏览器对应网址是公用的，会造成cookie公用的问题，双开会造成同状态的问题
app.use(session({
	name: 'skey', // 默认为connect.sid
	secret: 'chyingp',  // 用来对session id相关的cookie进行签名
	store: new FileStore(),  // 本地存储session（文本文件，也可以选择其他store，比如redis的）
	saveUninitialized: false,  // 是否自动保存未初始化的会话，建议false
	resave: false,  // 是否每次都重新保存会话，建议false
	cookie: {
		maxAge: 1000 * 1000,  // 有效期，单位是毫秒
		secure: false // 是否只允许http携带cookie,并且您通过HTTP访问您的站点，true则不会设置 cookie,本地无sessionId对应的cookie时访问页面是失效的
	},
	genid: function(req) { // 获取sessionId的函数
    return Date.now() + req.body.name
  },
}));

app.get('/', function(req, res, next){
	var sess = req.session;
	console.log(req.session)
	var loginUser = sess.loginUser;
	var isLogined = !!loginUser;

	res.render('session', {
		isLogined: isLogined,
    name: loginUser || '',
    // isLogined: false,
	});
});

app.post('/login', function(req, res, next){
	var sess = req.session;
	var user = findUser(req.body.name, req.body.password);
	if(user){
		req.session.regenerate(function(err) {
			if(err){
				return res.json({ret_code: 2, ret_msg: '登录失败'});				
			}
			
      req.session.loginUser = user.name;
      req.session.loginName = 'abadfdfdfdfdfdfdasd';
      res.cookie('aaa', 'abcdd');
			res.json({ret_code: 0, ret_msg: '登录成功'});							
		});
	}else{
		res.json({ret_code: 1, ret_msg: '账号或密码错误'});
	}	
});

app.get('/logout', function(req, res, next){
	// 备注：这里用的 session-file-store 在destroy 方法里，并没有销毁cookie
	// 所以客户端的 cookie 还是存在，导致的问题 --> 退出登陆后，服务端检测到cookie
	// 然后去查找对应的 session 文件，报错
	// session-file-store 本身的bug	

	req.session.destroy(function(err) {
		if(err){
			res.json({ret_code: 2, ret_msg: '退出登录失败'});
			return;
		}
		
		// req.session.loginUser = null;
		// res.clearCookie(identityKey);
		res.redirect('/');
	});
});

// get请求响应
app.get('/get',(req,res)=>{
  var sess = req.session;
  var loginUser = sess.loginUser;
  console.log(1111,sess,loginUser)
  console.log('psot请求路径/post',req.cookies,req.signedCookies)
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

app.listen(8080,(err)=>{
  console.log('server is working......')
});