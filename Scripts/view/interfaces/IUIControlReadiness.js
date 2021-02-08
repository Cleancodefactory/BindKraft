(function() {
    /**
     * Enables controls that perform asynchronous operations to declare their interactive and/or binding-ready state.
     * Also allows interested parties to wait the control to enter ready state.
     */
    function IUIControlReadiness() {}
    IUIControlReadiness.Interface("IUIControlReadiness");

    /**
     * @returns {boolean}   Ready/not ready.
     */
    IUIControlReadiness.prototype.get_controlreadystate = function() { throw "not implemented.";}
    /**
     * MUST return operation, the operation must be protected against unlimited timeouts and for that reason
     * the result MUST be the ready state, which can still be false (not ready) after the time alloted.
     * This enables the 3-d party to decide what to do with the misbehaving control in border cases.
     */
    IUIControlReadiness.prototype.get_waitcontrolreadystate = function() { throw "not implemented.";}
})();