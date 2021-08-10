(function() {

    /**
     * This interface enables usage of request inspectors and also enables the implementer to pose as inspector itself
     */
    function IAjaxRequestInspectorsUser() {}
    IAjaxRequestInspectorsUser.Interface("IAjaxRequestInspectorsUser", "IAjaxRequestInspector");

    IAjaxRequestInspectorsUser.prototype.addInspector = function(v) { throw "not impl.";}
    IAjaxRequestInspectorsUser.prototype.removeInspector = function(v) { throw "not impl."}
    IAjaxRequestInspectorsUser.prototype.removeAllInspectors = function() { throw "not impl."}


})();