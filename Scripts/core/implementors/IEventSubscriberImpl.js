

function IEventSubscriberImpl() {}
IEventSubscriberImpl.InterfaceImpl(IEventSubscriber,"IEventSubscriberImpl");
IEventSubscriberImpl.classInitialize = function(cls) {
    cls.prototype.$__generalDispatcherHandlers = null;
    cls.prototype.subscribeFor = function(evenDisp, handler, priority) {
        if (handler != null && BaseObject.is(evenDisp, "IEventDispatcher")) {
            var handlerHelper = EventHandlerHelperRegister.On(this, "$__generalDispatcherHandlers").bind(this, handler);
            handlerHelper.to(evenDisp, priority);
            return handlerHelper;
        }
        return null;
    }
    cls.prototype.unsubscribeAll = function() {
        EventHandlerHelperRegister.On(this, "$__generalDispatcherHandlers").unbind();
    }

    cls.prototype.handlerGroup = function(name) {
        if (typeof name == "string" && name.length > 0) {
            var handlerReg = EventHandlerHelperRegister.On(this, name);
            return new _HandlerGroup(this, handlerReg);
        } else if (name == null || typeof name == "string") { // null or length == 0
            // Return the default global register (funny isn't it?)
            return this;
        } else {
            throw "Invalid handlerGroup name.";
        }
    }

    function _HandlerGroup(parent, handlerReg) {
        this.$parent = parent;
        this.$reg = handlerReg;
    }
    _HandlerGroup.prototype.subscribeFor = function(eventDisp, handler, priority) {
        if (handler != null && BaseObject.is(eventDisp, "IEventDispatcher")) {
            this.$reg.bind(this.$parent, handler).to(eventDisp, priority);
        }
        return this;
    }
    _HandlerGroup.prototype.unsubscribeAll = function() {
        this.$reg.unbind();
        return this;
    }

}


