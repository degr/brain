Engine.define("MatrixApp", ['Dom', 'MainMenu'], function(){
    var Dom = Engine.require('Dom');
    var MainMenu = Engine.require('MainMenu');

    var MatrixApp = function(context, placeApplication) {

        this.width = 3;
        this.height = 3;
        this.difficulty = 3;

        var mainMenu = new MainMenu(context, placeApplication);
        this.content = Dom.el('div');
        this.metaData = Dom.el('div', null, this.getMetadata());
        this.progressBar = Dom.el('div', 'progress-bar');

        var controlPanel = Dom.el('div', null, [
            this.metaData,
            this.hasProgressBar() ? Dom.el('div', 'progress', this.progressBar) : null
        ]);
        this.container = Dom.el('div', null, [mainMenu.container, controlPanel, this.content]);
        this.matrix = null;

        this.gameStart = false;
        this.toggleItems = null;
        this.progressInterval = -1;
    };
    MatrixApp.prototype.getMetadata = function() {
        return Dom.el('div', null, [
            Dom.el('div', null, 'Size: ' + this.width + 'x' + this.height),
            Dom.el('div', null, 'Level: ' + (this.difficulty - 2))
        ]);
    };
    MatrixApp.prototype.hasProgressBar = function() {
        return true;
    };
    MatrixApp.prototype.beforeOpen = function () {
        this.render();
    };
    MatrixApp.prototype.increaseSize = function() {
        this.changeSize(1);
    };
    MatrixApp.prototype.decreaseSize = function() {
        this.changeSize(-1);
    };
    MatrixApp.prototype.changeSize = function(shift) {
        if(shift > 0) {
            if (this.width < this.height) {
                this.width += shift;
            } else {
                this.height += shift;
            }
        } else {
            if(this.width < this.height) {
                this.height += shift;
            } else {
                this.width += shift;
            }
        }
        this.difficulty += shift;
        if(this.width < 3) {
            this.width = 3;
        }
        if(this.height < 3) {
            this.height = 3;
        }
        if(this.difficulty < 3) {
            this.difficulty = 3;
        }
        this.metaData.innerHTML = '';
        Dom.append(this.metaData, this.getMetadata());
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
    MatrixApp.prototype.startProgressBar = function(time) {
        if(this.progressInterval > -1) {
            this.stopProgressBar();
        }
        var me = this;
        var start = (new Date()).getTime();
        this.progressInterval = setInterval(function(){
            var now = (new Date()).getTime();
            var diff = (now - start);
            if(diff > time) {
                clearInterval(me.progressInterval);
                me.decreaseSize();
                me.render();
            } else {
                me.progressBar.style.width = (diff / time) * 100 + '%';
            }
        }, 10);
        console.log('interval started  ' + this.progressInterval)
    };
    MatrixApp.prototype.stopProgressBar = function() {
        clearInterval(this.progressInterval);
        this.progressBar.style.width = '0';
    };
    return MatrixApp;
});