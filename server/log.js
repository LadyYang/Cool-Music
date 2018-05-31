var fs = require('fs');
var url = require('url');
var stream = require('stream');
/* 
 *{
     host: 'localhost:1010',
     connection: 'keep-alive',
     'user-agent': 'Mozilla/5.0 (Linux; Android 5.0; SM-G900P Build/LRX21T) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/66.0.3359.181 Mobile Safari/537.36',
  
     referer: 'http://localhost:1010/css/playsong.css',
     'accept-encoding': 'gzip, deflate, br',
     'accept-language': 'zh-CN,zh;q=0.9,en;q=0.8',
     cookie: '_ga=GA1.1.2085692776.1526913011'
   }
 *['Host',
     'localhost:1010',
     'Connection',
     'keep-alive',
     'User-Agent',
     'Mozilla/5.0 (Linux; Android 5.0; SM-G900P Build/LRX21T) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/66.0.3359.181 Mobile Safari/537.36',
     'Accept',

     'Referer',
     'http://localhost:1010/css/playsong.css',
     'Accept-Encoding',
     'gzip, deflate, br',
     'Accept-Language',
     'zh-CN,zh;q=0.9,en;q=0.8',
     'Cookie',
     '_ga=GA1.1.2085692776.1526913011'
 ]
*/
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
            fs.close(fd);
        });
    })
}

module.exports = log;