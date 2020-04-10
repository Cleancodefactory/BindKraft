(function() {
    function ChannelComm_MsgChannel(channel) {
        BaseObject.apply(this, arguments);
        this.$channel = channel;
    }
    ChannelComm_MsgChannel.Inheirt(BaseObject, "ChannelComm_MsgChannel");
    ChannelComm_MsgChannel.Implement(IChannelComm);

    ChannelComm_MsgChannel.prototype.$channel = null;
    ChannelComm_MsgChannel.prototype.$localport = null;

    ChannelComm_MsgChannel.prototype.send = function(message) {

    }
    ChannelComm_MsgChannel.prototype.receive = function(message) {

    }


    ChannelComm_MsgChannel.InitiateOnIFrame = function(iframe) {
        if (iframe instanceof HTMLIFrameElement) {
            iframe.addEvent
        } else if (iframe == null) {
            return null;
        } else {
            throw "InitiateOnIFrame requires iframe element or null."
        }
        
    }
});
