(function() {
    /**
     * Preferably use this as single global listener
     */
    function ListenMessenger() {
        BaseObject.apply(this, arguments);
    }
    ListenMessenger.Inherit(BaseObject, "ListenMessenger");
    ListenMessenger.prototype.onMessage = new InitializeMethodCallback("Main handler for posted messages.",function(messageEvent) {

    });
    ListenMessenger.prototype.ListenMessages = function(origin, matchchecker)
})();