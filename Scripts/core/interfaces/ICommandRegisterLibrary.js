(function() {
    function ICommandRegisterLibrary() {}
    ICommandRegisterLibrary.Interface("ICommandRegisterLibrary", "ICommandRegister");

    ICommandRegisterLibrary.prototype.addLibrary = function(lib) { throw "not implemented"; }
    ICommandRegisterLibrary.prototype.removeLibrary = function(lib) { throw "not implemented"; }
    ICommandRegisterLibrary.prototype.removeAllLibraries = function() { throw "not implemented"; }

})();