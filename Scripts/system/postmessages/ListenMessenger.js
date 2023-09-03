(function() {
    var BufferStream = Class("BufferStream"),
        MessageListenerRT = Class("MessageListenerRT");

    /**
     * Preferably use this as single global listener
     */
    function ListenMessenger(webcontext) {
        BaseObject.apply(this, arguments);
        this.$webcontext = webcontext;
        this.$webcontext.addEventListener("message", this.onMessage);
    }
    ListenMessenger.Inherit(BaseObject, "ListenMessenger");
    ListenMessenger.prototype.$webcontext = null;
    ListenMessenger.prototype.onMessage = new InitializeMethodCallback("Main handler for posted messages.",function(messageEvent) {
        var result;
        for (var i = 0; i < this.$listeners.length; i++) {
            var lrt = this.$listeners[i];
            if (BaseObject.is(lrt,"MessageListenerRT")) {
                result = lrt.onMessage(messageEvent);
                if (result === true || result === false) return;
            }
        }
    });
    ListenMessenger.prototype.$listeners = new InitializeArray("All listenars");
    
    ListenMessenger.prototype.ListenMessages = function(origin, matchchecker) {
        if (origin == null) origin = "*";
        var lrt = new MessageListenerRT(origin, matchchecker);
        this.$listeners.push(lrt);    
        return lrt.init(this);
    }
    /**
     * 
     * @param {ListenMessagesRT} lrt - listener that wants message sent 
     * @param {*} message - message to send
     */
    ListenMessenger.prototype.PostMessage = function(lrt, message) {
        if (this.$webcontext != null) {
            this.$webcontext.postMessage(message, lrt.get_origin());
        }
    }
    ListenMessenger.prototype.UnlistenMessages = function(buffstream) {
        var nListener = this.$listeners.findIndex( function(lrt, idx, arr) {
            return (lrt.get_buffsream() == buffstream);
        });
        if (nListener != -1) {
            this.$listeners.splice(nListener, 1);
        }
    }
    ListenMessenger.prototype.UnlistenAllMessages = function() {
        this.$listeners.splice(0);

    }
})();