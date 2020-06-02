function KeyedTokenStorage() {
    BaseObject.apply(this,arguments);
}
KeyedTokenStorage.Inherit(BaseObject, "KeyedTokenStorage")
    .Implement(IQueryTokenStorage);


KeyedTokenStorage.prototype.$storage = new InitializeArray("The storage itself");
KeyedTokenStorage.ImplementProperty("parentStorage");



KeyedTokenStorage.prototype.registerToken = function( /*KeyedTokenItem|string|RegeExp*/ key_item, /*optional, string*/ token, /*optional,string*/ service_name) {
    if (!BaseObject.is(key_item, "KeyedTokenItem")) {
        if (typeof key_item == "string" || BaseObject.is(key_item, "BKUrl")) {
            // Either token or service_name have to be present (or both)
            if ( 
                (typeof token != "string" || token.length == 0) &&
                (typeof service_name != "string" || service_name.length == 0)
            ) {
                return false;
            }
            key_item = new KeyedTokenItem(key_item, token, service_name);
            if (typeof service_name == "string") {
                if (this.queryServiceUrl(service_name) != null) {
                    throw "A service with the name " + service_name + " is already registered in this KeyedTokenStorage."
                }
            }
            return this.$storage.addElement(key_item);
        } else {
            throw "key_item parameter is not of an expected type (KeyedTokenItem|string)";
        }
    } else {
        return this.$storage.addElement(key_item);
    }
}
KeyedTokenStorage.prototype.unregisterToken = function(key_item) {
    var kti = null;
    if (typeof key_item == "string") {
        kti = this.getItem(key);
    }
    if (BaseObject.is(key_item,"KeyedTokenItem")) {
        kti = key_item;
    }
    if (kti != null) {
        this.$storage.removeElement(kti);
    }
    return false;
}

KeyedTokenStorage.prototype.getItem = function(key) { //: KeyewdTokenItem
    var kti = this.$storage.FirstOrDefault(function(index, item) {
        if (item.checkKey(key)) return item;
        return null;
    });
    return kti;
}
KeyedTokenStorage.prototype.getToken = function(key) { //: KeyewdTokenItem
    var kti = this.getItem(key);
    if (kti != null) return kti.get_token();
    if (this.get_parentStorage() != null) return this.get_parentStorage().get_token();
    return null;
}
KeyedTokenStorage.prototype.queryServiceUrl = function(service_name) {
    var kti = this.$storage.FirstOrDefault(function(index, item) {
        if (item.checkServiceName(service_name)) {
            return item.get_keystring();
        }
        return null;
    });
    return kti;
}