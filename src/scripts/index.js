var $ = require('zepto');
// var touch = require('touch');
var soso = require('./soso.js');
require('../css/index.css');
require('../css/playsong.css');
require('../css/error.css');

var sliderLi = Array.from(document.getElementsByClassName('slider')[0]['children']);
var index = -1;
var lastIndex = 0;

sliderLi.forEach(function (ele, index) {
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


// var soso = document.getElementsByClassName('soso')[0];
// soso.onclick = function () {
//         window.location = '/soso.html';
// }