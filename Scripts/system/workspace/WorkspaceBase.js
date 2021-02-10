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

    // Main API methods

    /**
     * This method must be called only once, any 
     * 
     * @param domroot (HTMLElement) The element on which the root window should mount. Can be null for implementations that do not need this (see docs).
     * @param parameters {object} Various parameters needed by the workspace, depend on the implementations, but some
     * general rules exist.
     * @returns {Boolean} Indicates if initialization was performed (true) or was previously done (false).
     */
    WorkspaceBase.prototype.initialize = function(domroot, parameters) {

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

})();