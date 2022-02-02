(function() {

    function IUIMenuEditProcessor() {}
    IUIMenuEditProcessor.Interface("IUIMenuEditProcessor","IUIMenuBaseProcessor");

    /**
     * 
     * @param {*} keycode 
     * @return {boolean} True to allow it.
     */
    IUIMenuEditProcessor.prototype.keyinput = function(sender, item, keycode, content, pos) { throw "not implemented"; };

    IUIMenuEditProcessor.prototype.get_text = function() { throw "not implemented"; };
    IUIMenuEditProcessor.prototype.set_text = function(v) { throw "not implemented"; };

    IUIMenuEditProcessor.prototype.get_validationrules = function() { throw "not implemented"; };

    IUIMenuEditProcessor.wrapMethod = function(obj, method) {
        var Wrapper_UIMenuEditProcessor = Class("Wrapper_UIMenuEditProcessor");
        return new Wrapper_UIMenuEditProcessor(obj, method);
    }

})();