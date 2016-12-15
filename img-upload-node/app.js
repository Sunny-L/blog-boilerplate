const http = require('http'),
  express = require('express'),
  path = require('path'),
  router = express.Router()

var app = express()

router.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'index.html'))
})


router.post('/upload', (req, res) => {
  setTimeout(() => {
    res.json({code: 0, info: 'success'})
  }, 2000);
})

app.use(router)



var server = http.createServer(app)



server.listen('3002')
