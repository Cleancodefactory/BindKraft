


/*INTERFACE*/
function IDisablable() {
}
IDisablable.Interface("IDisablable");
IDisablable.prototype.$disabledUI = false;
IDisablable.prototype.get_disabled = function () {
    return this.$disabledUI;
};
IDisablable.prototype.set_disabled = function (v) {
    this.$disabledUI = v;
};