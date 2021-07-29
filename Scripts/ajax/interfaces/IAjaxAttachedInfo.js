(function() {

    /**
     * This interface obsoletes the idea for IAjaxRequestDetails and can serve additional purposes where
     * information collected/created by one object for another object has to be available with the latter.
     * This approach is more natural looking and fits better the role of cached data over an inspected object by
     * its inspectors.
     * 
     */
    function IAjaxAttachedInfo() {}
    IAjaxAttachedInfo.Interface("IAjaxAttachedInfo");

    /**
     * @param attacher {BaseObject|string} Defines the key
     * @param info {object} The information to attach. Technically it can be basic value and not an object, but
     *                      using objects is strongly recommended.
     */
    IAjaxAttachedInfo.prototype.attachInfo = function(attacher, info) { throw "not impl.";};
    /**
     * @param attacher {BaseObject|string} Defines the key
     * @returns {object} The previously attached info or null if absent.
     */
    IAjaxAttachedInfo.prototype.getAttachedInfo = function(attacher) {throw "not impl.";};

    /**
     * @param attacher {BaseObject|string} Optional, Defines the key, if omitted all the data is cleared.
     */
    IAjaxAttachedInfo.prototype.clearAttachedInfo = function(attacher) {throw "not impl.";}

})();