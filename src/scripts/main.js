require('./zepto.min.js');
require('./control.js');
require('../css/index.css');

var sliderLi = Array.from(document.getElementsByClassName('slider')[0]['children']);
var index = -1;
var lastIndex = 0;

sliderLi.forEach(function (ele) {
    $(ele).on('swipeLeft', function () {
        show('right-left');
    });

    $(ele).on('swipeRight', function () {
        show('left-right');
    });
});

$('.slider-index span').on('click', function () {
    clearTimeout(sliderLi.timer);

    var n = $(this).index();
    console.log(n);
    sliderLi[Math.abs(lastIndex)].style.opacity = '';
    sliderLi[n].style.opacity = 1;
    $('.slider-active').removeClass('slider-active');
    $('.slider-index span').eq(n).addClass('slider-active');
    lastIndex = n;
    index = n;

    sliderLi.timer = setTimeout(() => {
        show('right-left');
    }, 3000);
})

function show(dir) {
    dir = dir || 'right-left';
    clearTimeout(sliderLi.timer);

    lastIndex = index;
    if (dir === 'right-left') {
        index++;
    } else if (dir === 'left-right') {
        index--;
    }
    index = index % sliderLi.length;

    // console.log(index);
    sliderLi[Math.abs(lastIndex)].style.opacity = '';
    sliderLi[Math.abs(index)].style.opacity = 1;

    $('.slider-active').removeClass('slider-active');
    $('.slider-index span').eq(index).addClass('slider-active');
    sliderLi.timer = setTimeout(() => {
        show('right-left');
    }, 4000);
}

sliderLi.timer = setTimeout(() => {
    show('right-left');
}, 30);

var wfImage = Array.from(document.getElementsByClassName('wf-image')),
    slideshow = document.getElementsByClassName('slideshow')[0],
    sliderLiImg = document.querySelectorAll('.slider li'),
    imageArr = ["../images/18742275209205360.jpg", "../images/18924794137858123.jpg",
        "../images/19019352137865075.jpg", "../images/109951163315570256.jpg", "../images/109951163324132839.jpg",
        "../images/109951163325479921.jpg", "../images/18742275209205360.jpg", "../images/18924794137858123.jpg",
        "../images/109951163315570256.jpg", "../images/19019352137865075.jpg", "../images/109951163324132839.jpg",
        "../images/109951163325479921.jpg"
    ];
slideshow.style.height = slideshow.offsetWidth / 2.2 + 'px';

function loadImage(dom, imageArr, index) {
    var image = new Image();
    image.onload = function () {
        dom.appendChild(image);
    };

    // image.src = import(imageArr[index]);
    image.src = imageArr[index];
}

/* waterfull */
wfImage.forEach(function (ele, index) {
    loadImage(ele, imageArr, index);
});



window.onload = function () {
    document.addEventListener('touchstart', function (e) {
        // console.log(e);
        if (e.touches.length > 1) {
            e.preventDefault();
        }
    });

    var lastTouchEnd = 0;
    document.addEventListener('touchend', function (e) {
        var now = +new Date();
        if (now - lastTouchEnd < 300) {
            e.preventDefault();
        }
        lastTouchEnd = now;
    });

    imageArr = ['../images/slide01.jpg', '../images/slide02.jpg', '../images/slide03.jpg', '../images/slide04.jpg', '../images/slide05.jpg', '../images/slide06.jpg'];
    /* slidershow */
    Array.from(sliderLiImg).forEach(function (ele, index) {
        if (index == 0) {
            loadImage(ele, imageArr, index);
        } else {
            setTimeout(() => {
                loadImage(ele, imageArr, index);
            }, 500);


        }
    });
}