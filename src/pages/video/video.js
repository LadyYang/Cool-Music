class Video {
    constructor() {
        
    }

    onShow() {
    }

    onHide() {

    }

    onLoad() {

    }

    onReady() {
    }
    
    getHTML() {
        return require('./video.html');
    }

    get pageName() {
        return 'video';
    }
}

module.exports = new Video;