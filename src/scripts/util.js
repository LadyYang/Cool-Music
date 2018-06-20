(function () {

    function inherits(ctor, superCtor) {
        if (ctor === undefined || ctor === null)
            throw new Error(ctor + ' is not an Object');
        if (superCtor === undefined || superCtor === null)
            throw new Error(superCtor + ' is not an Object');
        if (superCtor.prototype === undefined) {
            throw new Error(superCtor.prototype + ' can\'t be undefined');
        }

        Object.setPrototypeOf(ctor, superCtor.__proto__);
        Object.setPrototypeOf(ctor.prototype, superCtor.prototype);
    }

    this.music || (this.music = {});

    this.music.inherits = inherits;

})(this);