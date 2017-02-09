var express = require('express');
var http = require('http');
var fs = require('fs');
var path = require('path');
var Player = require('./player.js');
Player = Player.Player;
console.log(Player);

var players = {};

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
    // console.log("New player has connected: "+socket.id);
    socket.on("disconnect", onClientDisconnect);
    // socket.on("new player", onNewPlayer);
    // socket.on("move player", function(){console.log('clicked on cliend');});
    socket.on("move player", onMovePlayer);
    // console.log(socket.id);

    // players[totalConnection] = players.id;

    // socket.broadcast.emit('totalPlayers', {players: players.length});
    // socket.emit('totalPlayers', {players: players.length});

    // socket.on('disconnect', function(){
    //     players.splice(players.indexOf(socket.id), 1);
    //     --totalConnection;
    //     socket.broadcast.emit('totalPlayers', {players: totalConnection});
    //     console.log('socket disconnected');
    // });

    // socket.on('clicked', function(data){
    //     console.log('received the clicked event: ' + data.row, data.column);
    //     socket.broadcast.emit('emittedClick', data);
    //     console.log('brodcasted click event');
    // });
    // console.log(++totalConnection + 'player connected');
    createNewPlayer(socket);
};
function onMovePlayer(data){
    players[this.id].setSelection(data.row, data.column);

    Object.keys(players).forEach(function(id, index){
        players[id].setSelection(data.row, data.column);
    }.bind(this));    
    this.broadcast.emit('sync move player', {row: data.row, column: data.column, id: this.id});
    console.log('clicked by: ' + this.id + ', at location: ' + data.row, data.column);
};
function onClientDisconnect() {
    this.broadcast.emit("remove player", {id: this.id});
    console.log("Player has disconnected: "+this.id);
    delete players[this.id];
};
function createNewPlayer(data) {
    var self = data;
    var symbol = 'O';
    if(Object.keys(players).length === 1){
        if(players[Object.keys(players)[0]].symbol === 'O'){
            symbol = 'X';
        }
    }
    var newPlayer = new Player();
    newPlayer.id = self.id;
    newPlayer.symbol = symbol;
    self.emit("my id", {id: newPlayer.id, symbol: symbol});
    self.broadcast.emit("new player", {id: newPlayer.id, symbol: newPlayer.symbol});
    Object.keys(players).forEach(function(id, index){
        self.emit("remote players", {id: id, symbol: players[id].symbol});
    }.bind(self));

    players[self.id] = newPlayer;
    console.log('new Player connected: ' + self.id + ', total Players: ' + Object.keys(players).length);
};
















