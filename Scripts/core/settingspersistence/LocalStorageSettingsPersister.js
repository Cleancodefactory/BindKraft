


function LocalStorageSettingsPersister(key, jsonFilter) {
    SettingsPersister.apply(this, arguments);
    this.jsonFilter = jsonFilter;
}

LocalStorageSettingsPersister.Inherit(SettingsPersister, "LocalStorageSettingsPersister");


LocalStorageSettingsPersister.prototype.$save = function() {
	if (!this.isDirty) return;
    if (!IsNull(this.$settings)) {
        if (this.jsonFilter) {
            localStorage.setItem('LocalStorage_' + this.$key, JSON.stringify(this.$settings, this.jsonFilter));
        } else {
            localStorage.setItem('LocalStorage_' + this.$key, JSON.stringify(this.$settings));
        }
        
    }
    this.isDirty = false;
};

LocalStorageSettingsPersister.prototype.$load = function() {
    var settings = localStorage.getItem('LocalStorage_' + this.$key);
    if (typeof settings == "string") {
        return JSON.parse(settings);
    } else {
        return { };
    }
    
};