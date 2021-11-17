(function() {


    /**
     * For historical reasons this interface is preserved and extended with IExposeCommandsEx. Both interfaces define properties and
     * objects that contain in their leafs arrays of "commands". The considerations below apply to all of them.
     * 
     * The "commands" at this level are an abstract idea of something that commands the implementor of the interface or may be even 
     * the host of the implementor and so on. The interface(s) can be used in both UI and non-UI cases and one obvious difference will
     * be the types of the items in those arrays.
     * 
     * Because this idea for "commands" reminds everybody of menus and submenus, this is again a problem for the "commands" themselves and not
     * the interface(s) - they provide only the root "commands" which should be most often enough for non-UI applications, but UI scenarios will 
     * most often need additional complexity implemented by the "commands" which will have to be more like slots for different kinds of elements 
     * (simple commands, submenus, embeds etc.)
     * 
     * Additional interfaces may depend on these or extend them to provide some operations over all the contained "commands".
     * 
     */
    function IExposeCommands() {}
    IExposeCommands.Interface("IExposeCommands");
    IExposeCommands.ImplementProperty("commands", new InitializeArray("Array of commands. These should be objects derived from delegate or at least supporting IInvoke"));

})();
