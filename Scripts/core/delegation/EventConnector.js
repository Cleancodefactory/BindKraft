

/*CLASS*/
/*
    new EventConnector(
        thisObject              - BaseObject+,optional, must be first argument - invoke handlers with this pointing there if they are functions and not delegates
        targetType              - string, optional, a class name or Interface name of the target object to which the connection should be made.
        {event: handler, ...}   - pairs containing event name and handler. The handler can be function or delegate
        connectNotify           - optional, function or delegate to call when connected/disconnected signature function(target, connected) 
                                    where connected is true on connect and false on disconnect. Note that this is called only on forced disconnect - i.e. only if the disconnect method is called
                                    In all other cases the disconnection is out of our control and may be partial. If you need to track the life of some object subscribe to an event fired when the 
                                    object closes/shuts down.
*/
function EventConnector(bytype_params) {
    BaseObject.apply(this, arguments);
    var arg;
    for (var i = 0; i < arguments.length; i++) {
        arg = arguments[i];
        if (BaseObject.is(arg, "IInvocationWithArrayArgs")) {
            this.connectHandler = arg;
        } else if (i == 0 && BaseObject.is(arg, "BaseObject")) {
            this.handlerObject = arg;
        } else if (BaseObject.is(arg, "string")) {
            this.targetType = arg;
        } else if (typeof arg == "function") {
            this.connectHandler = new Delegate(this.handlerObject, arg);
        } else if (typeof arg == "object" && !BaseObject.is(arg, "BaseObject")) {
            this.connections = arg;
        }
    }
};
EventConnector.Inherit(BaseObject, "EventConnector");
EventConnector.prototype.handlerObject = null;
EventConnector.prototype.connectHandler = null;
EventConnector.prototype.targetType = null;
EventConnector.prototype.connections = null;
EventConnector.prototype.obliterate = function() {
    if (this.connections != null) {
        for (var k in this.connections) {
            if (this.connections[k] != null) {
                BaseObject.obliterate(this.connections[k]);
            }
        }
    }
    if (this.connectHandler != null) BaseObject.obliterate(this.connectHandler);
    // But not the handler object !!! It is not our concern.
};
EventConnector.prototype.connect = function (target) {
    if (target != null && this.connections != null) {
        if (this.targetType == null || BaseObject.is(target, this.targetType)) {
            var conn;
            for (var k in this.connections) {
                conn = this.connections[k];
                if (conn != null) {
                    if (BaseObject.is(target[k], "EventDispatcher")) {
                        if (typeof conn == "function") {
                            target[k].add(new Delegate(this.handlerObject, conn));
                        } else {
                            target[k].add(conn);
                        }
                    } else {
                        if (this.targetType != null) throw "Unsupported by target (" + this.targetType + ") event specified";
                    }
                }
            }
            if (this.connectHandler != null) {
                if (BaseObject.is(this.connectHandler, "IInvoke")) {
                    this.connectHandler.invoke(target, true);
                } else if (typeof this.connectHandler == "function") {
                    this.connectHandler.call(this.handlerObject, target, true);
                }
            }
        }
    }
};
EventConnector.prototype.disconnect = function (target) {
    if (target != null && this.connections != null) {
        if (this.targetType == null || BaseObject.is(target, this.targetType)) {
            var conn;
            for (var k in this.connections) {
                conn = this.connections[k];
                if (conn != null) {
                    if (BaseObject.is(target[k], "EventDispatcher")) {
                        if (typeof conn == "function") {
                            target[k].remove(new Delegate(this.handlerObject, conn));
                        } else {
                            target[k].remove(conn);
                        }
                    } else {
                        if (this.targetType != null) throw "Unsupported by target (" + this.targetType + ") event specified";
                    }
                }
            }
            if (this.connectHandler != null) {
                if (BaseObject.is(this.connectHandler, "IInvoke")) {
                    this.connectHandler.invoke(target, false);
                } else if (typeof this.connectHandler == "function") {
                    this.connectHandler.call(this.handlerObject, target, false);
                }
            }
        }
    }
};
EventConnector.prototype.equals = function (obj) {
    if (obj == this) return true;
    return false;
};
