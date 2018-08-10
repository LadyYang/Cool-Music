class Video {
    constructor() {
        
    }

    onShow() {
        console.log('video show');

    }

    onHide() {
        console.log('video hide');

    }

    onLoad() {
        console.log('video load');

    }

    onReady() {
        console.log('video ready');

    }
    
    getHTML() {
        return require('./video.html');
    }

    get pageName() {
        return 'video';
    }
}

module.exports = new Video;