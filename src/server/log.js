var fs = require('fs');
var url = require('url');
var stream = require('stream');

function log({req,res,info,path}) {
    var data = '';
    if (req instanceof stream.Readable) {
        var href = url.parse(req.url);
        var socket = req.socket;
        // console.log(href);
        // console.log(req.headers);
        // console.log(req.rawHeaders);
        data = `|clientIP:${socket.remoteAddress} ${socket.remotePort}|access:${href.pathname}|code:${res.statusCode}|method:${req.method}|User-Agent:${req.headers['user-agent']}|`
    } else {
        data = info;
    }
    fs.open(__dirname + path, 'a+', function (err, fd) {
        if (err) {
            throw err;
        }

        var date = new Date();

        var str = '\n' + date.toString() + data;

        fs.write(fd, str, 0, null, null, function (err) {
            if (err) throw err;
          fs.close(fd, function () {
              console.log('close ok');
          });
        });
    });
}

module.exports = log;