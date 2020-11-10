(function() {
    
    function LocalizationManagement(appClass) {
        BaseObject.apply(this,arguments);
        if (typeof appClass == "string" && !/^\s*$/.test(appClass)) {
            this.$appClass = appClass;
        } else {
            throw "LocalizationManagement can be created only for a specific app class or the system.";
        }
        var memfs = Registers.Default().getRegister("appfs");
        if (!BaseObject.is(memfs, "MemoryFSDirectory")) throw "Cannot find the appfs: file system. Check if system/sysconfig.js is not corrupted.";
        var dir = this.$fs.mkdir(appClass); // Make sure the app dir exists and changes to it.
        var locdir = dir.mkdir("localization"); // Make sure localization directory exists and change to it.
        if (!BaseObject.is(locdir, "MemoryFSDirectory")) throw "Cannot find/create the localization directory for " + appClass;
        this.$dir = locdir;
    }
    LocalizationManagement.Inherit(BaseObject, "LocalizationManagement")
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
        } else { // Override the content for now
            f.set_content(content);
            f.set_contenttype("memory/object");
        }
        return f;
    }

    LocalizationManagement.prototype.setTranslation = function(locale, content) {
        return this.$createFile("translations/" + locale, content);
    }


})();