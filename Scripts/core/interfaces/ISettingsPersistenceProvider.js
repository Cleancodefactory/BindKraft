/**
 * This interface enables persistence providers to be built and assinged to various persisters.
 * For persisters it is highly recommended to use the persistence proveders for save and load when
 * provider is set to them (see more info in the docs of the ISettingsPersister)
 */
function ISettingsPersistenceProvider() {}
ISettingsPersistenceProvider.Interface("ISettingsPersistenceProvider");

ISettingsPersistenceProvider.prototype.disablePersistence = function(bDisable) { throw "not implemented"; }
// These two methods are called by implementers of ISettingsPersister
ISettingsPersistenceProvider.prototype.readSettings = function(persisterkey) { throw "not implemented"; }
ISettingsPersistenceProvider.prototype.writeSettings = function(persisterkey, settings) { throw "not implemented"; }

ISettingsPersistenceProvider.prototype.save = function() {throw "not implemented";}
ISettingsPersistenceProvider.prototype.load = function() {throw "not implemented";}

