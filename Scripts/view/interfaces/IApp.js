



/*
In a typical windowed environment we have apps working in the system. The class below is the core class which should be inherited by app implementations.
We are trying to find ways to design this class in such a way that definition of a new one nheriting it can be avoided in many cases. When possible the standard app
should be usable by attaching a run function to it. 
    
For convenience the main app functionality is defined as Interface(s)
*/
/*INTERFACE*/
function IApp() { }
IApp.Description("App main Interface.");
IApp.Interface("IApp", "IAppBase");
/*
IApp.prototype.appinitialize = function (callback, args) {
    BaseObject.callCallback(callback, true);
    return true;
}
// Implementation guidelines: args_optionally - should be the same arguments as in appinitialize
IApp.prototype.run = function (args_optionally) {
    // TODO: attach or override with the main application code.
    throw "The app is not implemented.";
}
IApp.prototype.appshutdown = function (callback) {
    BaseObject.callCallback(callback, true);
    return true;
}
IApp.ImplementProperty("instanceid", new Initialize("App managers can set this id in order to be able to find the specific app later. The type of the id depends on the manager."));
IApp.ImplementProperty("instancename", new InitializeStringParameter("The app should set its name here.", "App"));
*/
IApp.prototype.get_iconpath = function() {
	return mapPath("img/app-default-icon-off.png");
}
IApp.prototype.get_caption = function() {
	return "Unnamed App";
}
/**
	Avoid using/dpenging on this property. It is controversal and is impossible to be implemented correctly. 
	We start to obsolete it.
*/
IApp.prototype.get_approotwindow = function() {
	return null;
}.Description("Gets the app's hosting window (or sometimes the main app window). The implementation may vary depending on the system architecture. Usually this is the window created for the app by the Shell. Not recommended to use when multiple root windows are used.")
	.Deprecated();
// Methods injected from the manager for calling frominside the app
// ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
// TO DO: Places the top window in whatever visual UI is maintained. Most often this is the default or a method attached by the parrent app.
IApp.prototype.placeWindow = function (w, options) {
    //if (window.Shell) {
    //    Shell.addAppWindow(w, options);
    //}
	throw "placeWindow not implemented."
}
IApp.prototype.displaceWindow = function (w, options) {
    // TODO: If needed Implement window detachment
	throw "displaceWindow not implemented."
}
IApp.prototype.ExitApp = function() {
	// Hosts should replace this with appropriate code
	throw "ExitApp not implemented."
}
IApp.prototype.windowDisplaced = function(w) {
	// Here the app has a chance to determine what this means for it. E.g. if this is the last window - it can close. also
	// the variable/field hodling ref to that window should be cleared here (this is important)
	throw "windowDisplaced not implemented."
}

