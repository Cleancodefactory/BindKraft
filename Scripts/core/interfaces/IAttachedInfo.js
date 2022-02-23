(function() {

    /**
     * This interface describes functionality that allows to attach information to an object that implements it 
     * at any phase of its lifecycle.
     * 
     * The concept is that the pieces of information can be attached and extracted by tagging them 
     * in two ways - (1) with a type or/and with (2) instance reference.
     * 
     * (1) is good for sharing the info with other objects (such as some kind of  extensions).
     *  There are (obviously) many ways to use this e.g. 
     * - extract data tagged with interface type will query info collected for public use by this kind of objects (collected so far).
     * - writing data tagged with a specific type can "send" special info to the object of that type.
     * - and so on.
     * 
     * (2) tagging with instance is mostly useful for data caching that may need significant effort to be determined/calculated.
     * 
     * Apparently certain conventions are necessary for any information that is tagged with a type in order to be shared.
     * For such cases it should be defined in the documentation of the element that is publishing it and in more important 
     * cases it can be also represented by interface types and even wrappers. In all cases when shared information is 
     * accessed the accessor must know the structure of the data it accesses.
     * 
     */
    function IAttachedInfo() {}
    IAttachedInfo.Interface("IAttachedInfo");

    //#region Attached Info (by type)
    /**
     * @param attacher {BaseObject|string} Defines the key - type or type name. The type must exist.
     * @param info {object} The information to attach. Technically it can be basic value and not an object, but
     *                      using objects is strongly recommended.
     */
    IAttachedInfo.prototype.setAttachedInfo = function(attacher, info) { throw "not impl.";};

    /**
     * Like attachInfo but mixes the existing info with the one passed to the method.
     * @param attacher {BaseObject|string} Defines the key - type or type name. The type must exist.
     * @param info {object} The information to mix into the attached info. Technically it can be basic value and not an object, but
     *                      using objects is strongly recommended at least for the cases where mixing is really possible.
     */
    IAttachedInfo.prototype.mixAttachedInfo = function(attacher, info) { throw "not impl.";};
    /**
     * @param attacher {BaseObject|string} Defines the key - type or type name. The type must exist.
     * @returns {object} The previously attached info or null if absent.
     */
    IAttachedInfo.prototype.getAttachedInfo = function(attacher) {throw "not impl.";};

    /**
     * @param attacher {BaseObject|string}* Optional.Defines the key - type or type name. 
     *                                      The type must exist. Multiple attachers can be passed.
     *                                      Without arguments clears everything
     */
    IAttachedInfo.prototype.clearAttachedInfo = function(attacher) {throw "not impl.";}
    //#endregion Attached info (by type)


    //#region Instance info (attached by/for specific instance)
    /**
     * Attaches info for the specified instance (the instance is usually the this of the caller)
     */
    IAttachedInfo.prototype.setInstanceInfo = function(instance, info) { throw "not impl."; }
    /**
     * Mixes with the existing info or creates a new one for the specified instance (usually the caller)
     */
    IAttachedInfo.prototype.mixInstanceInfo = function(instance, info) { throw "not impl."; }
    /**
     * Gets any existing info for the specified instance (usually the callers this)
     */
    IAttachedInfo.prototype.getInstanceInfo = function(instance) { throw "not impl.";}
    /**
     * Clears any data associated with the specified instance.
     */
     IAttachedInfo.prototype.clearInstanceInfo = function(instance) { throw "not impl.";}
    //#endregion Instance info (attached by/for specific instance)

    //#region Mass clear
    IAttachedInfo.prototype.clearAllAttachedInfos = function() { throw "not impl.";}
    IAttachedInfo.prototype.clearAllInstanceInfos = function() { throw "not impl.";}
    //#endregion


    //#region Usage helpers
    /**
     * 
     * @param {string} valueName The name of the field to mix
     * @param {object} typeValues { <typename1>: <value1>, <typename1>: <value2>} - values for various types.
     */
    IAttachedInfo.mixMultipleAttachedInfos = function(instance, valueName, typeValues) {
        if (instance.is(IAttachedInfo)) { 
            for (var type in typeValues) {
                if (typeValues.hasOwnProperty(type)) {
                    var o = {};
                    o[valueName] = typeValues[type];
                    instance.mixAttachedInfo(type, o);
                }
            }
        }
    }
    IAttachedInfo.getAttachedInfoValue = function(instance, valueName /*, ...typeValues */) {
        if (instance.is(IAttachedInfo)) { 
            var arr = Array.createCopyOf(arguments,2);
            for (var i = 0;i < arr.length;i++) {
                var o = instance.getAttachedInfo(arr[i]);
                if (o[valueName] != null) return o[valueName];
            }
        }
        return null;
    }
    //#endregion
})();