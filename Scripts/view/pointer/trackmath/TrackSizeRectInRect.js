(function(){

    var GRect = Class("GRect"),
        TrackMathBase = Class("TrackMathBase")
        GPoint = Class("GPoint");
        

function TrackSizeRectInRect(outer, inner, anchor, side, width) {
    TrackMathBase.apply(this,arguments);
    if (BaseObject.is(outer, "IGRect")) {
        this.$outer = outer;
    } else if (outer instanceof HTMLElement) {
        this.$outer = GRect.fromDOMElementClientViewport(outer);
    }
    if (BaseObject.is(inner, "IGRect")) {
        this.$inner = inner;
    } else if (inner instanceof HTMLElement) {
        this.$inner = GRect.fromDOMElementViewport(inner);
    }
    inner = this.$inner;
    if (BaseObject.is(anchor, "IGPoint")) {
        // Assume point is in rectangle coords
        this.$anchor = anchor;
    } else if (anchor instanceof MouseEvent) {
        // assume point is in viewport coords
        var pt = new GPoint(anchor.clientX, anchor.clientY);
        this.$anchor = pt.mapFromTo(null, this.$inner);
    }
    var width = width || 5;
    this.$side = side;
    switch (side) {
        case "left":
            this.$sideRect = new GRect(inner.x, inner.y, width, inner.h);
        break;
        case "top":
            this.$sideRect = new GRect(inner.x, inner.y, inner.w, width);
        break;
        case "right":
            this.$sideRect = new GRect(inner.x + inner.w - width, inner.y, width, inner.h);
        break;
        case "bottom":
            this.$sideRect = new GRect(inner.x, inner.y + inner.h - width, inner.w, width);
        break;

    }

}
TrackSizeRectInRect.Inherit(TrackMathBase, "TrackSizeRectInRect");


TrackSizeRectInRect.prototype.$outer = null; // Rect
TrackSizeRectInRect.prototype.$anchor = null; // Point
TrackSizeRectInRect.prototype.$sideRect = null;
TrackSizeRectInRect.prototype.$side = null;

TrackSizeRectInRect.prototype.isValid = function() {
    return (BaseObject.is(this.$sideRect, "GRect") &&
            BaseObject.is(this.$outer, "GRect") && 
            BaseObject.is(this.$anchor, "GPoint") &&
            this.side != null);
}

TrackSizeRectInRect.prototype.trackPoint = function(pt) {
    if (this.isValid()) {
        // This can be remembered
        var possibleRect = null;
        switch (this.$side) {
            case "left":
                possibleRect = new GRect(   this.$outer.x, 
                                            this.$inner.y, 
                                            this.$inner.x - this.$outer.x + this.$inner.w - this.$sideRect.w, 
                                            this.$inner.h);
            break;
            case "top":
                possibleRect = new GRect(   this.$inner.x, 
                                            this.$outer.y, 
                                            this.$inner.w, 
                                            this.$inner.y - this.$outer.y + this.$inner.h - this.$sideRect.h);
            break;
            case "right":
                possibleRect = new GRect(   this.$inner.x, 
                                            this.$inner.y, 
                    this.$inner.x - this.$outer.x + this.$inner.w - this.$sideRect.w, 
                    this.$inner.h);
                this.$sideRect = new GRect(inner.x + inner.w - width, inner.y, width, inner.h);
            break;
            case "bottom":
                this.$sideRect = new GRect(inner.x, inner.y + inner.h - width, inner.w, width);
            break;

    }
        }



        var possibleRect = this.$outer.mapToInsides(this.$inner,this.$anchor)
        if (possibleRect != null && possibleRect.isValid()) {
            var pt = possibleRect.mapToInsides(pt);
            pt = pt.subtract(this.$anchor);
            return pt.mapFromTo(null, this.$outer);
        }
    }
    return null;
}

})();