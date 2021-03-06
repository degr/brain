var Engine = (function(){

    var modules = {};
    var afterModuleLoad = {};
    var loaded = {};

    var Engine = {
        defaultPath: '',
        pathBuilder: null,
        limit: 500,
        log: true,
        load: function (module, clb) {
            if (modules[module]) {
                clb();
            } else {
                if (!afterModuleLoad[module]) {
                    afterModuleLoad[module] = [];
                }
                afterModuleLoad[module].push(clb);
                _load(module);
            }
        },
        define: function (name, imports, module) {
            if (!module) {
                //module have no dependencies, can be initialized by default
                _initModule(name, imports, []);
                return;
            } else if (!imports) {
                imports = [];
            }
            var i;
            var requirements = [];
            if (imports) {
                if (typeof imports === 'string') {
                    if (!modules[imports]) {
                        requirements.push(imports);
                    }
                } else {
                    for (i = 0; i < imports.length; i++) {
                        if (modules[imports[i]] === undefined) {
                            requirements.push(imports[i]);
                        }
                    }
                }
            }
            if (requirements.length > 0) {
                var clb = function () {
                    Engine.define(name, imports, module);
                };
                clb.toString = function () {
                    return "Callback for " + name + " when all dependencies resolved";
                };
                _loadClasses(name, requirements, clb);
            } else {
                var args = [];
                if (imports) {
                    if (typeof imports === 'string') {
                        args = [Engine.require(imports)];
                    } else {
                        for (i = 0; i < imports.length; i++) {
                            args.push(Engine.require(imports[i]));
                        }
                    }
                }
                _initModule(name, module, args);
            }
        },
        require: function (name) {
            if (modules[name] === undefined) {
                throw "Module not instantiated " + name;
            } else {
                return modules[name];
            }
        },
        console: function (message) {
            if (Engine.log) {
                console.log(message);
            }
        }
    };


    function _load(module, clb) {
        var path;
        if (Engine.pathBuilder !== null) {
            if(typeof Engine.pathBuilder === 'function') {
                path = Engine.pathBuilder(module);
            } else {
                for(var i = 0; i < Engine.pathBuilder.length; i++) {
                    path = Engine.pathBuilder[i](module);
                    if(path) {
                        break;
                    }
                }
            }
        }
        if(!path) {
            path = Engine.defaultPath + "js/" + module + ".js";
        }
        if (!path) {
            throw "Can't load module " + module + " because path is undefined ";
        } else {
            Engine.console('Resolving dependency: ' + module + " using path: " + path);
            var script = document.createElement('script');
            script.onload = clb;
            script.src = path;
            document.getElementsByTagName('head')[0].appendChild(script);
        }
    }

    function _initModule (name, module, arguments) {
        if (typeof module === 'function') {
            modules[name] = module.apply(window, arguments);
        } else {
            modules[name] = module;
        }
        if (loaded[name] && loaded[name].deferredCallbacks) {
            for (var i = loaded[name].deferredCallbacks.length - 1; i >= 0; i--) {
                //after this deferred callbacks queue must be cleaned
                (loaded[name].deferredCallbacks.pop())();
            }
        }
        if (afterModuleLoad[name]) {
            for (var j = 0; j < afterModuleLoad[name].length; j++) {
                (afterModuleLoad[name].pop())();
            }
        }
    }
    function _loadClasses (parentName, requirements, callback) {
        Engine.console('resolve dependencies for ' + parentName);
        Engine.limit--;
        if (Engine.limit < 1) {
            throw "Something wrong, too much modules in project! It look like circular dependency. Othervise, please change Engine.limit property";
        }
        if (requirements.length === 0) {
            callback();
        } else {
            var module = requirements.pop();
            var dependencyCallback = function () {
                _loadClasses(parentName, requirements, callback);
            };
            dependencyCallback.toString = function () {
                return "Callback for " + parentName;
            };

            if (!loaded[module]) {
                loaded[module] = {
                    afterLoad: dependencyCallback,
                    callers: [],
                    deferredCallbacks: []
                };
                _load(module, function () {
                    Engine.console("Script " + module + " was loaded as dependency for: " + parentName);
                    loaded[module].afterLoad();
                });

            } else if (modules[module]) {
                Engine.console('Dependency ' + module + ' already loaded');
                dependencyCallback();
            } else if (loaded[module].callers.indexOf(parentName) === -1) {
                loaded[module].callers.push(parentName);
                loaded[module].deferredCallbacks.push(dependencyCallback);
            } else {
                Engine.console("Skipped dependency " + module + " load for " + parentName);
            }
        }
    }

    return Engine;
})();