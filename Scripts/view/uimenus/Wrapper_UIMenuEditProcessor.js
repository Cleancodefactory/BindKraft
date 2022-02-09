(function () {

    var IUIMenuEditProcessor = Interface("IUIMenuEditProcessor"),
        IUIMenuProcessorOpinion = Interface("IUIMenuProcessorOpinion");

    function Wrapper_UIMenuEditProcessor(obj, onchange) {
        BaseObject.apply(this, arguments);
        this.obj = obj;
        if (typeof onchange == "string") {
            if (obj != null) {
                this.$onchange = new Delete(obj,onchange);
            } else {
                this.LASTERROR("No base object on which to resolve the onchange handler as string.");
                this.$onchange = null;
            }
        } else if (typeof onchange == "function") {
            this.$onchange = new Delete(obj,onchange);
        } else if (BaseObject.isCallback(onchange)) {
            this.$onchange = onchange;
        } else {
            this.$onchange = null;
        }
    }

    Wrapper_UIMenuEditProcessor.Inherit(BaseObject, "Wrapper_UIMenuEditProcessor")
        .Implement(IUIMenuEditProcessor)
        .Implement(IUIMenuProcessorOpinion);
        

    //#region Initialization
    Wrapper_UIMenuEditProcessor.prototype.onchange = function(method) {
        if (BaseObject.isCallback(method)) {
            this.$onchange = method;
        } else if (typeof method == "string" && this.obj != null) {
            this.$onchange = new Delete(this.obj,method);
        } else if (method == null) {
            this.$onchange = null;
        }
        return this;
    }
    Wrapper_UIMenuEditProcessor.prototype.onkeyinput = function(method) {
        if (BaseObject.isCallback(method)) {
            this.$onkeyinput = method;
        } else if (typeof method == "string" && this.obj != null) {
            this.$onkeyinput = new Delete(this.obj,method);
        } else if (method == null) {
            this.$onkeyinput = null;
        }
        return this;
    }
    Wrapper_UIMenuEditProcessor.prototype.onsubmit = function(method) {
        if (BaseObject.isCallback(method)) {
            this.$onsubmit = method;
        } else if (typeof method == "string" && this.obj != null) {
            this.$onsubmit = new Delete(this.obj,method);
        } else if (method == null) {
            this.$onsubmit = null;
        }
        return this;
    }

    Wrapper_UIMenuEditProcessor.prototype.catchAll = function (signal, sender, data) { };

    Wrapper_UIMenuEditProcessor.prototype.change = function (item, content) {
        return BaseObject.callCallback(this.$onchange,item, content);
    }
    Wrapper_UIMenuEditProcessor.prototype.submit = function (item, content) {
        return BaseObject.callCallback(this.$onsubmit,item, content);
    }
    Wrapper_UIMenuEditProcessor.prototype.keyinput = function (item, keydata, content, selection) {
        return BaseObject.callCallback(this.$onkeyinput,item, keydata, content, selection);
    };

    Wrapper_UIMenuEditProcessor.prototype.suggestUIComponentClass = function (slotInterface, menuItem) {
        return "UIMenuEditComponent";
    };
})();