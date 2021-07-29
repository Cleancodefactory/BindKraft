(function() {

    function AjaxRequestSenderBase() {
        AjaxBase.apply(this, arguments);
    }

    AjaxRequestSenderBase.Inherit(AjaxBase, "AjaxRequestSenderBase")
        .Implement(IAjaxRequestSender);

    //#region IAjaxRequestSender
    IAjaxRequestSender.prototype.get_blocked = function() {throw "not implemented."; }

    IAjaxRequestSender.prototype.sendRequest = function(request) {

    }
    IAjaxRequestSender.prototype.$requests = function() {
        
    }

    //IAjaxRequestSender.prototype.unblockedevent = new InitializeEvent("Fired when the sender can accept more requests");
    //#endregion
})();