class Account {
    constructor() {}

    onShow() {
    }

    onHide() {
    }

    onLoad() {
    }

    onReady() {
    }

    getHTML() {
        return require('./account.html');
    }

    get pageName() {
        return 'account';
    }

}


module.exports = new Account;