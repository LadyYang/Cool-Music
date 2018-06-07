/*!
 * StartTime: 2018-5-28 19:28
 * 酷狗接口：
 * searchUrl = http://songsearch.kugou.com/song_search_v2?callback=Song.doJSON&keyword
 * songUrl = http: //www.kugou.com/yy/index.php?r=play/getdata&hash=;
 */
(function (global, factory) {
    "use strict";

    if (typeof module === "object" && typeof module.exports === "object") {
        module.exports = global.document ?
            factory(global) :
            function (options) {
                if (!(options.target instanceof Element)) {
                    throw new Error("Song requires a window with a document");
                }
            };
    } else {
        factory(global);
    }
})(this, function (global) {
    "use strict"

    function Song(sUrl) {
        if (!(this instanceof Song)) {
            throw new Error("Illegal constructor.");
        }
    };

    function gaussBlur(imgData) {
        var pixes = imgData.data;
        var width = imgData.width;
        var height = imgData.height;
        var gaussMatrix = [],
            gaussSum = 0,
            x, y,
            r, g, b, a,
            i, j, k, len;

        var radius = 10;
        var sigma = 5;

        a = 1 / (Math.sqrt(2 * Math.PI) * sigma);
        b = -1 / (2 * sigma * sigma);
        //生成高斯矩阵
        for (i = 0, x = -radius; x <= radius; x++, i++) {
            g = a * Math.exp(b * x * x);
            gaussMatrix[i] = g;
            gaussSum += g;

        }
        //归一化, 保证高斯矩阵的值在[0,1]之间
        for (i = 0, len = gaussMatrix.length; i < len; i++) {
            gaussMatrix[i] /= gaussSum;
        }
        //x 方向一维高斯运算
        for (y = 0; y < height; y++) {
            for (x = 0; x < width; x++) {
                r = g = b = a = 0;
                gaussSum = 0;
                for (j = -radius; j <= radius; j++) {
                    k = x + j;
                    if (k >= 0 && k < width) { //确保 k 没超出 x 的范围
                        //r,g,b,a 四个一组
                        i = (y * width + k) * 4;
                        r += pixes[i] * gaussMatrix[j + radius];
                        g += pixes[i + 1] * gaussMatrix[j + radius];
                        b += pixes[i + 2] * gaussMatrix[j + radius];
                        // a += pixes[i + 3] * gaussMatrix[j];
                        gaussSum += gaussMatrix[j + radius];
                    }
                }
                i = (y * width + x) * 4;
                // 除以 gaussSum 是为了消除处于边缘的像素, 高斯运算不足的问题
                // console.log(gaussSum)
                pixes[i] = r / gaussSum;
                pixes[i + 1] = g / gaussSum;
                pixes[i + 2] = b / gaussSum;
                // pixes[i + 3] = a ;
            }
        }
        //y 方向一维高斯运算
        for (x = 0; x < width; x++) {
            for (y = 0; y < height; y++) {
                r = g = b = a = 0;
                gaussSum = 0;
                for (j = -radius; j <= radius; j++) {
                    k = y + j;
                    if (k >= 0 && k < height) { //确保 k 没超出 y 的范围
                        i = (k * width + x) * 4;
                        r += pixes[i] * gaussMatrix[j + radius];
                        g += pixes[i + 1] * gaussMatrix[j + radius];
                        b += pixes[i + 2] * gaussMatrix[j + radius];
                        // a += pixes[i + 3] * gaussMatrix[j];
                        gaussSum += gaussMatrix[j + radius];
                    }
                }
                i = (y * width + x) * 4;
                pixes[i] = r / gaussSum;
                pixes[i + 1] = g / gaussSum;
                pixes[i + 2] = b / gaussSum;
            }
        }
        //end
        return imgData;
    }

    // 模糊图片
    function blurImg(img, ele) {
        var w = img.width,
            h = img.height,
            canvasW = 40,
            canvasH = 40;

        var canvas = document.createElement('canvas'),
            ctx = canvas.getContext('2d');

        canvas.width = canvasW;
        canvas.height = canvasH;

        ctx.drawImage(img, 0, 0, w, h, 0, 0, canvasW, canvasH);

        var pixel = ctx.getImageData(0, 0, canvasH, canvasH);

        gaussBlur(pixel);

        ctx.putImageData(pixel, 0, 0);

        var imageData = canvas.toDataURL();

        ele.style.backgroundImage = 'url(' + imageData + ')';
        ele.style.backgroundRepeat = 'no-repeat';
        ele.style.backgroundSize = '100% 100%';
    }


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

    // assign
    Song.prototype.extend = Song.extend = function extend(target) {
        target = typeof target === 'object' ? target : {};

        var names = Object.getOwnPropertyNames(target);
        names.forEach((ele) => {
            if (typeof target[ele] === 'object' && target[ele] !== null && !target[ele].nodeType) {
                if (Array.isArray(target[ele])) {
                    this[ele] = [];
                    extend.call(this[ele], target[ele]);
                } else {
                    this[ele] = {};
                    extend.call(this[ele], target[ele]);
                }
            } else {
                this[ele] = target[ele];
            }
        });
    }

    var audio = new Audio();

    Song.prototype.extend({
        timer: null,
        /* 
         * Determine which song the user clicked on in the song list
         * @param {Number} index
         */
        loadSong: function (hash) {
            audio.pause();
            // var song = this.songList[index];
            // var songHash = hash;

            // 代理服务器 获取歌曲
            var self = this;
            ajax({
                method: 'post',
                url: '/getSong.js',
                data: hash,
                flag: true,
                success: function (data) {
                    // console.log(JSON.parse(data));

                    self.oneSong = JSON.parse(data).data;
                    self.readyToPlay(self.oneSong);
                }
            });
        },

        readyToPlay: function (data) {
            var time,
                firstTime,
                secondTime,
                lyricArr,
                lyrics = data.lyrics,
                str = '';

            var img = new Image();

            img.onload = () => {

                // 高斯模糊
                blurImg(img, document.querySelector(".play-wrapper"));

                this.imgDom.replaceChild(img, this.imgDom.firstElementChild);
            }

            img.crossOrigin = "Anonymous";
            img.src = data.img;

            audio.src = data.play_url;

            // Update song information
            this.songNameDom.innerHTML = data.audio_name;
            this.authorDom.innerHTML = data.author_name;

            // Calculate the total song time
            time = (data.timelength / 60000).toFixed(2).split('.');
            firstTime = time[0];
            secondTime = time[1];
            firstTime = secondTime > 60 ? (secondTime = secondTime - 60, ++firstTime) : firstTime;
            this.endTimeDom.innerHTML = `${String(firstTime).length == 2 ? firstTime : '0' + firstTime}:${String(secondTime).length == 2 ? secondTime : '0' + secondTime}`;

            // Prepare the lyrics
            lyricArr = lyrics.split('\n').map((ele, index) => {

                // [00: 02.33]作曲：周杰伦
                return ele.split(']').map((ele, index, arr) => {
                    return arr[index].replace(/\[(\d{2}):(\d{2})\..*/g, function ($, $1, $2) {
                        return $1 + ":" + $2;
                    });
                });
            });


            lyricArr.forEach((ele, index) => {
                ele[1] && (str += `<p>${ele[1]}</p>`);
            });

            this.lyricUiDom.innerHTML = str;

            this.playBtn.className = 'state';
            this.dialDom.className = 'dial paused';
            this.isPlay = false;

            // init start time
            this.startTimeDom.innerHTML = '00:00';

            // init once
            this.syncLyricsTime = syncLyricsTime.call(this);

            // Auto play 
            // Safari nonsupport
            var u = navigator.userAgent;
            if (u.indexOf('Android') > -1 || u.indexOf('Linux') > -1) {
                // alert('安卓手机');
                setTimeout(() => {
                    this.playBtn.click();
                }, 400);

            } else if (u.indexOf('iPhone') > -1) {
                // alert('苹果手机');
                // ....

            }
            //else if (u.indexOf('Windows Phone') > -1) {
            //     // alert('win phone');

            // }

        },


        play: function () {
            audio.play();
            this.timer = setTimeout(this.syncLyricsTime.bind(this), 16)
        },

        pause: function () {
            audio.pause();
            clearTimeout(this.timer);
        },

        next: function () {
            this.index++;
            this.index = this.index % this.songList.length;
            this.hash = this.songList[Math.abs(this.index)].FileHash;

            console.log(this.index);
            this.loadSong(this.hash);
        },

        prev: function () {
            this.index--;
            this.index = this.index % this.songList.length;
            this.hash = this.songList[Math.abs(this.index)].FileHash;

            console.log(this.index);
            this.loadSong(this.hash);
        }
    });

    function syncLyricsTime() {
        clearTimeout(this.timer);
        var a = +new Date();
        var firstTime = '00';
        var secondTime = '00';

        return function () {
            var currentTime,
                timer,
                info = this.oneSong;

            clearTimeout(this.timer);

            // Gets the current playback time
            currentTime = (audio.currentTime / 60).toFixed(2).split('.');
            currentTime[0] = currentTime[1] > 60 ? (currentTime[1] = currentTime[1] - 60, ++currentTime[0]) : currentTime[0];
            currentTime = currentTime.join(':');


            // Update time 
            // 00:00
            var b = +new Date();
            if (b - a >= 1000) {
                console.log(1);
                a = b;
                ++secondTime;
                firstTime = secondTime > 60 ? (secondTime = secondTime - 60, ++firstTime) : firstTime;
                this.startTimeDom.innerHTML = `${String(firstTime).length == 2 ? firstTime : '0' + firstTime}:${String(secondTime).length == 2 ? secondTime : '0' + secondTime}`;
            }

            this.timer = setTimeout(this.syncLyricsTime.bind(this), 16);

        }
    }

    global.Song = Song;
    return Song;
});