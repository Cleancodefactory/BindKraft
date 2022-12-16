(function(){

    function AjaxGlobalHooks() {
        BaseObject.apply(this, arguments);
    }
    AjaxGlobalHooks.Inherit(BaseObject, "AjaxGlobalHooks")


    //#region Entry points for specific events
    /**
     * TODO: all the arguments after the first are to be revised.
     */
    AjaxGlobalHooks.prototype.onHttpError = function(httpStatus, responseData) { 
        var op = new Operation("onHttpError");
        var index = 0;
        var me = this;
        function pickOne(prevResult) {
            if (prevResult === false) {
                op.CompleteOperation(true, false);
                return;
            }
            if (index >= me.$hooks.length) {
                op.CompleteOperation(true, undefined);
                return;
            }
            var hook = me.$hooks[index];
            index ++;
            doOne(hook);
        }
        function doOne(hook) {
            var opa = new Operation("Process OnhttpError hook");
            if (BaseObject.is(hook, "IAjaxHttpHook")) {
                var hook_result = hook.onHttpError(httpStatus, responseData);
                if (hook_result === false) {
                    opa.CompleteOperation(true, false);
                    
                } else {
                    if (BaseObject.is(hook_result, "Operation")) {
                        hook_result.onsuccess(pickOne).onfailure(function(err) {
                            console.log("OnhttpError hook error: ", err);
                            pickOne(undefined);
                        });
                    } else {
                        opa.CompleteOperation(true,undefined);
                    }
                }
            } else {
                opa.CompleteOperation(true, undefined);
            }
            opa.onsuccess(pickOne).onfailure(function(err) {
                op.CompleteOperation(false, err);
            });
        }
        pickOne(undefined);
        return op;
    }
    //#endregion

    //#region Actual hooks registered
    AjaxGlobalHooks.prototype.addHooks = function(callbackinterfaces) { 
        if (arguments.length == 0) return;
        for (var i = 0; i < arguments.length; i++) {
            if (this.$hooks.indexOf(arguments[i]) < 0) this.$hooks.push(arguments[i]);
        }
    }
    AjaxGlobalHooks.prototype.removeHooks = function(callbackinterfaces) { 
        if (arguments.length == 0) return;
        for (var i = this.$hooks.length - 1; i >= 0;i--) {
            var hook = this.$hooks[i];
            if (callbackinterfaces.indexOf(hook) >= 0) {
                this.$hooks.splice(i, 1);
            }
        }
    }
    /**
     * Removes all hooks (without arguments) or all hooks which support one of the given interfaces (passed as types)
     * @param {Type} ifaceType - one or more interface definitions/names
     */
    AjaxGlobalHooks.prototype.removeAllHooks = function(/*optional*/ ifaceType) { 
        var ifaces = Array.createCopyOf(arguments).Select(function(idx, ifdef) {
            return Class.getTypeName(ifdef);
        });
        for (var i = this.$hooks.length - 1; i >= 0;i--) {
            var hook = this.$hooks[i];
            if (hook == null || arguments.length == 0) {
                this.$hooks.splice(i, 1);
                continue;
            }
            if (ifaces.Any(function(idx, ifacename) {
                return hook.is(ifacename);
            })) {
                this.$hooks.splice(i, 1);
                continue;
            }
        }
    }
    AjaxGlobalHooks.prototype.$hooks = new InitializeArray("Hooks registered");
    //#endregion

    //#region Singleton
    AjaxGlobalHooks.Default = (function () {
        var instance = null;
        return function() {
            if (instance == null) {
                instance = new AjaxGlobalHooks();
            }
            return instance;
        }
    })();
    //#endregion

    //#region Static goodies
    AjaxGlobalHooks.RedirectToLogin = function() {
        window.location.href = mapPath('/account/signin') + '?returnUrl=' + encodeURIComponent(BKUrl.getInitialFullUrl());
    }
    //#endregion
})();