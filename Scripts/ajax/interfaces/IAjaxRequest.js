
(function() {

    /**
     * Represents the request to be sent without HTTP details which are determined by a composer
     */
    function IAjaxRequest() {}
    IAjaxRequest.Interface("IAjaxRequest");

    /**
     * Returns the owner instance of an BaseObject
     */
    IAjaxRequest.prototype.get_owner = function() { throw "not impl"; }

    /**
     * Holds the main data to be posted to the server
     */
    IAjaxRequest.prototype.get_data = function() { throw "not impl"; }
    IAjaxRequest.prototype.set_data = function(v) { throw "not impl"; }

    /**
     * Must be implemented according to the indexed property pattern with an underlying object
     */
    IAjaxRequest.prototype.get_reqdata = function(idx) { throw "not impl"; }
    IAjaxRequest.prototype.set_reqdata = function(idx,v) { throw "not impl"; }

    /**
     * The url which can vary in syntax - http, logical, BkUrl or others (support will grow)
     */
    IAjaxRequest.prototype.get_url = function() { throw "not impl"; }
    IAjaxRequest.prototype.set_url = function(v) { throw "not impl"; }

    /**
     * Boolean instruction for the cache manager (ignored in betas)
     */
    IAjaxRequest.prototype.get_cache = function() { throw "not impl"; }
    IAjaxRequest.prototype.set_cache = function(v) { throw "not impl"; }

    IAjaxRequest.prototype.completeRequest = function(response) {
        throw "This method must be created by a requester.";
    }

})();
