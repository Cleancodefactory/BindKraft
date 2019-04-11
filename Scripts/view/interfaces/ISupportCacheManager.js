


/*INTERFACE*/
/* This Interface is used by the cache manager to query objects and their classes for cache hash */
function ISupportCacheManager() { }
ISupportCacheManager.Interface("ISupportCacheManager");
ISupportCacheManager.prototype.getCacheHash = function () {
    /* Override isntructions:
    use the static method hashKeyOfUrl of your class. For example:
    MyClass.hashKeyOfUrl(composedUrl);
    Generate the composedUrl to include whatever is needed by the hashKeyOfUrl to work. This may or may not be the whole url or may contain fake
    parts. Overrides in child classes may still call the hashKeyOfUrl of their parent (direct or indirect) if the caching scheme remains the same but
    the URL components are chosen differently. Also you MUST include any implicit framework parameter (like roleId in NextGen) in the generated url, this
    decoration should be done in a base class or through some helper method, of course. 
    */
    return null;
}