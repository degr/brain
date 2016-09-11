Engine.define("Home", ['Dom', 'MainMenu'], function(){
    var Dom = Engine.require('Dom');
    var MainMenu = Engine.require('MainMenu');
    function Home(context, placeApplication) {
        var mainMenu = new MainMenu(context, placeApplication);
        this.container = Dom.el('div', null, [
            mainMenu.container,
            Dom.el('p', null, 'Welcome aboard!')
        ])
    }
    Home.URL = 'home';
    return Home;
});