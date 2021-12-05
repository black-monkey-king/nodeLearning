const express = require('express');
const router = express.Router();

router.get('/love',(req,res)=>{
  console.log(req.url)
  res.send('hello/love')
})

router.get('/price',(req,res)=>{
  console.log(req.url);
  res.status(201).json({msg:'这是一个json'})
})
module.exports = router;