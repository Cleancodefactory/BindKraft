


/*NOTIFY EVENTS*/
// Events created this way are dispatched to parents by the default handler of the window on which they are fired. Internal implementation
// can override this by setting msg.handled=true.
function WindowingParentNotifyMessage(eventType, eventData, targetWindow, sourceWindow) {
    WindowingMessage.apply(this, arguments);
}
WindowingParentNotifyMessage.Inherit(WindowingMessage, "WindowingParentNotifyMessage");
WindowingParentNotifyMessage.fireOn = function (wnd, evntType, evntData) {
    if (wnd != null && BaseObject.is(wnd, "BaseWindow")) {
        var e = new WindowingParentNotifyMessage(evntType, evntData, wnd);
        return wnd.$handleWindowEvent(e);
    }
    return null;
};
// Performs dispatch by inspecting the message. 
// Notification messages are sent to self first, then the window function is presponsible to send them to the parent if they are not cancelled
WindowingParentNotifyMessage.prototype.dispatch = function () {
    if (BaseObject.is(this.source, "BaseWindow")) {
        return this.dispatchOn(this.source);
    } else {
        WindowingMessage.prototype.dispatch.call(this);
    }
}

