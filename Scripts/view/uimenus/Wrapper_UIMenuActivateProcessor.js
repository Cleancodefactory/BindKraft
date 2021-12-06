(function(){

    var IUIMenuActivateProcessor = Interface("IUIMenuActivateProcessor");

    function Wrapper_UIMenuActivateProcessor(obj, method) {
        BaseObject.apply(this, arguments);
        this.obj = obj;
        if (typeof method == "string") {
            if (obj != null) {
                this.method = obj[method];
            } else {
                this.LASTERROR("Name of a method is required.");
                this.method = null;
            }
        } else if (typeof method == "function") {
            this.method = method;
        } else {
            this.LASTERROR("Method or a name of a method is required.");
            this.method = null;
        }
    }
    Wrapper_UIMenuActivateProcessor.Inherit(BaseObject, "Wrapper_UIMenuActivateProcessor")
        .Implement(IUIMenuActivateProcessor);

        Wrapper_UIMenuActivateProcessor.prototype.catchAll = function() {}
        Wrapper_UIMenuActivateProcessor.prototype.onActivate = function() {
            if (typeof this.method != "function") return;
            if (this.obj != null) {
                this.method.apply(this.obj, arguments);
            } else {
                method.apply(null, arguments);
            }
        };

})();