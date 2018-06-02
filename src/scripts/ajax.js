module.exports = function ajax(json) {
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