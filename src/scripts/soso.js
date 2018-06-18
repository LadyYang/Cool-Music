var song = new Song();

function doJSON(data) {
    song.cb(data);
}

song.extend({
    searchUrl: 'http://songsearch.kugou.com/song_search_v2?callback=doJSON&keyword=',
    inputDom: document.querySelector('input'),
    targetDom: document.querySelector('.song_wrapper .song_list'),
    imgDom: document.querySelector('.play-main .dial .zz'),
    songNameDom: document.querySelector('.play-nav .name'),
    authorDom: document.querySelector('.play-nav .author'),
    endTimeDom: document.querySelector('.play-UI .play-bottom .progress-bar .end-time'),
    startTimeDom: document.querySelector('.play-UI .play-bottom .progress-bar .start-time'),
    lyricUiDom: document.querySelector('.play-main .ly-list'),
    dialDom: document.querySelector('.play-main .dial'),
    ctDom: document.querySelector('.ct'),
    playUiBackBtn: document.querySelector('.play-nav .back'),
    playBtn: document.querySelector('.play-UI .play-bottom .state'),
    playBtn2: document.querySelector('.p-bottom .state'),
    playUiDom: document.querySelector('.play-UI'),
    pImg: document.querySelector('.p-bottom .p-img'),
    isPlay: false,


    // callback of jsonp 
    cb: function (data) {
        // // 搜索的所有歌曲信息 songList
        this.songList = data.data.lists;
        console.log(this.songList);
        if (this.songList.length) {
            this.createDom(this.targetDom, this.songList);
        }
    },

    // create song list
    createDom: function (obj, songList) {
        var str = '';

        songList.forEach(function (ele) {
            var itemStr = `<li class="song_item"> 
                                <div class="singer_name">${ele.SongName}</div>
                        </li>`;
            str += itemStr;
        });

        obj.innerHTML = str;
    },

    // 防抖
    debounce: function (handle, delay) {
        var timer = null;

        return function (e) {
            var args = arguments;
            clearTimeout(timer);

            timer = setTimeout(() => {
                handle.apply(this, args);
            }, delay)
        }
    },

    // jsonp 加载歌曲资源
    loadSongList: function () {
        // this---> this.input
        if (this.value) {
            var script = document.createElement('script');
            script.type = 'text/javascript';
            script.src = song.searchUrl + this.value;
            // script.src = `https://c.y.qq.com/soso/fcgi-bin/client_search_cp?ct=24&qqmusic_ver=1298&new_json=1&remoteplace=txt.yqq.center&searchid=49493059975831973&t=0&aggr=1&cr=1&catZhida=1&lossless=0&flag_qc=0&p=1&n=20&w=${this.value}&g_tk=1175838790&jsonpCallback=cb&loginUin=0&hostUin=0&format=jsonp&inCharset=utf8&outCharset=utf-8&notice=0&platform=yqq&needNewCode=0`;
            document.body.appendChild(script);
            document.body.removeChild(script);
        }
    },

    bindEvent: (function () {
        var flag = true,
            nav = document.getElementsByClassName('nav')[0],
            content = document.getElementsByClassName('content')[0],
            nextBtn = document.querySelector('.play-bottom .next'),
            prevBtn = document.querySelector('.play-bottom .prev'),
            singer = document.getElementsByClassName('song_list')[0],
            pBottom = document.querySelector('.p-bottom');

        return function () {
            if (flag) {

                var self = this;

                function playBtnEvent() {
                    if (this.isPlay) {
                        this.isPlay = false;
                        this.dialDom.classList.add('paused');
                        this.pImg.classList.add('paused');
                        this.playBtn.classList.remove('pause-btn');
                        this.playBtn2.classList.remove('pause-btn');
                        this.pause();
                    } else {
                        this.isPlay = true;
                        this.play();
                        this.dialDom.classList.remove('paused');
                        this.pImg.classList.remove('paused');
                        this.playBtn.classList.add('pause-btn');
                        this.playBtn2.classList.add('pause-btn');
                    }
                }

                // 播放界面的播放按钮
                this.playBtn.onclick = () => {
                    // this ==> song
                    playBtnEvent.call(this);
                }

                // 底部小界面的播放按钮
                this.playBtn2.onclick = () => {
                    // this ==> song
                    playBtnEvent.call(this);
                }

                this.inputDom.oninput = this.debounce(this.loadSongList, 300);

                // Click on a single song
                singer.onclick = function (e) {
                    var singerName = Array.from(document.getElementsByClassName('singer_name'));
                    var target = e.target;

                    // Select a song to display the play Ui
                    if (target.className === 'singer_name') {
                        self.inputDom.value = '';
                        self.index = singerName.indexOf(target);

                        self.hash = self.songList[self.index].FileHash;

                        // Switch interface ct between play
                        switchPlayUI.call(self);

                        self.loadSong(self.hash);
                    }
                }

                function switchPlayUI() {
                    this.ctDom.style.display = 'none';
                    this.playUiDom.style.top = '0';
                }

                this.pImg.addEventListener('click', switchPlayUI.bind(this));

                nextBtn.onclick = () => {
                    this.next();
                }

                prevBtn.onclick = () => {
                    this.prev();
                }

                function slideUpToDown() {
                    // console.log(e);
                    var first = 0,
                        second = 0;

                    return function (e) {

                    }
                }

                this.playUiDom.touchstart = (() => {
                    var first = 0,
                        second = 0;



                });

                // click input
                this.inputDom.onclick = function () {
                    nav.classList.add('active');
                    content.style.display = 'none';
                    self.targetDom.parentElement.style.display = 'block';
                    pBottom.style.bottom = '-50px';
                }

                // cancle click
                this.inputDom.nextElementSibling.onclick = function () {
                    nav.classList.remove('active');
                    content.style = '';
                    this.previousElementSibling.value = '';
                    self.targetDom.parentElement.style.display = '';
                    self.targetDom.innerHTML = '';
                    pBottom.style = '';
                }

                // Play screen return button
                this.playUiBackBtn.onclick = () => {
                    this.ctDom.style = '';
                    this.playUiDom.style = '';
                }

                // click show lyrics
                this.dialDom.onclick = function () {
                    this.style.opacity = 0;
                    this.style.display = 'none';
                    self.lyricUiDom.parentNode.style.display = 'block';
                    self.lyricUiDom.parentNode.style.opacity = 1;
                }

                // click show dial
                this.lyricUiDom.parentNode.onclick = function () {
                    this.style.opacity = 0;
                    this.style.display = 'none';
                    self.dialDom.style.display = 'block';
                    self.dialDom.style.opacity = 1;
                }

                var menu = document.querySelector('.nav .nav-top .icon');
                var rightWrapper = document.querySelector('.ct .right-wrapper');
                menu.flag = false;
                menu.onclick = () => {
                    if (menu.flag) {
                        this.ctDom.style.left = '-100%';
                        rightWrapper.style.right = '0';
                        menu.flag = false;
                    } else {
                        this.ctDom.style.left = '-20%';
                        rightWrapper.style.right = '-80%';
                        menu.flag = true;
                    }
                }

                flag = false;
            } else {
                throw new Error('You can\'t perform this function');
            }
        }
    })(),

})

song.bindEvent();