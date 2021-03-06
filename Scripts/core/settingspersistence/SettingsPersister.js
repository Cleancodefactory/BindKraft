


function SettingsPersister(key,persistmap /*as string*/) {
    BaseObject.apply(this, arguments);
    this.$key = key;
    this.$settings = { };
	if (typeof persistmap == "string") {
		this.set_allowmap(persistmap);
	}
}

SettingsPersister.Inherit(BaseObject, "SettingsPersister");
SettingsPersister.Implement(ISettingsPersister);
SettingsPersister.ImplementProperty("persistenceprovider",new Initialize("When set the persister writes through it",null));
SettingsPersister.prototype.$allowmap = null;
SettingsPersister.prototype.set_allowmap = function(v) { 
	var arr, i, o = {};
	if (typeof v == "string") {
		arr = v.split(/,/);
		if (arr != null && arr.length > 0) {
			for (i = 0; i < arr.length; i++) {
				o[arr[i]] = true;
			}
		}
		this.$allowmap = o;
		
	} else if (BaseObject.is(v, "Array")) {
		arr = v;
		if (arr != null && arr.length > 0) {
			for (i = 0; i < arr.length;i++) {
				o[arr[i] + ""] = true;
			}
		}
		this.$allowmap = o;
	} else if (v == null) {
		this.$allowmap = null;
	} else if (typeof v == "object") {
		for (i in v) {
			o[i] = true;
		}
		this.$allowmap = o;
	} else {
		throw "Invalid allow map";
	}
	
}
SettingsPersister.prototype.get_allowmap = function() { return this.$allowmap; }
SettingsPersister.prototype.$canpersist = function(key) {
	if (this.$allowmap == null) return true;
	if (this.$allowmap[key]) return true;
	return false;
}
SettingsPersister.$disablePersistence = false;
SettingsPersister.disablePersistence = function(bDisable) {
    if (arguments.length > 0) {
        this.$disablePersistence = bDisable;
    }
    return this.$disablePersistence;
};
SettingsPersister.prototype.$disablePersistence = false;
SettingsPersister.prototype.disablePersistence = function(bDisable) {
    if (arguments.length > 0) {
        this.$disablePersistence = bDisable;
    }
    if (SettingsPersister.$disablePersistence) return true;
    return this.$disablePersistence;
};
SettingsPersister.prototype.$save = function(arg) {
	// Override this
	throw "not implemented";
}
SettingsPersister.prototype.save = function(arg) {
	var res;
	if (BaseObject.is(this.get_persistenceprovider(),"ISettingsPersistenceProvider")) {
		res = this.get_persistenceprovider().writeSettings(this.$key, this.$settings);
		this.isDirty = false;
		return res;
	}
	
    res = this.$save.apply(this,arguments);
	this.isDirty = false;
	return res;
};
SettingsPersister.prototype.$load = function(arg) {
	// Override this - load and return the data
	
	// throw "Not implemented";
	return {};
}
SettingsPersister.prototype.load = function(arg) {
	this.isDirty = false;
    if (BaseObject.is(this.get_persistenceprovider(),"ISettingsPersistenceProvider")) {
		this.$settings = this.get_persistenceprovider().readSettings(this.$key);
		return true;
		
	}
    this.$settings = this.$load.apply(this,arguments);
	return true;
};
SettingsPersister.prototype.isDirty = false;
SettingsPersister.prototype.get_isdirty = function() {
	return this.isDirty;
}
SettingsPersister.prototype.get_setting = function(settingKey, defaultValue) {
    if (settingKey != null && this.$canpersist(settingKey)) {
		if (this.$settings == null) this.$settings = {};
        return (this.$settings[settingKey] == null) ? defaultValue : this.$settings[settingKey];
    }
    return defaultValue;
};

SettingsPersister.prototype.set_setting = function(settingKey, settingValue) {
    if (this.disablePersistence() || !this.$canpersist(settingKey)) return;
    if (BaseObject.is(settingValue, 'BaseObject') || BaseObject.is(settingValue, 'Array')) { //Check for a javascript object as well
        throw 'Setting should be of scalar type';
    }
    if (settingKey != null) {
		if (this.$settings == null) this.$settings = {};
        this.isDirty = true;
        this.$settings[settingKey] = settingValue;
    }
}.Description('Will accept only scalar types. Will dance for money!');
SettingsPersister.prototype.hasSetting = function(settingKey) {
	if (this.$settings != null && this.$canpersist(settingKey) && (this.$settings[settingKey] != null)) return true;
	return false;
}

SettingsPersister.prototype.$key = null;
SettingsPersister.prototype.$settings = null;
