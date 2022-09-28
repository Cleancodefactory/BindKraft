(function() { 

    /**
     * Contains abstract method for manipulation of data state items can be implemented over a container to simplify management.
     * The docs below are oriented for implementation over something like an array
     * 
     * Use new InitializeInterfaceBubble to implement this over a class (see for example DoArray).
     */
    function IDataStateManipulator() {}
    IDataStateManipulator.Interface("IDataStateManipulator");
    /**
     * Removes the item or marks it for deletion
     */
    IDataStateManipulator.prototype.Delete = function(item_index) { throw "not implemented";}
    /**
     * Adds the item and sets its state to new
     */
    IDataStateManipulator.prototype.New = function(item) { throw "not implemented";}
    /**
     * Marks item as changed and optionally applies some changes supplied by item_changes argument.
     * 
     * @param {object} item_changes - optional object to combine with the current one
     */
    IDataStateManipulator.prototype.Update = function(item_index, item_changes) { throw "not implemented";}


})();