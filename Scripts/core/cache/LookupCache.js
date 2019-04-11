// DEPRECATED - check for remaining refs and remove

////#using "../../view/binding/Binding.js" // It was a bad idea to move all of these here - check!


// Nomenclatures (lookups) cache. They are usually keyed with packageID and RoleID, but may also have other keying schemas
//  that is why we key them with some url composed by a method of the classes that use this cache, leaving them to compose it as they please.

function LookupCache() {
    BaseObject.apply(this, arguments);
    this.$dataStates = { };
    this.data = { };
}

LookupCache.Inherit(BaseObject, "LookupCache");
LookupCache.prototype.isLoaded = function(url) {
    var state = this.$dataStates[url];
    if (state != null) {
        if (!state.loaded || state.dirty) return false;
        return true;
    } else {
        return false;
    }
};
LookupCache.prototype.setLoaded = function(url, data) {
    this.$dataStates[url] = { loaded: true, lastchange: new Date(), dirty: true };
    this.data[url] = data;
};
LookupCache.prototype.loadLookups = function(url, ctx, callback) { // Performs load if needed, returns true if already loaded, false if load is cheduled and then the callback is called.
    if (url == null) {
        return true;
    }
    if (this.isLoaded(url)) return true;
    var localThis = this;
    this.ajaxGetXml(url, null, function(result) {
        if (result != null && result.status.issuccessful) {
            localThis.setLoaded(url, result.lookups);
        }
        if (callback != null) callback.call(ctx);
    }, false);
    return false;
};

// Resource and lookup cache initialization. The dynamic resources are not used at the moment, only a demo is included.
// Binding.resources = new ResourceSet(g_LocalizedResources);
//Binding.$lookups = new LookupCache(); TODO Michael to check this line is commented out on 11/1/2019 also base for view declarations
/*
Binding.dynamicresources = new ResourceSet(function (branch, state) {
    if (branch != null) {
        this.data[branch] = { alpha: Math.random() + " some number" };
    } else {

    }
});
*/