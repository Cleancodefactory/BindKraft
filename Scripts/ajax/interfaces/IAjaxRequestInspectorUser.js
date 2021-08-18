(function(){

    /**
     * A simple interface that can be implemented by classes using a single request inspector
     */
    function IAjaxRequestInspectorUser() { }
    IAjaxRequestInspectorUser.Interface("IAjaxRequestInspectorUser");

    IAjaxRequestInspectorUser.prototype.get_requestinspector = function() { throw "not impl.";}
    IAjaxRequestInspectorUser.prototype.set_requestinspector = function(v) { throw "not impl.";}

})();