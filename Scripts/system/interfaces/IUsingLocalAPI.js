/**
	Implemented by apps (AppBase) that want use Local API and depend on the launcher to connect them to APIs with an LocalAPIClient.
	The launched does this:
	obtains the import table by calling getLocalAPIImportDefinition firstChild
	creates LocalAPIClient with that import and LocalAPI hubs chosen by the launcher
	gives the initialized client to the app by calling setLocalAPIClient
	
	This is done before initializng the app (i.e. before calling appinitialize (in AppBase)/initialize (in AppBaseEx))
	
	Why so early? This is a matter of packing the API references and is fast. Also no uninitialization is needed - the client just points to the APIs
	and they are usable as early as possible this way. The APIs are not available in the constructor of the app (as usual none or very little contextual information is available there)! 
	
	Use IUsingLocalAPIImpl get this done for you and also beautified by DI.
	
	Concerns
	~~~~~~~~
	
	Using Local API as DI (dependency injected): Some API can be loadable, but the system will not autoload them (e.g. start the apps/daemons that serve the API). In the future
	we may decide to implement this for daemons, but it is unlikely that such auto-load feature will be available for apps. For both daemons and apps there is a concern that their
	availability may depend on more factors than just the APIs they provide and auto-start is not as straightforward solution as it looks.
	
	To understand this better, imagine that an app/daemon exposes as Local API functionality that is very much like normal app function - access to databases on remote server,
	performing operations that change remote data, query data there etc. If this app is written as a daemon especially to be the means this to be done by the command of other apps it
	will be ok to autostart it. However if the app is a visual one, with UI and everything starting it on demand will be confusing for the user and it is even possible that it may require
	interaction with the user in order to accomplish some actions that are seen through the API as just method calls. So, it all depends on the nature of the implementation and the purpose of
	the API exposition.
	
	The design recommendation is thus a bit conservative - know your APIs. Using dependency injection is fine with system APIs, but is a bad idea with APIs exposed by UI heavy apps
	that expose them in order to enable visual app integration. Depending on the purpose of the API you can easilly guess how persistent it is and thus determine if your usage
	of the particular API will be accompanied with checks for nulls or not. See more info in the documentation and the client and implementor files.
	
*/
function IUsingLocalAPI() {}
IUsingLocalAPI.Interface("IUsingLocalAPI");
IUsingLocalAPI.RequiredTypes("AppBase"); // For now!, we will add demon bases later
IUsingLocalAPI.prototype.setLocalAPIClient = function(clnt) {throw "Not implemented. It is recommended to use IUsingLocalAPIImpl and benefot from all the added convenience.";}
IUsingLocalAPI.prototype.getLocalAPIImportDefinition  = function() { throw "Not implemented. It is strongly recommended to use IUsingLocalAPIImpl or other implementors and benefot from all the added convenience.";}
