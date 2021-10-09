(function() {

    /**
     * This interface obsoletes the idea for IAjaxRequestDetails and can serve additional purposes.
     * 
     * It allows to attach information to an object that implements it at any phase and even outside the ajax
     * subsystem. The concept is that the pieces of information can be attached and extracted by tagging them 
     * in two ways - (1) with type or/and with (2) instance reference.
     * 
     * (1) is good for sharing the info with other objects, such as extensions and functional elements further
     * down the pipeline. There are (obviously) many ways to use this e.g. 
     * - extract data tagged with interface type will query info collected for public use these kind of objects so far.
     * - writing data tagged with a specific type can "send" special info to the object of that type (usually an extension 
     *      in the pipeline)
     * - and so on.
     * 
     * (2) tagging with instance is mostly useful for caching of information that needs significant effort to be determined.
     * This kind of tagging is mostly useful for the IRequestInspector-s to avoid the need to determine characteristics of
     * a request. Yet other uses are also possible, but for obvious reasons they are typically private solutions applicable
     * "locally" - i.e. specific locations of the pipeline where the instance reference can be known.
     * 
     * Apparently certain conventions are necessary for any information that is tagged with a type in order to be shared.
     * For such cases it should be defined in the documentation of the element that is publishing it and in more important 
     * cases it can be also represented by interface types and even wrappers. In all cases when shared information is 
     * accessed the accessor must know the structure of the data it accesses.
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
     * Like attachInfo but mixes the existing info with the one passed to the method.
     * @param attacher {BaseObject|string} Defines the key
     * @param info {object} The information to mix into the attached info. Technically it can be basic value and not an object, but
     *                      using objects is strongly recommended.
     */
    IAjaxAttachedInfo.prototype.mixInfo = function(attacher, info) { throw "not impl.";};
    /**
     * @param attacher {BaseObject|string} Defines the key
     * @returns {object} The previously attached info or null if absent.
     */
    IAjaxAttachedInfo.prototype.getAttachedInfo = function(attacher) {throw "not impl.";};

    /**
     * @param attacher {BaseObject|string} Optional, Defines the key, if omitted all the data is cleared.
     */
    IAjaxAttachedInfo.prototype.clearAttachedInfo = function(attacher) {throw "not impl.";}

    /**
     * Attaches info for the specified instance (the instance is usually the this of the caller)
     */
    IAjaxAttachedInfo.prototype.attachInstanceInfo = function(instance, info) { throw "not impl."; }
    /**
     * Mixes with the existing info or creates a new one for the specified instance (usually the caller)
     */
    IAjaxAttachedInfo.prototype.mixInstanceInfo = function(instance, info) { throw "not impl."; }
    /**
     * Gets any existing info for the specified instance (usually the callers this)
     */
    IAjaxAttachedInfo.prototype.getInstanceInfo = function(instance) { throw "not impl.";}

})();