


// This class implements a global message queue for all the windows in the browser tab and can be used by other objects as well (it is not limited to window messages only).
// Messages for windows in other browser tabs (windows) should not be queued directly because no proxying is
// currently implemented. 
/*CLASS*/
function EventPump(config) {
    BaseObject.apply(this, arguments);
    this.config = { // defaults
        messagesPerTick: 2
    };
    this.$schedulerId = ((EventPump.$schedulerIdCurrent != null)?(EventPump.$schedulerIdCurrent++): (EventPump.$schedulerIdCurrent = 0));
    this.$taskIdCurrent = 0;
    if (typeof config == "object") this.config = BaseObject.CombineObjects(this.config, config); // The second overrides the first
}
EventPump.Inherit(BaseObject, "EventPump");
EventPump.Implement(ITickable);
EventPump.Implement(IProcessScheduler); // Note that we Implement traditional non-standratized Interface (post methods) and scheduler over it.
EventPump.prototype.equals = function (obj) { // Reimplement equals to make all instances distinguishable (not needed currently, but if we decide to have more than one queue ...)
    if (!BaseObject.prototype.equals.call(this, obj)) return false;
    if (this != obj) return false;
    return true;
};
EventPump.prototype.queue = new InitializeArray("Message queue");
// The condition prototype is function(msg) - the method should return true if the condition is true, otherwise the message is requeued.
// post:
//  msg - the message (not necessarily window message, but it must be dispatchable)
//  condition - a callback see above
//  maxAge - maximum age after which the message is no longer reposted on the queue.
//  after - dispatch the message no sooner than after the specified number of milliseconds.
EventPump.prototype.post = function (msg, condition, maxAge, after) {
    var target = null;
    if (BaseObject.is(msg, "ITargeted")) {
        target = msg.get_target();
    }
    this.queue.push({ message: msg,
                      condition: condition,
                      after: after,
                      maxAge: maxAge,
                      postedAt: (new Date()).getTime(), 
                      target: target });
    this.register();
};
// Unlike post trackPost returns async result and accepts as optional second arg a parent async result on which the new (or specified) one is chained.
// TODO: Implement the behavior for ProcessScheduleOptionsEnum.Synchronous - we do not need it urgently, but completeness of the code is always a good thing.
EventPump.prototype.trackPost = function (msg, chainResult, condition, maxAge, after) {
    var ar = null;
    var target = null;
    if (BaseObject.is(msg, "IAsyncResult")) {
        ar = msg;
        if (msg.is("ITargeted")) target = msg.get_target();
        // Set the scheduler to the result
        ar.set_scheduler(this);
        this.queue.push({ message: null, condition: condition, after: after, maxAge: maxAge, postedAt: (new Date()).getTime(), asyncResult: ar, target: target });
        ar.set_scheduled(true);
        // The dispatchable will be extracted from the asyncResult
    } else if (BaseObject.is(msg, "IDispatchable")) {
        ar = new AsyncResult(this, msg);
        if (msg.is("ITargeted")) target = msg.get_target();
        this.queue.push({ message: msg, condition: condition, after: after, maxAge: maxAge, postedAt: (new Date()).getTime(), asyncResult: ar, target: target });
        ar.set_scheduled(true);
        // The message is set into the newly created async result
    } else if (BaseObject.is(msg, "Delegate")) { // autocreate dispatchable
        // We are requested to pack this
        var disp = new Dispatchable(msg);
        target = msg.object;
        ar = new AsyncResult(this, disp);
        this.queue.push({ message: disp, condition: condition, after: after, maxAge: maxAge, postedAt: (new Date()).getTime(), asyncResult: ar, target: target });
        ar.set_scheduled(true);
    } else if (typeof msg == "function") {
        var disp = new Dispatchable(Delegate.createWrapper(null, msg));
        ar = new AsyncResult(this, disp);
        this.queue.push({ message: disp, condition: condition, after: after, maxAge: maxAge, postedAt: (new Date()).getTime(), asyncResult: ar, target: null });
        ar.set_scheduled(true);
    } else {
        // Do nothing
        throw "trackPost has been called with some invalid arguments";
    }

    if (ar != null) {
        if (BaseObject.is(chainResult, "IAsyncResult")) {
            // Chain this on that parent - chainResult is the parent result
            chainResult.chainResult(ar);
        }
    }
    this.register();
    return ar;
};
EventPump.prototype.$pick = function () {
    if (this.queue.length > 0) {
        var o = this.queue.shift();
		if (typeof o.after == "number" && (o.$waiting == null || o.$waiting < o.after)) {
			if (o.$waiting == null) {
				o.$waiting = Ticker.Default.timeout;
			} else {
				o.$waiting += Ticker.Default.timeout;
			}
			this.queue.push(o);
			return false;
		}
		if (typeof o.maxAge == "number" && ((new Date()).getTime() - o.postedAt) > o.maxAge) {
			// Do not requeue! The message has expired.
			return false;
		}
		if (o.condition != null) {
			if (BaseObject.callCallback(o.condition, o.message)) {
				return o; //.message;
			} else {
				this.queue.push(o);
				return false;
			}
		} else {
			if (o != null) return o;
		}
    }
    return false;
} .Description("Picks a message holder. See pick for more info.");
EventPump.prototype.pick = function () { // For public use. Public use of pick should be avoided - the very purpose of this class is to push messages to others and not to be polled for them!
    var h = this.$pick();
    if (h === false) return false;
    if (h != null) return h.message;
    return null;
}.Description("Picks a message if it has no condition or if its condition resolves to true, if thecondition is not met requeues the message at the end of the queue and returns null. Returns false if the queue is empty");
EventPump.prototype.register = function () {
    if (this.queue.length > 0 && this.$enabled) {
        Ticker.Default.add(this);
        Ticker.Default.start();
    } else {
        Ticker.Default.remove(this);
    }
} .Description("Registers/unregisters the pump with the Ticker as needed - if there are messages.");
EventPump.prototype.$enabled = true; // The queue is enabled
EventPump.prototype.enable = function (bEnabled) {
    this.$enabled = bEnabled;
    this.register();
};
EventPump.prototype.$internalProcessMessage = function (ticker, h) {
    if (h != null) {
        var msg = null;
        var ar = BaseObject.as(h.asyncResult, "IAsyncResult");
        if (BaseObject.is(h.message, "IDispatchable")) {
            msg = h.message;
        } else if (h.message == null && ar != null) {
            msg = ar.get_task();
        }
        // Dispatch it
        this.$currentAsyncResult = h.asyncResult;
        CallContext.rootContext();
        if (ar != null) ar.$set_executing(true);
        if (msg != null) msg.dispatch(ar);
        if (ar != null) ar.$set_executing(false);
        CallContext.endContext();
        this.$currentAsyncResult = null;
        // Even if there is nothing to dispatch we should mark the asyncResult as done.
        // This is internally managed - no need to make type checks
        if (h.asyncResult != null) {
            if (BaseObject.is(msg, "IDataHolder")) {
                h.asyncResult.setComplete(msg.get_data()); // dispatchable objects may carry data and we need to pass it to the completion routines
            } else {
                h.asyncResult.setComplete();
            }
        }
    }
};
EventPump.prototype.tick = function (ticker) {
    // Pull rabbits out of the hat and distribute them
    if (!this.$enabled) return;
    var h, notdone = true;
    for (var i = 0; i < this.config.messagesPerTick; i++) {
        do {
            h = this.$pick();
            if (h === false) {
                // Unregister (just in case)
                notdone = false;
                this.register();
                continue;
            }
            if (h != null) {
                if (BaseObject.is(h.asyncResult, "IAsyncResult")) {
                    if (h.asyncResult.scheduleOptions != null && (h.asyncResult.scheduleOptions & ProcessScheduleOptionsEnum.Later) != 0) {
                        h.asyncResult.scheduleOptions &= (0xFFFF ^ ProcessScheduleOptionsEnum.Later);
                        this.queue.push(h);
                        continue;
                    }
                }
                this.$internalProcessMessage(ticker, h);
                notdone = false;
                if (BaseObject.is(h.asyncResult, "IAsyncResult")) {
                    if (h.asyncResult.scheduleOptions != null && (h.asyncResult.scheduleOptions & ProcessScheduleOptionsEnum.Continue) != 0) {
                        notdone = true;
                        continue; // Pick next without waiting the next tick
                    }
                }
            }
        } while (notdone);
    }
};
// IProcessScheduler implementation
EventPump.prototype.generateTaskId = function() {
    return (this.$shcedulerId + "_" + (this.$taskIdCurrent++));
};
EventPump.prototype.schedule = function(/* same as trackPost */) {
    return this.trackPost.apply(this, arguments);
};
EventPump.prototype.unschedule = function (disp_or_result) { /*IDispatchable|IAsyncResult[|Delegate|function]*/
    this.queue.Delete(function (idx, item) {
        if (item != null && (item.message == disp_or_result || item.asyncResult == disp_or_result)) {
            if (item.asyncResult != null) item.asyncResult.set_scheduled(false);
            return true;
        }
        return false;
    });
};
EventPump.prototype.unscheduleByTarget = function (target, callback) {
    // The target is extracted during registration! In order this to work the tasks must have targets before they are scheduled (which should be normal)
    if (target != null) {
        this.queue.Delete(function (idx, item) {
            if (item.target == target) {
                if (item.asyncResult != null) item.asyncResult.set_scheduled(false);
                return true;
            }
            return false;
        });
    } else if (target != null && callback != null) {
        this.queue.Delete(function (idx, item) {
            if (item.target == target && BaseObject.callCallback(item.message, item.asyncResult)) {
                if (item.asyncResult != null) item.asyncResult.set_scheduled(false);
                return true;
            }
            return false;
        });
    } else if (callback != null) {
        this.queue.Delete(function (idx, item) {
            if (BaseObject.callCallback(item.message, item.asyncResult)) {
                if (item.asyncResult != null) item.asyncResult.set_scheduled(false);
                return true;
            }
            return false;
        });
    }
};
EventPump.prototype.$currentAsyncResult = null;
EventPump.prototype.currentAsyncResult = function () {
    return this.$currentAsyncResult;
};
EventPump.$Default = null;
EventPump.Default = function () {
    if (EventPump.$Default == null) {
        EventPump.$Default = new EventPump();
    }
    return EventPump.$Default;
};