var common = {
    bindEvent: function () {
        var menu = document.querySelector('.nav .nav-top .icon'),
            rightWrapper = document.querySelector('.right-wrapper'),
            leftWrapper = document.querySelector('.left-wrapper'),
            baffle = document.querySelector('.right-wrapper .baffle');

        menu.flag = false;
        menu.onclick = () => {
            if (menu.flag) {
                leftWrapper.style.left = '';
                rightWrapper.style = '';
                baffle.style.display = 'none';
                menu.flag = false;
            } else {
                leftWrapper.style.left = '0';
                rightWrapper.style.right = '-80%';
                rightWrapper.style.position = 'fixed';
                baffle.style.display = 'block';
                menu.flag = true;
            }
        }

    },

    init: function () {
        this.bindEvent();
    }
}

module.exports = common;