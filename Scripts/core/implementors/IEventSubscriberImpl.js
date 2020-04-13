function IEventSubscriberImpl() {}
IEventSubscriberImpl.InterfaceImpl(IEventSubscriber,"IEventSubscriberImpl");
IEventSubscriberImpl.prototype.$__generalDispatcherHandlers = null;
IEventSubscriberImpl.prototype.subscribeFor = function(evenDisp, handler, priority) {
    if (handler != null && BaseObject.is(evenDisp, "IEventDispatcher")) {
        var handlerHelper = EventHandlerHelperRegister.On(this, "$__generalDispatcherHandlers").bind(this, handler);
        handlerHelper.to(evenDisp, priority);
        return handlerHelper;
    }
    return null;
}
IEventSubscriberImpl.prototype.unsubscribeAll = function() {
    EventHandlerHelperRegister.On(this, "$__generalDispatcherHandlers").unbind();
}