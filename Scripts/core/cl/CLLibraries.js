(function() {

    function CLLibraries() {
        throw "This class is not instantiable";
    }
    CLLibraries.Inherit(BaseObject, "CLLibraries");


    CLLibraries.$libraries = {};

    CLLibraries.DefineLibrary = function (libName, commands) {
        if (typeof libName != "string" || /^\s+$/.test(libName)) {
            BaseObject.LASTERROR("Invalid lib name")
            return false;
        }
        var reg = new CommandReg("system_" + libName);
        if (Array.isArray(commands)) {
            for (var i = 0; i < commands.length; i++) {
                var cmd = commands[i];
                reg.register(cmd);
            }
        }
        this.$libraries[libName] = reg;
    }

})();