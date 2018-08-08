var fs = require('fs');
var http = require('http');
var url = require('url');
const config = require('./server.config');
var log = require('./log');
let mime = require('mime');
var cluster = require('cluster');

if (cluster.isMaster) {
    cluster.on('fork', function () {

    });
    cluster.on('listening', function () {

    });

    cluster.on('exit', function (worker, code, signal) {
        console.log("Workder " + worker.id + " Exited");
    });

    cluster.setupMaster({
        exec: './chtao.js'
    });
    var numCpus = require('os').cpus().length;
    for (var i = 0; i < numCpus; i++) {
        cluster.fork();
    }
} else {
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
            href,
            query
        } = url.parse(u, true, false);
        
        var img = href.match(/(.*\.png|.*\.ico|.*\.jpg)$/);
        
        var css = href.match(/(.*\.css)$/);
        var html = href.match(/(.*\.html)$/);
        var js = href.match(/(.*\.js)$/);
        var path;
        // http: //localhost:1010/html/playsong.html?hash=023650FBE10AD3ACEBB2C31CDD3C500

        function upload(res, code, type, path) {
            var fileReadStream = fs.createReadStream(path);
            fileReadStream.on('error', function (err) {
                console.log(err.toString());
                upload(res, 404, 'text/html', config.documentRoot + 'pages/error/error.html');
            });

            // 设置缓存
            res.writeHead(code, {
                'Content-type': type,
                'Expires': new Date(Date.now() + 3000 * 1000).toUTCString(),
                'Cache-Control': 'max-age=3000000000',
            });

            fileReadStream.pipe(res);
            // res.end();
        }
        
        if (img) {
            path = img[1];
            upload(res, 200, 'image', config.documentRoot + path);
        } else if (css) {
            path = css[1];
            upload(res, 200, 'text/css', config.documentRoot + path);
        } else if (html) {
            path = html[1];
            upload(res, 200, 'text/html', config.documentRoot  + path );
        } else if (js) {
            path = js[1];
            upload(res, 200, 'application/javascript', config.documentRoot + path);
        } else {
            console.log(u);
            upload(res, 404, 'text/html', config.documentRoot +  '/pages/error/error.html');
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

            get('pages/main/main.html', res);
        } else {

            get(req.url, res);
        }

        log({
            req: req,
            res: res,
            path: res.statusCode < 400 ? '/../log/access.log' : '/../log/error.log'
        });
    });

    server.on('error', function (err) {
        console.log(err.toString());
        log({
            info: 'Service opening failed, ' + err.toString(),
            path: '/../log/server.log'
        });
    })

    server.listen(81, function () {
        log({
            info: 'Start service successfully',
            path: '/../log/server.log'
        });
    });

}
