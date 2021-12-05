var co = require('co')
// function * a(){
//   console.log('第1个中间件before 1')
//   yield *b()
//   console.log('第1个中间件after 2')
// }
// function * b(){
//   console.log('  业务逻辑处理')
// }
// co(function* () {
//   yield *a()
// })


// var co = require('co')
// function * a(){
//   console.log('第1个中间件before 1')
//   yield *b()
//   console.log('第1个中间件after 2')
// }
// function * b(){
//   console.log('  第2个中间件before 3')
//   yield *c()
//   console.log('  第2个中间件after 4')
// }
// function * c(){
//   console.log('    业务逻辑处理')
// }
// co(function* () {
//   yield *a()
// })


// 数组的写法
co(function* () {
  var res = yield [
    Promise.resolve(1),
    Promise.resolve(2)
  ];
  console.log(res);
}).catch();

// 对象的写法
co(function* () {
  var res = yield {
    1: Promise.resolve(1),
    2: Promise.resolve(2),
  };
  console.log(res);
}).catch();