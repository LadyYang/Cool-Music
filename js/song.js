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
                    console.log(JSON.parse(data));

                    self.oneSong = JSON.parse(data).data;
                    self.startPlay(self.oneSong);
                }
            });
        },

        startPlay: function (data) {
            var audio_name = data.album_name,
                author_name = data.author_name,
                lyrics = data.lyrics,
                time = data.timelength;

            var img = new Image();
            img.onload = () => {
                this.imgDoc.appendChild(img);
            }

            img.src = data.img;

            audio.src = data.play_url;
            audio.autoplay = true;
        },

        play: function () {
            audio.play();
        },

        pause: function () {
            audio.pause();
        }

    })

    global.Song = Song;
    return Song;
});