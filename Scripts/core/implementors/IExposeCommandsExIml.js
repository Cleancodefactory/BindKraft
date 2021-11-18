(function(){
    function IExposeCommandsExIml() {   }
    IExposeCommandsExIml.InterfaceImpl("IExposeCommandsEx", "IExposeCommandsExIml");
    IExposeCommandsExIml.ImplementProperty("commands", new InitializeArray("commands"));
    IExposeCommandsExIml.ImplementReadProperty("commandareas", new InitializeObject("commandareas object"));

})();