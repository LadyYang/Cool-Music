// 数组去重
Array.prototype.unique = function () {
    var len = this.length;
    var arr = [];

    for (var i = 0; i < len; i++) {
        if (arr.indexOf(this[i]) == -1 && this[i] != undefined) {
            arr.push(this[i]);
        }
    }

    return arr;
}

// 圣杯模式
var inherit = (function () {
    var F = function () {};

    return function (orgin, target) {
        target = target || {};

        F.prototype = orgin.prototype;
        target.prototype = new F();
        target.prototype.constructor = target;
        target.prototype.uber = orgin;

        return target;
    }
}());


// 遍历元素节点树
function retChild(node) {
    "use strict";

    var child = node.childNodes,
        len = child.length;

    for (var i = 0; i < len; i++) {
        // 1 --> 元素节点
        // 2 --> 属性节点
        // 3 --> 文本节点
        // 8 --> 注释节点
        // 9 --> document
        // 11 --> documentFragment
        if (child[i].nodeType === 1) {
            console.log(child[i]);
            child[i].hasChildNodes() && retChild(child[i]);
        }
    }
}

// 返回元素 e 的 n 层父节点
function retParent(e, n) {
    // false null undefined 0 '' NaN
    while (e && n) {
        e = e.parentNode;
        n--;
    }

    return e;
}

// 返回元素e的第n个兄弟元素节点，如果n为正，返回后面的兄弟元素节点，n为负，返回前面的，n为0，返回自己
function retSibling(e, n) {
    // e.nextSibling  e.previousSibling
    while (e && n) {
        if (n < 0) {
            if (e.previousElementSibling) {
                e = e.previousElementSibling;
            } else {
                e = e.previousSibling;
                while (e && e.nodeType !== 1) {
                    e = e.previousSibling;
                }
            }
            n++;
        } else {
            if (e.nextElementSibling) {
                e = e.nextElementSibling;
            } else {
                e = e.nextSibling;
                while (e && e.nodeType !== 1) {
                    e = e.nextSibling;
                }
            }
            n--;
        }
    }

    return e;
}

// 获取 children 返回一个类数组
Element.prototype.getChildren = function () {
    var child = this.childNodes,
        len = child.length,
        obj = {
            'length': 0,
            'push': Array.prototype.push,
            'splice': Array.prototype.splice,
        };


    for (var i = 0; i < len; i++) {
        if (child[i].nodeType == 1) {
            obj.push(child[i]);
        }
    }

    return obj;
}

// 判断元素是否有子节点
Element.prototype.hasChildren = function () {
    var child = this.childNodes,
        len = child.length;

    for (var i = 0; i < len; i++) {
        if (child[i].nodeType == 1) {
            return true;
        }
    }

    return false;
}

//  封装函数 insertAfter()
Element.prototype.insertAfter = function (targetNode, afterNode) {
    if (afterNode && targetNode) {
        if (!afterNode.nextElementSibling) {
            this.appendChild(targetNode);
        } else {
            this.insertBefore(targetNode, afterNode.nextElementSibling);
        }
    }
}

// 求滚动条滚动距离 返回值是一個對象
function getScrollOffset() {
    if (window.pageXOffset) {
        return {
            x: window.pageXOffset,
            y: window.pageYOffset,
        }
    } else {
        return {
            x: document.documentElement.scrollLeft + document.body.scrollLeft,
            y: document.documentElement.scrollTop + document.body.scrollTop,
        }
    }
}

// 返回浏览器的视口大小 返回值是一個對象
function getViewportOffset() {
    if (window.innerHeight) {
        return {
            w: innerWidth,
            h: innerHeight,
        }
    } else {
        if (document.compatMode === 'CSS1Compat') {
            return {
                w: document.documentElement.clientWidth,
                h: document.documentElement.clientHight,
            }
        } else {
            return {
                w: document.body.clientWidth,
                h: document.body.clientHeight,
            }
        }
    }
}

//  封装一个函数，可以返回元素的宽高
// 不是實時更新的
function getElementOffset() {
    var objData = this.getBoundingClientRect();

    if (objData.width) {
        return {
            w: objData.width,
            h: objData.height,
        }
    } else {
        return {
            w: objData.right - objData.left,
            h: objData.bottom - objData.top,
        }
    }
}

// 兼容性的事件绑定函数
function attachEvent(ele, type, handle) {
    if (ele.addEventListener) {
        ele.addEventListener(type, handle, false);
    } else if (ele.attachEvent) {
        ele['temp' + type + handle] = handle;
        ele[type + handle] = function () {
            ele['temp' + type + handel].call(ele);
        }

        ele.attachEvent('on' + type, ele[type + handle]);
    } else {
        ele['on' + type] = handle;
    }
}

Array.prototype.myForEach = function (f, context) {
    var len = this.length;
    context = context || this;

    for (var i = 0; i < len; i++) {
        var item = this[i];
        f.call(context, item, i, this);
    }
}

Array.prototype.myFilter = function (f, context) {
    var arr = [];
    context = context || window;

    // for (var i = 0, len = this.length; i < len; i++) {
    //     var item = this[i];
    //     if (f.call(context, item, i, this)) {
    //         arr.push(item);
    //     }
    // }

    for (var p in this) {
        if (this.hasOwnProperty(p)) {
            if (f.call(context, this[p], p, this)) {
                arr.push(this[p]);
            }
        }
    }

    // 深拷贝
    function deepClone(origin, target) {
        target = target || {};
        for (var p in origin) {
            if (origin.hasOwnProperty(p)) {
                if (typeof origin[p] == 'object') {
                    if (Object.prototype.toString.call(origin[p]) === '[object Array]') {
                        target[p] = [];
                    } else {
                        target[p] = {};
                    }

                    deepClone(origin[p], target[p]);
                } else {
                    target[p] = origin[p];
                }
            }
        }

        return target;
    }
    //     function isObject(o) {
    //     if (Array.isArray(o)) {
    //         return false
    //     } else if (o == null) {
    //         return false
    //     } else if (typeof o === "object") {
    //         return true
    //     }
    //     return false
    // }


    // function deepClone(...args) {
    //     var target = typeof args[0] === 'object' ? args.shift() : {}

    //     console.log(args)
    //     args.forEach(src => {

    //         if (typeof src === 'object') {
    //             for (let p in src) {
    //                 if (Array.isArray(src[p])) {
    //                     target[p] = []
    //                     deepClone(target[p], src[p])
    //                 } else if (isObject(src[p])) {
    //                     target[p] = {}
    //                     deepClone(target[p], src[p])
    //                 } else {
    //                     target[p] = src[p]
    //                 }
    //             }
    //         }
    //     })

    //     return target
    // }


    // 这样处理效率不高。。。 
    return deepClone(arr, []);
}

Array.prototype.myMap = function (f, context) {
    var arr = [];
    context = context || window;

    for (var i = 0, len = this.length; i < len; i++) {
        var item = this[i];
        if (this[i] !== undefined) {
            arr.push(f.call(context, item, i, this));
        } else {
            arr.length++;
        }

    }

    return arr;
}

Array.prototype.myReduce = function (f, initial) {
    var len = this.length;
    var i;
    var accumlator;

    if (initial) {
        accumlator = initial;
        i = 0;
    } else {
        i = 1;
        accumlator = this[0];
    }

    for (; i < len; i++) {
        var item = this[i];
        accumlator = f.call(undefined, accumlator, item, i, this);
    }

    return accumlator;
}

// 封装 AJAX
function aJax(json) {
    var method = json.method,
        url = json.url,
        flag = json.flag,
        callback = json.callback,
        data = json.data,
        xhr = null;

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

// 模仿 bind 方法
// null, undefined  --> window
// new this --> new
Function.prototype.myBind = function (o) {
    var self = this,
        _args = [].slice.call(arguments, 1);
    o = o || window;

    function f() {
        args = _args.concat([].slice.call(arguments, 0));
        return self.apply(this instanceof self ? this : o, args);
    }

    f.prototype = self.prototype;
    return f;
}


// 函数柯里化
var currying = (function () {
    function fixedParam(f) {
        var _args = [].slice.call(arguments, 1);

        return function () {
            var args = _args.concat([].slice.call(arguments, 0));

            return f.apply(this, args);
        }
    }

    function currying(f, length) {
        var length = length || f.length;

        return function () {
            var args = [].slice.call(arguments, 0);
            if (length === arguments.length) {
                return f.apply(this, args);
            } else {
                var _args = [f].concat(args);
                return currying(fixedParam.apply(this, _args), length - arguments.length);
            }
        }
    }

    return currying;
}());


// 自我复制（克隆人)
// 可以进一步的优化 （懒了 *——*） 哈哈哈哈
Object.defineProperty(Object.prototype, 'clone', {
    value: function clone() {
        // var target = arguments[0] || null;
        var type = Object.prototype.toString.call(this).slice(8, -1);
        // console.log(type);

        if (type === 'Function') {
            return this;
        } else if (type === 'Array') {
            var target = [];
            for (var i = 0, len = this.length; i < len; ++i) {
                if (this.hasOwnProperty(i)) {
                    var t = Object.prototype.toString.call(this[i]).slice(8, -1);
                    if (t === 'Object') {
                        // obj = {};
                        target[i] = clone.call(this[i]);
                    } else if (t === 'Array') {
                        // obj = [];
                        target[i] = clone.call(this[i]);
                    } else {
                        target[i] = this[i];
                    }
                }
            }

            return target;

        } else if (type === 'Object') {
            var target = {};
            for (var p in this) {
                if (this.hasOwnProperty(p)) {
                    var t = Object.prototype.toString.call(this[p]).slice(8, -1);
                    if (t === 'Object') {
                        // obj = {};
                        target[p] = clone.call(this[p]);
                    } else if (t === 'Array') {
                        // obj = [];
                        target[p] = clone.call(this[p]);
                    } else {
                        target[p] = this[p];
                    }
                }
            }

            return target;
        }
    }
})

// 数组扁平化
function flatten(arr, a) {
    var a = a || [];

    for (var i in arr) {
        if (arr.hasOwnProperty(i)) {
            if (Array.isArray(arr[i])) {
                flatten(arr[i], a);
            } else {
                a.push(arr[i]);
            }
        }
    }

    return a;
}

// 判断矩形是否相交
function isIntersect(a, b, shape = 'RECT') {
    if (!(a instanceof Element && b instanceof Element)) {
        throw Error(a + ' or ' + b + ' is not a Element instance！');
    }

    if (shape === 'RECT') {
        // Half the width and half the height
        var wA = a.offsetWidth / 2;
        var hA = a.offsetHeight / 2;
        var wB = b.offsetWidth / 2;
        var hB = b.offsetHeight / 2;

        // The center coordinates
        var cenAX = a.offsetLeft + wA;
        var cenAY = a.offsetTop + hA;
        var cenBX = b.offsetLeft + wB;
        var cenBY = b.offsetTop + hB;

        // Center distance
        var distCX = Math.abs(cenAX - cenBX);
        var distCY = Math.abs(cenAY - cenBY);

        var isX = distCX < (wA + wB);
        var isY = distCY < (hA + hB);

        return (isX && isY);
    }
    if (shape === 'CIRCLE') {
        // var cd = Math.sqrt(Math.pow((b.x - a.x), 2) + Math.pow((b.y - a.y), 2));

    }

}


function loadScript(url, callback) {

    var script = document.createElement('script');
    script.type = "text/javascript";

    if (script.readyState) {
        script.onreadystatechange = function () {
            if (script.readyState == 'loaded' || script.readyState == "complete") {
                script.onreadystatechange = null;
                callback();
            }
        }
    } else {
        script.onload = function () {
            callback();
        }
    }

    script.src = url;

    document.getElementsByTagName('head')[0].appendChild(script);
    document.getElementsByTagName('head')[0].removeChild(script);
}

module.exports = {
    ajax: aJax
}