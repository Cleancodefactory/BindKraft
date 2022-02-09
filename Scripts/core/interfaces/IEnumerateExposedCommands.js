(function() {


    /**
     * Interface to back an implementer that 
     */
    function IEnumerateExposedCommands() {}
    IEnumerateExposedCommands.Interface("IEnumerateExposedCommands");
    IEnumerateExposedCommands.RequiredTypes("IExposeCommands");
    
    IEnumerateExposedCommands.prototype.enumExposedCommands = function(arg, callback) { throw "not impl"; }

    IEnumerateExposedCommands.enumExposedCommands = function(obj, arg, callback) {
        if (!BaseObject.isCallback(callback)) return 0;
        var counter = 0;
        function _enum(o) { 
            var cmds, i, _o;
            counter ++;
            if (BaseObject.callCallback(callback, o, args) == false) return;
            if (BaseObject.is(o, "IExposeCommands")) {
                cmds = o.get_commands();
                if (Array.isArray(cmds)) {
                    for (i = 0; i < cmds.length; i++) {
                        _enum(cmds[i]);
                    }
                }
            }
            if (BaseObject.is(o, "IExposeCommandsEx")) {
                var areas = o.get_commandareas();
                if (areas != null) {
                    for (var k in areas) {
                        if (areas.hasOwnProperty(k)) {
                            cmds = areas[k];
                            if (Array.isArray(cmds)) {
                                for (i = 0; i < cmds.length; i++) {
                                    _enum(cmds[i]);
                                }
                            }
                        }
                    }
                }
            }
        }

        _enum(obj);
        return counter;
    }

})();
