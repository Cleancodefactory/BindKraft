(function() {

    function IGRect() {}
    IGRect.Interface("IGRect");

    IGRect.RoundBoundingRect=function(_rect){
        var rect = {};
        rect.y = rect.top = Math.round(_rect.top);
        rect.x = rect.left = Math.round(_rect.left);
        rect.bottom = Math.round(_rect.bottom);
        rect.right = Math.round(_rect.right);
        return rect;
    };

})();
