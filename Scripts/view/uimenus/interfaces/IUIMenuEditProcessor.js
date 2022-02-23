(function() {

    function IUIMenuEditProcessor() {}
    IUIMenuEditProcessor.Interface("IUIMenuEditProcessor","IUIMenuBaseProcessor");
    /**
     * 
     * @param {UIMenuItem} item The item being handled by the component caller.
     * @param {object} keydata See UIMenuComponentBase.packKeyboardEventData for the object contents.
     * @param {string} content The value of the text box/textarea.
     * @param {object} selection See UIMenuComponentBase.packSelectionData for the object contents.
     * 
     * @return {boolean} True to allow it.
     */
    IUIMenuEditProcessor.prototype.keyinput = function(item, keydata, content, selection) { throw "not implemented"; };

    IUIMenuEditProcessor.prototype.change = function(item, content) { throw "not implemented"; };

    IUIMenuEditProcessor.prototype.submit = function(item, content) { throw "not implemented"; };

    // Deprecated
    // IUIMenuEditProcessor.prototype.get_text = function() { throw "not implemented"; };
    // IUIMenuEditProcessor.prototype.set_text = function(v) { throw "not implemented"; };

    IUIMenuEditProcessor.prototype.get_validationrules = function() { throw "not implemented"; };


    

    IUIMenuEditProcessor.wrapMethod = function(obj, onchange) {
        var Wrapper_UIMenuEditProcessor = Class("Wrapper_UIMenuEditProcessor");
        return new Wrapper_UIMenuEditProcessor(obj, onchange);
    }



})();