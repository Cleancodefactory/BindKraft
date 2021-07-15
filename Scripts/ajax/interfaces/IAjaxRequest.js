
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

    /**
     * HTTP verb to use. This can be null which means auto. 
     * The automatic behaviour can be tricky if one does not take into account
     * that such a choice requires to view the building process as ordered steps.
     * So, setting the verb can be a step and if precedes setting the data - the 
     * data should be accommodated to the limitations of the verb. On the other case,
     * if we order the process in reverse - set the data, then the verb, setting the 
     * data and url should determine the best verb and auto set it.
     */
    IAjaxRequest.prototype.get_verb = function() { throw "not impl"; }
    IAjaxRequest.prototype.set_verb = function(v) { throw "not impl"; }

    /**
     * Sets an error message (string) when the request cannot be constructed completely for some reason.
     * The requests are built by adding certain pieces of data - url, data, verb etc. This is most often done
     * by some API method that does it gradually and it can determine at certain point that successful construction
     * cannot be performed. The method then sets some error message and if the request then enters the pipeline it
     * will be internally completed with erroneous response without any attempt to further process it or send it anywhere.
     */
    IAjaxRequest.prototype.get_constructionError = function() { throw "not impl.";}
    IAjaxRequest.prototype.set_constructionError = function(v) { throw "not impl.";}


    IAjaxRequest.prototype.completeRequest = function(response) {
        throw "This method must be created by a requester.";
    }

    //#region Static helpers
    IAjaxRequest.generateRequestId = (function() {
        ///////////
    })();

    //#endregion
})();
