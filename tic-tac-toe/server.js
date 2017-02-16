var express = require('express');
var http = require('http');
var fs = require('fs');
var path = require('path');
var Player = require('./player.js');
Player = Player.Player;

var maxPlayerPerGame = 2;
var players = {};
var games = {};
// games = {
//     'game1': {
//         'isGameOpen': true,
//         'players': {
//             'player1': {},
//             'player2': {}
//         }
//     }
// }

var server = http.createServer(function(request, response){
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
io.sockets.on('connection', onSocketConnection);

function onSocketConnection(socket){
    var isExistingGameAvailable = checkForExistingGame();
    // console.log('if Existing game is there: ' + isExistingGameAvailable);
    if(!isExistingGameAvailable){
        createGame(socket);
    }else{
        console.log('adding player in Existing game: ' + isExistingGameAvailable);
        createNewPlayer(socket, isExistingGameAvailable);
    }
    socket.on("disconnect", onClientDisconnect);
    socket.on("move player", onMovePlayer);
    // createNewPlayer(socket);
};;
function createGame(socket){
    var gameId = parseInt(Math.random()*100000).toString();
    games[gameId] = new Object();
    games[gameId].isGameOpen = true;
    games[gameId].players = {};
    console.log('creating new game with id: ' + gameId);
    createNewPlayer(socket, gameId);
};
function checkForExistingGame(){
    var openGameId = 0;
    if(Object.keys(games).length === 0){
        return false;
    }else{
        Object.keys(games).forEach(function(gameId, index){
            if(games[gameId].isGameOpen){
                openGameId = gameId;
            }
        });
        if(openGameId === 0){
            return false;
        }else{
            return openGameId;
        }
    }
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
function createNewPlayer(data, gameId) {
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
    self.emit("my id", {id: newPlayer.id, symbol: symbol, gameId: gameId});
    //broadcast only with current game id
    self.broadcast.emit("new player", {id: newPlayer.id, symbol: newPlayer.symbol, gameId: gameId});
    //send all remote players of current game
    Object.keys(games[gameId].players).forEach(function(id, index){
        self.emit("remote players", {id: id, symbol: games[gameId].players[id].symbol});
    }.bind(self));


    games[gameId].players[self.id] = newPlayer;
    if(Object.keys(games[gameId].players).length === maxPlayerPerGame){
        games[gameId].isGameOpen = false;
    }
    
    console.log('new Player connected: ' + self.id + ', in gameId: ' + gameId + ', isGameOpen: ' + games[gameId].isGameOpen + ', players: ' + Object.keys(games[gameId].players).length);
};
















