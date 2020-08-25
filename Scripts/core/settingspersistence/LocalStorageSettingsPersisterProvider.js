function LocalStorageSettingsPersisterProvider(pkey) {
	SettingsPersistenceProvider.apply(this,arguments);
	this.$lspkey = pkey + "";
}
LocalStorageSettingsPersisterProvider.Inherit(SettingsPersistenceProvider,"LocalStorageSettingsPersisterProvider");
LocalStorageSettingsPersisterProvider.prototype.load = function() {
	var key = this.$lspkey || "LSPDefault";
	var persisters = localStorage.getItem(pkey + "_" + this.$key);
    if (typeof persisters == "string") {
        this.$persisters = JSON.parse(persisters);
    } else {
        this.$persisters = { };
		return false;
    }
    return true;
};
LocalStorageSettingsPersisterProvider.prototype.save = function() {
	var key = this.$lspkey || "LSPDefault";
    if ( typeof this.$persisters == "object") {
        localStorage.setItem(pkey + "_" + this.$key, JSON.stringify(this.$persisters));
    }
	return true;
};