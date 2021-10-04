(function() {

    /** 
     * View with properties for visualization in tab sets and other containers that require more information.
     * Use ImplementEx to preserve the existing property implementations. E.g. ViewBase introduces get_caption and 
     * its implementation will be shadowed if Implement is used.
     */

    function ICaptionedView();
    ICaptionedView.Interface("ICaptionedView");

    ICaptionedView.prototype.get_caption = function() { throw "not implemented"; };
    ICaptionedView.prototype.get_icon = function() { throw "not implemented"; };
    ICaptionedView.prototype.get_iconType = function() { throw "not implemented"; };
    ICaptionedView.prototype.get_viewdescription = function() { throw "not implemented"; };

})();