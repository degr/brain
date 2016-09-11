Engine.define('UrlResolver', {
    regex: /(^\/)|(\/$)/,
    findApplication: function () {
        var path = document.location.pathname;
        path = path.replace(this.regex, '');
        switch (path) {
            case 'home':
            case '':
                return 'Home';
            case 'square-matrix':
                return 'SquareMatrix';
            case 'number-matrix':
                return 'NumberMatrix';
            case 'repeat-matrix':
                return 'RepeatMatrix';
            default:
                return '404';
        }
    }
});