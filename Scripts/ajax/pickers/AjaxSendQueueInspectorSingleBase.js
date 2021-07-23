(function(){

    function AjaxSendQueueInspectorSingleBase() {
        AjaxSendQueueInspectorBase.apply(this, arguments);
    }
    AjaxSendQueueInspectorSingleBase.Inherit(AjaxSendQueueInspectorBase,"AjaxSendQueueInspectorSingleBase")
        .Implement(IAjaxRequestInspectorUser);

    //#region IAjaxRequestInspectorUser
    AjaxSendQueueInspectorBase.prototype.$requestInspector = null;
    AjaxSendQueueInspectorBase.prototype.get_requestinspector = function() {
         return this.$requestInspector;
    }
    AjaxSendQueueInspectorBase.prototype.set_requestinspector = function(v) {
        if (v == null) {
            this.$requestInspector = null;
        } else if (BaseObject.is(v, "IAjaxRequestInspector")) {
            this.$requestInspector = v;
        } else {
            this.LASTERROR("Unsupprted type set.", "set_requestinspector");
        }

    }
    //#endregion
})();