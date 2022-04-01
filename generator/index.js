thunkify = require('thunkify');
// thunk能实现自执行原理
/* var g = gen();

var r1 = g.next();
r1.value(function (err, data) {
  if (err) throw err;
  var r2 = g.next(data);
  r2.value(function (err, data) {
    if (err) throw err;
    g.next(data);
  });
}); */


// 流程执行函数
function run(fn) {
	var gen = fn();
  
	function next(err, data) {
	  var result = gen.next(data);
	  if (result.done) return;
	  result.value(next);
	}
  
	next();
  }
  

// thunk函数简易封装
const Thunk = function(fn) {
    	return function (...args) {
	  return function (callback) {
		return fn.call(this, ...args, callback);
	  }
	};
  };


function relRegisterFn(val){
	return Math.random()*val;
}
// regesitrFn封装
function regesitrFn(props,callback){
	let isRunNext = false,getData=null;
	let next = function(){
		isRunNext = true;
	}
	try {
		getData = relRegisterFn(props);
		return callback(null,getData,isRunNext)
	} catch (error) {
		return callback(error,getData,isRunNext)
    }
}

let getVal = Thunk(regesitrFn)(100)((err,data,flog)=>{
    console.log(22222,err,data,flog);
    return 'ccTest'
    
})
console.log(44444,getVal)

getVal = thunkify(regesitrFn)(100)((err,data,flog)=>{
    console.log(22222,err,data,flog);
    return 'ccTest222222'
})
console.log(5555555,getVal)


