(function(){
    function IDisablableActiveImpl() {}
    IDisablableActiveImpl.InterfaceImpl(IDisablable,"IDisablableActiveImpl");
    IDisablableActiveImpl.RequiredTypes("Base");
    IDisablableActiveImpl.ForbiddenTypes("BaseWindow");
    IDisablableActiveImpl.ImplementActiveProperty("disabled", new InitializeBooleanParameter("",false));
})();