/**
 * Base class for settings persistence providers.Provides persistence mechanism for persisters forced to use one - see the description of the 
 * ISettingsPersister for more detail how a persiser cooperates with a provider
 */

function SettingsPersistenceProvider() {
	BaseObject.apply(this, arguments);
	this.$peristers = {};
}
SettingsPersistenceProvider.Inherit(BaseObject,"SettingsPersistenceProvider");
SettingsPersistenceProvider.Implement(ISettingsPersistenceProvider);
SettingsPersistenceProvider.prototype.$disableproviderpersistence = false;
SettingsPersistenceProvider.prototype.disablePersistence = function(bDisable) { 
	if (arguments.length > 1) {
		this.$disableproviderpersistence = bDisable && true;
	}
	return this.$disableproviderpersistence;
}

SettingsPersistenceProvider.prototype.readSettings = function(persisterkey) { 
	var key = persisterkey + "";
	if (key != null && key.length > 0) {
		return this.$peristers[key];
	} else {
		throw "Persister provider's readSettings has been called with invalid key";
	}
}
SettingsPersistenceProvider.prototype.writeSettings = function(persisterkey, settings) { 
	var key = persisterkey + "";
	if (key != null && key.length > 0) {
		this.$peristers[key] = settings;
	} else {
		throw "Persister provider's writeSettings has been called with invalid key";
	}
}
