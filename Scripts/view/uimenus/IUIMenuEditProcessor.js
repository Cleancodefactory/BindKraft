(function() {

    function IUIMenuEditProcessor() {}
    IUIMenuEditProcessor.Interface("IUIMenuEditProcessor","IUIMenuBaseProcessor");

    /**
     * 
     * @param {*} keycode 
     * @return {boolean} True to allow it.
     */
    //IUIMenuEditProcessor.prototype.keyinput = function(keycode, content, pos) { throw "not implemented"; };

    IUIMenuEditProcessor.prototype.get_text = function() { throw "not implemented"; };
    IUIMenuEditProcessor.prototype.set_text = function(v) { throw "not implemented"; };

    IUIMenuEditProcessor.prototype.get_validationrules = function() { throw "not implemented"; };

})();