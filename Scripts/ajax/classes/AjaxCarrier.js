(function() {
    var AjaxBase = Class("AjaxBase");

    /**
     * 
     * TODO
     * 
     * Not sure if we ara going to use this with multiple queue inspectors. Still it will be supported, but it might be impractical (We will see).
     * 
     */
    function AjaxCarrier() {
        AjaxBase.apply(this,arguments);
    }
    AjaxCarrier.Inherit(AjaxBase, "AjaxCarrier");

    //#region Inspectors

    AjaxCarrier.prototype.$inspectors = new InitializeArray("Array of all the inspectors using this carrier");
    AjaxCarrier.prototype.addInspector = function(inspector) {
        // TODO
    }
    AjaxCarrier.prototype.removeInspector = function(inspector) {
        // TODO
    }
    AjaxCarrier.prototype.removeAllInspectors = function() {
        // TODO
    }

    //#endregion

    


})();