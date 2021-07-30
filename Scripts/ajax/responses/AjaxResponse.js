(function() {

    var IAjaxResponse = Interface("IAjaxResponse"),
        AjaxBase = Class("AjaxBase");

    function AjaxResponse(request, data, message) {
        AjaxBase.apply(this,arguments);
        if (data === false) {
            this.$data = { status: { issuccessful: false, message: message || "Request cancelled"}};
        } else if (data != null && typeof data == "object") {
            this.$data = data;
        } else {
            this.$data = { status: { issuccessful: false, message: message || "Unexpected data type."}};
        }
        this.$request = request;
    }
    AjaxResponse.Inherit(AjaxBase, "AjaxResponse")
        .Implement(IAjaxResponse);

    //#region IAjaxResponse
    AjaxResponse.prototype.$data = null;
    AjaxResponse.prototype.get_data = function() { return this.$data;}

    
    AjaxResponse.prototype.get_success = function() { 
        if (this.$data && this.$data.status) return this.$data.status.issuccessful;
        return false;
    }
 
    AjaxResponse.prototype.get_message = function() { 
        if (this.$data && this.$data.status) return this.$data.status.message;
        return null;
    }

    AjaxResponse.prototype.get_request = function() { 
        return this.$request;
    }

    //#endregion IAjaxResponse
})();