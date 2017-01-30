var http = require('http');
var path = require('path');
var fs = require('fs');
var static = require('node-static');

var fileServer = new static.Server('./');

var server = http.createServer(function (request, response) {
    console.log('request starting...' + request.url);

    var filePath = '.' + request.url;
    if (filePath == './')
        filePath = './index.html';

    var extname = path.extname(filePath);
    var contentType = 'text/html';
    switch (extname) {
        case '.js':
            contentType = 'text/javascript';
            break;
        case '.css':
            contentType = 'text/css';
            break;
        case '.json':
            contentType = 'application/json';
            break;
        case '.png':
            contentType = 'image/png';
            break;      
        case '.jpg':
            contentType = 'image/jpg';
            break;
        case '.wav':
            contentType = 'audio/wav';
            break;
    }

    fs.readFile(filePath, function(error, content) {
        if (error) {
            if(error.code == 'ENOENT'){
                fs.readFile('./404.html', function(error, content) {
                    response.writeHead(200, { 'Content-Type': contentType });
                    response.end(content, 'utf-8');
                });
            }
            else {
                response.writeHead(500);
                response.end('Sorry, check with the site admin for error: '+error.code+' ..\n');
                response.end(); 
            }
        }
        else {
            response.writeHead(200, { 'Content-Type': contentType });
            response.end(content, 'utf-8');
        }
    });

}).listen(8081);

var io = require('socket.io').listen(server);

console.log('server is running at 8081 port');




// var app = require('http').createServer(handler),
// 	io = require('socket.io').listen(app),
// 	static = require('node-static'); // for serving files

// var fileServer = new static.Server('./');
	
// // This is the port for our web server.
// // you will need to go to http://localhost:8080 to see it
// app.listen(8080);

// // If the URL of the socket server is opened in a browser
// function handler (request, response) {

// 	request.addListener('end', function () {
//         fileServer.serve(request, response);
//     });
// }

// // Delete this row if you want to see debug messages
// io.set('log level', 1);

// Listen for incoming connections from clients
var counter = 0;
io.sockets.on('connection', function (socket) {
	console.log('client connected: ' + counter);
	// Start listening for mouse move events
	socket.on('mousemove', function (data) {
		console.log('recieving mousemove: ', data);
		
		// This line sends the event (broadcasts it)
		// to everyone except the originating client.
		socket.broadcast.emit('moving', data);
	});
});