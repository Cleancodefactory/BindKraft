(function() {

    var IAjaxResponse = Interface("IAjaxResponse"),
        IAjaxRequest = Interface("IAjaxRequest"),
        IAjaxCloneable = Interface("IAjaxCloneable"),
        AjaxBase = Class("AjaxBase");

    /**
     * This response class is often used to pack unsuccessful responses to requests. Unlike the more general
     * AjaxErrorResponse this one also includes properties for more detailed error information.
     */
    function AjaxUnsuccessfulResponse(objdataStatus) {
        AjaxBase.apply(this,arguments);
        this.$data = objdataStatus;
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
        return new AjaxUnsuccessfulResponse(BaseObject.DeepClone(this.$data));
    }
    //#endregion
})();