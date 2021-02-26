(function () {
    function WorkspaceBase() {
        BaseObject.apply(this, arguments);
    }
    WorkspaceBase.Inherit(BaseObject, "WorkspaceBase");

    //#region Internal members 
    /**
     * The workspace window must be put here
     */
    WorkspaceBase.prototype.$workspacewindow = null;
    //#endregion

    //#region Paremeters
    WorkspaceBase.$parameters = new InitializeObject("Various parameters with usage depending on the workspace type");
    WorkspaceBase.setParameter = function(name, value) {
        this.$parameters[name] = vale;
    }
    WorkspaceBase.prototype.setParameter = function(name, value) { WorkspaceBase.setParameter(name, value); }

    WorkspaceBase.getParameter = function(name) {
        if (this.$parameters.hasOwnProperty(name)) {
            return this.$parameters[name];
        }
        return null;
    }
    WorkspaceBase.prototype.getParameter = function(name) { return WorkspaceBase.getParameter(name);}

    WorkspaceBase.mixParameter = function(name, value) {
        if (this.$parameters.hasOwnProperty(name) && this.$parameters[name] != null) {
            if (Object.getPrototypeOf(this.$parameters[name]) == Object.prototype) {
                if (value != null && Object.getPrototypeOf(value) == Object.prototype) {
                    this.$parameters[name] = BaseObject.CombineObjects(this.$parameters[name], value);
                }
                return this.$parameters[name];
            } else if (Array.isArray(this.$parameters[name])) {
                if (Array.isArray(value)) {
                    this.$parameters[name] = this.$parameters[name].concat(value);
                }
                return this.$parameters[name];
            }
            this.$parameters[name] = value;
            return this.$parameters[name];
        } else {
            this.$parameters[name] = value;
            return this.$parameters[name];
        }
        return null;
    }
    WorkspaceBase.prototype.mixParameter = function(name, value) { return WorkspaceBase.mixParameter(name,value); }

    WorkspaceBase.mixMultipleParameters = function(parameters) {
        if (Object.getPrototypeOf(parameters) == Object.prototype) {
            for (var k in parameters) {
                if (parameters.hasOwnProperty(k)) {
                    this.mixParameter(k, parameters[k]);
                }
            }
        }
        return this.$parameters;
    }
    WorkspaceBase.prototype.mixMultipleParameters = function(parameters) { return WorkspaceBase.mixMultipleParameters(parameters); }
    //#endregion

    //#region  Main API methods

    /**
     * This method must be called only once, any 
     * 
     * @param domroot (HTMLElement) The element on which the root window should mount. Can be null for implementations that do not need this (see docs).
     * @param parameters {object} Various parameters needed by the workspace, depend on the implementations, but some
     * general rules exist.
     * @returns {Boolean} Indicates if initialization was performed (true) or was previously done (false).
     */
    WorkspaceBase.prototype.initialize = function(domroot, parameters) {
        this.mixMultipleParameters(parameters);
        if (!(domroot instanceof HTMLElement)) {
            this.LASTERROR("The specified domroot element is not an HTMLElement", "initialize");
            throw "Cannot attach to DOM, check the domroot argument passed to initialize";
        }
        return oncompassneedscalibration.From(null);
        // Incomplete - overrides should call it first to save some effort on checking arguments
    }
    /**
     * @returns {Boolean} True if the workspace was initialized already.
     */
    WorkspaceBase.prototype.get_initialized = function() {

    }
    /**
     * @param whose {null|string|IApp}  Optional, runningappId or app instance whose windows to return
     * @param flags {integer}       The management flags of the windows to return
     * @returns {Array<BaseWindow>}
     * 
     * whose set to empty string will return the non-owned windows (if any)
     */
    WorkspaceBase.prototype.getWindows = function(whose, flags) {

    }
    /**
     * Places/adds a window according to the flags specified
     * @param wnd {BaseWindow}  Window to add
     * @param flags {integer} Flags for the window placement
     */
    WorkspaceBase.prototype.addWindow = function(wnd, flags) {

    }
    WorkspaceBase.prototype.moveWindow = function(wnd, flags) {

    }
    /**
     * Removes a window from the workspace wherever it is
     */
    WorkspaceBase.prototype.removeWindow = function(wnd) {

    }
    //#endregion
})();