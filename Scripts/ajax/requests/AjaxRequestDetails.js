(function() {

    var IAjaxRequestDetails = Interface("IAjaxRequestDetails");

    /**
     * This class represents the results of the AjaxRequestInspector-s. Their result is mostly viewed as a plain object and its existence as confirmation that
     * a given request matches the inspector's criteria. The inspectors do two things in one step - check if the request is
     * 
     */

    function AjaxRequestDetails(plainObject, request) {
        BaseObject.apply(this,arguments);
        if (plainObject != null) {
            for (var k in plainObject) {
                if (plainObject.hasOwnProperty(k)) {
                    this[k] = plainObject[k];
                }
            }
        }
        this.request = request;
    }
    AjaxRequestDetails.Inherit(BaseObject, "AjaxRequestDetails")
        .Implement(IAjaxRequestDetails);

    AjaxRequestDetails.prototype.removeRequestFromQueue = function(requestQueue) {
        if (BaseObject.is(requestQueue, "IAjaxSendQueue")) {
            requestQueue.removeRequest(request);
        }
    }

})();