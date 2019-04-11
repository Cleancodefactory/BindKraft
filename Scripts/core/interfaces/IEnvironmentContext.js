
/**
	Serves a role similar to the environment variables in OS-es,
	but may contain other things as well.

	The limitation of the environment here comes from clonning
	- what we can and want to clone and where (from what point on)
	we do not want to risk it.
	
	Obviously simple key-values (normal fields in javascript objects)
	are Ok, even arrays with simple values are Ok, but BaseObject derivatives
	can be dangerous idea and hard to identify as such. So, for the moment we
	stop at clonning data objects - whatever you can obtain from/save to a JSON,
	but no more.
*/
function IEnvironmentContext() {}
IEnvironmentContext.Interface("IEnvironmentContext");
/** Gets environment variable and if it is missing returns the default value.
*/
IEnvironmentContext.prototype.getEnv = function(key,defval) { throw "not implemented";}
/** Sets an environment variable
*/
IEnvironmentContext.prototype.setEnv = function(key, val) {	throw "not implemented"; }
/** Returns a clone of the environment
*/
IEnvironmentContext.prototype.cloneEnvironent = function() { throw "not implemented"; }
/** Returns an array of the names of all the environment variables (without the special ones)
*/
IEnvironmentContext.prototype.getEnvVarnames = function() { throw "not implemented"; }
/** Removes an environment variable by its name
*/
IEnvironmentContext.prototype.unsetEnv = function(key) { throw "not implemented"; }