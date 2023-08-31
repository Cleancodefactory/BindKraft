( function() {

    function BufferedStream() {
        BaseObject.apply(this, arguments);
    }
    BufferedStream.Inherit(BaseObject,"BufferedStream")
        .Implement(IMessageReadStream)
        .Implement(IMessageWriteStream)
    
})();