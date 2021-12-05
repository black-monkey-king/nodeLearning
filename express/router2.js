var express = require('express')
var app = express()
var router = express.Router()

// a middleware function with no mount path. This code is executed for every request to the router
router.use(function (req, res, next) {
  console.log('Time:', Date.now())
  next()
})

// a middleware sub-stack shows request info for any type of HTTP request to the /user/:id path
router.use('/user/:id', function (req, res, next) {
  console.log('Request URL:', req.originalUrl)
  next()
}, function (req, res, next) {
  console.log('Request Type:', req.method)
  // 多次res.send会报错：Cannot set headers after they are sent to the client
  res.send('router.use')
  next()
})

// a middleware sub-stack that handles GET requests to the /user/:id path
router.get('/user/:id', function (req, res, next) {
  // if the user ID is 0, skip to the next router
  if (req.params.id === '0') next('route')
  // otherwise pass control to the next middleware function in this stack
  else next()
}, function (req, res, next) {
  // render a regular page
  res.send('regular')
})

// handler for the /user/:id path, which renders a special page
router.get('/user/:id', function (req, res, next) {
  console.log(req.params.id)
  res.send('special')
})

// mount the router on the app
app.use('/', router)


function logOriginalUrl (req, res, next) {
  console.log('middleware1')
  next()
}
function logMethod (req, res, next) {
  console.log('middleware2')
  next()
}
app.get('/middleware', [logOriginalUrl,logMethod], function (req, res, next) {
  res.send('User Info')
})

const server = app.listen(8000,(err)=>{
  var host = server.address().address
  var port = server.address().port
  console.log("应用实例，访问地址为 http://%s:%s", host, port)
})