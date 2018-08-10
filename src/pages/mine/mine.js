class Mine {
    constructor() {

    }

    onShow() {
        console.log('mine show');

    }

    onHide() {
        console.log('mine hide');

    }

    onLoad() {
        console.log('mine load');
        
    }

    onReady() {
        console.log('mine ready');
        
    }

    getHTML() {
        return require('./mine.html');
    }

    get pageName() {
        return 'mine';
    }
}

module.exports = new Mine;