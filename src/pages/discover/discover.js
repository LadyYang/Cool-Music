require('../../utils/zepto.min.js');
require('../../utils/touch.js');

/**
 * @description slideshow module
 */

// Slideshow Object
var slideshow = {
    createImage: function (dom, index) {
        var image = new Image();
        image.onload = () => {
            dom.appendChild(image);
        };

        // image.src = import(imageArr[index]);
        image.src = this.path[index];
    },

    renderImage: function () {
        /* slidershow */
        Array.from(this.sliderLi).forEach((ele, index) => {
            if (index == 0) {
                this.createImage(ele, index);
            } else {
                setTimeout(() => {
                    this.createImage(ele, index);
                }, 0);
            }
        });
    },

    slide: function slide(dir) {
        dir = dir || 'right-left';
        clearTimeout(this.sliderLiArr.timer);

        this.lastIndex = this.index;
        if (dir === 'right-left') {
            this.index++;
        } else if (dir === 'left-right') {
            this.index--;
        }
        this.index = this.index % this.sliderLiArr.length;

        // console.log(index);
        this.sliderLiArr[Math.abs(this.lastIndex)].style.opacity = '';
        this.sliderLiArr[Math.abs(this.index)].style.opacity = 1;

        $('.slider-active').removeClass('slider-active');
        $('.slider-index span').eq(this.index).addClass('slider-active');
        this.sliderLiArr.timer = setTimeout(() => {
            this.slide('right-left');
        }, 4000);
    },

    bindEvent: function () {
        $('.slider-index span').on('click', function () {
            clearTimeout(this.sliderLiArr.timer);

            var n = $(this).index();

            this.sliderLiArr[Math.abs(this.lastIndex)].style.opacity = '';
            this.sliderLiArr[n].style.opacity = 1;
            $('.slider-active').removeClass('slider-active');
            $('.slider-index span').eq(n).addClass('slider-active');
            this.lastIndex = n;
            index = n;

            this.sliderLiArr.timer = setTimeout(() => {
                show('right-left');
            }, 3000);
        });

        $(this.slideshowDom).on('swipeLeft', () => {
            this.slide('right-left');
        });

        $(this.slideshowDom).on('swipeRight', () => {
            this.slide('left-right');
        });
    },

    init: function () {
        this.index = -1;
        this.lastIndex = 0;
        this.path = ['../../images/slide01.jpg', '../../images/slide02.jpg', '../../images/slide03.jpg', '../../images/slide04.jpg', '../../images/slide05.jpg', '../../images/slide06.jpg'];
        this.sliderLi = document.querySelectorAll('.slider li');
        this.slideshowDom = document.querySelector('.slideshow');
        this.sliderLiArr = Array.from(document.getElementsByClassName('slider')[0]['children']);
        this.slideshowDom.style.height = this.slideshowDom.offsetWidth / 2.2 + 'px';

        this.sliderLiArr.timer = setTimeout(() => {
            this.slide('right-left');
        }, 30);

        this.bindEvent();
        this.renderImage();
    }
}

// 瀑布流界面对象
var waterfall = {
    init: function () {
        // picture path
        this.path = ["../../images/18742275209205360.jpg", "../../images/18924794137858123.jpg",
            "../../images/19019352137865075.jpg", "../../images/109951163315570256.jpg", "../../images/109951163324132839.jpg",
            "../../images/109951163325479921.jpg", "../../images/18742275209205360.jpg", "../../images/18924794137858123.jpg",
            "../../images/109951163315570256.jpg", "../../images/19019352137865075.jpg", "../../images/109951163324132839.jpg",
            "../../images/109951163325479921.jpg"
        ];
        this.wfImgArr = Array.from(document.querySelectorAll('.wf-image'));
        /* waterfull */
        this.wfImgArr.forEach((ele, index) => {
            slideshow.createImage.call(this, ele, index);
        });
    },

}

// soso Object
const Song = require('../play/song.js');
class SOSO extends Song {
    constructor() {
        super();

        window.doJSON = data => {
            this.cb(data);
        }

        this.inputDom = document.querySelector('input');
        this.targetDom = document.querySelector('.song_wrapper .song_list');
        this.playUiBackBtn = document.querySelector('.play-nav .back');
        this.playUiDom = document.querySelector('.play-UI');

        // Play screen return button
        this.playUiBackBtn.onclick = () => {
            discover.main.style.display = 'block';
            this.playUiDom.style.top = '100%';
        }

        // equalizer
        (function () {
            function equalizer() {
                document.querySelectorAll('#music-bars span')[(Math.floor(Math.random() * 15))].classList.toggle('move');

                setTimeout(equalizer, 30);
            }

            document.querySelectorAll('#music-bars span').forEach((ele, index) => {
                ele.style.left = index * 2 + 'px';
            })

            setTimeout(equalizer, 30);

        })();

    }

    // callback of jsonp 
    cb(data) {
        // // 搜索的所有歌曲信息 songList
        this.songList = data.data.lists;

        if (this.songList.length) {
            this.createDom(this.targetDom, this.songList);
        }
    }

    // create song list
    createDom(obj, songList) {
        var str = '';

        songList.forEach(function (ele) {
            var itemStr = `<li class="song_item"> 
                                <div class="singer_name">${ele.SongName}</div>
                        </li>`;
            str += itemStr;
        });

        obj.innerHTML = str;
    }

    // 防抖
    debounce(handle, delay) {
        var timer = null;

        return function (e) {
            var args = arguments;
            clearTimeout(timer);

            timer = setTimeout(() => {
                handle.apply(this, args);
            }, delay)
        }
    }

    clickSongList(e) {
        var singerName = Array.from(document.getElementsByClassName('singer_name'));
        var target = e.target;

        // Select a song to display the play Ui
        if (target.className === 'singer_name') {
            this.inputDom.value = '';
            this.index = singerName.indexOf(target);

            let hash = this.songList[this.index].FileHash;

            // this.songHash
            if (this.songHash.indexOf(hash) === -1) {
                this.songHash.unshift(hash);
                localStorage.hash = JSON.stringify(this.songHash);
            }

            this.loadSong(hash);

            this.renderPlayUI();

        }
    }

    // jsonp 加载this.歌曲资源
    loadSongList() {
        var searchUrl = 'http://songsearch.kugou.com/song_search_v2?callback=doJSON&keyword=';
        // this---> this.input
        if (this.value) {
            var script = document.createElement('script');
            script.type = 'text/javascript';
            script.src = searchUrl + this.value;
            // script.src = `https://c.y.qq.com/soso/fcgi-bin/client_search_cp?ct=24&qqmusic_ver=1298&new_json=1&remoteplace=txt.yqq.center&searchid=49493059975831973&t=0&aggr=1&cr=1&catZhida=1&lossless=0&flag_qc=0&p=1&n=20&w=${this.value}&g_tk=1175838790&jsonpCallback=cb&loginUin=0&hostUin=0&format=jsonp&inCharset=utf8&outCharset=utf-8&notice=0&platform=yqq&needNewCode=0`;
            document.body.appendChild(script);
            document.body.removeChild(script);
        }
    }

    renderPlayUI() {
        // load playUI and prepare to initialize
        this.playUiDom.style.top = '0%';
        discover.cancel.click();
        discover.main.style.display = 'none';
    }

}

// page object
var discover = {
    hasLocalStorage() {

    },

    bindEvent: function () {
        var playBtn = document.querySelector('.discover .top .play');
        playBtn.onclick = this.so.renderPlayUI.bind(this.so);

        // when click soso input
        function clickSOSO() {
            var soso = document.querySelector('.soso input'),
                play = document.querySelector('.top .play'),
                content = document.querySelector('.discover .content'),
                songWrapper = document.querySelector('.discover .song_wrapper'),
                songList = document.querySelector('.song_wrapper .song_list');

            soso.onclick = function () {
                if (!content.style.display) {
                    // document.body.style.backgroundColor = '#fff';
                    soso.className = 'running'
                    play.style.display = 'none';
                    discover.cancel.style.display = 'inline-block';
                    content.style.display = 'none';
                    songWrapper.style.display = 'block';
                }
            }

            discover.cancel.onclick = function () {
                // document.body.style.backgroundColor = '';
                soso.className = '';
                play.style.display = '';
                discover.cancel.style.display = '';
                content.style.display = '';
                songWrapper.style.display = '';
                soso.value = '';
                songList.innerHTML = '';
            }
        }



        clickSOSO();
    },

    render: function () {

    },

    init: function () {
        this.cancel = document.querySelector('.top .cancel');
        this.main = document.querySelector('.discover .main');
        this.so = new SOSO();

        slideshow.init();
        waterfall.init();

        this.bindEvent();
        this.so.bindEvent();

        console.log(this.so);

    }
}

module.exports = discover;