(function() {

    /**
     * Loads a script from any URL. Current implementation will not work correctly if different scripts are loaded in response to differences
     * in the query string.
     */
    function ExternalScripts() {
        BaseObject.apply(this,arguments);
    }
    ExternalScripts.Inherit(BaseObject, "ExternalScripts");
    ExternalScripts.prototype.$loadedScripts = new InitializeObject("The loaded scripts by key");
    ExternalScripts.prototype.$loadedCSS = new InitializeObject("The loaded CSS by key");
    ExternalScripts.prototype.loadScript = function(url,asModule) {
        var u = new BKUrl(url);
        u.get_query().clear();
        u.get_fragment().clear();
        var key = u.toString();
    
        if (this.$loadedScripts[key] != null) {
            if (BaseObject.is(this.$loadedScripts[key].__$isLoading, "Operation")) return this.$loadedScripts[key].__$isLoading;
            return Operation.From({});
        }
    
        var scr = document.createElement("script");
        if (asModule) {
            scr.type = "module";
        }
        scr.src = url;
        this.$loadedScripts[key] = scr;
        var op = new Operation();
        scr.__$isLoading = op;
        scr.onload = function() {
            scr.__$isLoading = null;
            op.CompleteOperation(true, {});
        }
        scr.onerror = function(err) {
            scr.__$isLoading = null;
            op.CompleteOperation(false, "Error loading the script from: " + url);
        }
    
        document.body.appendChild(scr);
        return op;
    
    }
    ExternalScripts.prototype.loadCSS = function(url) {
        var u = new BKUrl(url);
        u.get_query().clear();
        u.get_fragment().clear();
        var key = u.toString();
    
        if (this.$loadedCSS[key] != null) {
            if (BaseObject.is(this.$loadedCSS[key].__$isLoading, "Operation")) return this.$loadedScripts[key].__$isLoading;
            return Operation.From({});
        }
    
        var scr = document.createElement("link");
        scr.type = "text/css";
        scr.rel = 'stylesheet';
        scr.href = url;
        this.$loadedCSS[key] = scr;
        var op = new Operation();
        scr.__$isLoading = op;
        scr.onload = function() {
            scr.__$isLoading = null;
            op.CompleteOperation(true, {});
        }
        scr.onerror = function(err) {
            scr.__$isLoading = null;
            op.CompleteOperation(false, "Error loading the script from: " + url);
        }
    
        document.head.appendChild(scr);
        return op;
    
    }
    
    
    ExternalScripts.Default = (function() {
        var instance;
        return function() {
            if (instance == null) instance = new ExternalScripts();
            return instance;
        }
    })();
    
})();