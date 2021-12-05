// fs模块：
const fs = require('fs')
// 按照字符的方式读写文件(返回的直接是字符串)
/* // 1.读取文件
  // 异步  回调处理
  console.log('异步读取文件')
  console.time()
  fs.readFile('./test.txt','utf8',(err,data)=>{
    if(err){
      console.log(err)
    } else {
      console.log(data)
      console.log('异步读取文件结束')
      console.timeEnd()
    }
  })
  
  // 同步读取文件
  const getVal = fs.readFileSync('./test.txt','utf8')
  console.log(getVal)
  console.log('同步读取文件')
  // 通过读取流的形式
  // stream 是一种抽象接口,所有的stream都是eventEmitter的实例
  const txtStream = fs.createReadStream('./test.txt','utf8')
  txtStream.on('data',(data)=>{
    console.log(data)
    console.log('通过stream读取文件结束')
  }) */

/* // 2.写入（创建新文件夹）/修改文件/追加写入
  // 写入文件时,如果文件不存在,则会创建并写入,如果文件存在,会覆盖文件内容.
  // 异步写入
  fs.writeFile('./write.txt', 'Hello Nodejs0', 'utf8', err => {
    if (err) throw err
  })
  const ws = fs.createWriteStream('./write.txt', 'utf8')
  ws.write('Hello Nodejs2')
  ws.end() 
  // 同步执行要优先写文件，然后再执行异步(同进程不可能同时操作同一个文件，对进程要考虑  文件锁？)
  fs.writeFileSync('./write.txt', 'Hello Nodejs1')
  // 同步写入
  fs.writeFileSync('./writeSync.txt1', 'Hello Nodejs')
  // 文件流写入
  const ws = fs.createWriteStream('./writeStream.txt2', 'utf8')
  ws.write('Hello Nodejs')
  ws.end() */

/* //2.2 文件的追加修改
  // 写入文件时,如果文件不存在,则会创建并写入,如果文件存在,不会覆盖原有文件内容，只会追加文件内容.
  //  * 参数1: 要追加写入的文件的路径 * 参数2: 要写入的字符串* 参数3: 字符集，默认是utf-8 * 参数4: 写入完成后触发的回调函数，有一个参数 err
  fs.appendFile('./write.txt', ' 这是appenFile追加的内容---我是亚索', (err) => {
    if (err) {
        console.log(err);
    }
  }) */
  
  
// 3.删除文件/文件夹 (删除的文件 回收箱不可见) (删除文件的时候必须为空文件夹)
  // 1. 删除文件的时候可以考虑深层遍历文件夹删除文件后删除文件夹  npm install mkdirsp  
  // 2. // rimraf 的作用：以包的形式包装rm -rf命令，用来删除文件和文件夹的，不管文件夹是否为空，都可删除；
  // 同步删除文件 文件夹 异步删除文件  文件夹
  // fs.unlink('./deletTest.txt',err=>{ console.log(err)})
  // fs.rmdir('./deleteFile',err=>{console.log(err)})
  // fs.unlinkSync('./deleteTest.txt')
  // fs.rmdirSync('./deleteFile')

/*   // 递归删除多层文件夹
  function deleteFolderRecursive(path) {
    if( fs.existsSync(path) ) {
        fs.readdirSync(path).forEach(function(file) {
            var curPath = path + "/" + file;
            if(fs.statSync(curPath).isDirectory()) { // recurse
                deleteFolderRecursive(curPath);
            } else { // delete file
                fs.unlinkSync(curPath);
            }
        });
        fs.rmdirSync(path);
    }
};
deleteFolderRecursive('./deleteFile') */

// 3.1 遍历文件目录 (返回该目录下的所有文件和文件夹,不会自动深层递归)
  /* fs.readdir('./deleteFile',(err,files)=>{
    console.log(files)
  })
  const fileList = fs.readdirSync('./deleteFile')
  console.log(fileList) */

// 3.2 返回当前文件夹状态信息  (文件的储存和读取方式会有不同 硬连接  软连接？？？)
/*   fs.stat('./deleteFile',(err,status)=>{
    console.log(status)
    console.log(status.isDirectory())
  })
  const status = fs.statSync('./deleteFile') */

// 4.创建文件夹
  // fs.mkdir('file',(err)=>{
  //   if(err){ console.log(err) }
  // })
  // const status = fs.mkdirSync('files')

// 5.重命名文件/文件夹 (可以修改文件的类型)
/*   fs.rename('read.js','read-change.js',(err)=>{
    if(err) console.log(err);
  })
  fs.renameSync('read-change.js','read.xml') */

// 6.复制文件/文件夹 (复制可以修改文件类型，不可复制到不存的文件夹中)
 /*  fs.copyFile('./read.html','../read-copy.txt',(err,copyFile)=>{
    if(err) console.log(err);
    console.log(copyFile)
  })
  fs.copyFileSync('./read.html','../read-copy.txt') */


// 按照字节方式读取文件,读取出来的数据直接写入buffer中
// fs.read方式读取文件，只能在fs.open中执行
  // fs.read(fd, buffer, offset, length, position, callback) 读取文件可偏移  写入buffer可偏移  buffer本身可偏移截取
  // fd - 通过 fs.open() 方法返回的文件描述符。
  // buffer - 数据写入的缓冲区。
  // offset - 缓冲区写入的写入偏移量。
  // length - 要从文件中读取的字节数。
  // position - 文件读取的起始位置，如果 position 的值为 null，则会从当前文件指针的位置读取。
  // callback - 回调函数，有三个参数err, bytesRead, buffer，err 为错误信息， bytesRead 表示读取的字节数，buffer 为缓冲区对象。

/* var buf = new Buffer.alloc(1024);
fs.open('write.txt', 'r+', function(err, fd) {
   if (err) {
       return console.error(err);
   }
   console.log("准备读取文件：");
   fs.read(fd, buf, 0, buf.length, 0, function(err, bytes){ // bytes 为被写入的buffer的字节数
      if (err){
         console.log(err);
      }
      console.log(bytes + "  字节被读取");
      // 仅输出读取的字节
      if(bytes > 0){
        // buffer中数据要tostrig使用，当buf所取的长度于对应字符的所存储的长度不匹配tostring时会乱码
         console.log(buf.slice(6, bytes).toString());
      }
      // 关闭文件
      fs.close(fd, function(err){
         if (err){
            console.log(err);
         } 
         console.log("文件关闭成功");
      });
   });
}); */

/* // fs.ftruncate(fd, sliceLength, callback) // 截取文件内容会修改原文件内容
var buf = new Buffer.alloc(1024);
fs.open('write.txt', 'r+', function(err, fd) {
   if (err) {
       return console.error(err);
   }
   console.log("截取10字节内的文件内容，超出部分将被去除。");
   // 截取文件   第一个参数：fd fs.open打开的标识符  截取的截止位置
   fs.ftruncate(fd, 10, function(err){
      if (err){
         console.log(err);
      } 
      console.log("文件截取成功。");
      fs.read(fd, buf, 0, buf.length, 0, function(err, bytes){
         if (err){
            console.log(err);
         }
         // 仅输出读取的字节
         if(bytes > 0){
            console.log(buf.slice(0, bytes).toString());
         }
         fs.close(fd, function(err){
            if (err){ console.log(err); } 
         });
      });
   });
}); */
