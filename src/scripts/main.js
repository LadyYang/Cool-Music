require('./recommend.js').init();
const song = require('./control.js');
const common = require('./common.js');

var music = {
    bindEvent: function () {

    },

    main: function () { 
        this.bindEvent();
        // recommend.init();
        song.init();
        common.init();
    }
}

window.music = music;
music.main();
require('../css/index.css');
require('../css/recommend.css');

// window.onload = function () {
//     document.addEventListener('touchstart', function (e) {
//         // console.log(e);
//         if (e.touches.length > 1) {
//             e.preventDefault();
//         }
//     });

//     var lastTouchEnd = 0;
//     document.addEventListener('touchend', function (e) {
//         var now = +new Date();
//         if (now - lastTouchEnd < 300) {
//             e.preventDefault();
//         }
//         lastTouchEnd = now;
//     });
// }