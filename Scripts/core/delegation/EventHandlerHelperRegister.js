

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
    if (obj[JBCoreConstants.EventHelperRegisterProp] == null) {
        obj[JBCoreConstants.EventHelperRegisterProp] = {};
    }
    var _root = obj[JBCoreConstants.EventHelperRegisterProp];
    if (_root[name] == null) _root[name] = new EventHandlerHelperRegister();
    return _root[name];
};
EventHandlerHelperRegister.For = EventHandlerHelperRegister.On;