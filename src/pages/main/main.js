require('../../layout/initialize.css');
require('./main.css');
require('../../layout/footer.css');
// const common = require('../../app/app.js');

function parseHTML(pageContext, className) {
    var main = document.querySelector('body .main');
    main.innerHTML = pageContext;
    document.body.className = className;
}

var discoverHTML = require('../discover/discover.html');
parseHTML(discoverHTML, 'discover')

const discover = require('../discover/discover.js');


var music = {
    bindEvent: function () {

    },

    main: function () {
        this.bindEvent();
        discover.init();
        // common.init();

        var footer = document.querySelector('footer');
        footer.innerHTML = require('../../layout/footer.html');
    }
}

window.music = music;

music.main();