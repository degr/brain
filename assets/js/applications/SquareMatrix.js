Engine.define("SquareMatrix", ['Dom', 'MatrixApp'], function(){
    var Dom = Engine.require('Dom');
    var MatrixApp = Engine.require('MatrixApp');
    var SquareMatrix = function() {
        MatrixApp.apply(this, arguments);
    };

    SquareMatrix.prototype = Object.create(MatrixApp.prototype);
    SquareMatrix.URL = 'square-matrix';
    
    SquareMatrix.prototype.createMatrix = function() {
        var max = this.width * this.height;
        var matrix = [];
        var limit = this.difficulty;
        var l = 1000;
        while(limit > 0) {
            var point = Math.floor(Math.random() * max);
            if(matrix.indexOf(point) === -1) {
                matrix.push(point);
                limit--;
            }
            l--;
            if(l === 0) {
                return;
            }
        }
        var out = [];
        for(var h = 0; h < this.height; h++) {
            var line = [];
            for(var w = 0; w < this.width; w++) {
                var index = h * this.width + w;
                line.push(matrix.indexOf(index) > -1);
            }
            out.push(line);
        }
        return out;
    };
    SquareMatrix.prototype.render = function() {
        this.stopProgressBar();
        this.gameStart = false;
        this.content.innerHTML = '';
        this.matrix = this.createMatrix();
        var table = this.buildTable();
        Dom.append(this.content, table);
        var me = this;
        setTimeout(function() {
            me.hideItems();
            me.startProgressBar(1115000);
            me.gameStart = true;
        }, 3000)
    };
    
    
    SquareMatrix.prototype.buildCell = function(h, w) {
        var data = this.matrix[h][w];
        var cell = Dom.el('td');
        var me = this;
        cell.onclick = function() {
            if(me.gameStart) {
                cell.className = data ? 'pass' : 'error';
                if (!data) {
                    me.decreaseSize();
                    me.render();
                } else {
                    me.matrix[h][w] = false;
                    if(me.isMatrixEmpty()) {
                        me.increaseSize();
                        me.render();
                    }
                }
            }
        };
        if(data) {
            cell.className = 'brown';
            this.toggleItems.push(cell);
        }
        return cell;
    };
        
    return SquareMatrix;
});