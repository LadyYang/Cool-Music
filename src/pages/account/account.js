class Account {
    constructor() {}

    onShow() {
        console.log('account show');

    }

    onHide() {
        console.log('account hide');

    }

    onLoad() {
        console.log('account load');

    }

    onReady() {
        console.log('account ready');

    }

    getHTML() {
        return require('./account.html');
    }

    get pageName() {
        return 'account';
    }

}


module.exports = new Account;