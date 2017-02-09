var localPlayer;
var remotePlayers = {};
var url = 'http://localhost:8081';
var socket = io.connect(url);
var canPlay = false;

function setEventHandlers(){
    socket.on("disconnect", onSocketDisconnect);
    socket.on("new player", onNewPlayer);
    socket.on("sync move player", onSyncMovePlayer);
    socket.on("remove player", onRemovePlayer);
    socket.on("remote players", onRemotePlayers);
    socket.on("my id", onMyId);
    addGameEvents();
};
setEventHandlers();

function onSocketDisconnect() {
    console.log("Disconnected from socket server");
};
function onMyId(data){
    console.log("got my Id from server: "+data.id);
    var newPlayer = new Player();
    newPlayer.id = data.id;
    newPlayer.symbol = data.symbol;
    localPlayer = newPlayer;
    document.getElementById('playerCount').innerHTML = '1 Connected: Waiting for Another Player';
}
function onNewPlayer(data) {
    console.log("Other New player connected: " + data.id);
    var newPlayer = new Player();
    newPlayer.id = data.id;
    newPlayer.symbol = data.symbol;
    remotePlayers[data.id] = newPlayer;
    document.getElementById('playerCount').innerHTML = 'Game Connected: Your Turn';
    enableGame();
};
function onRemotePlayers(data){
    console.log("remote Players: " + data.id);
    var newPlayer = new Player();
    newPlayer.id = data.id;
    newPlayer.symbol = data.symbol;
    remotePlayers[data.id] = newPlayer;
    document.getElementById('playerCount').innerHTML = 'Game Connected: Wait For Your Turn';
    // remotePlayers.push(newPlayer);
}
function onSyncMovePlayer(data) {
    document.getElementById('child' + data.row + data.column).innerHTML = remotePlayers[data.id].symbol;
    localPlayer.setSelection(data.row, data.column, remotePlayers[data.id].symbol);
    remotePlayers[data.id].setSelection(data.row, data.column, remotePlayers[data.id].symbol)
    enableGame();
    console.log('Player move: ' + data.row, data.column, remotePlayers[data.id].symbol);
    document.getElementById('playerCount').innerHTML = 'Game Connected: Your Turn: ' + localPlayer.symbol;
};
function onRemovePlayer(data) {
    console.log('Remove Player: ' + data.id);
    delete remotePlayers[data.id];
};

function addGameEvents(){
    for(var i = 0; i <= 2; i++){
        for(var j = 0; j <= 2; j++){
            var elem = document.getElementById('child' + i + j);
            elem.addEventListener('click', function(i, j){
                if(!canPlay){return;};
                if(!localPlayer.isClickable(i, j)){
                    return;
                }
                document.getElementById('child' + i + j).innerHTML = localPlayer.symbol;
                socket.emit('move player', {
                    row: i,
                    column: j
                });
                console.log('clicked child' + i + j);
                localPlayer.setSelection(i, j);
                remotePlayers[Object.keys(remotePlayers)[0]].setSelection(i, j, localPlayer.symbol);
                document.getElementById('playerCount').innerHTML = 'Game Connected: Wait For Your Turn: ' + localPlayer.symbol;
                disableGame();
            }.bind(this, i, j));
        }
    }
};

function enableGame(){
    canPlay = true;
    document.getElementById('parent').className = '';
}

function disableGame(){
    canPlay = false;
    document.getElementById('parent').className = 'disabled';
}