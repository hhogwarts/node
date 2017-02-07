var localPlayer;
var remotePlayers = [];
var url = 'http://localhost:8081';
var socket = io.connect(url);

function setEventHandlers(){
    socket.on("connect", onSocketConnected);
    socket.on("disconnect", onSocketDisconnect);
    socket.on("new player", onNewPlayer);
    socket.on("move player", onMovePlayer);
    socket.on("remove player", onRemovePlayer);
    addGameEvents();
};
function onSocketConnected() {
    socket.emit("new player");
    console.log("Connected to socket server");
};
function onSocketDisconnect() {
    console.log("Disconnected from socket server");
};
function onNewPlayer(data) {
    console.log("New player connected: "+data.id);
    var newPlayer = new Player();
    newPlayer.id = data.id;
    remotePlayers.push(newPlayer);
};
function onMovePlayer(data) {
    console.log('Player move');
};
function onRemovePlayer(data) {
    console.log('Remove Player');
};

function addGameEvents(){
    for(var i = 0; i <= 2; i++){
        for(var j = 0; j <= 2; j++){
            var elem = document.getElementById('child' + i + j);
            elem.addEventListener('click', function(i, j){
                
                document.getElementById('child' + i + j).innerHTML = gameSymbol;

                socket.emit('clicked', {
                    row: i,
                    column: j
                });
                console.log('clicked child' + i + j);
            }.bind(this, i, j));
        }
    }
}