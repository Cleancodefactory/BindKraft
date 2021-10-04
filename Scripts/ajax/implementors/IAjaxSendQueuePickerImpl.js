(function() {

    var IAjaxSendQueuePicker = Interface("IAjaxSendQueuePicker"),
        IAjaxSendQueueInspector = Interface("IAjaxSendQueueInspector");

    /**
     * Implements a picker based on multiple send queue inspectors.
     * If supplied with a _queueSupplier callback sets the queue on each added inspector. The queue is set to null when inspector is removed.
     * 
     * Usage:
     * MyClass.Implement(IAjaxSendQueuePicker, callback(): IAjaxSendQueue);
     */
    function IAjaxSendQueuePickerImpl() {}
    IAjaxSendQueuePickerImpl.InterfaceImpl(IAjaxSendQueuePicker, "IAjaxSendQueuePickerImpl");
    IAjaxSendQueuePickerImpl.classInitialize = function(cls, _queueSupplier) {

        function _getQueue(instance) {
            if (BaseObject.is(instance.$sendqueue, "IAjaxSendQueue")) {
                return instance.$sendqueue;
            } else if (typeof _queueSupplier == "function") {
                return _queueSupplier.call(instance);
            } else if (typeof _queueSupplier == "string" && typeof instance[_queueSupplier] == "function") {
                return _queueSupplier.call(instance);
            }
            return null;
        }

        cls.prototype.$sendqueue = null;
        cls.prototype.get_sendqueue = function() { return this.$sendqueue; }
        cls.prototype.set_sendqueue = function(v) { 
            if (v == null || BaseObject.is(v, "IAjaxSendQueue")) {
                this.$sendqueue = v;
            }
        }

        cls.prototype.$checkQueueIndex = 0; // Initial
        /**
         * Picker logic from multiple inspectors by rotating them.
         */
        cls.prototype.pickQueue = function(priority, limit) {
            var results = [];
            var index = this.$checkQueueIndex;
            if (index >= this.$inspectors.length) index = 0; // >= ? or > ?
            if (index < this.$inspectors.length) {
                var inspector, reqs, total, excess;
                do {
                    inspector = this.$inspectors[index];
                    if (BaseObject.is(inspector, IAjaxSendQueueInspector)) {
                        var reqs = inspector.checkQueue(priority);
                        total = results.limit + reqs.length;
                        if (limit != null) {
                            if (total > limit) {
                                excess = total - limit;
                                reqs = reqs.reverse.splice(0,excess);
                                if (reqs.length > 0) {
                                    inspector.grabRequests(reqs);
                                    results = results.concat(reqs);
                                }
                                this.$checkQueueIndex = ++index;
                                return results;
                            } else {
                                inspector.grabRequests(reqs);
                                results = results.concat(reqs);
                            }
                        } else {
                            inspector.grabRequests(reqs);
                            results = results.concat(reqs);
                            this.$checkQueueIndex = ++index;
                        }
                    }
                    this.$checkQueueIndex = ++index;
                } while(index < this.$inspectors.length);
            } 
            return results;
        }

        cls.prototype.$inspectors = new InitializeArray("Array of all the inspectors using this carrier");
        cls.prototype.addInspector = function(inspector) {
            if (BaseObject.is(inspector, "IAjaxSendQueueInspector")) {
                if (this.$inspectors.indexOf(inspector) >= 0) return true; // already there
                this.$inspectors.push(inspector);
                inspector.set_queue(_getQueue(this));
                return true;
            }
            return false;
        }
        cls.prototype.removeInspector = function(inspector) {
            var idx = this.$inspectors.indexOf(inspector);
            if (idx >= 0) {
                var inspectors = this.$inspectors.splice(idx,1);
                if (Array.isArray(inspectors)) {
                    inspectors.Each(function(idx, inspector) {
                        if (BaseObject.is(inspector, "IAjaxSendQueueInspector")) {
                            inspector.set_queue(null);
                        }
                    });
                    return (inspectors.length > 0)?inspectors[0]:null;
                }
            }
            return null;
        }
        cls.prototype.removeAllInspectors = function() {
            var inspectors = this.$inspectors.splice(0);
            if (Array.isArray(inspectors)) {
                inspectors.Each(function(idx, inspector) {
                    if (BaseObject.is(inspector, "IAjaxSendQueueInspector")) {
                        inspector.set_queue(null);
                    }
                });
            }
        }
    }

})();