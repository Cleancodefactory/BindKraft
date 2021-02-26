(function() {
    function IMediaQueryNotificator() {}
    IMediaQueryNotificator.Interface("IMediaQueryNotificator", "IManagedInterface");

    /**
     * Sets the expression for checking the conditions.
     * @param {string} expression The expression that checks media queries registered in the host tracker
     */
    IMediaQueryNotificator.prototype.setConditions = function(expression) { throw "not implemented.";}
    /**
     * @param {string} [expression] Optional expression, if missing the expression previously set is executed. Usually this argument is omitted.
     * @returns {boolean} Indicates if the conditions are met.
     */
    IMediaQueryNotificator.prototype.exec = function(expression) { throw "not implemented.";}

    IMediaQueryNotificator.prototype.matchevent = new InitializeEvent("Fired when the conditions gets fulfilled from unfulfilled state.").Arguments(IMediaQueryNotificator, null);
    IMediaQueryNotificator.prototype.unmatchevent = new InitializeEvent("Fired when the conditions gets unfulfilled from fulfilled state.").Arguments(IMediaQueryNotificator, null);
})();