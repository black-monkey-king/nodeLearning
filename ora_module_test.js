// oraM 命令行添加动画效果
const oraM = require('ora');
console.log(111)
const spinner = oraM('Loading user').start();

spinner.start()

setTimeout(() => {
  spinner.color = 'green';
  spinner.text = 'loading text'
  spinner.stop()

}, 1000);
