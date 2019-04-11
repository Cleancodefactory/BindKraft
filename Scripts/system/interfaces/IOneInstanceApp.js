/**
	IOneInstanceApp is to be implemented by apps that want to run in a single instance.
	The SysShell (do not automatically apply to other launchers) will do the following:
	
	1. If the app class being launched supports the interface it will 
	2. See if instance is running and 
	3. if not - will continue normaly (end)
	4. if yes will get reference to it
	5. Will check get_autoactivate and if it is true will activate the app windows (not recommended for apps with more than one top windows)
	6. Will call newLaunchRequest with the passed arguments to enable the app to react to them if possible
	
	As the app has the opportunity to activate itself more appropriately as response to the newLaunchRequest using autoactivate is not
	the best approach often. To perform the activation itseld the app has to remember and use the query back launcher object passed to its constructor.
	So, it is a bit easier to say autoactivate and be done with it, but do not forget - multiple top level windows obviously require some smarts only your app
	has.
	
*/
function IOneInstanceApp() {}
IOneInstanceApp.Interface("IOneInstanceApp");
IOneInstanceApp.prototype.get_autoactivate = function() { throw "not impl"; }
IOneInstanceApp.prototype.newLaunchRequest = function(/* call arguments*/args) {
	throw "not impl";
}