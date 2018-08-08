require('../../layout/initialize.css');
require('./main.css');
require('../discover/discover.css')
require('../../layout/footer.css');
require('../play/play.css');
require('../account/account.css');

// all HTML Object
var HTML = {
    discoverHTML: require('../discover/discover.html'),
    playHTML: require('../play/play.html'),
    footerHTML: require('../../layout/footer.html'),
    accountHTML: require('../account/account.html'),
    mineHTML: require('../mine/mine.html'),
    videoHTML: require('../video/video.html'),

    mainDOM: document.querySelector('body .main'),
    footerDOM: document.querySelector('footer'),

    parseCurrentPage(className) {
        document.body.className = className;
    },

    render(o, htmlStr) {
        o.innerHTML = htmlStr;
    }
}

// footer Object
var footer = {
    pages: ['DiscoverPage', 'VideoPage', 'MinePage', 'AccountPage'],

    init() {
        /* 
            notice!!!
            The footer page needs to be rendered before it can be initialized 
            --> HTML.render(HTML.footerDOM, HTML.footerHTML);
        */
        HTML.render(HTML.footerDOM, HTML.footerHTML)
        HTML.render(document.querySelector('.play-UI'), HTML.playHTML);

        this.DiscoverPage = document.querySelector('footer div.discover');
        this.VideoPage = document.querySelector('footer div.video');
        this.MinePage = document.querySelector('footer div.mine');
        this.AccountPage = document.querySelector('footer div.account');

        this.initialized = true;

        // Automatically click on the discovery page when the page is first loaded
        this.DiscoverPage.onclick = this.clickDiscoverPage;
        this.DiscoverPage.onclick();
    },


    clickDiscoverPage() {
        footer.DiscoverPage.onclick = null;
        footer.bindEvent('DiscoverPage');

        // load page
        HTML.parseCurrentPage('discover');
        HTML.render(HTML.mainDOM, HTML.discoverHTML);

        require('../discover/discover.js').init();
    },

    clickVideoPage() {
        footer.VideoPage.onclick = null;
        footer.bindEvent('VideoPage');

    },

    clickMinePage() {
        footer.MinePage.onclick = null;
        footer.bindEvent('MinePage');

    },

    clickAccountPage() {
        footer.AccountPage.onclick = null;
        footer.bindEvent('AccountPage');

        // load page
        HTML.parseCurrentPage('account');
        HTML.render(HTML.mainDOM, HTML.accountHTML);

        require('../account/account.js');
    },

    bindEvent(currentPage) {
        if (this.initialized) {

            // switch classname
            this.pages.forEach(ele => {
                if (!(currentPage === ele)) {
                    this[ele].classList.remove('active');
                    this[ele].onclick = this['click' + ele];
                } else {
                    this[ele].classList.add('active');
                }
            })
        } else {
            throw new Error('need to initialize');
        }

    }
}

var music = {
    bindEvent: function () {

    },

    main: function () {
        footer.init();

        // common.init();
    }
}

window.music = music;

music.main();