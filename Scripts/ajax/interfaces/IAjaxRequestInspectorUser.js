(function(){

    /**
     * A simple interface that can be implemented by classes using a single request inspector.
     * This interface also enables the implementer to pose as inspector itself.
     */
    function IAjaxRequestInspectorUser() { }
    IAjaxRequestInspectorUser.Interface("IAjaxRequestInspectorUser", "IAjaxRequestInspector");

    IAjaxRequestInspectorUser.prototype.get_requestinspector = function() { throw "not impl.";}
    IAjaxRequestInspectorUser.prototype.set_requestinspector = function(v) { throw "not impl.";}

})();