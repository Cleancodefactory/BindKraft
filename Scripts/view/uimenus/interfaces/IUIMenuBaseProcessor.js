(function() {

    /**
     * All menu processor interfaces have to extend this one.
     */
    function IUIMenuBaseProcessor() {}
    IUIMenuBaseProcessor.Interface("IUIMenuBaseProcessor");

    IUIMenuBaseProcessor.prototype.set_component = function(component) { throw "not implemented";}
    /**
     * With argument sets the visibility, always returns boolean true=visible, false = not visible.
     */
    //IUIMenuBaseProcessor.prototype.visibility = function(v) { throw "not implemented"; }
    
    IUIMenuBaseProcessor.prototype.catchAll = function(signal, sender, data) { throw "not implemented"; }


})();