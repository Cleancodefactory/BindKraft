(function(){
    function MediaChangedMessage(name) {
        BaseObject.apply(this, arguments);
        this.set_name(name);
    }
    MediaChangedMessage.Inherit(BaseObject, "MediaChangedMessage")
        .ImplementProperty("name", new InitializeStringParameter("The name of the notificator",null))
        .ImplementProperty("matched", new InitializeBooleanParameter("The expression result",false))
        .ImplementProperty("expression", new InitializeStringParameter("Optional expression if available.",null));
})();