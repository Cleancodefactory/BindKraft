(function() {

    var ICommandContext = Interface("ICommandContext"),
        IEnvironmentContext = Interface("IEnvironmentContext"),
        ICommandRegister = Interface("ICommandRegister");

    function CommandContextHelper(contextStack) {
        BaseObject.apply(this, arguments);
        this.contextStack = contextStack;
    }
    CommandContextHelper.Inherit(BaseObject, "CommandContextHelper")
        .Implement(IEnvironmentContext)
        .Implement(ICommandRegister);

    //#region Navigation and management
    CommandContextHelper.prototype.popContext = function() {
        if (this.contextStack.length > 1) {
            return this.contextStack.pop();
        } else {
            return this.contextStack[0];
        }
    }
    CommandContextHelper.prototype.pullContext = CommandContextHelper.prototype.popContext;
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
    CommandContextHelper.prototype.enumContexts = function(callback, defresult, startFrom) {
        var output = { result: defresult || null };
        var initialIndex = this.contextStack.length - 1;
        if (startFrom == "parent") {
            if (initialIndex > 0) initialIndex = initialIndex - 1;
        } else if (startFrom == "root") {
            if (initialIndex >= 0) initialIndex = 0;
        }
        for (var i = initialIndex; i >= 0;i--) {
            if (BaseObject.callCallback(callback, this.contextStack[i],output)) {
                break;
            }
        }
        return output.result;
    }
    CommandContextHelper.prototype.topEnvContext = function(n) { 
        if (typeof n != "number" || isNaN(n)) n = null;
        return this.enumContexts(function(ctx, output) {
            var env = ctx.get_environment();
            if (env != null) {
                if (n == null || n == 0) {
                    output.result = env;
                    return true;
                } else {
                    n--;
                }
            }
            return false;
        },null);
    }
    CommandContextHelper.prototype.topCommandContext = function() { 
        return this.enumContexts(function(ctx, output) {
            var cmd = ctx.get_command();
            if (cmd != null) {
                output.result = cmd;
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
    CommandContextHelper.prototype.unsetEnv = function(key) { 
        var env = this.topEnvContext();
        if (env != null) {
            env.unsetEnv(key);
        }
    }
    

    //#endregion

    //#region 
    CommandContextHelper.prototype.ownerString = function() {
        var ctx = this.topCommandContext();
        if (ctx != null) {
            return ctx.ownerString();
        }
        return null;
    }
    /**
     * Checks if command is registered with the top command register.
     * 
     * @param {string|CommandDescriptor} cmd_or_name - command to check for. Alias or command name can be used.
     */
     CommandContextHelper.prototype.exists = function(cmd_or_name) {
         var ctx = this.topCommandContext();
         if (ctx != null) {
             return this.exists(cmd_or_name);
         }
         return null;
     }
    /**
     * Gets the command queried
     * 
     * @param {string|CommandDescriptor} cmd_or_name - command to get.
     */
    CommandContextHelper.prototype.getEx = function(cmd_or_name) {
        return this.enumContexts(function(cmdCtx, output) {
            var cmd = cmdCtx.get_commands();
            if (cmd != null) {
                var c = cmd.get(cmd_or_name);
                if (c != null) {
                    output.result = {
                        command: c,
                        context: cmdCtx
                    };
                    return true;
                }
            }
        }, null);
    }
    CommandContextHelper.prototype.get = function(cmd_or_name) {
        var r = this.getEx(cmd_or_name);
        if (r != null) { 
            return r.command;
        }
        return null;
    }
    /**
     * Finds and if found returns the command
     * @param {string} token - the token to analyse or just command name/alias
     * @param {object} meta - options defining how to recognize the command (not all languages use this to the full extent)
     */
    CommandContextHelper.prototype.findEx = function(token, startFrom) {
        return this.enumContexts(function(cmdCtx, output) {
            var cmd = cmdCtx.get_commands();
            if (cmd != null) {
                var c = cmd.find(token, {subtype: "identifier"});
                if (c != null) {
                    output.result = {
                        command: c,
                        context: cmdCtx
                    };
                    return true;
                }
            }
        }, null, startFrom);
    }
    CommandContextHelper.prototype.find = function(token, startFrom) {
        var r = this.findEx(token,startFrom);
        if (r != null) {
            return r.command;
        }
        return null;
    }
    CommandContextHelper.prototype.register = function(command, alias, regexp, action, help, bOverride) {
        var cmdreg = this.topCommandContext();
        if (cmdreg != null) {
            return cmdreg.register(command, alias, regexp, action, help, bOverride);
        }
        return null;
    }
    CommandContextHelper.prototype.unregister = function(command) {
        var cmdreg = this.topCommandContext();
        if (cmdreg != null) {
            return cmdreg.unregister(command);
        }
        return null;
    }
    //#endregion

})();