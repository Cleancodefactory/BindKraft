(function(){

    var IAjaxRequestInspectorUser = Interface("IAjaxRequestInspectorUser");

    function IAjaxRequestInspectorUserImpl() {}
    IAjaxRequestInspectorUserImpl.InterfaceImpl(IAjaxRequestInspectorUser);
    IAjaxRequestInspectorUserImpl.classInitialize = function(cls) {

        cls.prototype.$requestinspector = null;
        cls.prototype.get_requestinspector = function() { return this.$requestinspector; }
        cls.prototype.set_requestinspector = function(v) { 
            if (v == null || BaseObject.is(v, "IAjaxRequestInspector")) {
                this.$requestinspector = v;
            } else {
                this.LASTERROR("set_requestinspector requires IAjaxRequestInspector");
            }
        }

        //#region Using it
        cls.prototype.inspectRequest = function(req) { 
            if (this.$requestinspector == null) return null;
            return this.$requestinspector.inspectRequest(req);
        }
        //#endregion
    }

})();