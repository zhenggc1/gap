var url = require('url')

var container;

var handle = function (request, response) {

    handler = this.container[url.parse(request.url).pathname];
    if(handler == null){
        console.log("invalid request: " + request.url);
        response.writeHead(404, {});
        response.end();
        return
    }

    handler(request, response);
};

exports.handle = handle;
exports.container = container;
