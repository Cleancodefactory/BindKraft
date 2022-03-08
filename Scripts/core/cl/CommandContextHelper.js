(function() {

    function CommandContextHelper(contextStack) {
        BaseObject.apply(this, arguments);
        this.contextStack = contextStack;
    }
    CommandContextHelper.Inherit(BaseObject, "CommandContextHelper")
        .Implement(IEnvironmentContext);

    //#region Navigation and management
    CommandContextHelper.prototype.popContext = function() {
        if (this.contextStack.length > 1) {
            return this.contextStack.pop();
        } else {
            return this.contextStack[0];
        }
    }
    CommandContextHelper.prototype.pushContext = function(ctx) {
        if (BaseObject.is(ctx, "ICommandContext")) {
            this.contextStack.push(ctx);
            return ctx;
        }
        return null;
    }
    CommandContextHelper.prototype.topContext = function() {
        if (this.contextStack.length > 1) {
            return this.contextStack[this.contextStack.length - 1];
        }
        return null;
    }
    
    /**
     * @param {callback} callback - A callback(context:ICommandContext, output:object). The callback should return truthy value if done
     *                              The result must be set into output.result;
     */
    CommandContextHelper.prototype.enumContexts = function(callback, defresult) {
        var output = { result: defresult || null };
        for (var i = this.contextStack.length - 1; i >= 0;i--) {
            if (BaseObject.callCallback(callback, this.contextStack[i],output)) {
                break;
            }
        }
        return output.result;
    }
    CommandContextHelper.prototype.topEnvContext = function() { 
        return this.enumContexts(function(ctx, output) {
            var env = ctx.get_environment();
            if (env != null) {
                output.result = env;
                return true;
            }
            return false;
        },null);
    }
    //#endregion


    //#region IEnvironmentContext and additions

    CommandContextHelper.prototype.getEnv = function(key,defval) { 
        return this.enumContexts(function(cmdCtx, output) {
            var env = cmdCtx.get_environment();
            var val = env.getEnv(key,defval);
            if (val != null) {
                output.result = val;
                return true;
            }
        }, null);
    }
    /** Sets an environment variable
    */
    CommandContextHelper.prototype.setEnv = function(key, val) {
        var env = this.topEnvContext();
        if (env != null) {
            env.setEnv(key, val);
            return true;
        }
        return false;
    }
    /** Returns a clone of the environment
    */
    CommandContextHelper.prototype.cloneEnvironent = function() { 
        var env = this.topEnvContext();
        if (env != null) return env.cloneEnvironent();
        return null;
    }
    /** Returns an array of the names of all the environment variables (without the special ones)
    */
    CommandContextHelper.prototype.getEnvVarnames = function() { 
        return this.enumContexts(function(cmdCtx, output) {
            var env = cmdCtx.get_environment();
            var names;
            if (env != null) {
                names = env.getEnvVarnames();
                if (Array.isArray(names) && names.length > 0) {
                    output.result = output.result.concat(names);
                }
            }
        }, []);
    }
    /** Removes an environment variable by its name
    */
     CommandContextHelper.prototype.unsetEnv = function(key) { throw "not implemented"; }

    //#endregion

})();