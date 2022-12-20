


/* EVENTS */
// except eventType the rest are optional parameters.
// sourceWindow is not used in typical scenarios instead the targetWindow is set to the window on which the event
// has been firedOn first. Routing messages to other windows is to be done by using dispatchOn which will change nothing
// thus the targetWindow always points to the window on which something happens and is enough even for notifications to parents etc.
// sourceWindow may be used only in specific messages that describe events for which "target" sounds ambigous.
function WindowingMessage(eventType, eventData, targetWindow, sourceWindow) {
    BaseObject.apply(this, arguments);
    this.type = eventType;
    this.data = eventData;
    this.target = targetWindow;
    this.source = sourceWindow;
}
WindowingMessage.Inherit(BaseObject, "WindowingMessage");
WindowingMessage.Implement(IDispatchable);
WindowingMessage.Implement(ITargeted);
WindowingMessage.Implement(IDataHolder);
// ITargeted
WindowingMessage.prototype.get_target = function () {
    return this.target;
}
// IDataHolder
WindowingMessage.prototype.get_data = function () {
    return this.data;
}
WindowingMessage.prototype.set_data = function (v) {
    this.data = v;
    // No notification for data context changed is deemed useful for messages. If this changes call this.OnDataContextChanged here.
}
/**
 * 
 * @returns The result of the message unlike sendTo which returns the message 
 */
WindowingMessage.fireOn = function (wnd, evntType, evntData) {
    if (wnd != null && BaseObject.is(wnd, "BaseWindow")) {
        var e = new WindowingMessage(evntType, evntData, wnd);
        return e.dispatchOn(wnd);
        //return wnd.$handleWindowEvent(e);
    }
    return null;
};
/**
 * 
 * @returns Like fireOn, but returns the message for potential result recorded there
 */
WindowingMessage.sendTo = function (wnd, evntType, evntData) {
    var msg = new WindowingMessage(evntType, evntData, wnd);
    msg.dispatchOn(wnd);
    return msg;
};
WindowingMessage.postTo = function (wnd, evntType, evntData) {
    var msg = new WindowingMessage(evntType, evntData, wnd);
	return EventPump.Default().trackPost(msg);
}.Returns("IAsyncResult that can be used for tracking the progress");

WindowingMessage.broadcastTo = function (wnd, a1, a2, a3) {
	var cond = null;
	var action = null;
	var data = null;
	var msg;
	for (var i = 1; i < arguments.length;i++) {
		if (BaseObject.isCallback(arguments[i])) {
			if (action == null) {
				action = arguments[i];
			} else if (cond == null) {
				cond = arguments[i];
			} else {
				throw "More than 2 callbacks have been passed to broadcastTo, don't know what to do with them.";
			}
		} else {
			data = arguments[i];
		}
	}
	if (action != null || cond != null) {
		msg = new WindowingMessage(WindowEventEnum.BroadcastAction, {
			condition: cond, 
			action: action,
			data: data
		}, wnd);
	} else {
		msg = new WindowingMessage(WindowEventEnum.Broadcast, data, wnd);
	}
	return EventPump.Default().trackPost(msg);
}.Returns("IAsyncResult that can be used for tracking the progress");

WindowingMessage.prototype.type = null;
WindowingMessage.prototype.handled = false;
WindowingMessage.prototype.result = undefined; // Alternative to returned result from a handler (work inprogress);
WindowingMessage.prototype.data = new InitializeObject("Event data");
// This method does partial work and should be in BaseWindow - moving it there. The code will remain commented out for some time to help readers
// // V: 2.15.1
/*
WindowingMessage.prototype.handleOn = function (obj) {
    if (BaseObject.is(obj, "BaseWindow")) {
        if (typeof obj["on_" + this.type] == "function") {
            return obj["on_" + this.type].call(obj, this);
        }
    }
    return null;
} .Description("Helper the windows call to Implement the on_<message> simple handling");
*/
WindowingMessage.prototype.dispatchOn = function (obj) {
    if (BaseObject.is(obj, "BaseWindow")) {
        if (typeof obj.$handleWindowEvent == "function") { // Paranoia
            return obj.$handleWindowEvent(this);
        }
    }
    return null;
};
WindowingMessage.prototype.dispatch = function () { // Performs dispatch by inspecting the message. 
    return this.dispatchOn(this.target);
}
WindowingMessage.prototype.compareDispatchTarget = function (wnd) {
    if (this.target == wnd) return true;
    return false;
}