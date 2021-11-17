(function(){

    function IEnumerateExposedCommandsImpl() {}
    IEnumerateExposedCommandsImpl.InterfaceImpl("IEnumerateExposedCommands", "IEnumerateExposedCommandsImpl");
    IEnumerateExposedCommandsImpl.RequiredTypes("IExposedCommands");
    IEnumerateExposedCommandsImpl.prototype.enumExposedCommands = function(args,callback) {
        return IEnumerateExposedCommands.enumExposedCommands(this, args, callback);
    }

    IEnumerateExposedCommandsImpl.enumExposedCommands = IEnumerateExposedCommands.enumExposedCommands;
})();