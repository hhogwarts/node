var url = 'http://localhost:8081';
var socket = io.connect(url);

socket.on('emittedClick', function(data){
    console.log('received click on ' + data.row, data.column);
});

var id = Math.round($.now()*Math.random());

// alert(document.getElementById('parent'));
var Game = function(){
    this.selectionMatrix = [];
    this.symbol = 'zero';

    this.addEvents();
}

Game.prototype.currentTurn = 'player1';

Game.prototype.setSymbol = function(symbol){
    this.symbol = symbol;
}

Game.prototype.startGame = function(){
    for(var i = 0; i <= 2; i++){
        var temp = [];
        for(var j = 0; j <= 2; j++){
            temp[j] = 0;
        }
        this.selectionMatrix.push(temp);
    }    
}

Game.prototype.addEvents = function(){
    for(var i = 0; i <= 2; i++){
        for(var j = 0; j <= 2; j++){
            var elem = document.getElementById('child' + i + j);
            elem.addEventListener('click', function(i, j){
                if(this.currentTurn === 'player1'){
                    this.currentTurn = 'player2';
                }else if(this.currentTurn === 'player2'){
                    this.currentTurn = 'player1';
                }
                console.log(this.currentTurn);
                socket.emit('clicked', {
                    row: i,
                    column: j
                });
                console.log('clicked child' + i + j);
            }.bind(this, i, j));
        }
    }
}

var player1 = new Game();
player1.startGame();
