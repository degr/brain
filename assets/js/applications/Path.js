Engine.define("Path", ['Dom', 'MatrixApp'], function(){
    var Dom = Engine.require('Dom');
    var MatrixApp = Engine.require('MatrixApp');
    var Path = function() {
        MatrixApp.apply(this, arguments);
        this.chain = [];
        this.stack = [];
        this.shownIndex = null;
    };
    Path.prototype = Object.create(MatrixApp.prototype);

    Path.prototype.createMatrix = function() {
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
        this.chain = [];
        var value = 1;
        for(var h = 0; h < this.height; h++) {
            var line = [];
            for(var w = 0; w < this.width; w++) {
                var index = h * this.width + w;
                line.push(matrix.indexOf(index) > -1 ? value++ : 0);
                if(matrix.indexOf(index) > -1) {
                    this.chain.push(value);
                }
            }
            out.push(line);
        }
        return out;
    };
    Path.prototype.render = function() {
        this.gameStart = false;
        this.shownIndex = 0;
        this.matrix = this.createMatrix();
        this.stack = [];
        var me = this;
        function showNext() {
            me.container.innerHTML = '';
            var table = me.buildTable();
            Dom.append(me.container, table);
            if(me.shownIndex >= me.chain.length) {
                me.gameStart = true;
            } else {
                me.shownIndex++;
                setTimeout(
                    showNext, 1000
                )
            }
        }
        showNext();
    };


    Path.prototype.buildCell = function(h, w) {
        var data = this.matrix[h][w];
        var cell = Dom.el('td', null, data === this.shownIndex + 1 ? data : null);
        var me = this;
        cell.onclick = function() {
            if(me.gameStart) {
                console.log(data);
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

    Path.prototype.isMatrixEmpty = function () {
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
    return Path;
});