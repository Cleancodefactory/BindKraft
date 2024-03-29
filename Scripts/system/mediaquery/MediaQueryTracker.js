(function() {
    var MediaQueryNotificatorBase = Class("MediaQueryNotificatorBase"),
        IMediaQueryTracker = Interface("IMediaQueryTracker");


    var _instance = null;
    /**
     * The MediaQueryTracker is true singleton that do not permit second instance in the same workspace.
     * It enables registration of multiple media queries and subscriptions (of varying kinds) for general and
     * specific transitions.
     */
    function MediaQueryTracker() {
        BaseObject.apply(this, arguments);
    }
    MediaQueryTracker.Inherit(BaseObject, "MediaQueryTracker")
        .Implement(IMediaQueryTracker);

    MediaQueryTracker.prototype.obliterate = function() {
        this.$clearQueries();
        BaseObject.prototype.obliterate.apply(arguments);
    }

    MediaQueryTracker.Default = function() {
        if (_instance == null) {
            _instance = new MediaQueryTracker();
            LocalAPI.Default().registerAPI(IMediaQueryTracker,_instance);
        }
        return _instance;
    }

    MediaQueryTracker.prototype.$queries = new InitializeObject("Registered queries");
    /**
     * Checks if a media query is matched by the media query name.
     * @param {string} name The name of the media query - the name with which it was added with add.
     * @returns {boolean} True if the query matches the current browser state, false otherwise.
     */
    MediaQueryTracker.prototype.checkQuery = function(name) {
        if (typeof name != "string") {
            this.LASTERROR("The media query name is required and must be string");
            return false;
        }
        if (/^\s*$/.test(name)) {
            this.LASTERROR("The media query name must not be empty");
            return false;
        }
        return this.$queries[name].matches;
    }
    MediaQueryTracker.prototype.exists = function(name) {
        if (typeof name != "string") {
            this.LASTERROR("The media query name is required and must be string");
            return false;
        }
        if (/^\s*$/.test(name)) {
            this.LASTERROR("The media query name must not be empty");
            return false;
        }
        return (this.$queries[name] != null);
    }
    /**
     * Registers a media query under a specific name. The name can be used to configure notifications.
     * 
     * @param {string} name   Name of the query
     * @param {string} query  The media query. Browsers do not issue syntax errors, but the MediaQueryList they return will contain "not all"
     *                        whenever the browser cannot understand the query. Such queries are ignored and not registered.
     * @returns {boolean}     True if the query is successfully registered and false otherwise.
     */
    MediaQueryTracker.prototype.add = function(name, query) {
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
            this.$connectQuery(q);
            return true;
        } else {
            this.LASTERROR("Media query is empty or incorrect.");
        }
        return false;
    }
    MediaQueryTracker.prototype.remove = function(name) {
        if (typeof name != "string") {
            this.LASTERROR("The media query name is required and must be string");
            return false;
        }
        if (/^\s*$/.test(name)) {
            this.LASTERROR("The media query name must not be empty");
            return false;
        }
        if (this.$queries.hasOwnProperty(name)) {
            var q = this.$queries[name];
            this.$queries[name] = null;
            delete this.$queries[name];
            this.$disconnectQuery(q);
            return true;
        }
        return false;
    }
    MediaQueryTracker.prototype.clear = function() {
        this.$clearQueries();
    }
    MediaQueryTracker.prototype.queryChange = function(force) {
        this.onQueryChange(force);
    }
    MediaQueryTracker.prototype.onQueryChange = new InitializeMethodCallback("Handles events from mediaquery lists", function(force) {
        if (this.$notificators != null) {
            for (var name in this.$notificators) {
                if (this.$notificators.hasOwnProperty(name)) {
                    this.$notificators[name].onMediaChanged(force);
                }
            }
        }
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
                this.$disconnectQuery(q);
            }
        }
        for (var i = 0; i < arr.length; this.$queries[arr[i++]] = null);
    }
    //#endregion Media query registration

    //#region Notificator registrations
    MediaQueryTracker.prototype.$notificators = new InitializeObject("Notificators registered with a name");
    /**
     * @param {string} name
     * @param {string} condition
     * @param {string|class} [type=MediaQueryNotificatorBase]   
     */
    MediaQueryTracker.prototype.addNotificator = function (name, condition, type) {
        if (typeof name != "string") {
            this.LASTERROR("The notificator name is required and must be string");
            return null;
        }
        if (/^\s*$/.test(name)) {
            this.LASTERROR("The notificator name must not be empty");
            return null;
        }
        if (this.$notificators.hasOwnProperty(name) && this.$notificators[name] != null) {
            this.LASTERROR("A notificator with this name is already registered. Remove it first if you want to replace it.");
            return null;
        }
        
        var n = null;
        if (type != null) {
            if (Class.is(type, "MediaQueryNotificatorBase")) {
                var cls = Class.getClassDef(type);
                n = new cls(this,name);
                n.setConditions(condition);
            } else {
                this.LASTERROR("The specified notificator class does not inherit from  MediaQueryNotificatorBase.");
                return null;
            }
        } else { // This part is not expected to work when this is used through LocalAPI
            if (BaseObject.is(condition, "MediaQueryNotificatorBase")) {
                n = condition;
            } else {
                n = new MediaQueryNotificatorBase(this, name);
                n.setConditions(condition);
            }
        }
        if (n != null) {
            this.$notificators[name] = n;    
        }
        return n;   
    }
    MediaQueryTracker.prototype.removeNotificator = function (name) {
        if (typeof name != "string") {
            this.LASTERROR("The notificator name is required and must be string");
            return false;
        }
        if (/^\s*$/.test(name)) {
            this.LASTERROR("The notificator name must not be empty");
            return false;
        }
        if (this.$notificators.hasOwnProperty(name)) {
            var n = this.$notificators[name];
            this.$notificators[name] = null;
            delete this.$notificators[name];
            if (BaseObject.is(n, "BaseObject")) { // No need to be too specific for what we are about to do
                n.obliterate();
            }
            return true;
        }
        return false;   
    }
    MediaQueryTracker.prototype.removeAllNotificators = function () {
        if (this.$notificators) {
            var names = {};
            for (var n in this.$notificators) {
                names[n] = true;
            }
            for (var name in names) {
                this.removeNotificator(name);
            }
        }
    }
    MediaQueryTracker.prototype.getNotifcator = function(name) {
        if (typeof name != "string") {
            this.LASTERROR("The notificator name is required and must be string");
            return false;
        }
        if (/^\s*$/.test(name)) {
            this.LASTERROR("The notificator name must not be empty");
            return false;
        }
        if (name in this.$notificators) {
            return this.$notificators[name];
        }
        return null;
    }
    MediaQueryTracker.prototype.askNotificator = function(name) {
        var n = this.getNotifcator(name);
        if (n != null) {
            return n.exec();
        }
        return false;
    }
    //#endregion Notificator registrations    
})();