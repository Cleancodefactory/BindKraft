(function() {

    /**
     * Constructs as necessary and provides access to translations of a specified app and locale. The class caches statically and
     * provides access from an instance, so it is lightweight to use in any number if instances, each configured as needed.
     * 
     * @param appClass  {string}    Required, name of the app class to which this translation belongs
     * @param lang      {string}    Optional locale name. If set the locale name can be omitted in the public methods.
     */
    function Localization(appClass, lang) {
        BaseObject.apply(this,arguments);
        if (typeof appClass == "function") {
            appClass = Class.getTypeName(appClass);
        }
        if (typeof appClass == "string" && (appClass == "system" || Class.getClassName(appClass) != null)) {
            this.$appClass = appClass; // TODO check the class
        } else {
            throw "Localization can be created only for a specific class or the system. The class should be preferably an app class if at all possible.";
        }
        var memfs = Registers.Default().getRegister("appfs");
        if (!BaseObject.is(memfs, "MemoryFSDirectory")) throw "Cannot find the appfs: file system. Check if system/sysconfig.js is not corrupted.";
        var dir = memfs.cd(appClass); // Make sure the app dir exists and changes to it.
        if (dir == null) throw "App directory does not exist in appfs: for " + appClass;
        var locdir = dir.cd("localization"); // Make sure localization directory exists and change to it.
        if (!BaseObject.is(locdir, "MemoryFSDirectory")) throw "Cannot find the localization directory for " + appClass;
        this.$dir = locdir;
        this.$lang = lang || System.Default().settings.CurrentLang;

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
                    if (arr[i].length == 1) {
                        arr.pop();
                        break;
                    }
                }
                if (arr.length > 0) {
                    return arr.join("-");
                }
            }
        } 
        return null;
    }
    /**
     * @param locale {string}   The locale for which we want to find a match in the availableLocales
     * @param availableLocales {Array<string>} The list of locales to consider
     * @param bUltimate {Boolean} If True will return the ultimate fallback locale instead of null in case match is not found.
     */
    Localization.findClosestSuitableLocale = function(locale, availableLocales, bUltimate) {
        if (!BaseObject.is(availableLocales, "Array") || availableLocales.length == 0) return bUltimate?System.Default().get_settings("UltimateFallBackLocale"):null;
        var al = availableLocales.Select(function(idx, l) {return l.toLowerCase();});
        while (locale != null && al.indexOf(locale) < 0) {
            locale = this.truncateLocaleTag(locale);
        }
        if (locale == null) bUltimate?System.Default().get_settings("UltimateFallBackLocale"):null;
        return locale;
    }
    // - Utilities



    Localization.prototype.$appClass = null;
    Localization.prototype.$lang = null;
    Localization.prototype.$dir = null;
    Localization.prototype.$loadTranslation = function(locale) {
        var f = this.$dir.item("translations/" + locale);
        if (BaseObject.is(f, "IMemoryFileContent")) {
			// Ignores the availability
				return f.get_content();
		}
        return null;
    }

    Localization.$translations = {};
    
    Localization.prototype.$loadTranslationLocale = function(_locale) {
        var locale = _locale || this.$lang;
        var arrTrans = [];
        var t;
        var $translations = this.get_translations();
        var xlocale = locale;
        while (xlocale != null) {
            t = this.$loadTranslation(xlocale);
            if (t != null) arrTrans.unshift(t);
            xlocale = Localization.truncateLocaleTag(xlocale)
        }
        if (arrTrans.length > 0) {
            t = BaseObject.CombineObjects.apply(null, arrTrans);
            $translations[locale] = t;
            return t;
        }
        return null;
    }

    // +PUBLIC
    Localization.prototype.get_culture = function() {
        return this.$lang;
    }
    /**
     * Returns and creates if necessary a branch for the app specified in the constructor
     * 
     * @returns {object}    Plain object containing all the loaded translations for the app.
     */
    Localization.prototype.get_translations = function() {
        if (Localization.$translations[this.$appClass] == null) {
            Localization.$translations[this.$appClass] = {};
        }
        return Localization.$translations[this.$appClass];
    }
    /**
     * Static version
     */
    Localization.get_translations = function(appClass) {
        if (Localization.$translations[appClass] == null) {
            Localization.$translations[appClass] = {};
        }
        return Localization.$translations[appClass];
    }
    /**
     * Returns an object with the translations for the specified locale.
     * 
     * @param _locale {string}  Optional. If omitted the lang (locale) was specified in the constructor will be used. If no local has been
     *                          given to the constructor the system CurrentLang will be used.
     */
    Localization.prototype.get_translation = function(_locale) {
        var locale = _locale || this.$lang;
        if (typeof locale != "string" || !/^\w{2}(-.*)?$/.test(locale)) {
            this.LASTERROR(_Errors.compose(), "Invalid locale", "get_translation");
            return null; // Invalid locale
        }
        var $translations = this.get_translations();

        var loc = $translations[locale];
        if (loc == null) {
            loc = this.$loadTranslationLocale(locale);
        }
        if (loc == null) {
            loc = this.get_translation(System.Default().get_settings("UltimateFallBackLocale"))
        }
        return loc;
    }

    Localization.get_translation = function(appClass, _locale) {
        var locale = _locale || System.Default().get_settings("CurrentLang");
        if (typeof locale != "string" || !/^\w{2}(-.*)?$/.test(locale)) {
            return null; // Invalid locale
        }
        var $translations = Localization.get_translations(appClass);

        var loc = $translations[locale];
        if (loc == null) {
            var l = new Localization(appClass);
            loc = l.$loadTranslationLocale(locale);
        }
        if (loc == null && locale != System.Default().get_settings("UltimateFallBackLocale")) {
            loc = Localization.get_translation(appClass, System.Default().get_settings("UltimateFallBackLocale"))
        }
        return loc;
    }

    // -PUBLIC
    

})();