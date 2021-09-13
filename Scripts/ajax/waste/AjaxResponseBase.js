// DEPRECATED

(function() {

    var IAjaxResponse = Interface("IAjaxResponse"),
        IAjaxRequest = Interface("IAjaxRequest"),
        IAjaxCloneable = Interface("IAjaxCloneable"),
        AjaxBase = Class("AjaxBase");

    /**
     * The failed responses do not need to inherit this class, but it is implemented as a separate one to simplify
     * the request cancellation/failure procedure inside the pipeline. It is a BAD IDEA to check for its type when 
     * the intent is to check for reported failure. Why: There are many components and some of them may have multiple 
     * implementations, there is no guarantee that every one of them is using this class to fail requests midway.
     */
    function AjaxResponseBase(request, message) {
        AjaxBase.apply(this,arguments);
        this.$message = message || "Request failed before being sent";
        this.$request = request;
        if (this.$request != null && !BaseObject.is(this.$request, IAjaxRequest )) {
            this.LASTERROR("The request parameter is not an IAjaxRequest");
            return null;
        }
    }
    AjaxResponseBase.Inherit(AjaxBase, "AjaxResponseBase")
        .Implement(IAjaxCloneable)
        .Implement(IAjaxResponse);

    //#region IAjaxResponse
    AjaxResponseBase.prototype.$data = null;
    AjaxResponseBase.prototype.get_data = function() { 
        // return this.$data;
        return null;
    }


    AjaxResponseBase.prototype.get_success = function() { 
        return false;
    }
 
    AjaxResponseBase.prototype.$message = null;
    AjaxResponseBase.prototype.get_message = function() { 
        
        return this.$message || "Undefined error";
    }

    AjaxResponseBase.prototype.get_request = function() { 
        return this.$request;
    }
    AjaxResponseBase.prototype.set_request = function(request) {
        if (request == null || BaseObject.is(request,  "IAjaxRequest")) {
            this.$request = request;
        } else {
            this.LASTERROR("Attempt to set non-IAjaxRequest", "set_request");
        }
    }

    //#endregion IAjaxResponse

    //#region IAjaxCloneable
    AjaxResponseBase.prototype.cloneAjaxComponent = function() { 
        return new AjaxResponseBase(this.$request, this.$message);
    }
    //#endregion
})();