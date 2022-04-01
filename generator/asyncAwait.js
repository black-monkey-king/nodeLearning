function a (ctx,next,arg,evnetList,iname){
  console.log('fun--a')
  let getPromise = new Promise((resolve,reject)=>{
    console.log(4444444)
    setTimeout(()=>{
      console.log('funAPromise....setTimeout1')
      resolve('aaaaa-promise')
    },10000)
  })
  next()
  // return 'aaaa';
  return getPromise;
}

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

  // function registerFnThunk(RegisterFn,callback){
async  function registerFnThunk(RegisterFn,callback){
  let context =1,config=2,arg=3,eventList=4,eventName=5;
  let isRunNext = false;
  let next = function(){
    isRunNext = true;
  }
  // let getData =  RegisterFn(context,next,config,arg,eventList,eventName);
  let getData = await RegisterFn(context,next,config,arg,eventList,eventName);
  console.log('getData',getData,isRunNext)
  callback(null, getData, isRunNext);
  console.log('end.......')
  return getData;
}

let thunkFn = thunkify(registerFnThunk)
let getVal = thunkFn(a)((err,data,isFloag)=>
  console.log(11111,err,data,isFloag)
)
console.log(22222,getVal)
console.log('1111111111111111')

async function jj(){
  
}