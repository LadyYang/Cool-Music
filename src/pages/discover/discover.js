require('../../utils/zepto.min.js');
require('../../utils/touch.js');

/**
 * @description slideshow module
 */
var index = -1,
    lastIndex = 0,
    sliderLiArr = Array.from(document.getElementsByClassName('slider')[0]['children']);

// Slideshow Object
var slideshow = {
    path: ['../../images/slide01.jpg', '../../images/slide02.jpg', '../../images/slide03.jpg', '../../images/slide04.jpg', '../../images/slide05.jpg', '../../images/slide06.jpg'],
    sliderLi: document.querySelectorAll('.slider li'),
    slideshowDom: document.querySelector('.slideshow'),

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
        clearTimeout(sliderLiArr.timer);

        lastIndex = index;
        if (dir === 'right-left') {
            index++;
        } else if (dir === 'left-right') {
            index--;
        }
        index = index % sliderLiArr.length;

        // console.log(index);
        sliderLiArr[Math.abs(lastIndex)].style.opacity = '';
        sliderLiArr[Math.abs(index)].style.opacity = 1;

        $('.slider-active').removeClass('slider-active');
        $('.slider-index span').eq(index).addClass('slider-active');
        sliderLiArr.timer = setTimeout(() => {
            this.slide('right-left');
        }, 4000);
    },

    bindEvent: function () {
        $('.slider-index span').on('click', function () {
            clearTimeout(sliderLiArr.timer);

            var n = $(this).index();

            sliderLiArr[Math.abs(lastIndex)].style.opacity = '';
            sliderLiArr[n].style.opacity = 1;
            $('.slider-active').removeClass('slider-active');
            $('.slider-index span').eq(n).addClass('slider-active');
            lastIndex = n;
            index = n;

            sliderLiArr.timer = setTimeout(() => {
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
        this.bindEvent();
        this.renderImage();

        this.slideshowDom.style.height = this.slideshowDom.offsetWidth / 2.2 + 'px';

        sliderLiArr.timer = setTimeout(() => {
            this.slide('right-left');
        }, 30);

    }
}


// 瀑布流界面对象
var waterfall = {
    path: ["../../images/18742275209205360.jpg", "../../images/18924794137858123.jpg",
        "../../images/19019352137865075.jpg", "../../images/109951163315570256.jpg", "../../images/109951163324132839.jpg",
        "../../images/109951163325479921.jpg", "../../images/18742275209205360.jpg", "../../images/18924794137858123.jpg",
        "../../images/109951163315570256.jpg", "../../images/19019352137865075.jpg", "../../images/109951163324132839.jpg",
        "../../images/109951163325479921.jpg"
    ],
    wfImgArr: Array.from(document.querySelectorAll('.wf-image')),

    init: function () {
        /* waterfull */
        this.wfImgArr.forEach((ele, index) => {
            slideshow.createImage.call(this, ele, index);
        });
    },

}

/**
 * @description Recommend UI Object
 *     推荐总界面
 */
var recommend = {
    slideshow: slideshow,
    waterfall: waterfall,

    init: function () {
        slideshow.init();
        waterfall.init();
    }
}

// page object
var discover = {
    recommend: recommend,

    init: function () {
        require('./discover.css')
        
        recommend.init();
    }
}

module.exports = discover;