const express = require('express')
const bodyParser = require('body-parser')
const querystring = require('querystring');
const qs = require('qs');

const app = express()
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({
    extended: true
}))

let target1 = {
  prop1: {
    name: 'target1'
  }
}

let target2 = {
    name: 'target2'
}
let target3 = [1,2 , 3, 4]
console.log(querystring.stringify(target1), querystring.stringify(target2), querystring.stringify(target3))
console.log(qs.stringify(target1), qs.stringify(target2), qs.stringify(target3))

app.post('/users', (req, res, next) => {
    const {userIds} = req.body
    console.log(req.body);
    res.json(userIds)
})
app.on('error', err => {
    console.log(err);
})

app.listen('4001')