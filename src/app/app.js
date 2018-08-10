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

    // constructor
    function App() {
        if (!(this instanceof App)) {
            return new App();
        }
    }

    Object.defineProperty(App.prototype, 'extend', {
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

    function parseCurrentPage(className) {
        document.body.className = className;
    }

    // all tab
    App.prototype.tabs = {};

    // all page
    var pages = [];

    // render tabPage function
    Object.defineProperties(App.prototype, {
        'renderTab': {
            configurable: true,
            writable: true,
            value: function (tab) {
                this.tabs[tab.pageName] = tab;

                if (this.currentPage) {
                    var currentPageDOM = document.getElementById(this.currentPage.pageName);
                    currentPageDOM.style.display = 'none';

                    typeof this.currentPage.onHide === 'function' ? this.currentPage.onHide() : '';
                }


                Object.defineProperty(App.prototype, 'currentPage', {
                    configurable: true,
                    get() {
                        return tab;
                    }
                })

                Object.defineProperty(tab, 'loaded', {
                    configurable: true,
                    get() {
                        return true;
                    }
                })

                // 初次加载页面
                typeof tab.onLoad === 'function' ? tab.onLoad() : '';

                // 页面显示 触发函数
                typeof tab.onShow === 'function' ? tab.onShow() : '';

                // render page
                var div = document.createElement('div');
                div.innerHTML = tab.getHTML();
                document.body.insertBefore(div, document.body.firstElementChild);

                // 页面渲染完成 触发函数
                typeof tab.onReady === 'function' ? tab.onReady() : '';

            }
        },

        'switchTab': {
            configurable: true,
            writable: true,
            value: function (page) {
                var targetPage = document.getElementById(page.pageName),
                    currentPageDOM = document.getElementById(this.currentPage.pageName);


                typeof this.currentPage.onHide === 'function' ? this.currentPage.onHide() : '';

                Object.defineProperty(App.prototype, 'currentPage', {
                    configurable: true,
                    get() {
                        return page;
                    }
                })

                typeof page.onShow === 'function' ? page.onShow() : '';

                currentPageDOM.style.display = 'none';
                targetPage.style.display = 'block';

            }
        }
    })

    // route
    Object.defineProperties(App.prototype, {
        'navigateTo': {
            configurable: true,
            writable: true,
            value: function () {

            }
        },

        'redirectTo': {
            configurable: true,
            writable: true,
            value: function () {
                
            }
        }
    })

    return App;
})