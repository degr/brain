Engine.define("RepeatMatrix", ['Dom', 'MatrixApp'], function(){
    var Dom = Engine.require('Dom');
    var MatrixApp = Engine.require('MatrixApp');

    var RepeatMatrix = function() {
        MatrixApp.apply(this, arguments);
        this.repeatableIndexes = [];
        var me = this;
        var button = Dom.el('button', {onclick: function(){
            for(var y in me.repeatableIndexes) {
                for(var x in me.repeatableIndexes[y]) {
                    me.repeatableIndexes[y][x].cell.className = 'brown';
                }
            }
        }}, 'Too hard!');
        this.container.appendChild(button)
    };
    RepeatMatrix.prototype = Object.create(MatrixApp.prototype);
    RepeatMatrix.URL = 'repeat-matrix';
    RepeatMatrix.prototype.createMatrix = function() {
        var max = this.width * this.height;
        var limit = max;
        var matrix = [];
        var l = 10000;
        while(limit > 0) {
            var point = Math.floor(Math.random() * max);
            if(matrix.indexOf(point) === -1) {
                matrix.push(point);
                limit--;
            }
            l--;
            if(l === 0) {
                alert('error');
                return;
            }
        }
        var random1 = matrix[Math.floor(Math.random() * matrix.length)];
        var random1Index = matrix.indexOf(random1);
        var random2 = matrix[Math.floor(Math.random() * matrix.length)];
        if(random2 == random1) {
            random2++;
        }
        var random2Index = matrix.indexOf(random2);
        this.repeatableIndexes = {};
        matrix[random2Index] = random1;

        var out = [];
        for(var h = 0; h < this.height; h++) {
            var line = [];
            for(var w = 0; w < this.width; w++) {
                var index = h * this.width + w;
                var value = matrix[index];
                if(index == random1Index || index == random2Index) {
                    if(!this.repeatableIndexes[h])this.repeatableIndexes[h] = {};
                    this.repeatableIndexes[h][w] = {};
                }
                line.push(value);
            }
            out.push(line);
        }
        return out;
    };
    RepeatMatrix.prototype.increaseSize = function() {
        MatrixApp.prototype.increaseSize.apply(this);
        if(this.width * this.height > 72) {
            this.width = 9;
            this.height = 8;
        }
    };

    RepeatMatrix.prototype.render = function() {
        this.gameStart = false;
        this.repeatableIndexes = [];
        this.matrix = this.createMatrix();
        this.content.innerHTML = '';
        var table = this.buildTable();
        Dom.append(this.content, table);
        this.gameStart = true;
        this.startProgressBar(10000)
    };


    RepeatMatrix.prototype.buildCell = function(h, w) {
        var data = this.matrix[h][w];
        var img = Dom.el('img', {src: 'assets/images/icons/' + (data +1) + '.png', 'alt': "img", width: 100, height: 100});
        var cell = Dom.el('td', 'default', img);
        var me = this;
        if(me.repeatableIndexes[h] && me.repeatableIndexes[h][w]) {
            me.repeatableIndexes[h][w].cell = cell;
        }
        img.onclick = function() {
            if(me.gameStart) {
                if(me.repeatableIndexes[h] && me.repeatableIndexes[h][w]) {
                    me.increaseSize();
                } else {
                    me.decreaseSize();
                }
                me.render();
            }
        };
        return cell;
    };

    RepeatMatrix.prototype.isMatrixEmpty = function () {
        return true;
    };
    return RepeatMatrix;
});