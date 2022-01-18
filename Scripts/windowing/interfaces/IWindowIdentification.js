(function(){

    function IWindowIdentification() {}
    IWindowIdentification.Interface("IWindowIdentification");
    IWindowIdentification.RequiredTypes("BaseWindow");

    /**
     * Management name of the window
     * @return {string} the name
     */
    IWindowIdentification.prototype.get_windowName = function() { throw "not implemented";}

    /**
     * Searches for a child window named as windowName specified
     * @param {string} windowName - the name of the child being searched
     * @param {boolean} recursive - If true - search recursively the children of children ...
     * @return {BaseWindow|null} the found window or null otherwise
     */
    IWindowIdentification.prototype.findChildByName = function(windowName, /*optional*/ recursive) { throw "not implemented";}
    /**
     * Searches for a children windows matching one of the windowName arguments
     * @param {string} ...windowName - One or more string arguments, specifying the names of child windows to find
     * @param {boolean} recursive - If true - search recursively the children of children ...
     * @return {Array<BaseWindow>} the found windows as an array of BaseWindows. The array will be empty if no child windows are found.
     */
    IWindowIdentification.prototype.findChildrenByName = function(windowName, windowName2 /* etc. */, /*optional*/ recursive) { throw "not implemented";}

    // TODO: should this fail if the whole chain cannot be found.
    /**
     * Finds the child window specified by the first arg, then its child window speciofied by second argument and so on ...
     * @param {string} ...windowName - the names of the windows in the searched chain.
     * @return {Array<BaseWindow>|null} - an array containing the references to all the windows found in the order they were specified
     * 
     * Returns null if the entire chain cannot be found.
     */
    IWindowIdentification.prototype.findChildrenChain = function(windwoName, windowName2) { throw "not implemented";}

})();