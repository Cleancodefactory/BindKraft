


/* 
    Helper for resource access. While the string resources are actually kept in the CacheManager, they are exposed publicly to any interested code and
    therefore they need to be accessible under a single data tree, not poluted with caching related attributes.
*/
/*CLASS*/

function StringResources(staticResources) {
    BaseObject.apply(this, arguments);
    this.data = { };
    if (staticResources != null) {
        for (var k in staticResources) { // Attach any global statically preloaded resources to the access point.
            this.data[k] = staticResources[k];
        }
    }
}

StringResources.Inherit(BaseObject, "StringResources");
StringResources.Implement(IReloadableData);
// We Implement this for compatibility only
StringResources.Implement(IDataAccessor);
// We Implement this for compatibility only
StringResources.prototype.data = new Initialize("Global string resource root. All the system string resource strings are under this object keyed with the name of the class to which they belong.");
// IDataAccessor implementation
StringResources.prototype.get = function(path, defalutValue) {
    var arr;
    if (BaseObject.is(path, "string")) {
        arr = path.split(".");
    } else if (BaseObject.is(path, "Array")) {
        arr = path;
    }
    var o = this.data;
    for (var i = 0; i < arr.length && o != null; i++) {
        o = o[arr[i]];
    }
    return (o != null) ? o : defalutValue;
};
StringResources.prototype.set = function(path, val) {
    throw "StringResources allows only read access to the cached data. Check if you have non-read only binding to: " + path;
};