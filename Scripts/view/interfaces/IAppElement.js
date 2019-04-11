/**
	This is an interface for anything that serves as integral component of an app - from a random class containing logic to window hierarchies. 
	being an integral part means it is needed by the app and it needs to know its app in order to work correctly.
	
	Windows implement this interface, but a single window is never considered an app element - the whole hierarchy of windows in it is considered as such.
	This may be a little vague and example relations can illustrate the phylosophy behind this - the deeper is a window in the hierarchy the less it (considered
	separately/alone) looks like an element of the application - it is part of the hierarchy and plays more in it and not alone or directly with the application.
	The fact that it can use the app as service may bring an illusion that this makes such window (with or without a view in it) an element of the app, but
	this is done on service base and logically may or may not be an app based concept - i.e. it is usage of a service that potentionally changes the state of the app.
*/

/*INTERFACE*/
function IAppElement() { }
IAppElement.Interface("IAppElement");
IAppElement.ImplementProperty("approot", new Initialize("Only the root windows of the application should have this set to the AppBase object of the application"));