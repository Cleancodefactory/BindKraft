(function(){

    var AjaxRequestInspectorBase = Class("AjaxRequestInspectorBase");

    /**
     * All requests match - used for final cancellation mostly
     *
     */
    function AjaxRequestInspectorAny() {
        AjaxRequestInspectorBase.apply(this,arguments);

    }
    AjaxRequestInspectorAny.Inherit(AjaxRequestInspectorBase,"AjaxRequestInspectorAny");
        
    AjaxRequestInspectorAny.prototype.inspectRequest = function(request) {
        return {};
        
    }


})();