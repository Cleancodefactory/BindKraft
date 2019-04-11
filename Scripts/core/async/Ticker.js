


/*
Ticker - usually a single class exists - a singleton
*/
function Ticker(freq) {
    this.timeout = freq;
    this.timeout = freq;
    this.ticking = false;
    this.clients = newObjectArray();
    this.$totalticks = 0;
	this.tickWrapper = Delegate.createWrapper(this, this.tick);
};
Ticker.Inherit(BaseObject, "Ticker");
Ticker.interfaces = { PTicker: true };
Ticker.prototype.add = function (clnt) {
    if (clnt != null) {
        this.clients.addElement(clnt);
    };
};
Ticker.prototype.remove = function (clnt) {
    if (clnt != null) {
        this.clients.removeElement(clnt);
    } 
};
Ticker.prototype.start = function () {
    if (this.clients.length > 0) {
        if (!this.ticking) {
            window.setTimeout(this.tickWrapper, this.timeout);
			// window.setTimeout("Ticker.Default.tick()",this.timeout)
			
            this.ticking = true;
        }
    }
};
Ticker.prototype.get_totalticks = function () {
    return this.$totalticks;
};
Ticker.prototype.tickWrapper = null;
Ticker.prototype.tick = function () {
    this.$totalticks++;
    if (this.clients.length > 0) {
        CallContext.resetContext(); // Reset all contexts
        CallContext.rootContext(this).description = "Ticker induced (can be destroyed by schedulers)";
		try {
			for (var i = 0; i < this.clients.length; i++) {
				var clnt = this.clients[i];
				if (BaseObject.is(clnt, "Delegate")) {
					clnt.invoke();
				} else if (BaseObject.is(clnt, "ITickable")) {
					clnt.tick(this);
				} else if (BaseObject.is(clnt, "BaseObject")) {
					clnt.tick(); // WARNING! This will be removed at some point - Implement ITickable!
				} else if (BaseObject.is(clnt, "function")) {
					clnt();
				}
			}
		} catch (ex) {
			if (console) {
				console.log("Exception in a ticker initiated action. " + ex);
				if (typeof ex.stack == "string") {
					console.log("Stack: " + ex.stack);
					alert("Stack: " + ex.stack);
				}
			}
		}
        CallContext.endContext(this);
        window.setTimeout(this.tickWrapper, this.timeout);
		// window.setTimeout("Ticker.Default.tick()",this.timeout)
        this.ticking = true;
    } else {
        this.ticking = false;
    }
};
Ticker.prototype.postCall = function (callback, arg1, arg2) { // TODO: Probably discard this?
    if (callback == null) return;
    if (typeof callback == "function") {
    } else if (BaseObject.is(callback, "IInvoke")) { // as is
    } else {
        // We do not know what to do with this yet.
        // throw
    }
};
Ticker.Default = new Ticker(JBCoreConstants.SystemSchedulerFreq); // Framework default is usually 25 milliseconds
