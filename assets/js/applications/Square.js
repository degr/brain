Engine.define("Square", ['Dom', 'MatrixApp'], function(){
    var Dom = Engine.require('Dom');
    var MatrixApp = Engine.require('MatrixApp');
    var Square = function() {
        MatrixApp.apply(this, arguments);
    };

    Square.prototype = Object.create(MatrixApp.prototype);
    
    Square.prototype.createMatrix = function() {
        var max = this.width * this.height;
        var matrix = [];
        var limit = this.difficulty;
        var l = 1000;
        while(limit > 0) {
            var point = Math.ceil(Math.random() * max) - 1;
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
    Square.prototype.render = function() {
        this.gameStart = false;
        this.container.innerHTML = '';
        this.matrix = this.createMatrix();
        var table = this.buildTable();
        Dom.append(this.container, table);
        var me = this;
        setTimeout(function() {
            me.hideItems();
            me.gameStart = true;
        }, 3000)
    };
    
    
    Square.prototype.buildCell = function(h, w) {
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
        
    return Square;
});