


/*CLASS*/
/*MANDATORY SINGLETON*/
/*  This class must be single instance - only one singleton should exist in a browser window (and may be across all connected ones - remains to be seen)
    To avoid any temptation to create multiple instances the implementation is duplicated with static members for the important functionality. A singleton
    instead of static class gives us some flexibility we do not want to sacrifice.
    
*/
function CallContext() {
BaseObject.apply(this, arguments);
}
CallContext.Inherit(BaseObject, "CallContext");
CallContext.prototype.contexts = new InitializeArray("Contexts stack");
CallContext.prototype.newContext = function (owner) { // Just create a new context
    var ctx = new CallContextEntry(owner, this.currentContext()); // Give it a chance to copy
    this.contexts.push(ctx);
    return ctx;
};
CallContext.prototype.rootContext = function (owner, scheduler) { // Root the contexts - protection agiainst recursion
    var ctx = null;
    if (this.contexts.length > 0) {
        if (owner != null) { // Find out if there is a context owned by the same instance and dump everything down to it if it is so
            for (var i = this.contexts.length - 1; i >= 0; i--) {
                ctx = this.contexts[i];
                if (ctx != null && ctx.owner == owner) {
                    this.contexts.length = i + 1; // Clear everything up
                    return ctx;
                }
            }
        }
    } 
    // Just start one
    ctx = new CallContextEntry(owner, scheduler);
    this.contexts.push(ctx);
    return ctx;
};
CallContext.prototype.currentContext = function () {
    if (this.contexts.length > 0) {
        return this.contexts[this.contexts.length - 1]; // Top
    } else {
        return null;
    }
};
CallContext.prototype.obtain_current = function () { // This is the recommended method for access - creates a context if none exists
    if (this.contexts.length > 0) {
        return this.contexts[this.contexts.length - 1]; // Top
    } else {
        return this.rootContext();
    }
};
CallContext.prototype.resetContext = function (owner) {
    if (owner != null) {
        for (var i = this.contexts.length - 1; i >= 0; i--) {
            var ctx = this.contexts[i];
            if (ctx != null && ctx.owner == owner) {
                this.contexts.length = i;
                break;
            }
        }
    } else {
        this.contexts.length = 0; // Clear the array
    }
};
CallContext.prototype.endContext = function (owner) {
    if (this.contexts.length > 0) {
        if (owner != null) {
            for (var i = this.contexts.length - 1; i >= 0; i--) {
                var ctx = this.contexts[i];
                if (ctx != null && ctx.owner == owner) {
                    this.contexts.length = i;
                    break;
                }
            }
        } else {
            return this.contexts.pop();
        }
    }
    return null;
};
CallContext.prototype.currentAsyncResult = function () { // This is a shortcut function digging to the current async result (if any)
    var ctx = this.currentContext();
    if (ctx != null) {
        return ctx.currentAsyncResult();
    }
    return null;
};
/// Static accessors
CallContext.currentContext = function () { return CallContext.instance.currentContext(); };
CallContext.obtain_current = function () { return CallContext.instance.obtain_current(); };
CallContext.rootContext = function (scheduler) { return CallContext.instance.rootContext(scheduler); }; // Start with this
CallContext.newContext = function () { return CallContext.instance.newContext(); }; // Or start with this
CallContext.endContext = function () { return CallContext.instance.endContext(); }; // Finish with this
CallContext.resetContext = function (owner) { return CallContext.instance.resetContext(owner); }; // Finish with this
CallContext.currentAsyncResult = function (filter) { // Will return it if no filter is given or if the key of the result matches an entry in the filter
    if (filter == null) {
        return CallContext.instance.currentAsyncResult();
    } else {
        var ar = CallContext.instance.currentAsyncResult();
        var key = ar.get_key();
        if (BaseObject.is(filter, "Array")) {
            return filter.FirstOrDefault(function (idx, fltItem) {
                if (fltItem == key) return ar;
                return null;
            });
        } else if (typeof filter == "string") {
            var filts = filter.split(",");
            if (BaseObject.is(filts, "Array")) {
                return filts.FirstOrDefault(function (idx, fltItem) {
                    if (fltItem == key) return ar;
                    return null;
                });
            } else {
                return null;
            }
        }
    }
    return null;
}
CallContext.instance = new CallContext();
