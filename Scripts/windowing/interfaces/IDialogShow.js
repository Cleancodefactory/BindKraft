(function(){

    /**
     * This interface defines dialog (quasi-modal/non-modal) showing functionality. It can be implemented
     * in different ways and its limitations are supposed mostly to guarantee that the implementation will have
     * easy access to the typically required elements. For this reason the requirements can be relaxed in future.
     * 
     * There is no separation between modal and modeless dialogs in the interface, to provide better control an Ex interface will
     * be introduced later
     * 
     * To avoid tempting people to employ techniques that will slow the dialog creation openDialog accepts ready data and preloaded views only.
     * Of course this wont stop anybody from loading everything on demand, but the preferred way to deal with dialogs is to treat them as typical 
     * controls and supply what they need ready for use.
     */
    function IDialogShow() {}
    IDialogShow.Interface("IDialogShow");
    IDialogShow.RequiredTypes("IWindowBehavior", "BaseWindow", "IApp");

    /**
     * Must return the host window used as parent for the dialogs. This can be implemented as null in niche cases, but such implementations should not
     * be necessary, because they can be replaced by multiple IDialogShow services provided on different levels
     * @returns {BaseWindow} The host window
     */
    IDialogShow.prototype.get_hostwindow = function() { throw "not impl."; }

    /**
     * Gets/sets a default window template to be used for the dialog windows. If not provided the default window template for SimpleViewWindow will
     * be used.
     */
    IDialogShow.prototype.get_windowtemplate = function() { throw "not impl."; }
    IDialogShow.prototype.set_windowtemplate = function(v) { throw "not impl."; }

    /**
     * 
     * @param {*} workdata - A data appropriate for the dialog view
     * @param {string} view - The view to use
     * @param {*} placement 
     * @returns {ChunkedOperation} Returns an operation which, depending on the expected functionality of the dialog view, can be assumed just Operation 
     * or ChunkedOperation - dialogs working along the lines of modal dialogs will use it as Operation, while dialogs that stay open to provide control UI 
     * will report user interactions through using chunks (supported by ChunkedOperation).
     */
    IDialogShow.prototype.openDialog = function(workdata, view, placement) { throw "not impl."; }
    
    //#region Optionals
    /**
     * This method can be implemented as an empty one in some cases, if fully implemented it should recognize the specific dialog to close by the ChunkedOperation
     * created for it.
     * 
     * @param {ChunkedOperation} op - the operation returned by the openDialog
     */
    IDialogShow.prototype.closeDialog = function(operation) { throw "not impl."; }

    /**
     * Like close dialog this method can be implemented as an empty one in some cases, if fully implemented it has to close all opened dialogs.
     */
    IDialogShow.prototype.closeAllDialogs = function() { throw "not impl."; }

    /**
     * This method can be implemented as an empty one in some cases, if fully implemented it should recognize the specific dialog by the ChunkedOperation
     * created for it.
     * 
     * @param {ChunkedOperation} op - the operation returned by the openDialog
     */
    IDialogShow.prototype.isOpen = function(op) { throw "not impl."; }
    //#endregion Optionals


})();