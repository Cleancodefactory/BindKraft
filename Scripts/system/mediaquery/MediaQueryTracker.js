(function() {
    var _instance = null;
    /**
     * The MediaQueryTracker is true singleton that do not permit second instance in the same workspace.
     * It enables registration of multiple media queries and subscriptions (of varying kinds) for general and
     * specific transitions.
     */
    function MediaQueryTracker() {
        BaseObject.apply(this, arguments);
    }
    MediaQueryTracker.Inherit(BaseObject, "MediaQueryTracker");
    MediaQueryTracker.prototype.obliterate = function() {
        this.$clearQueries();
        BaseObject.prototype.obliterate.apply(arguments);
    }

    MediaQueryTracker.Default = function() {
        if (_instance == null) {
            _instance = new MediaQueryTracker();
        }
        return _instance;
    }

    MediaQueryTracker.prototype.$queries = new InitializeObject("Registered queries");

    /**
     * Registers a media query under a specific name. The name can be used to configure notifications.
     * 
     * @param {string} name   Name of the query
     * @param {string} query  The media query. Browsers do not issue syntax errors, but the MediaQueryList they return will contain "not all"
     *                        whenever the browser cannot understand the query. Such queries are ignored and not registered.
     * @returns {boolean}     True if the query is successfully registered and false otherwise.
     */
    MediaQueryTracker.prototype.addQuery = function(name, query) {
        if (typeof name != "string") {
            this.LASTERROR("The media query name is required and must be string");
            return false;
        }
        if (/^\s*$/.test(name)) {
            this.LASTERROR("The media query name must not be empty");
            return false;
        }
        if (this.$queries.hasOwnProperty(name) && this.$queries[name] != null) {
            this.LASTERROR("A media query with this name is already registered. Remove it first if you want to replace it.");
            return false;
        }
        var q = window.matchMedia(query);
        if (q != null && q.media != "not all") {
            this.$queries[name] = q;
            // Connect the events.

        } else {
            this.LASTERROR("Media query is empty or incorrect.");
        }
        return false;
    }
    MediaQueryTracker.prototype.onQueryChange = new InitializeMethodCallback("Handles events from mediaquery lists", function(e) {
        //////////
    });
    //#region Media query registration
    MediaQueryTracker.prototype.$connectQuery = function(q) {
        if (q.addListener) {
            q.addListener(this.onQueryChange);
        } else if (q.addEventListener) {
            q.addEventListener("change",this.onQueryChange);
        } else {
            q.onchange = this.onQueryChange;
        }
    }
    MediaQueryTracker.prototype.$disconnectQuery = function(q) {
        if (q.removeListener) {
            q.addListener(this.onQueryChange);
        } else if (q.addEventListener) {
            q.removeEventListener("change",this.onQueryChange);
        } else {
            q.onchange = null;
        }
    }
    MediaQueryTracker.prototype.$clearQueries = function() {
        var q;
        var arr = [];
        for (var k in this.$queries) {
            if (this.$queries.hasOwnProperty(k)) {
                arr.push[k];
                q = this.$queries[k];
                if (q instanceof MediaQueryList) {
                    this.$disconnectQuery(q);
                }
            }
        }
        for (var i = 0; i < arr.length; this.$queries[arr[i++]] = null);
    }
    //#endregion Media query registration

    //#region Notificator registrations
    
    //#endregion Notificator registrations    
})();