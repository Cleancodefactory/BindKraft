


/* NOT USED!!! DO NOT USE THIS CLASS!!!
    Registered inheritors of this class handle the cache item(s) when they are received or when they must be attached to an instance of a class.
    Implement as many child classes of this one as needed and register them in a structure { cachebaranch: handler, ...}
    Only one instance of each handler class is created.
*/
/*CLASS*/

function CacheItemHandler() {
    BaseObject.apply(this, arguments);
}

CacheItemHandler.Inherit(BaseObject, "CacheItemHandler");
CacheItemHandler.prototype.onCacheItem = function(newItem, oldItem, instance) {
};
// instance is not used in the current version
CacheItemHandler.prototype.onAttachToInstance = function(cacheItem, instance) {
};
// must attach the cache item to the object if necessary (for the app)
CacheItemHandler.prototype.onManageInstance = function(cacheItem, instance) {
};
// for explicit invocation of CacheManager.prototype.manageInstance(obj);
