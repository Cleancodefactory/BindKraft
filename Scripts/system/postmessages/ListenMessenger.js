(function() {
    var BufferStream = Class("BufferStream"),
        MessageListenerRT = Class("MessageListenerRT");

    /**
     * Postmessages listener, both parameters must be not null for two directional work
     * Preferably use this as single global listener
     * @param {Window|Worker|ServiceWorker|MessagePort|BroadcastChannel} webcontext - webcontext to listen on
     * @param {Window|Worker|ServiceWorker|MessagePort|BroadcastChannel} postcontext - webcontext to post messages to
     */
    function ListenMessenger(webcontext,postcontext) {
        BaseObject.apply(this, arguments);
        if (webcontext == null || typeof(webcontext.postMessage) != "function" ) {
            throw "webcontext to listen on is null or des not seem to support post messages";
        }
        if (postcontext == null || typeof postcontext.postMessage != "function") {
            throw "Target postwebcontext is null or does not support posting messages";
        }
        this.$webcontext = webcontext;
        this.$webcontexttarget = postcontext;
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
        if (this.$webcontexttarget != null) {
            this.$webcontexttarget.postMessage(message, lrt.get_origin());
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