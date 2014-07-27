var express = require('express')

var weixin = require('./weixin.js')
var email = require('./email.js')


var app = express();

weixin.watchWeixin(app);

app.get('/email', email.touch);

app.listen(80);

console.log('Started\n The server is listening on 80');

