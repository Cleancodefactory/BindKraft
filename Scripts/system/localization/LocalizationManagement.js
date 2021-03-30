(function() {
    
    function LocalizationManagement(appClass) {
        BaseObject.apply(this,arguments);
        if (typeof appClass == "string" && !/^\s*$/.test(appClass)) {
            this.$appClass = appClass;
        } else if (typeof appClass == "function") {
            this.$appClass = Class.getClassName(appClass);
            if (this.$appClass == null) {
                throw "The class specified to LocalizationManagement cannot be found";
            }
        } else {
            throw "LocalizationManagement can be created only for a specific app class or the system.";
        }
        var memfs = Registers.Default().getRegister("appfs");
        if (!BaseObject.is(memfs, "MemoryFSDirectory")) throw "Cannot find the appfs: file system. Check if system/sysconfig.js is not corrupted.";
        var dir = memfs.mkdir(this.$appClass); // Make sure the app dir exists and changes to it.
        var locdir = dir.mkdir("localization"); // Make sure localization directory exists and change to it.
        var trasndir = locdir.mkdir("translations");
        if (!BaseObject.is(locdir, "MemoryFSDirectory")) throw "Cannot find/create the localization directory for " + appClass;
        this.$dir = locdir;
    }
    LocalizationManagement.Inherit(BaseObject, "LocalizationManagement");
    LocalizationManagement.prototype.$appClass = null;
    LocalizationManagement.prototype.$dir = null;
    LocalizationManagement.prototype.$getfile = function(name) {
        var f;
        try { // Support old behavior, no exception in newer versions, just null
            f = this.$dir.item(name);
        } catch(err) {
            f = null;
        }
        if (f != null) {
            if (BaseObject.is(f, "IMemoryFileContent")) {
                // Ignores the availability and content type
                return f;
            }
        }
        return null;
    }

    LocalizationManagement.prototype.$createFile = function(name, content) {
        var f = this.$getfile(name);
        if (f == null) {
            f = new ContentMemoryFile("memory/object", content);
            this.$dir.register(name, f)
        } else { // Override the content for now
            f.set_content(content);
            f.set_contenttype("memory/object");
        }
        return f;
    }

    LocalizationManagement.prototype.setTranslation = function(locale, content) {
        return this.$createFile("translations/" + locale, content);
    }

    // +Loading helpers
    /**
     * 
     * @param {string} locale - locale to load
     * @param {function(string):Operation} callback - Called to load each locale. 
     */
     LocalizationManagement.prototype.EnsureTranslationsFetched = function(/*string[]*/ _locales, callback) {
        var locales = null;
        if (BaseObject.is(_locales,"Array")) {
            locales = _locales;
        }
        if (!BaseObject.isCallback(callback)) { 
            throw "The callback argument is required";
        }
        var f;
        if (locales != null) {
            var op = new OperationAll(false);
            for (var i = 0; i < locales.length; i++) {
                f = this.$getfile("translations/" + locale);
                if (f == null) {
                    var _op = BaseObject.callCallback(callback, locale);
                    op.attach(_op);
                }
            }
            op.seal();
            return op;
        } else {
            var trdir = this.$dir.cd("translations");
            var files = trdir.get_files();
            if (files.length == 0) {
                return BaseObject.callCallback(callback, "*");
            } else {
                return Operation.From(null);
            }
        }
    }
    // -Loading helpers

})();