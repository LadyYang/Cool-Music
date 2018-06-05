/*!
 * Date: 2018-5-28 19:28
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

    Song.prototype.extend = Song.extend = function extend(target) {
        target = typeof target === 'object' ? target : {};

        var names = Object.getOwnPropertyNames(target);
        names.forEach((ele) => {
            if (typeof target[ele] === 'object') {
                if (Array.isArray(target[ele])) {
                    this[ele] = [];
                    extend.call(this[ele], target[ele]);
                } else {
                    this[ele] = {};
                    extend.call(this[ele], target[ele]);
                }
            }
            this[ele] = target[ele];
        })
    }

    var audio = new Audio();

    Song.prototype.extend({
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
                    self.startPlay(self.oneSong);
                }
            });
        },

        startPlay: function (data) {
            var audio_name = data.album_name,
                author_name = data.author_name,
                time,
                lyrics = data.lyrics;

            var img = new Image();
            img.onload = () => {
                this.imgDoc.appendChild(img);
            }

            img.src = data.img;
            audio.src = data.play_url;
            // audio.onloadedmetadata = () => {
            //     this.play();
            // }
            time = (data.timelength / 60000).toFixed(2).split('.');
            var firstTime = time[0];
            var secondTime = time[1];
            firstTime = secondTime > 60 ? (secondTime = secondTime - 60, ++firstTime) : firstTime;
            this.timeDom.innerHTML = `${firstTime}:${secondTime}`;
        },

        play: function () {
            audio.play();
            this.syncLyricsTime();
        },

        pause: function () {
            audio.pause();
        },

        syncLyricsTime: function (lyricsDom) {
            var info = this.oneSong;
            var lyrics = info.lyrics;
            var author = info.authors[0].author_name;
            
            

            // Get current progress time
            var currentTime = (audio.currentTime / 60).toFixed(2).split('.');
            currentTime[0] = currentTime[1] > 60 ? (currentTime[1] = currentTime[1] - 60, ++currentTime[0]) : currentTime[0];
            currentTime = currentTime.join('.');


            var lyricTimeArr = lyrics.split('\n').map((ele, index) => {
                // [00: 02.33]作曲：周杰伦
                return ele.split(']').map((ele, index, arr) => {
                    return arr[index].replace(/\[(\d{2}):(\d{2})\..*/g, function ($, $1, $2) {
                        return $1 + ":" + $2;
                    });
                });
            });

            var str = '';
            lyricTimeArr.forEach((ele, index) => {
                ele[1] && (str += `<p>${ele[1]}</p>`);
            });

            console.log(str);
            

            console.log(lyricTimeArr);
        }
    });

    global.Song = Song;
    return Song;
});