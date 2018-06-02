var fs = require('fs');
var http = require('http');
var url = require('url');
var config = require('./server.config');
var log = require('./log');

// ClientRequest
function requestSource(res, hash) {
    var request = http.request({
        hostname: 'www.kugou.com',
        path: '/yy/index.php?r=play/getdata&hash=' + hash,
    }, function (response) {
        var str = '';
        response.on('data', function (chunk) {
            str += chunk;
        });
        response.on('end', function () {
            res.writeHead(200);
            res.end(str.toString());
        });
        response.on('error', function (err) {
            console.log(err.toString());
        });
    });
    request.on('close', function () {

    })
    request.on('error', function (err) {
        console.log(err.toString());
    });
    request.end();
}

// 根据路径加载
function get(u, res) {
    var {
        pathname,
        query
    } = url.parse(u, true, false);
    var img = pathname.match(/([^/]*\.png|[^/]*\.ico|[^/]*\.jpg)$/);
    var css = pathname.match(/([^/]*\.css)$/);
    var html = pathname.match(/([^/]*\.html)$/);
    var js = pathname.match(/([^/]*\.js)$/);
    var path;
    // http: //localhost:1010/html/playsong.html?hash=023650FBE10AD3ACEBB2C31CDD3C500

    function upload(res, code, type, path) {
        var fileReadStream = fs.createReadStream(path);
        fileReadStream.on('error', function (err) {
            console.log(err.toString());
            upload(res, 404, 'text/html', __dirname + config.html +'error.html');
        });
        res.writeHead(code, {
            'Content-type': type
        });
        fileReadStream.pipe(res);
        // res.end();
    }

    if (img) {
        path = img[1];
        upload(res, 200, 'image/png', __dirname + config.image + path);
    } else if (css) {
        path = css[1];
        upload(res, 200, 'text/css', __dirname + config.css + path);
    } else if (html) {
        path = html[1];
        upload(res, 200, 'text/html', __dirname + config.html + path);
    } else if (js) {
        path = js[1];
        upload(res, 200, 'application/javascript', __dirname + config.js + path);
    } else {
        console.log(u);
        upload(res, 404, 'text/html', __dirname + config.html + 'error.html');
    }

}

var server = http.createServer();

server.on('request', function (req, res) {

    req.on('error', function (err) {
        console.log(err.toString());
    });
    res.on('error', function (err) {
        console.log(err.toString());
    });

    if (req.url === '/getSong.js') {
        var hash = '';

        req.on('data', function (chunk) {
            hash += chunk;
        });

        req.on('end', function () {

            requestSource(res, hash);
        });
    } else if (req.url === '/') {

        get('/html/index.html', res);
    } else {

        get(req.url, res);
    }

    log({
        req: req,
        res: res,
        path: res.statusCode < 400 ? '/../../log/access.log' : '/../../log/error.log'
    });
});

server.on('error', function (err) {
    console.log(err.toString());
    log({
        info: 'Service opening failed, ' + err.toString(),
        path: '/../../log/server.log'
    });
})

server.listen(81, function () {
    log({
        info: 'Start service successfully',
        path: '/../../log/server.log'
    });
});
