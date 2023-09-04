(function() {
    function PortMessenger(listencontext) {
        BaseObject.apply(this,arguments);
        if (listencontext == null || typeof listencontext.postMessage != "function") {
            throw "listencontext does not support messages or is null";
        }
        this.$listencontext = listencontext;
        this.$listencontext.addEventListener("message", this.onMessage);
    }
    PortMessenger.Inherit(BaseObject, "PortMessenger");
    ListenMessenger.prototype.$listencontext = null;
    ListenMessenger.prototype.onMessage = new InitializeMethodCallback("Main handler for posted connect messages.",function(messageEvent) {
        var result;
        ///////////
        for (var i = 0; i < this.$listeners.length; i++) {
            var lrt = this.$listeners[i];
            if (BaseObject.is(lrt,"MessageListenerRT")) {
                result = lrt.onMessage(messageEvent);
                if (result === true || result === false) return;
            }
        }
    });
    ListenMessenger.prototype.$listeners = new InitializeArray("All listenars");
    
    ListenMessenger.prototype.AttachToPort = function(origin, matchchecker) {
        if (origin == null) origin = "*";
        var lrt = new MessageListenerRT(origin, matchchecker);
        this.$listeners.push(lrt);    
        return lrt.init(this);
    }
})();