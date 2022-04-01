import { EventCenterMapItem, EventCenterUserSelect } from '.';
import UserConfig from '../../config';
import { FunctionCenterFunction } from '../functionCenter';

export interface EventListType { 
  arr: Array<EventCenterMapItem>;
  displayName: string;
  userSelect: Array<EventCenterUserSelect>;
}
export interface EventFnArgsInter {
  args: Record<string, any>;
  // eventMapItem
	eventList: EventListType;
	eventFnArr: EventCenterMapItem;
}
export interface RegisterFnArgsInter extends EventFnArgsInter {
	context: Record<string, any>;
	next:()=> any;
	config:UserConfig;
}
export interface RegisterFnInter {
}

export class EventQuene {
  // 事件名称
  eventName:string;
  // 事件上配置的函数链
  eventFunMap:  Array<FunctionCenterFunction>;
  eventFunArgsMap:Array<EventFnArgsInter>;
  // 上下文
  context: Record<string, any>;
  // dooringx全局config
  config:UserConfig;
	constructor(eventName:string, funMap:Array<FunctionCenterFunction>,funArgsMap:Array<EventFnArgsInter>, config: UserConfig, context:Record<string, any> = {}) {
		this.eventName = eventName;
    this.eventFunMap = funMap;
    this.eventFunArgsMap = funArgsMap;
		this.context = context;
		this.config = config;
  }
  thunkify(fn){
    return function(){
      var args = new Array(arguments.length);
      var ctx = this;
      for(var i = 0; i < args.length; ++i) {
        args[i] = arguments[i];
      }
      return function(done){
        var called:boolean;
        args.push(function(){  
          if (called) return; 
          called = true; 
          done.apply(null, arguments); 
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
	registerFnThunk(RegisterFn:any,context:any,config:any,args:any,eventList:any,eventFnArr:any,callback:any){
		let isRunNext = false;
		let next = function(){
			isRunNext = true;
    }
    let getData = RegisterFn(context,next,config,args,eventList,eventFnArr);
    console.log('getData',getData,isRunNext)
    callback(null,getData,isRunNext);
    return getData;
	}
	*eventFunGenerator ( ) {
    let list = this.eventFunMap; 
		for(var i = 0; i<this.eventFunMap.length; i++) {
			let registerThunk:any = this.thunkify(this.registerFnThunk);
      let registerFn = list[i];
		  yield registerThunk(registerFn,this.context,this.config,this.eventFunArgsMap[i]['args'],this.config,this.eventFunArgsMap[i]['eventList'],this.config,this.eventFunArgsMap[i]['eventFnArr']);
		}
  }
  runGenerator(){
    return new Promise((resolve)=>{
      let GenEndVal;
      var gen = this.eventFunGenerator();
	    function next(err:any, data:any, nextFlog:boolean | undefined ) {
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
      let aa = next(null,1111,true);
      console.log('jjjjjjj',aa,GenEndVal)
      resolve(GenEndVal)
    })
  }
	getEventFunMap() { 	
    console.log('ccccccccccccc',this.eventFunMap)
  }
}
