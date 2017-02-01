var express = require('express');
var http = require('http');
var fs = require('fs');
var path = require('path');

var server = http.createServer(function(request, response){
    console.log('request starting');

    var filePath = '.' + request.url;
    if(filePath == './'){
        filePath = './index.html';
    }

    var extName = path.extname(filePath);
    var contentType = 'text/html';
    switch(extName){
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

    fs.readFile(filePath, function(error, content){
        if(error){

        }else{
            response.writeHead(200, {'Content-Type': contentType});
            response.end(content, 'utf-8');
        }
    });

});
console.log('server is running in 8081');
var io = require('socket.io').listen(server);

server.listen(8081);
var totalConnection = 0;
io.sockets.on('connection', onSocketConnection);

function onSocketConnection(socket){
    console.log(socket.id);

    socket.on('disconnect', function(){
        --totalConnection;
        console.log('socket disconnected');
    });

    socket.on('clicked', function(data){
        console.log('received the clicked event: ' + data.row, data.column);
        socket.broadcast.emit('emittedClick', data);
        console.log('brodcasted click event');
    });
    console.log(++totalConnection + 'player connected');
}

















