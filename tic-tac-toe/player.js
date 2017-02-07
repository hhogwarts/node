var Player = function(){
    var id = '';
    var selectionMatrix = [[0, 0, 0], [0, 0, 0], [0, 0, 0]];
    var winType = '';   //row0, row1, row2, column0, column1, column2, diagonal0(00 -> 22), diagonal1(02 -> 20)

    var setSelection = function(row, column){
        selectionMatrix[row][column] = 1;
    };
    var resetMatrix = function(){
        selectionMatrix = [[0, 0, 0], [0, 0, 0], [0, 0, 0]];
    };
    var hasWon = function(){
        if(selectionMatrix[0][0] && selectionMatrix[1][1] && selectionMatrix[2][2]){
            return 'diagonal0';
        }else if(selectionMatrix[2][0] && selectionMatrix[1][1] && selectionMatrix[0][2]){
            return 'diagonal1';
        }
        var count = 0;
        for(var i = 0; i <= 2; i++){
            count = 0;
            for (var j = 0; j <= 2; j++){
                if(selectionMatrix[i][j]){
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
                if(selectionMatrix[i][j]){
                    count++
                }
            }
            if(count === 3){
                return 'column'+j;
            }
        }
        return false;
    };

    return {
        setSelection: setSelection,
        resetMatrix: resetMatrix,
        hasWon: hasWon,
        id: id
    }

}