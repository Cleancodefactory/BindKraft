function KeyedTokenItem(key, token, service_name) {
    BaseObject.apply(this,arguments);
    if (key != null) {
        this.$key = key;
    }
    if (typeof token == "string") {
        this.$token = token;
    }
    if (typeof service_name == "string") {
        this.$serviceName = service_name;
    }
}
KeyedTokenItem.Inherit(BaseObject, "KeyedTokenItem");

KeyedTokenItem.ImplementProperty("key", new Initialize("string, regex or other type serving as key - what limits it is that it has to be comparable to a string", null));
KeyedTokenItem.ImplementProperty("token", new Initialize("The token for the strings matching key", null));
KeyedTokenItem.ImplementProperty("serviceName", new Initialize("Optional service name", null));

KeyedTokenItem.prototype.isKeyRegExp = function() {
    return (this.$key instanceof RegExp);
}
KeyedTokenItem.prototype.checkKey = function(key) { // : boolean
    if (typeof this.$key == "string") {
        return (key == this.$key);
    } else if (this.$key instanceof RegExp) {
        return this.$key.test(key);
    }
    return false;
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