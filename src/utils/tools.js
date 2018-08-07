;
(function (root, factory) {
    if (typeof define === 'function' && define.amd) {
        define([], factory);
    } else if (typeof module === 'object' && module.exprots) {
        module.exprots = factory(root);
    } else {
        root.tools = factory(root);
    }
})(typeof window === 'undefined' ? this : window, function (root) {
    function ajax(json) {
        var method = json.method,
            url = json.url,
            flag = json.flag,
            data = json.data,
            success = json.success,
            beforeSend = json.beforeSend,
            xhr = null;

        if (window.XMLHttpRequest) {
            xhr = new window.XMLHttpRequest();
        } else {
            xhr = new window.ActiveXObject('Mircosoft.XMLHTTP');
        }

        if (method.toLowerCase() === 'get') {
            url += '?' + data;
            xhr.open(method, url, flag);
        } else {
            xhr.open(method, url, flag);
        }

        typeof beforeSend === 'function' ? beforeSend() : '';

        xhr.onreadystatechange = function () {
            if (xhr.readyState === 4 && xhr.status === 200) {
                typeof success === 'function' ? success(xhr.responseText) : '';
            }
        }

        if (method.toLowerCase() === 'get') {
            xhr.send();
        } else {
            xhr.setRequestHeader('Content-Type', 'application/x-www-form-urle')
            xhr.send(data);
        }
    }

    function getStyle(obj, attr) {
        if (obj.currentStyle) {
            return obj.currentStyle[attr];
        } else {
            return window.getComputedStyle(obj, false)[attr];
        }
    }

    function startMove(obj, json, timing, callback) {
        clearInterval(obj.timer);
        var iSpeed,
            iCur;

        obj.timer = setInterval(function () {
            var bStop = true;
            for (var attr in json) {
                if (attr == 'opacity') {
                    iCur = parseFloat(getStyle(obj, attr)) * 100;
                } else {
                    iCur = parseInt(getStyle(obj, attr));
                }

                iSpeed = (json[attr] - iCur) / 7;
                iSpeed = iSpeed > 0 ? Math.ceil(iSpeed) : Math.floor(iSpeed);

                if (attr == 'opacity') {
                    obj.style.opacity = (iCur + iSpeed) / 100;
                } else {
                    obj.style[attr] = iCur + iSpeed + 'px';
                }

                if (iCur != json[attr]) {
                    bStop = false;
                } else {
                    bStop = true;
                }

            }

            if (bStop) {
                clearInterval(obj.timer);
                typeof callback === 'function' ? callback() : '';
            }
        }, timing);
    }

    return {
        ajax: ajax,
        startMove: startMove
    }
})