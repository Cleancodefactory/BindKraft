(function(){

    var GRect = Class("GRect"),
        TrackMathBase = Class("TrackMathBase")
        GPoint = Class("GPoint");
        

function TrackRectInRect(outer, inner, anchor) {
    TrackMathBase.apply(this,arguments);
    if (BaseObject.is(outer, "IGRect")) {
        this.$outer = outer;
    } else if (outer instanceof HTMLElement) {
        this.$outer = GRect.fromDOMElementClientViewport(outer);
    }
    if (BaseObject.is(inner, "IGRect")) {
        this.$inner = inner;
    } else if (inner instanceof HTMLElement) {
        this.$outer = GRect.fromDOMElementViewport(outer);
    }
    if (BaseObject.is(anchor, "IGPoint")) {
        // Assume point is in rectangle coords
        this.$anchor = anchor;
    } else if (anchor instanceof MouseEvent) {
        // assume point is in viewport coords
        this.$anchor = new GPoint(anchor.clientX, anchor.clientY);
    }

}
TrackRectInRect.Inherit(TrackMathBase, "TrackRectInRect");
TrackRectInRect.prototype.$inner = null; // Rect
TrackRectInRect.prototype.$outer = null; // Rect
TrackRectInRect.prototype.$anchor = null; // Point

TrackRectInRect.prototype.isValid = function() {
    return (BaseObject.is(this.$inner, "GRect") &&
            BaseObject.is(this.$outer, "GRect") && 
            BaseObject.is(this.$anchor, "GPoint"));
}

TrackRectInRect.prototype.trackPoint = function(pt) {
    if (this.isValid()) {
        var possibleRect = this.$outer.mapToInsides(this.$inner,this.$anchor)
        if (possibleRect != null && possibleRect.isValid()) {
            return possibleRect.mapToInsides(pt);
        }
    }
    return null;
}

})();