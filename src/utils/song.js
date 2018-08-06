/*
 * StartTime: 2018-5-28 19:28
 * 酷狗接口：
 * searchUrl = http://songsearch.kugou.com/song_search_v2?callback=Song.doJSON&keyword
 * songUrl = http: //www.kugou.com/yy/index.php?r=play/getdata&hash=;
 * 
 * entry: loadSong();
 */

'use strict';
var audio = new Audio();

// Constructor function
function Song() {
    if (!(this instanceof Song)) {
        throw new Error("Illegal constructor.");
    }
};

// 高斯
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

    var g = new Image();

    g.src = imageData;

    g.onload = function () {
        ele.replaceChild(g, ele.firstElementChild);
    }
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

/**
 * @method
 *      Create the image document based on the image resource path and insert it into the {dom} document
 * @param {String} imgSrc
 * @param {Element} dom
 */
function readyImage(dom, imgSrc = '../images/ldh.jpg') {
    var img = new Image();

    // previous image
    var prev = dom.firstElementChild;

    img.onload = () => {
        // 高斯模糊
        blurImg(img, document.querySelector(".play-bg"));

        dom.replaceChild(img, prev);
    }

    img.onerror = function () {
        readyImage(dom);
    }

    img.crossOrigin = "Anonymous";
    img.src = imgSrc;
}



/**
 * Format the time and output it.
 * @example 
 *      '00:23'
 *      '02:45'
 *          |
 *          |----> No more than 60s
 * @method
 * 
 * @param {Number} time The total number of seconds
 * @returns {String} Returns after formating
 */
function parseCurrentTime(time) {
    var currentTime = [];

    if (time >= 60) {
        currentTime = (time / 60).toFixed(2).split('.');
        currentTime[0] = currentTime[1] >= 60 ? (currentTime[1] = currentTime[1] - 60, ++currentTime[0]) : currentTime[0];
    } else {
        currentTime[0] = '00';
        currentTime[1] = time.toFixed(0);
    }

    return `${String(currentTime[0]).length == 2 ? currentTime[0] : '0' + currentTime[0]}:${String(currentTime[1]).length == 2 ? currentTime[1] : '0' + currentTime[1]}`;
}

function renderTime(time, dom) {
    dom.innerHTML = parseCurrentTime(time);
}

function parseLyrics(lyrics) {

    // Prepare the lyrics
    var lyricsArr = lyrics.split('\n').map((ele, index) => {

        // eg: '[00: 02.33]作曲：周杰伦'  ==>  ['00:02', '作曲：周杰伦']
        return ele.split(']').map((ele, index, arr) => {
            return arr[index].replace(/\[(\d{2}):(\d{2})\..*/g, function ($, $1, $2) {
                return $1 + ":" + $2;
            });
        });
    });

    return lyricsArr;
}

function renderLyrics(lyrics, dom) {
    var str = '';

    parseLyrics(lyrics).forEach((ele, index) => {

        ele[1] && (str += `<p>${ele[1]}</p>`);
    });

    dom.innerHTML = str;
}

function rollingLyrics(lyricsArr, dom) {
    var currentTime = parseCurrentTime(audio.currentTime).split(':');

    var children = Array.from(dom.children);


    lyricsArr.forEach(function (ele, index) {
        // ele ==> ["01:54", "Sorry like an angel"]
        var [first, second] = ele[0].split(':');

        if (first == currentTime[0] && second == currentTime[1]) {

            children.forEach(function (ele) {
                ele.style = '';
            });

            dom.style.marginTop = -index * 30 + 'px';
            dom.children[index].style.color = 'blue';

        }
    });
}

function rollingBar(per) {
    this.style.right = this.offsetWidth - (this.offsetWidth * per) + 'px';
}

function syncLyricsTime(lyArr) {
    rollingLyrics(lyArr, this.lyricUiDom);
    renderTime(audio.currentTime, this.startTimeDom);
    rollingBar.call(document.querySelector('.progress-bar .bar .slide'), audio.currentTime / audio.duration);
}

function slideProgressBar() {
    // bind slide time
    var bar = document.querySelector('.progress-bar .bar-wrap');
    var slide = document.querySelector('.bar-wrap .bar .slide');

    bar.ontouchstart = () => {
        var
            left = bar.offsetLeft,
            w = bar.offsetWidth,
            right = left + w;

        document.ontouchmove = (e) => {

            var {
                clientX: newX
            } = e.touches[0];

            // console.log();
            if (newX < left) {
                newX = left;
            } else if (newX > right) {
                newX = right;
            }

            // Percentage of current slippage
            var percentage = (newX - left) / w;

            audio.currentTime = audio.duration * percentage;
            renderTime(audio.currentTime, this.startTimeDom);
            rollingBar.call(slide, percentage);
        }
    }

    bar.ontouchend = function (e) {
        document.ontouchmove = null;
    }

    audio.onended = () => {
        console.log('end');
        this.startTimeDom.innerHTML = '00:00';

        audio.play();

    }
}

function renderSongInfo(name, author, data) {
    // Update playUi title information
    name.innerHTML = data.audio_name;
    author.innerHTML = data.author_name;
}

function render(data) {
    readyImage(this.imgDom, data.img);
    readyImage(this.pImg, data.img);
    renderSongInfo(this.songNameDom, this.authorDom, data);
    renderTime(audio.duration, this.endTimeDom);
    renderLyrics(data.lyrics, this.lyricUiDom);
}

// Initialize some work before playing
function beforePlay(data) {
    this.isPlay = false;
    this.playBtn.className = 'state';

    // Change the wheel
    this.dialDom.className = 'dial paused';
    this.dialDom.style.opacity = 1;

    // init start time
    this.startTimeDom.innerHTML = '00:00';

    render.call(this, data);

    // Auto play 
    // Safari nonsupport
    var u = navigator.userAgent;
    if (u.indexOf('Android') > -1 || u.indexOf('Linux') > -1) {
        // alert('安卓手机');
        setTimeout(() => {
            this.playBtn.click();
        }, 300);

    } else if (u.indexOf('iPhone') > -1) {
        // alert('苹果手机');
        // ....
    }

    bindEvent.call(this);
}

function bindEvent() {
    // this ==> song
    audio.ontimeupdate = syncLyricsTime.bind(this, parseLyrics(this.oneSong.lyrics));

    slideProgressBar.call(this);

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

                self.oneSong = JSON.parse(data).data;

                audio.onloadedmetadata = beforePlay.bind(self, self.oneSong);
                audio.src = self.oneSong.play_url;
            }
        });
    },


    play: function () {
        audio.play();
    },

    pause: function () {
        audio.pause();
        clearTimeout(this.timer);
    },

    next: function () {
        this.index++;
        this.index = this.index % this.songList.length;
        this.hash = this.songList[this.index].FileHash;

        this.loadSong(this.hash);
    },

    prev: function () {
        if (this.index === 0) {
            this.index = this.songList.length - 1;
        } else {
            this.index--;
        }

        this.index = this.index % this.songList.length;
        this.hash = this.songList[Math.abs(this.index)].FileHash;

        this.loadSong(this.hash);
    }
});

module.exports = Song;