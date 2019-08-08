function IAppBase() { }
IAppBase.Interface("IAppBase");
IAppBase.Description("App main Interface.");

IAppBase.prototype.appinitialize = function (callback, args) {
    BaseObject.callCallback(callback, true);
    // return true;
}
// Implementation guidelines: args_optionally - should be the same arguments as in appinitialize
IAppBase.prototype.run = function (args_optionally) {
    // TODO: attach or override with the main application code.
    throw "The app is not implemented.";
}
IAppBase.prototype.appshutdown = function (callback) {
    BaseObject.callCallback(callback, true);
    //return true;
}
IAppBase.prototype.get_instanceid = function() { return this.$instanceid; }
IAppBase.prototype.set_instanceid = function(v) { this.$instanceid = v; }
IAppBase.prototype.get_instancename = function() { return this.$instancename; }
IAppBase.prototype.set_instancename = function(v) { this.$instancename = v; }


// The below code is commented and kept here to remind all interested developers what decision has been made:
// There will be only an Interface getter method over the IAppBase, all the rest will be done through one of the obtainable interfaces.
// Rationale: GetAppInterface is a method that returns interfaces through which the caller communicates with the App itself. Requesting specific services or new instances of specific services
//  	is a work done by the app, not the app itself. E.g. An app/daemon that implements API for access to certain storage PRODUCES service instancies for each requested service and acts like some kind
// 		of driver - it is a product of the app/daemon (well you may not think about it in those terms while developing it, but think about it), then the app may want to allow to be controlled with commands
//		in which case you will want to obtain the command context of the app. Still on the same matter you may want to have commands that control the app, but you may also want to have commands that use some of the services like in the first example.
//		These are two complete different scenarios, implemented as commands (which is common between the two, but it is the implementation, not the actual scenario.
//		So, in conclusion there are two cases: controlling the app on one hand and using services supplied by it. Supplying a services is a product, a work the application does and can (if desired) be controlled, but when service is obtained - it is used, the product is used.
/*
IAppBase.prototype.GetServiceHub = function() {
	var op = new Operation();
	op.CompleteOperation(false,"not implemented");
	return op;
} // Returns Operation!!!
*/
// These are not yet available at this time :(
//IAppBase.ImplementProperty("instanceid", new Initialize("App managers can set this id in order to be able to find the specific app later. The type of the id depends on the manager."));
//IAppBase.ImplementProperty("instancename", new InitializeStringParameter("The app should set its name here.", "App"));