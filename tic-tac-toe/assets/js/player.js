var Player = function(){
    var id = '';
    var selectionMatrix = [[0, 0, 0], [0, 0, 0], [0, 0, 0]];
    var winType = '';   //row0, row1, row2, column0, column1, column2, diagonal0(00 -> 22), diagonal1(02 -> 20)
    var symbol = '';
    var totalClicks = 0;
    var gameId = 0;

    var setSelection = function(row, column, sym){
        if(sym === undefined){
            sym = this.symbol
        }
        selectionMatrix[row][column] = sym;
    };
    var resetMatrix = function(){
        selectionMatrix = [[0, 0, 0], [0, 0, 0], [0, 0, 0]];
    };
    var isClickable = function(i, j){
        if(selectionMatrix[i][j]){
            return false;
        }
        return true;
    };
    var hasWon = function(){
        if((selectionMatrix[0][0] == this.symbol) && (selectionMatrix[1][1] == this.symbol) && (selectionMatrix[2][2] == this.symbol)){
            return 'diagonal0';
        }else if((selectionMatrix[2][0] == this.symbol) && (selectionMatrix[1][1] == this.symbol) && (selectionMatrix[0][2] == this.symbol)){
            return 'diagonal1';
        }
        var count = 0;
        for(var i = 0; i <= 2; i++){
            count = 0;
            for (var j = 0; j <= 2; j++){
                if(selectionMatrix[i][j] == this.symbol){
                    count++
                }
            }
            if(count === 3){
                return 'row'+i;
            }
        }
        for(var j = 0; j <= 2; j++){
            count = 0;
            for (var i = 0; i <= 2; i++){
                if(selectionMatrix[i][j] == this.symbol){
                    count++
                }
            }
            if(count === 3){
                return 'column'+j;
            }
        }
        return false;
    };
    var getMatrix = function(){
        return selectionMatrix;
    };

    return {
        setSelection: setSelection,
        resetMatrix: resetMatrix,
        hasWon: hasWon,
        id: id,
        symbol: symbol,
        isClickable: isClickable,
        getMatrix: getMatrix,
        clicks: totalClicks,
        gameId: gameId
    };
};