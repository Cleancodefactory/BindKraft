(function() {

    function Localization(appClass) {
        BaseObject.apply(this,arguments);
        if (typeof appClass == "string" && !/^\s*$/.test(appClass)) {
            this.$appClass = appClass; // TODO check the class
        } else {
            throw "Localization can be created only for a specific app class or the system.";
        }
        var memfs = Registers.Default().getRegister("appfs");
        if (!BaseObject.is(memfs, "MemoryFSDirectory")) throw "Cannot find the appfs: file system. Check if system/sysconfig.js is not corrupted.";
        var dir = this.$fs.cd(appClass); // Make sure the app dir exists and changes to it.
        if (dir == null) throw "App directory does not exist in appfs: for " + appClass;
        var locdir = dir.cd("localization"); // Make sure localization directory exists and change to it.
        if (!BaseObject.is(locdir, "MemoryFSDirectory")) throw "Cannot find the localization directory for " + appClass;
        this.$dir = locdir;

    }
    Localization.Inherit(BaseObject, "Localization");

    // +Utilities
    Localization.truncateLocaleTag = function(locale) {
        if (typeof locale == "string") {
            var arr = locale.split("-");
            if (arr.length > 0) {
                if (arr[arr.length - 1].length >= 1) {
                    arr.pop();
                }
                for (var i = arr.length - 1; i >= 0; i--) {
                    if (arr[i].length == 1) arr.pop();
                }
                if (arr.length > 0) {
                    return arr.join("-");
                }
            }
        } 
        return null;
    }
    // - Utilities



    Localization.prototype.$appClass = null;
    Localization.prototype.$dir = null;
    Localization.prototype.$loadTranslation = function(locale) {
        var f = this.$dir.item("translations/locale");
        if (BaseObject.is(f, "IMemoryFileContent")) {
			// Ignores the availability
				return f.get_content();
		}
        return null;
    }
    
    Localization.prototype.$translations = new InitializeObject("Object containing the loaded translations");
    Localization.prototype.$loadTranslationLocale = function(locale) {
        var arrTrans = [];
        var t, loc;

        while (loc != null) {
            t = this.$loadTranslation(loc);
            if (t != null) arrTrans.unshift(t);
            loc = Localization.truncateLocaleTag(loc)
        }
        if (arrTrans.length > 0) {
            t = BaseObject.CombineObjects.apply(null, arrTrans);
            this.$translations[locale] = t;
            return t;
        }
        return null;
    }
    Localization.prototype.get_translation = function(locale) {
        var loc = this.$translations[locale];
        if (loc == null) {
            loc = this.$loadTranslationLocale(locale);
        }
        if (loc == null) {
            loc = this.get_locale(System.Default().get_settings("UltimateFallBackLocale"))
        }
        return loc;
    }
    

})();