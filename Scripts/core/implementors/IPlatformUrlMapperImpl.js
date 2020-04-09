/*
	The in-line implementation of the IPlatformUrlMapper is now in implementer. The built-ins are corrected.
*/
function IPlatformUrlMapperImpl() {
	
}
IPlatformUrlMapperImpl.InterfaceImpl(IPlatformUrlMapper,"IPlatformUrlMapperImpl");
IPlatformUrlMapperImpl.classInitialize = function(cls,defModulename, defServername) {
	ICustomParameterization.registerStdParamNames(cls,"servername","modulename");
	cls.ImplementProperty("modulename", new InitializeStringParameter("...", defModulename));
	cls.ImplementProperty("servername", new InitializeStringParameter("...", defServername));
}
/*
IPlatformUrlMapperImpl.prototype.$modulename = null;
IPlatformUrlMapperImpl.prototype.get_modulename = function() { return this.$modulename; }
IPlatformUrlMapperImpl.prototype.set_modulename = function(v) { this.$modulename = v; }
IPlatformUrlMapperImpl.prototype.$servername = null;
IPlatformUrlMapperImpl.prototype.get_servername = function() { return this.$servername; }
IPlatformUrlMapperImpl.prototype.set_servername = function(v) { this.$servername = v; }
*/
IPlatformUrlMapperImpl.prototype.mapModuleUrl = function(url) {
	var module = this.get_modulename();
	var server = this.get_servername();
	return IPlatformUrlMapper.mapModuleUrl(url, module, server);
}
IPlatformUrlMapperImpl.prototype.mapResourceUrl = function(url) {
	var module = this.get_modulename();
	var server = this.get_servername();
	return IPlatformUrlMapper.mapResourceUrl(url, module, server);
}
