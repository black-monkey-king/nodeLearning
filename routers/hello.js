const express = require('express');
const router = express.Router();

router.get('/',(req,res)=>{
  console.log(req.url)
  res.send('这里只匹配上一级路径')
})

router.get('/world',(req,res)=>{
  console.log(req.url)
  res.send('hello/world')
})

router.get('/cc',(req,res)=>{
  console.log(req.url);
  res.send('hello/cc')
})
router.use('*', (req, res) => {
  res.status(404).send('router.use使用中间件404');
});
module.exports = router;