Engine.define("404", ['Dom', 'MainMenu'], function(){
    var Dom = Engine.require('Dom');
    var mainMenu = Engine.require('MainMenu');
    function P404(context, placeApplication) {
        var mainMenu = new MainMenu(context, placeApplication);
        this.container = Dom.el('div', null, [
            mainMenu.container,
            Dom.el('p', null, 'There is no this page')
        ])
    }
    P404.URL = 'home';
    return P404;
});