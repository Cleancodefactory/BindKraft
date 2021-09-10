(function() {

    var IAjaxResponse = Interface("IAjaxResponse"),
        AjaxBase = Class("AjaxBase");

    /**
     * This response is the regular success response, but more specific classes may exist for certain kind of unpacking procedures.
     * 
     * @param {IAjaxRequest} request An original request object that will be completed with this.
     * @param {*} data 
     * @param {*} message 
     */
    function AjaxResponse(request, data, message) {
        AjaxBase.apply(this,arguments);
        if (data === false) {
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
        return true;
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