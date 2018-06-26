var common = {
    bindEvent: function () {
        var menu = document.querySelector('.nav .nav-top .icon'),
            rightWrapper = document.querySelector('.right-wrapper'),
            leftWrapper = document.querySelector('.left-wrapper'),
            baffle = document.querySelector('.baffle');

        menu.flag = false;
        menu.onclick = () => {
            if (menu.flag) {
                leftWrapper.style.left = '';
                rightWrapper.style = '';
                baffle.style.display = 'none';
                menu.flag = false;
            } else {
                leftWrapper.style.left = '0';
                rightWrapper.style.position = 'fixed';
                rightWrapper.style.right = '-80%';
                baffle.style.display = 'block';
                menu.flag = true;
            }
        }

        // switch UI eg: recommendui , findui, rankui, playlistui
        $('.ct-content').on('swipeLeft', function (e) {
            console.log('left');
            console.log(e);
        }).on('swipeRight', function (e) {
            console.log('right');
        });

    },

    init: function () {
        this.bindEvent();
    }
}

module.exports = common;