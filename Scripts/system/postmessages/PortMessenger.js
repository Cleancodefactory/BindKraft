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
            if (BaseObject.is(lrt,"PortRT")) {
                result = lrt.onMessage(messageEvent); 
                // Returning true means PortRT took the port 
                if (result === true || result === false) return;
            }
        }
    });
    ListenMessenger.prototype.$listeners = new InitializeArray("All listenars PortRT-s");
    
    ListenMessenger.prototype.ListenPort = function(matchchecker,mode) {
        if (origin == null) origin = "*";
        var lrt = new PortRT(matchchecker);
        this.$listeners.push(lrt);    
        var br = true, bw = true;
        if (typeof mode == "string") {
            switch (mode){
                case "r":
                    bw = false;
                    break;
                case "w":
                    br = false;
                    break;
                case "rw":
                case "wr":
                    break;
                default:
                    throw "If mode is specified in ListenPort it must be r,w,rw or wr";
            }
        }
        return lrt.init(this,br,bw); // return buffer stream
    }

})();