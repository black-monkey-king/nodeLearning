let co = require('co');
// let thunkify = require('thunkify');

function a (ctx,next,arg,evnetList,iname){
  console.log('fun--a')
  let getPromise = new Promise((resolve,reject)=>{
    setTimeout(()=>{
      console.log('funAPromise....setTimeout1')
      resolve('aaaaa-promise')
    },10000)
  })
  next()
  // return 'aaaa';
  return getPromise;
}
function b (ctx,next,arg,evnetList,iname){
  console.log('fun--b')
  // let getPromise = new Promise((resolve,reject)=>{
  //   setTimeout(()=>{
  //     console.log('funAPromise....setTimeout2')
  //     resolve('aaaaa-promise')
  //   },10000)
  // })
  next()
  return 'bbbbb'
  // return getPromise
}
function c (ctx,next,arg,evnetList,iname){
  console.log('fun--c')
  // next()
  setTimeout(() => {
      console.log('async....')
  }, 1000);
  return 'ccccc'
}
function d (ctx,next,arg,evnetList,iname){
  console.log('fun--d')
  next()
  return 'ddddd'
}

class EventQuene {
  eventName='cctest';
  eventList=[];
  eventFunMap=[];
  context={};
  config = {};
	constructor(eventName, funMap, config = {}, context = {}) {
    this.eventFunMap = funMap;
		this.eventName = eventName;
		this.context = context;
		this.config = config;
  }
  // thunkify包中包裹函数无法return
  thunkify(fn){
    return function(){
      var args = new Array(arguments.length);
      var ctx = this;
      for(var i = 0; i < args.length; ++i) {
        args[i] = arguments[i];
      }
      return function(done){
        var called;
        args.push(function(){  //传入这个函数作为回调函数
          if (called) return; 
          called = true; //调用第一次后 called 变为true 无法调用第二次
          done.apply(null, arguments); //这段代码等于 console.log.apply(null,arguments) arguments 是一个数组 就是sum的值
        });
        try {
        // fn.apply(ctx, args);
          return  fn.apply(ctx, args);
        } catch (err) {
          done(err);
        }
      }
    }
  };
	// register函数封装插入next
	async registerFnThunk(RegisterFn,callback){
		let context =1,config=2,arg=3,eventList=4,eventName=5;
		let isRunNext = false;
		let next = function(){
			isRunNext = true;
    }
    let getData = await RegisterFn(context,next,config,arg,eventList,eventName);
    console.log('getData',getData,isRunNext)
    callback(null, getData, isRunNext);
    return getData;
	}
	*eventFunGenerator ( ) {
    let list = this.eventFunMap; 
		for(var i = 0; i<this.eventFunMap.length; i++) {
			let registerThunk = this.thunkify(this.registerFnThunk);
      let registerFn = list[i];
		  var reset = yield registerThunk(registerFn);
		}
  }
  runGenerator(){
    return new Promise((resolve, reject)=>{
      // generator每步执行后修改,最后为之后一步的返回值.
      let GenEndVal;
      var gen = this.eventFunGenerator();
	    function next(err, data, nextFlog ) {
        console.log('generatorNext',err,data,nextFlog)
        if(nextFlog === false) {
          GenEndVal = data;
          return GenEndVal;
        }
        var result = gen.next(data);
	      if (result.done) {
          GenEndVal = data;
          return GenEndVal;
        }
        let getVal = result.value(next);
        console.log('getVal0000000',getVal)
        return 'kkkkkk'
	    }
      let aa = next();
      console.log('jjjjjjj',aa,GenEndVal)
      resolve(GenEndVal)
    })
  }
	getEventFunMap() { 	
    console.log('ccccccccccccc',this.eventFunMap)
  }
}

let funList = [a,b,c,d];
let getEventQuene = new EventQuene('cctestClick',funList)
// getEventQuene.getEventFunMap();
let GenEndVal = getEventQuene.runGenerator();
GenEndVal.then(data=>{
  console.log('generatorPromise-callback',data)
}).catch(err=>{
  console.log(err)
})

console.log('+++++++++++++++++++++++')

// let getG = getEventQuene.eventFunGenerator()
// console.log('1111',getG)
// console.log(22222,getG.next())

// co模块中this指向有问题.thunkify方法会默认return为undefined
// let PromiseCo = co(getEventQuene.eventFunGenerator).then((pro)=>{
//   console.log(11111,pro)
// }).catch((err)=>{
//   console.log(err)
// })




function thunkify(fn){
  return function(){
    var args = new Array(arguments.length);
    var ctx = this;
    for(var i = 0; i < args.length; ++i) {
      args[i] = arguments[i];
    }
    return function(done){
      var called;
      args.push(function(){  //传入这个函数作为回调函数
        if (called) return; 
        called = true; //调用第一次后 called 变为true 无法调用第二次
        done.apply(null, arguments); //这段代码等于 console.log.apply(null,arguments) arguments 是一个数组 就是sum的值
      });
      try {
        // fn.apply(ctx, args);
        return  fn.apply(ctx, args);
      } catch (err) {
        done(err);
      }
    }
  }
};
function RegisterFn (context,next,config,arg,eventList,eventName){
  console.log('RegisterFn')
  return 'returnVal'
}
function registerFnThunk(RegisterFn,callback){
  let context =1,config=2,arg=3,eventList=4,eventName=5;
  let isRunNext = false;
  let next = function(){
    isRunNext = true;
  }
  let getData = RegisterFn(context,next,config,arg,eventList,eventName);
  console.log('getData',getData)
  callback(null,getData,555555)
  console.log(8888888888)
  return 333333;
}

// let getThunk = thunkify(registerFnThunk)
// let getVal =  getThunk(RegisterFn)((err, data,isRunNext)=>{
//   console.log(err,data,isRunNext)
//   return 'callback'
// })
// console.log(00000000000,getVal)

console.log('---------------')

// console.log(344545454543,registerFnThunk(RegisterFn,(err, data,isRunNext)=>{
//   console.log(err,data,isRunNext)
// }))
