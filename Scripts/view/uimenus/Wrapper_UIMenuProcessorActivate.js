(function(){

    var IUIMenuProcessorActivate = Internal("IUIMenuProcessorActivate");

    function Wrapper_UIMenuProcessorActivate(obj, method) {
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
    Wrapper_UIMenuProcessorActivate.Inherit(BaseObject, "Wrapper_UIMenuProcessorActivate")
        .Implement(IUIMenuProcessorActivate);

        Wrapper_UIMenuProcessorActivate.prototype.catchAll = function() {}
        Wrapper_UIMenuProcessorActivate.prototype.onActivate = function() {
            if (typeof this.method != "function") return;
            if (this.obj != null) {
                obj[this.method].apply(obj, arguments);
            } else {
                method.apply(null, arguments);
            }
        };

})();