function getStyle(obj, prop) {
    if (window.getComputedStyle) {
        return getComputedStyle(obj, null)[prop];
    } else {
        return obj.currentStyle[prop];
    }
}

/* slidershow */
function animation(obj, json, callback) {
    clearInterval(obj.timer);

    obj.timer = setInterval(function () {
        var flag = false;
        var iSpeed = 8;

        for (var p in json) {
            if (p === 'opacity') {
                iCur = parseFloat(getStyle(obj, p)) * 100;
            } else {
                iCur = parseInt(getStyle(obj, p));
            }

            iSpeed = (parseInt(json[p]) - iCur) / 7;
            iSpeed = iSpeed > 0 ? Math.ceil(iSpeed) : Math.floor(iSpeed);

            if (p === 'opacity') {
                obj.style[p] = (iSpeed + iCur) / 100;
            } else {
                obj.style[p] = iSpeed + iCur + 'px';
            }

            if (parseInt(json[p]) === iCur) {
                flag = true;
            } else {
                flag = false;
            }
        }

        if (flag) {
            clearInterval(obj.timer);
            typeof callback === 'function' ? callback() : '';
        }

    }, 30);
}

var sliderLi = Array.from(document.getElementsByClassName('slider')[0]['children']);
// var
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