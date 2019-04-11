/*
	There are two levels of browser history support (there is a small possibility for even more in perspective)
	this implementer serves only the minimal level and is extended by the interface for the second.
	History is supported as history of switching between apps on the minimal (first) level, while
	the second includes in-app history, but requires the app to implement certain behavior which may involve
	serious amount of additional work - see IAppHistoryFullSupport for more info on that topic.
*/
function IAppHistorySupportImpl() {}
IAppHistorySupportImpl.InterfaceImpl("IAppHistorySupport");
IAppHistorySupportImpl.RequiredTypes("IApp"); // Inherited from the interface, but we repeat it for clarity
IAppHistorySupportImpl.classInitialize = function(cls, bDisAllowHistory) {
		cls.prototype.get_allowhistory = function() { return bDisAllowHistory?false:true; }
}
