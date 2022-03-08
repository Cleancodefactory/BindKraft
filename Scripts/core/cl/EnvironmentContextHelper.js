(function(){

    var IEnvironmentContext = Interface("IEnvironmentContext");

    function EnvironmentContextHelper(contextStack) {
        BaseObject.apply(this, arguments);
        this.contextStack = contextStack;
    }
    EnvironmentContextHelper.Inherit(BaseObject, "EnvironmentContextHelper")
        .Implement(IEnvironmentContext);

    

    EnvironmentContextHelper.prototype.getEnv = function(key,defval) { 
        var ctx;
        for (var i = this.contextStack; i >= 0;i--) {
            ctx = this.contextStack[i];
            
        }
    }
    /** Sets an environment variable
    */
    EnvironmentContextHelper.prototype.setEnv = function(key, val) {	throw "not implemented"; }
    /** Returns a clone of the environment
    */
    EnvironmentContextHelper.prototype.cloneEnvironent = function() { throw "not implemented"; }
    /** Returns an array of the names of all the environment variables (without the special ones)
    */
    EnvironmentContextHelper.prototype.getEnvVarnames = function() { throw "not implemented"; }
    /** Removes an environment variable by its name
    */
    EnvironmentContextHelper.prototype.unsetEnv = function(key) { throw "not implemented"; }


})();