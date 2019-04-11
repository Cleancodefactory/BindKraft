

/// Register for the EventHandlerHelper.
/// This one is the class that is actually used. It registers the handlers and then unbinds them with ease
function EventHandlerHelperRegister() {
    this.handlers = [];
};
EventHandlerHelperRegister.prototype.bind = function (obj_or_callback, func) {
    var h = EventHandlerHelper.bind(obj_or_callback, func);
    this.handlers.push(h);
    return h;
};
EventHandlerHelperRegister.prototype.unbind = function () {
    for (var i = 0; i < this.handlers.length; i++) {
        if (this.handlers[i] != null) this.handlers[i].unbind();
    }
    this.handlers.length = 0;
};
EventHandlerHelperRegister.On = function (obj, name) {
    if (obj[name] == null) obj[name] = new EventHandlerHelperRegister();
    return obj[name];
};
EventHandlerHelperRegister.For = EventHandlerHelperRegister.On;