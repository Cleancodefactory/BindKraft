(function() {

    var IAjaxResponse = Interface("IAjaxResponse"),
        AjaxBase = Class("AjaxBase");

    function AjaxResponse(request, data, message) {
        AjaxBase.apply(this,arguments);
        if (data === false) {
            this.$success = false;
            this.$message = message || "Request cancelled";
        } else if (data != null && typeof data == "object") {
            this.$data = data;
        } else {
            this.$data = null;
        }
        this.$request = request;
    }
    AjaxResponse.Inherit(AjaxBase, "AjaxResponse")
        .Implement(IAjaxResponse);

    //#region IAjaxResponse
    AjaxResponse.prototype.$data = null;
    AjaxResponse.prototype.get_data = function() { return this.$data;}

    
    AjaxResponse.prototype.$success = false;
    AjaxResponse.prototype.get_success = function() { 
        return this.$success;
    }
 
    AjaxResponse.prototype.get_message = function() { 
        if (this.$data && this.$data.status) return this.$data.status.message;
        return null;
    }

    AjaxResponse.prototype.get_request = function() { 
        return this.$request;
    }
    AjaxResponse.prototype.set_request = function(request) {
        if (request == null || BaseObject.is(request,  "IAjaxRequest")) {
            this.$request = request;
        } else {
            this.LASTERROR("Attempt to set non-IAjaxRequest", "set_request");
        }
    }

    //#endregion IAjaxResponse
})();