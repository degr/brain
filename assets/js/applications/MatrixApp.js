Engine.define("MatrixApp", ['Dom', 'MainMenu'], function(){
    var Dom = Engine.require('Dom');
    var MainMenu = Engine.require('MainMenu');
    
    var MatrixApp = function(context, placeApplication) {
        var mainMenu = new MainMenu(context, placeApplication);
        this.content = Dom.el('div');
        this.container = Dom.el('div', null, [mainMenu.container, this.content]);
        this.width = 3;
        this.height = 3;
        this.difficulty = 3;
        this.matrix = null;

        this.gameStart = false;
        this.toggleItems = null;
    };
    MatrixApp.prototype.beforeOpen = function () {
        this.render();
    };
    MatrixApp.prototype.increaseSize = function() {
        if(this.width < this.height) {
            this.width++;
        } else {
            this.height++;
        }
        this.difficulty++;
    };
    MatrixApp.prototype.decreaseSize = function() {
        if(this.width < this.height) {
            this.height--;
        } else {
            this.width--;
        }
        this.difficulty--;
    };
    MatrixApp.prototype.createMatrix = function() {
        throw "Override createMatrix function"
    };
    MatrixApp.prototype.render = function() {
        throw "Override render function"
    };

    MatrixApp.prototype.hideItems = function() {
        for(var i = 0; i < this.toggleItems.length; i++) {
            this.toggleItems[i].className = ''
        }
    };

    MatrixApp.prototype.isMatrixEmpty = function () {
        for(var i = 0; i < this.matrix.length; i++) {
            var line = this.matrix[i];
            for(var w = 0; w < line.length; w++) {
                if(line[w]){
                    return false;
                }
            }
        }
        return true;
    };

    MatrixApp.prototype.buildCell = function(h, w) {
        throw "Override buildCell function"
    };
    MatrixApp.prototype.buildTable = function() {
        var rows = [];
        this.toggleItems = [];
        for(var h = 0; h < this.matrix.length; h++) {
            var line = this.matrix[h];
            var row = Dom.el('tr');
            for(var w = 0; w < line.length; w++) {
                Dom.append(row, this.buildCell(h, w));
            }
            rows.push(row);
        }
        return Dom.el('table', 'matrix', rows);
    };

    return MatrixApp;
});