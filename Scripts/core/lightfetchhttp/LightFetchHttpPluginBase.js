/**
 * A base class for classes used by the LightGetchHttp to inject settings/details into the formed request while sending it.
 * 
 * The pattern of implementation and function is as follows:
 * The user creates an instance of a class inherited from LightFetchHttpPluginBase, passing the needed parameters as constructor arguments.
 * var x = new MyDynamic(someparam, somotherparam);
 * Then the user adds this instance to the dynamics of the LightFetchHttp instance.
 * var lfh = new LightFetch....
 * later:
 * lfh.addPlugin(x)
 * Then the LFH is using the dynamic every time it constructs a request internally
 * 
 */
function LightFetchHttpPluginBase() {
    BaseObject.apply(this,arguments)
}
LightFetchHttpPluginBase.Inherit(BaseObject, "LightFetchHttpPluginBase");

// Override this in inheriting classes
LightFetchHttpPluginBase.prototype.manipulateRequest = function(fetcher, xhr) {
    throw "Not implemented";
}