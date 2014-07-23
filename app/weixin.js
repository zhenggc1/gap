var url = require('url')

function search(request, response){
    var keyword = url.parse(request.url, true).query.keyword;
    searchKeyWord(keyword, response);
}

function searchKeyWord(keyword, response){
    response.write("You are searching " + keyword);
    response.end();
}

exports.search = search;
