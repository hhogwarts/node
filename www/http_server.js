var http = require("http");
var request = require("request");

var requestData = "";
request("http://www.google.com", function(error, response, body){
    requestData = body;
});

var server = http.createServer(function(request, response){
  response.writeHead(200, {
    "content-type": "text/plain"
  });
  response.end(requestData);
});

server.listen(8888);
