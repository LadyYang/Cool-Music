require('../../layout/initialize.css');
require('./main.css');
require('../discover/discover.css')
require('../../layout/footer.css');
require('../play/play.css');
require('../account/account.css');
const discover = require('../discover/discover.js');
const account = require('../account/account.js');
const mine = require('../mine/mine.js');
const video = require('../video/video.js');
const App = require('../../app/app.js');
const app = new App;

// footer Object
// switch page
var footer = {
    pages: ['DiscoverPage', 'VideoPage', 'MinePage', 'AccountPage'],

    init() {
        /* 
            notice!!!
            The footer page needs to be rendered before it can be initialized 
            
        */

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
        if (discover.loaded) {
            app.switchTab(discover);
        } else {
            app.renderTab(discover);
        }
    },

    clickVideoPage() {
        footer.VideoPage.onclick = null;
        footer.bindEvent('VideoPage');

        if (video.loaded) {
            app.switchTab(video);
        } else {
            app.renderTab(video);
        }
    },

    clickMinePage() {
        footer.MinePage.onclick = null;
        footer.bindEvent('MinePage');

        if (mine.loaded) {
            app.switchTab(mine);
        } else {
            app.renderTab(mine);
        }
    },

    clickAccountPage() {
        footer.AccountPage.onclick = null;
        footer.bindEvent('AccountPage');

        // load page
        if (account.loaded) {
            app.switchTab(account);
        } else {
            app.renderTab(account);
        }
    },

    bindEvent(currentPage) {
        console.log(app);

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

    main: function () {
        document.body.innerHTML = require('../play/play.html') + require('../../layout/footer.html');

        footer.init();

        // common.init();
    }
}

window.music = music;

music.main();