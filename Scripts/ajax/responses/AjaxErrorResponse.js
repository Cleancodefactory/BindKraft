(function() {

    var IAjaxResponse = Interface("IAjaxResponse"),
        IAjaxRequest = Interface("IAjaxRequest"),
        AjaxBase = Class("AjaxBase");

    /**
     * The failed responses do not need to inherit this class, but it is implemented as a separate one to simplify
     * the request cancellation/failure procedure inside the pipeline. It is a BAD IDEA to check for its type when 
     * the intent is to check for reported failure. Why: There are many components and some of them may have multiple 
     * implementations, there is no guarantee that every one of them is using this class to fail requests midway.
     */
    function AjaxErrorResponse(request, message) {
        AjaxBase.apply(this,arguments);
        this.$success = false;
        this.$message = message || "Request failed before being sent";
        this.$request = request;
        if (this.$request != null && !BaseObject.is(this.$request, IAjaxRequest )) {
            this.LASTERROR("The request parameter is not an IAjaxRequest");
            return null;
        }
    }
    AjaxErrorResponse.Inherit(AjaxBase, "AjaxErrorResponse")
        .Implement(IAjaxResponse);

    //#region IAjaxResponse
    AjaxErrorResponse.prototype.$data = null;
    AjaxErrorResponse.prototype.get_data = function() { 
        // return this.$data;
        return null;
    }

    AjaxErrorResponse.prototype.$success = false;
    AjaxErrorResponse.prototype.get_success = function() { 
        if (this.$data && this.$data.status) return this.$data.status.issuccessful;
        return false;
    }
 
    AjaxErrorResponse.prototype.$message = null;
    AjaxErrorResponse.prototype.get_message = function() { 
        if (this.$data && this.$data.status) return this.$data.status.message;
        return null;
    }

    AjaxErrorResponse.prototype.get_request = function() { 
        return this.$request;
    }
    AjaxErrorResponse.prototype.set_request = function(request) {
        if (request == null || BaseObject.is(request,  "IAjaxRequest")) {
            this.$request = request;
        } else {
            this.LASTERROR("Attempt to set non-IAjaxRequest", "set_request");
        }
    }

    //#endregion IAjaxResponse
})();