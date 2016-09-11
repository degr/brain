Engine.define("PathBuilder", function(){
    return function (module) {
        var seed = "?v=1";
        var path;
        switch (module) {
            case 'MatrixApp':
            case 'NumberMatrix':
            case 'SquareMatrix':
            case 'RepeatMatrix':
            case 'Home':
                path = 'applications/' + module + '.js';
                break;
            case 'StringUtils':
                path = 'utils/' + module + '.js';
                break;
            case 'UrlResolver':
            case 'MainMenu':
                path = 'components/' + module + '.js';
                break;
            default:
                path = '';
        }
        if(path == '') {
            return path;
        }
        return "assets/js/" + path + seed;
    };
});