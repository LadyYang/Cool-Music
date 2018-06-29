var common = {
    bindEvent: function () {
        var menu = document.querySelector('.nav .nav-top .icon'),
            content = document.querySelector('.content'),
            leftWrapper = document.querySelector('.left-wrapper'),
            nav = document.querySelector('.nav'),
            pBottom = document.querySelector('.p-bottom'),
            ctList = document.querySelector('.ct-list'),
            baffle = document.querySelector('.baffle');

        menu.flag = false;
        menu.onclick = () => {
            if (menu.flag) {
                leftWrapper.style.left = '';
                content.style = '';
                baffle.style.display = 'none';
                nav.style.right = "";
                pBottom.style.right = "";
                menu.flag = false;
            } else {
                baffle.style.display = 'block';
                leftWrapper.style.left = '0';
                content.style.position = 'fixed';
                content.style.right = "-80%";
                nav.style.right = "-80%";
                pBottom.style.right = "-80%";
                menu.flag = true;
            }
        }

        // switch UI eg: recommendui , findui, rankui, playlistui
        var n = 0;
        $('.content').on('swipeLeft', function (e) {
            if (e.path.some(function (ele) {
                    return ele.className === 'slideshow';
                })) {
                return;
            }
            if (n !== 3) {
                n++;
                ctList.style.left = -100 * n + '%';
            }
        }).on('swipeRight', function (e) {
            if (n > 0) {
                n--;
                ctList.style.left = -100 * n + '%';
            }

        });

    },

    init: function () {
        this.bindEvent();
    }
}

module.exports = common;