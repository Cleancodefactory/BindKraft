(function() {

    var IAjaxSendQueuePicker = Interface("IAjaxSendQueuePicker");

    function IAjaxSendQueuePickerImpl() {}
    IAjaxSendQueuePickerImpl.InterfaceImpl(IAjaxSendQueuePicker);
    IAjaxSendQueuePickerImpl.classInitialize = function(cls) {

        cls.prototype.$checkQueueIndex = 0; // Initial
        /**
         * Picker logic from multiple inspectors by rotating them.
         */
        cls.prototype.pickQueue = function(priority, limit) {
            var results = [];
            var index = this.$checkQueueIndex;
            if (index > this.$inspectors.length) index = 0;
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
                return true;
            }
            return false;
        }
        cls.prototype.removeInspector = function(inspector) {
            var idx = this.$inspectors.indexOf(inspector);
            if (idx >= 0) {
                return this.$inspectors.splice(idx,1);
            }
            return null;
        }
        cls.prototype.removeAllInspectors = function() {
            this.$inspectors.splice(0);
        }
    }

})();