var http = require('http')
var url = require('url')

var handler = require('./handler.js')
var weixin = require('./weixin.js')

handler.container = {
    "/weixin": weixin.search
};

var server = http.createServer(function (request, response){
    
    console.log(request.url)

    handler.handle(request, response);
});

server.listen(8080);

console.log('Started\n The server is listening on 8080');

