require('../../layout/initialize.css');
require('./main.css');
require('../discover/discover.css')
require('../../layout/footer.css');
require('../play/play.css');


function parseHTML(className) {
    document.body.className = className;
}

function renderHTML() {
    var discoverHTML = require('../discover/discover.html'),
        playHTML = require('../play/play.html'),
        footerHTML = require('../../layout/footer.html'),
        footer = document.querySelector('footer'),
        playUI = document.querySelector('.play-UI'),
        main = document.querySelector('body .main');

    playUI.innerHTML = playHTML;
    footer.innerHTML = footerHTML;
    main.innerHTML = discoverHTML;
    parseHTML('discover')
}

async function renderJS() {
    await renderHTML();

    return require('../discover/discover.js');
}

var music = {
    bindEvent: function () {

    },

    main: function () {
        this.mainDom = document.querySelector('.main');
        renderJS().then((discover) => {
            discover.init();
        })


        this.bindEvent();
        // common.init();
    }
}

window.music = music;

music.main();