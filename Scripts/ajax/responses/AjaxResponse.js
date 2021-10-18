(function() {

    var IAjaxResponse = Interface("IAjaxResponse"),
        AjaxBase = Class("AjaxBase");

    /**
     * This response is the regular success response, but more specific classes may exist for certain kind of unpacking procedures.
     * For not it is NOT cloneable.
     * 
     * @param {*} data - only the data from the response, without any OOB/status information.
     * @param {*} message - optional message
     */
    function AjaxResponse(data, message) {
        AjaxBase.apply(this,arguments);
        this.$message = message; // Successful requests usually do not include a message.
        if (data != null && typeof data == "object") {
            this.$data = data;
        } else {
            this.$data = null;
        }
    }
    AjaxResponse.Inherit(AjaxBase, "AjaxResponse")
        .Implement(IAjaxResponse);

    //#region IAjaxResponse
    AjaxResponse.prototype.$data = null;
    AjaxResponse.prototype.get_data = function() { return this.$data;}

    AjaxResponse.prototype.get_success = function() { 
        return true;
    }
 
    AjaxResponse.prototype.$message = null;
    AjaxResponse.prototype.get_message = function() { 
        return this.$message;
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