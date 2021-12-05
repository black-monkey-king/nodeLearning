const path = require('path');
const cModule = require('../require.js')

// console.log(cModule)
/* // 当前文件执行时，返回当前文件所在目录所在的绝对路径
console.log(__dirname)
// 当前文件执行时，返回当前文件执行的绝对路径
console.log(__filename)

// 输入字符串  不会解析路径 单纯的返回/分割后前面的字符串
console.log(path.dirname(__dirname +'../index.html'))
console.log(path.dirname(__dirname +'././index.html'))

// 输入字符串  不会解析路径 单纯的返回最后面 .文件格式
console.log(3333,path.extname('./index.html'))
console.log(4444,path.extname('./idnex.js.html'))
console.log(5555,path.extname('.a./idnex.js.html'))

// 返回当前执行文件 文件名称index.html
console.log(path.basename(__dirname + '/index.html'))

// 输入字符串  不会解析路径 单纯的判断第一个字符是否为/
console.log(path.isAbsolute('.aa/index.js'))
console.log(path.isAbsolute('./.aa/index.js'))
console.log(path.isAbsolute('/./aa/index.js'))
console.log(path.isAbsolute(' /./aa/index.js')) */

/* // 解析路径 支持绝对路径和相对路径
// {
//   root: '', 更路径
//   dir: '../cc/aa',  // dirname
//   base: 'index.html',
//   ext: '.html',
//   name: 'index'
// }
console.log(path.parse('cc/aa/index.html'))
console.log(path.parse('./cc/aa/index.html'))
console.log(path.parse('../cc/aa/index.html'))
console.log(path.parse(__dirname + '/index.html'))

// 序列化路径
const pathname = path.format({
  root: '/',
  dir: '/path/example',
  base: 'index.js',
  ext: '.js',
  name: 'index'
}) 
console.log(pathname)

// 获取 from 到 to 的相对路径
const getRelative1 = path.relative('/path/example/index.js', '/path')
console.log(getRelative1)
const getRelative = path.relative( '/path', '/path/example/index.js')
console.log(getRelative) */


// 将路径或路径片段的序列解析为相对路径。
console.log(path.join('aa/cc','.a/'))
// 解析代码片段时  /不会被视为根路径
console.log(path.join('../../cc','/eee'))
// 解析过程中也会解析 ../ ./
console.log(path.join('../../cc','/eee','../','jj'))
console.log(path.join('../../cc','/eee','../fff','jj'))
// 注意这种情况 ../不会被解析？？？？？？？？？
console.log(1111111,path.join(__dirname  '../template'))
console.log(222222,'/aaaa/bbbb/'+'../eee')
console.log(path.join('../../cc','/eee','./'))


// 将路径或路径片段的序列解析为绝对路径。 (返回的是绝对路径，解析片段的过程'/'会直接作为根路径，开头片段默认__dirname + )
console.log(path.resolve('a','b','c'))
// 路径解析过程 ../ 同  .. , . 同 ./
console.log(path.resolve('..','a'))
console.log(path.resolve('.','a'))
console.log(path.resolve('../','a'))
console.log(path.resolve('./','a'))
// 解析路径片段过程中 ，注意字段末尾的/
console.log(path.resolve('.a/','..c'))
console.log(path.resolve('.a//cc/d/','..c'))
console.log(1111111,path.resolve(__dirname + '../template'))
