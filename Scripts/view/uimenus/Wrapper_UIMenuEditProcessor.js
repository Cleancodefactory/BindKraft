(function () {

    var IUIMenuEditProcessor = Interface("IUIMenuEditProcessor"),
        IUIMenuProcessorOpinion = Interface("IUIMenuProcessorOpinion");

    function Wrapper_UIMenuEditProcessor(obj, method) {
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

    Wrapper_UIMenuEditProcessor.Inherit(BaseObject, "Wrapper_UIMenuEditProcessor")
        .Implement(IUIMenuEditProcessor)
        .Implement(IUIMenuProcessorOpinion);

    Wrapper_UIMenuEditProcessor.prototype.catchAll = function (signal, sender, data) { };

    Wrapper_UIMenuEditProcessor.prototype.keyinput = function (sender, item, keycode, content, pos) {
        if (typeof this.method != "function") return;

        if (this.obj != null) {
            this.method.apply(this.obj, arguments);
        } else {
            method.apply(null, arguments);
        }
    };

    Wrapper_UIMenuEditProcessor.prototype.suggestUIComponentClass = function (slotInterface, menuItem) {
        return "UIMenuEditComponent";
    };
})();