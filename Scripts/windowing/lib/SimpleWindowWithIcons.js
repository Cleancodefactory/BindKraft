function SimpleWindowWithIcons() {
    this.$icons = [];
    let self = this;

    Array.from(arguments).forEach(function (arg, idx) {
        if (typeof arg === 'object' && arg instanceof Array) {
            self.$icons = arg;
        }
    });

    SimpleViewWindow.apply(this, arguments);
};

SimpleWindowWithIcons.Inherit(SimpleViewWindow, "SimpleWindowWithIcons");

SimpleWindowWithIcons.prototype.set_icons = function (v) {
    this.$icons = v;
};

SimpleWindowWithIcons.prototype.get_icons = function () {
    return this.$icons;
};

