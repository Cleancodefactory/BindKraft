(function() {
    var IUIControlReadiness = Interface("IUIControlReadiness");

    function IUIControlReadinessImpl() {}
    IUIControlReadinessImpl.InterfaceImpl(IUIControlReadiness, "IUIControlReadinessImpl");

    IUIControlReadinessImpl.prototype.$controlreadystate = true;
    IUIControlReadinessImpl.prototype.get_controlreadystate = function() {
        return this.$controlreadystate;
    }
    IUIControlReadinessImpl.prototype.$waitControlReadyStateOperation = null;
    IUIControlReadinessImpl.prototype.get_waitcontrolreadystate = function() {
        var me = this;
        var op = null;
        if (this.$controlreadystate) {
            return Operation.From(true);
        } else {
            if (this.$waitControlReadyStateOperation == null || this.$waitControlReadyStateOperation.isOperationComplete()) {
                op = this.$waitControlReadyStateOperation = new Operation(null, 30000);
            } else {
                op = this.$waitControlReadyStateOperation;
            }
        }
        return op;
    }
    IUIControlReadinessImpl.prototype.$failControlReadiness = function(msg) {
        this.$controlreadystate = false;
        if (this.$waitControlReadyStateOperation != null) {
            if (!this.$waitControlReadyStateOperation.isOperationComplete()) {
                this.$waitControlReadyStateOperation.CompleteOperation(false, "Failure " + (msg || ""));
            }
        }
    }
    IUIControlReadinessImpl.prototype.$reportControlReadiness = function(isready) {
        if (isready) {
            this.$controlreadystate = true;
            if (this.$waitControlReadyStateOperation != null) {
                if (!this.$waitControlReadyStateOperation.isOperationComplete()) {
                    this.$waitControlReadyStateOperation.CompleteOperation(true, true);
                }
            }
        } else {
            this.$controlreadystate = false;
        }
    }

})();