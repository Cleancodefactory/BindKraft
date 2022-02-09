(function() {

    /**
     * See the general considerations discussion in IExposeCommands. Everything that apply to get_commands applies also to each area.
     */
    function IExposeCommandsEx() {}
    IExposeCommandsEx.Interface("IExposeCommandsEx", "IExposeCommands");
    /**
     * Must return an object with fields containing the areas as arrays.
     * example usage 
     * ... data-class="Repeater" data-bind-$items="{read source=X path=$commandareas.area1}" ...
     * 
     * The type of the items in the arrays are not enforced, but they are usually menu slots or something that can play similar role.
     */
    IExposeCommandsEx.prototype.get_commandareas = function() { throw "not implemented";}
    
})();
