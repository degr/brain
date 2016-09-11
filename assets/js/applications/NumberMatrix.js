Engine.define("NumberMatrix", ['Dom', 'MatrixApp'], function(){
    var Dom = Engine.require('Dom');
    var MatrixApp = Engine.require('MatrixApp');
    var NumberMatrix = function() {
        MatrixApp.apply(this, arguments);
        this.chain = [];
        this.stack = [];
        this.shownIndex = null;
    };
    NumberMatrix.prototype = Object.create(MatrixApp.prototype);
    NumberMatrix.URL = 'number-matrix';
    NumberMatrix.prototype.createMatrix = function() {
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
        this.chain = [];
        var values = [];
        for(var i = 0; i < this.difficulty; i++) {
            values.push(i+1);
        }
        for(var h = 0; h < this.height; h++) {
            var line = [];
            for(var w = 0; w < this.width; w++) {
                var index = h * this.width + w;
                var isValueSet = matrix.indexOf(index) > -1;
                var valuesIndex = Math.floor(Math.random() * values.length);
                var value = isValueSet ? values.splice(valuesIndex, 1)[0] : 0;
                line.push(value);
                if(isValueSet) {
                    this.chain.push(value);
                }
            }
            out.push(line);
        }
        return out;
    };
    NumberMatrix.prototype.render = function() {
        this.stopProgressBar();
        this.gameStart = false;
        this.shownIndex = 0;
        this.matrix = this.createMatrix();
        this.stack = [];
        var me = this;
        function showNext() {
            me.content.innerHTML = '';
            var table = me.buildTable();
            Dom.append(me.content, table);
            if(me.shownIndex >= me.chain.length) {
                me.gameStart = true;
                me.startProgressBar(5000);
            } else {
                me.shownIndex++;
                setTimeout(
                    showNext, 1000
                )
            }
        }
        showNext();
    };


    NumberMatrix.prototype.buildCell = function(h, w) {
        var data = this.matrix[h][w];
        var cell = Dom.el('td', null, data === this.shownIndex + 1 ? data : null);
        var me = this;
        cell.onclick = function() {
            if(me.gameStart) {
                if(me.matrix[h][w] === -1) {
                    return;
                }
                cell.className = data ? 'pass' : 'error';
                me.stack.push(data);
                if (data === 0 || data != me.stack.length) {
                    me.decreaseSize();
                    me.render();
                } else {
                    if(data > 0) {
                        me.matrix[h][w] = -1;
                        if (me.isMatrixEmpty()) {
                            me.increaseSize();
                            me.render();
                        }
                    }
                }
            }
        };
        if(data === this.shownIndex) {
            this.toggleItems.push(cell);
        }
        return cell;
    };

    NumberMatrix.prototype.isMatrixEmpty = function () {
        for(var i = 0; i < this.matrix.length; i++) {
            var line = this.matrix[i];
            for(var w = 0; w < line.length; w++) {
                if(line[w] > 0){
                    return false;
                }
            }
        }
        return true;
    };
    return NumberMatrix;
});