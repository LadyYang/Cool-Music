;
(function (root, factory) {
    if (typeof define === 'function' && define.amd) {
        define([], factory);
    } else if (typeof module === 'object' && module.exprots) {
        module.exprots = factory(root);
    } else {
        root.route = factory(root);
    }
})(typeof window === 'undefined' ? this : window, function (root) {

    function Route() {
        if (!(this instanceof Route)) {
            return new Route();
        }


    }

    function RouteError({
        message
    }) {

        return new Error(message);
    }

    RouteError.prototype = Error.prototype;

    Object.defineProperty(Route.prototype, 'extend', {
        writable: true,
        configurable: true,
        value: function (o) {
            for (var p in o) {
                if (o.hasOwnProperty(p)) {
                    this[p] = o[p];
                }
            }
        }
    })

    // register page
    var pages = {
        push: [].push,
        slice: [].slice,
        splice: [].splice,
        pop: [].pop
    }

    function loadPage(fileName, type) {
        var file = fileName.replace(/(.*)\..*$/, function ($, $1) {
            return $1;
        });

        ajax({
            url: 'localhost:81/' + file + '.' + type,
            callback: function (data) {
                pages[file][type] = data;
            }
        })
    }

    Object.defineProperties(Route.prototype, {
        'length': {
            configurable: true,
            get: function () {
                return pages.length;
            }
        },

        'register': {
            configurable: true,
            writable: true,
            value: function () {
                var [pageArr] = arguments;

                if (Array.isArray(pageArr)) {
                    pageArr.forEach(function (ele) {
                       loadPage(ele);
                    })
                    pages.splice(pages.length, 0, ...pageArr);
                } else {
                    pages.push(pageArr);
                }
            }
        }

    })

    function loadScript(url, callback) {
        var script = document.createElement('script');

        script.type = 'text/javascript';
        if (script.readyState) {
            script.onreadystatechange = function () {
                if (script.readyState === 'loaded' || script.readyState === 'complete') {
                    script.onreadystatechange = null;
                    callback();
                }
            };
        } else {
            script.onload = function () {
                callback();
            };
        }

        script.src = url;
        document.body.appendChild(script);
    }

    function ajax(config) {
        var {
            url,
            method = "GET",
            callback,
            flag = true,
            data,
            xhr = null
        } = config;

        if (window.XMLHttpRequest) {
            xhr = new XMLHttpRequest();
        } else {
            xhr = new ActiveXObject('Mircosoft.XMLHTTP');
        }

        if (method.toLowerCase() === 'get') {
            url += '?' + data + new Date().getTime();
            xhr.open(method, url, flag);
        } else {
            xhr.open(method, url, flag);
        }

        xhr.onreadystatechange = function () {
            if (xhr.readyState === 4 && xhr.status === 200) {
                callback(xhr.responseText);
            }
        }

        if (method.toLowerCase() === 'get') {
            xhr.send();
        } else {
            xhr.setRequestHeader('Content-Type', 'applicant/x-www-form-urle');
            xhr.send(data);
        }
    }

    // route
    Object.defineProperties(Route.prototype, {
        'redirectTo': {
            configurable: true,
            writable: true,
            value: function (page) {
                if (pages[page]) {
                    pages[page]()
                } else {
                    throw RouteError(`没有这个页面: ${page}`);
                }
            }
        },

        'navigateTo': {
            configurable: true,
            writable: true,
            value: function (page) {
                if (pages[page]) {
                    pages[page]()
                } else {
                    throw RouteError(`没有这个页面: ${page}`);
                }
            }
        }
    })


    return new Route;
})