Engine.define("PathBuilder", function(){
    return function (module) {
        var seed = "?v=1";
        var path;
        switch (module) {
            case 'MatrixApp':
            case 'Square':
            case 'Path':
                path = 'applications/' + module + '.js';
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