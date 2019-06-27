



/*
    The cache manager is configured with:
    branchesAndFlags: { branchName: flag, ...}
    cacheHandlers: { branchName: { 
                            _thiscall onCacheItem: function(oldItem, newItem, hash), // this == CacheManager.Default
                            _thiscall onApplyToInstance: function(item, hash) // this == The object to attach cache item to
                   }
    In both cases item is direct reference to the cache item of the specific kind (branch). The item looks like: 
    { dirty: <boolean>, stamp: <datetime>, data: <the_actual_data> };
    The second parameter is the hash of the entire cache node. It may be needed if the specific resource management needs to keep references back to the
    slot in the cache manager somewhere else in the application infrastructure.

    The cache manager is maintained as singleton CacheManager.Default
    The ajax infrastructure must call its onBeginRequest/onEndRequest implicitly
    The manager marks the ajax settings object with these properties:
        cacheHashKey - (string) the hash key under which the cached item will be saved (calculated once this saves processing time and idetifies the item type).
        requestedContentFlags - (integer) the flags of the content which was requested at begin request phase. The cache manager needs this in order to mark empty 
            nonexistent entries as present.

    Alo the cache manager saves the cache hash in the packet when it is inspected on ajax return. The same property name is used as in the settings: cacheHashKey.

*/
/*CLASS*/

function CacheManager(branchesAndFlags, cacheHandlers) {
    BaseObject.apply(this, arguments);
    this.cache = { };
    this.objBranchesAndFlags = branchesAndFlags;
    this.cacheHandlers = cacheHandlers;
    this.$noCacheFlagsGet = 0x0000FFFF; // Defaults passed down whenever caching is impossible
    this.$noCacheFlagsPost = 0x0000FFFF;
    for (var branch in this.objBranchesAndFlags) {
        this.disableCacheBranches[branch] = false;
    }

}

CacheManager.Inherit(BaseObject, "CacheManager");



// All interested classes must Implement a static method $hashKeyOfUrl(url)
CacheManager.$hashKeyOfUrl = function(urlIn) {
	
	var url = BaseObject.ajaxCleanURLForHashOperations(urlIn);
	var hash = null, cls = null, syshash;
	
	for ( var index = 0; index < ISupportsURLHashImpl.RegisterOfClasses.length; index++ )
	{
		cls = ISupportsURLHashImpl.RegisterOfClasses[index];
		hash = cls.prototype.hashKeyOfUrl.call ( cls, url );
		if (hash != null) {
			syshash = BaseObject.ajaxDecorateUrlHash ( null, url );
			if ( syshash.length > 0 ) hash += syshash;
			return { hash: hash, className: cls };
		}
	}
	return null;
	
	
	
    //var sysClasses = Function.classes;
    //var url = BaseObject.ajaxCleanURLForHashOperations(urlIn);
    //var hash = null, syshash;
    //for (var c in sysClasses) {
    //    if (Class.is(sysClasses[c], "ISupportsURLHashImpl")) {
    //        hash = sysClasses[c].prototype.hashKeyOfUrl.call(sysClasses[c], url);
    //        if (hash != null) {
    //            syshash = BaseObject.ajaxDecorateUrlHash(null, url);
    //            if (syshash.length > 0) hash += syshash;
    //            return { hash: hash, className: c };
    //        }
    //    }
    //}
    //return null;
};




CacheManager.prototype.get_cachableflags = function() {
    var d = 0;
    for (var branch in this.objBranchesAndFlags) {
        d |= this.objBranchesAndFlags[branch];
    }
    return d;
};
CacheManager.prototype.cache = null;
// The hash for an URL for the ajaxXXX routines is passed here and its entry is inspected, then flags for the missing parts are returned
// objBranchesAndFlags= { branch: flag, branch: flag ...}
// PHASE: Preparing request ajax cycle
CacheManager.prototype.flagContentRequest = function(hash) {
    if (this.objBranchesAndFlags == null) return 0;
    var flags = 0;
    var selectedStore = this.cache[hash.hash];
    if (selectedStore == null) {
        for (var branch in this.objBranchesAndFlags) {
            flags |= this.objBranchesAndFlags[branch];
        }
    } else {
        for (var branch in this.objBranchesAndFlags) {
            if (selectedStore[branch] == null || selectedStore[branch].dirty || this.disableCacheBranches[branch]) {
                flags |= this.objBranchesAndFlags[branch];
            }
        }
    }
    return flags;
};
CacheManager.prototype.flagContentRequestUrl = function(settings) {
    this.$lastCacheBranch = null;
    var url = settings.url;
    var hash = CacheManager.$hashKeyOfUrl(url);
    var flags = 0;
    if (hash != null) {
        settings.cacheHashKey = hash;
        flags = this.flagContentRequest(hash);
    } else {
        if (settings.type != null && settings.type.toUpperCase() == "POST") {
            flags = this.$noCacheFlagsPost;
        } else {
            flags = this.$noCacheFlagsGet;
        }
    }
    settings.requestedContentFlags = flags;
    return flags;
};
CacheManager.prototype.disableCacheBranches = new InitializeObject("Object where individual branches can be disabled. If disabled they are requested each time.");
// The hash for an URL for the ajaxXXX routines is passed here and the packet received from the server
// This routine is repsonsible to pick anything managed by the Cache Manager and put it where it belongs
// If content comes from the server it is used no matter what the dirty flag says!
CacheManager.prototype.$lastCacheBranch = null;
// The last cache branch accesses with inspect packet is recorded here
// PHASE: Returning ajax cycle
CacheManager.prototype.inspectPacket = function(hash, packet, requestedContentFlags) {
    if (this.objBranchesAndFlags == null) return false;
    var o, old, selectedStore = this.cache[hash.hash];
    if (selectedStore == null) {
        this.cache[hash.hash] = selectedStore = { };
    }
    var cf = 0;
    if (typeof requestedContentFlags == "numeric") cf = requestedContentFlags;
    packet.cacheHashKey = hash;
    for (var branch in this.objBranchesAndFlags) {
        if (packet[branch] != null) {
            o = {
                dirty: false,
                stamp: new Date(),
                data: packet[branch]
            };
            old = selectedStore[branch];
            selectedStore[branch] = o;
            if (this.cacheHandlers != null && this.cacheHandlers[branch] != null && typeof this.cacheHandlers[branch].onCacheItem == "function") {
                this.cacheHandlers[branch].onCacheItem.call(this, old, o, hash);
            }
        } else {
            if (requestedContentFlags & this.objBranchesAndFlags[branch]) {
                // Content was requested but was not returned - make sure entry exists in the cache and it is marked not dirty.
                if (selectedStore[branch] == null) {
                    o = {
                        dirty: false,
                        stamp: new Date(),
                        data: null
                    };
                    selectedStore[branch] = o;
                }
            }
            // Not present in the returned packet - fill the packet from the cache
            if (selectedStore[branch] != null) {
                packet[branch] = selectedStore[branch].data;
            }
        }
    }
    return true;
};
CacheManager.prototype.inspectPacketUrl = function(settings, packet) {
    var url, hash;
    if (settings.cacheHashKey == null) {
        url = settings.url;
        hash = CacheManager.$hashKeyOfUrl(url);
    } else {
        hash = settings.cacheHashKey;
    }
    if (hash != null) {
        return this.inspectPacket(hash, packet, settings.requestedContentFlags);
    }
    return false;
};
// PHASE: Outside ajax cycle
CacheManager.prototype.getCacheStore = function(objConsumer) {
    if (BaseObject.is(objConsumer, "ISupportCacheManager")) {
        var hash = objConsumer.getCacheHash();
        if (this.cache[hash] != null) {
            return this.cache[hash].data;
        }
    }
    return null;
};
// This method can be called by the ajax callers to allow the cache manager and the supporting infrastructure to apply/attach the found/cached items 
// to the object created/managed in conjunction with the ajax request.
CacheManager.prototype.applyToInstance = function(packetOrUrl, obj) {
    var cacheItem = null;
    var hash = null;
    if (packetOrUrl != null) {
        if (BaseObject.is(packetOrUrl, "string")) { // Assuming URL
            hash = CacheManager.$hashKeyOfUrl(url);
            if (hash != null) {
                if (this.cache[hash.hash] != null) cacheItem = this.cache[hash.hash];
            }
        } else if (typeof packetOrUrl == "object") { // Assuming packet
            if (packetOrUrl.cacheHashKey != null && this.cache[packetOrUrl.cacheHashKey] != null) {
                cacheItem = this.cache[packetOrUrl.cacheHashKey];
                hash = packetOrUrl.cacheHashKey;
            }
        }
    } else if (this.$lastCacheBranch != null) {
        cacheItem = this.$lastCacheBranch;
        hash = cacheItem.cacheHashKey;
    }
    if (cacheItem != null) {
        // Pass this to the cache item handler
        for (var k in this.cacheHandlers) {
            if (this.cacheHandlers[k] != null && this.cacheHandlers[k].onApplyToInstance != null) {
                this.cacheHandlers[k].onApplyToInstance.call(obj, cacheItem[k], hash);
            }
        }
        //        for (k in cacheItem) {
        //            if (this.cacheHandlers[k] != null && this.cacheHandlers[k].onApplyToInstance != null) {
        //                this.cacheHandlers[k].onApplyToInstance.apply(obj, cacheItem[k], hash);
        //            }
        //        }
    } else if (packetOrUrl != null && typeof packetOrUrl == "object") {
        for (var k in this.cacheHandlers) {
            if (this.cacheHandlers[k] != null && this.cacheHandlers[k].onApplyToInstance != null) {
                this.cacheHandlers[k].onApplyToInstance.call(obj, { dirty: true, stamp: null, data: packetOrUrl[k] }, hash);
            }
        }
    }
    //var hash = CacheManager.hashKeyOfUrl(url);
};
// Keep these two methods last in the implementation please!
/* These two methods are called by the framework specialization (convention: framework specialization should be in *.framework.conf.js)
*/
CacheManager.prototype.onBeginRequest = function(settings) {
    return this.flagContentRequestUrl(settings);

};
CacheManager.prototype.onEndRequest = function(settings, packet) {
    return this.inspectPacketUrl(settings, packet);
};
CacheManager.prototype.ClearFromCacheByHash = function(hash, flags) {
	return ClearFromCache({ hash: { hash:hash}}, flags);
}
CacheManager.prototype.ClearFromCache = function(ownerObject, settingsOrUrl, flags) {
	if (arguments.length < 2) throw "Required argument(s) are missing.";
	var settings = (typeof settingsOrUrl == "string")?{ url: settingsOrUrl }:settingsOrUrl;
	var hash = null;
	if (settings.cacheHashKey != null) {
		if (typeof settings.cacheHashKey == "string") {
			hash = settings.cacheHashKey;
		} else {
			hash = settings.cacheHashKey.hash;
		}
	} else {
		settings.url = BaseObject.ajaxDecorateUrl(ownerObject, settings.url);
		hash = CacheManager.$hashKeyOfUrl(settings);
	}
	if (hash != null) {
		var selectedStore = this.cache[hash];
		if (selectedStore != null) {
			for (var branch in this.objBranchesAndFlags) {
				if ( (flags & this.objBranchesAndFlags[branch]) != 0) {
					selectedStore[branch] = null;
				}
			}
		}
	} 
	return false;
	
}.Description("").Returns("Boolean - true if removal is successful");