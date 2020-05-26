function KeyedTokenItem(key, token, service_name) {
    BaseObject.apply(this,arguments);
    if (key != null) {
        this.set_key(key);
    }
    if (typeof token == "string") {
        this.$token = token;
    }
    if (typeof service_name == "string") {
        this.$serviceName = service_name;
    }
}
KeyedTokenItem.Inherit(BaseObject, "KeyedTokenItem");

//KeyedTokenItem.ImplementProperty("key", new Initialize("string, regex or other type serving as key - what limits it is that it has to be comparable to a string", null));
KeyedTokenItem.prototype.$bkKey = null;
/**
 * If the url is partial (which it almost always is)
 * e.g http://server/path1/path2 - query and fragment are empty
 */
KeyedTokenItem.prototype.set_key = function(v) {
    if (BaseObject.is(v,"BKUrl")) {
        this.$bkKey = v;
    } else if (typeof v == "string") {
        this.$bkKey = new BKUrl(v);
    }
}
KeyedTokenItem.prototype.get_key = function() {
    return this.$bkKey;
}
KeyedTokenItem.prototype.get_keystring = function() {
    return (this.$bkKey != null)?this.$bkKey.toString():null;
}


KeyedTokenItem.ImplementProperty("token", new Initialize("The token for the strings matching key", null));
KeyedTokenItem.ImplementProperty("serviceName", new Initialize("Optional service name", null));

KeyedTokenItem.prototype.isKeyRegExp = function() {
    return (this.$key instanceof RegExp);
}
KeyedTokenItem.prototype.checkKey = function(key) { // : boolean
    var bkKey = null;
    if (BaseObject.is(key, "BKUrl")) {
        bkKey = key;
    } else if (typeof key == "string") {
        bkKey = new BKUrl(key);
        // TODO validation
    }
    if (bkKey == null) return false;
    if (this.$bkKey == null) return false;

    var $part, part;

    $part = this.$bkKey.get_scheme();
    if (!$part.get_isempty()) {
        part = bkKey.get_scheme();
        if (part.get_isempty()) return false;
        if (part.toString().toUpperCase() != $part.toString().toUpperCase()) return false;
    }

    $part = this.$bkKey.get_authority();
    if (!$part.get_isempty()) {
        part = bkKey.get_authority();
        if (part.get_isempty()) return false;
        // TODO Maybe exclude the port?!?
        if (part.toString().toUpperCase() != $part.toString().toUpperCase()) return false;
    }

    $part = this.$bkKey.get_path();
    if (!$part.get_isempty()) {
        part = bkKey.get_path();
        if (part.get_isempty()) return false;
        // TODO Paths are case sensitive on native unix servers.
        if (part.toString().toUpperCase() != $part.toString().toUpperCase()) return false;
    }

    $part = this.$bkKey.get_query();
    if (!$part.get_isempty()) {
        part = bkKey.get_query();
        if (part.get_isempty()) return false;
        var arrKeys = $part.keys();
        for (var i = 0; i < arrKeys.length;i++) {
            var _$ = $part.get(arrKeys[i]);
            var _ = part.get(arrKeys[i]);
            if (_$.length != _.length) return false;
            for (var j = 0; j < _$.length; j++) {
                if (_$[j] == null || _$[j] == "") continue;
                if (_.indexOf($[i]) < 0) return false;
            }
        }
    }


    
    // } else if (this.$key instanceof RegExp) {
    //     return this.$key.test(key);
    // }
    return true;
}
KeyedTokenItem.prototype.checkServiceName = function(sn) {
    if (this.$serviceName != null && this.$serviceName == sn) return true;
    return false;
}
KeyedTokenItem.prototype.equals = function(obj) {
    if (!BaseObject.is(obj, this.classDefinition())) return false;
    if (typeof this.$key == "string") {
        if (obj.$key == this.$key) return true;
    } else if (this.$key instanceof RegExp) {
        if (obj.$key instanceof RegExp) {
            if (this.$key.source == obj.$key.source) {
                return true; // todo - we can be a bit more precise        
            } else {
                return false;
            }
        } else {
            return false;
        }
    }
}