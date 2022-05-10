(function() {

    /**
     * Supports only synchronous actions!!!
     */
    function QueuedActionsContainer() {
        BaseObject.apply(this, arguments);
    }
    QueuedActionsContainer.Inherit(BaseObject, "QueuedActionsContainer");
    QueuedActionsContainer.prototype.$queue = new InitializeArray("Conserved actions");
    QueuedActionsContainer.prototype.addDelegate = function(delegate) {
        if (BaseObject.is (delegate,"Delegate")) {
            this.$queue.push(delegate);
        } else {
            this.LASTERROR("Delegate required", "addDelegate");
        }
    }
    QueuedActionsContainer.prototype.add = function(_this, proc, args) {
        var args = Array.createCopyOf(arguments,2);
        if (BaseObject.is(_this, "BaseObject")) {
            if (typeof proc == "string") {
                proc = _this[proc];
            }
            if (typeof proc == "function") {
                var d = new Delegate(_this, proc, args);
                this.addDelegate(d);
                return;
            }
        }
        this.LASTERROR("Cannot add queued action", "add");
    }
    QueuedActionsContainer.prototype.addApply = function(_this, proc, args) {
        if (BaseObject.is(_this, "BaseObject")) {
            if (typeof proc == "string") {
                proc = _this[proc];
            }
            if (typeof proc == "function") {
                var d = new Delegate(_this, proc, args);
                this.addDelegate(d);
                return;
            }
        }
        this.LASTERROR("Cannot add queued action", "add");
    }
    QueuedActionsContainer.prototype.reset = function() {
        this.$queue.splice(0);
    }
    QueuedActionsContainer.prototype.execute = function() {
        var act;
        while (act = this.$queue.shift()) {
            if (BaseObject.is(act, "Delegate")) {
                act.invoke();
            }
        }
    }

})();