(function() {

    var IAjaxResponse = Interface("IAjaxResponse"),
        IAjaxRequest = Interface("IAjaxRequest"),
        IAjaxCloneable = Interface("IAjaxCloneable"),
        AjaxBase = Class("AjaxBase");

    /**
     * 
     */
    function AjaxUnsuccessfulResponse(request, objdataStatus) {
        AjaxBase.apply(this,arguments);
        this.$data = objdataStatus;
        this.$request = request;
        if (this.$request != null && !BaseObject.is(this.$request, IAjaxRequest )) {
            this.LASTERROR("The request parameter is not an IAjaxRequest");
            return null;
        }
    }
    AjaxUnsuccessfulResponse.Inherit(AjaxBase, "AjaxUnsuccessfulResponse")
        .Implement(IAjaxCloneable)
        .Implement(IAjaxResponse);

    //#region IAjaxResponse
    AjaxUnsuccessfulResponse.prototype.$data = null;
    AjaxUnsuccessfulResponse.prototype.get_data = function() { 
        return this.$data;
    }

    AjaxUnsuccessfulResponse.prototype.$success = false;
    AjaxUnsuccessfulResponse.prototype.get_success = function() { 
        if (this.$data && this.$data.status) return this.$data.status.issuccessful;
        return false;
    }
 
    AjaxUnsuccessfulResponse.prototype.$message = null;
    AjaxUnsuccessfulResponse.prototype.get_message = function() { 
        if (this.$data && this.$data.status) return this.$data.status.message;
        return null;
    }

    AjaxUnsuccessfulResponse.prototype.get_request = function() { 
        return this.$request;
    }
    AjaxUnsuccessfulResponse.prototype.set_request = function(request) {
        if (request == null || BaseObject.is(request,  "IAjaxRequest")) {
            this.$request = request;
        } else {
            this.LASTERROR("Attempt to set non-IAjaxRequest", "set_request");
        }
    }

    //#endregion IAjaxResponse

    //#region IAjaxCloneable
    AjaxUnsuccessfulResponse.prototype.cloneAjaxComponent = function() { 
        return new AjaxUnsuccessfulResponse(this.$request, BaseObject.DeepClone(this.$data));
    }
    //#endregion
})();