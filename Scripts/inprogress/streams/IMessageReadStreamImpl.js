(function() {
    var IMessageReadStreamReceiver = Interface("IMessageReadStreamReceiver"),
    IMessageReadStream = Interface("IMessageReadStream");


    function IMessageReadStreamImpl() {}
    IMessageReadStreamImpl.InterfaceImpl(IMessageReadStream);
    IMessageReadStreamImpl.classInitialize = function(cls) {
        cls.prototype.$readbuffer = new InitializeArray("incoming messages buffer");
        cls.ImplementInterfaceBubble("receiver",IMessageReadStreamReceiver, {
            receiveMessage: function(message) {
            },
        })
        cls.prototype.readMessage = function() {
            if (this.$readbuffer && this.$readbuffer.length) {
                return this.$readbuffer.shift();
            }
            return null;
        };
        cls.prototype.get_hasincoming = function() {
            if (this.$readbuffer.length > 0) return true;
            return false;
        };
        /**
         * 
         */
        cls.prototype.OnIncoming = function() {
            return true;
        }
        
    }
})();