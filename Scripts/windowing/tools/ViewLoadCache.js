(function() {
    /**
     * This is useful only for view windows that use DIRECTDATA and send requests only for their views.
     * Otherwise the requests will still be sent when the view is in teh cache.
     * 
     * var myurl = this.moduleUrl( .... );
     * var cachedview = new ViewLoadCache(myurl);
     * 
     * new SimpleViewWindow(.... {
     *  cachedView: cachedview,
     * })
     * 
     */
    function ViewLoadCache(url, ignoreQueryString) {
        BaseObject.apply(this, arguments);
        this.$url = url;
        var cacheUrl = BKUrl.mapToBaseUrl(url);
        cacheUrl.get_fragment().clear();
        if (ignoreQueryString) {
            cacheUrl.get_query().clear();
        }
        this.$cacheUrl = cacheUrl.toString();
    }
    ViewLoadParameter.Inherit(BaseObject,"ViewLoadCache");
    ViewLoadCache.$cache = {};
    ViewLoadCache.prototype.put = function(view) { 
        ViewLoadCache.$cache[this.$cacheUrl] = view;
    }

    ViewLoadCache.prototype.get_view = function() { 
        var view = ViewLoadCache.$cache[this.$cacheUrl];
        if (view != null) return view; 
        return null;
    }
    ViewLoadCache.prototype.get_url = function() { 
        var view = ViewLoadCache.$cache[this.$cacheUrl];
        if (view != null) return null; 
        return this.$url; 
    }


})();