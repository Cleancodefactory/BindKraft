(function(){

    var GRect = Class("GRect"),
        TrackMathBase = Class("TrackMathBase"),
        GPoint = Class("GPoint");
        

/**
 * 
 * @param anchor {MouseEvent|IGPoint}   If it is IGPoint it should be in inner rectangle coordinates
 */
function TrackSizeRectInRect(outer, inner, anchor, side, width) {
    TrackMathBase.apply(this,arguments);
    if (BaseObject.is(outer, "IGRect")) {
        this.$outer = outer;
    } else if (outer instanceof HTMLElement) {
        this.$outer = GRect.fromDOMElementClientViewport(outer);
    } else if (outer == null) {
        this.$outer = new GRect(0,0,window.innerWidth, window.innerHeight);
    }
    if (BaseObject.is(inner, "IGRect")) {
        this.$inner = inner;
    } else if (inner instanceof HTMLElement) {
        this.$inner = GRect.fromDOMElementViewport(inner);
    }
    inner = this.$inner;
    
    var width = width || 5;
    this.$side = side;
    if (typeof side == "string") this.$side = side.charAt(0);
    switch (this.$side) {
        case "l":
            this.$sideRect = new GRect(inner.x, inner.y, width, inner.h);
        break;
        case "t":
            this.$sideRect = new GRect(inner.x, inner.y, inner.w, width);
        break;
        case "r":
            this.$sideRect = new GRect(inner.x + inner.w - width, inner.y, width, inner.h);
        break;
        case "b":
            this.$sideRect = new GRect(inner.x, inner.y + inner.h - width, inner.w, width);
        break;
    }
    if (BaseObject.is(anchor, "IGPoint")) {
        // Assume point is in rectangle coords
        this.$anchor = anchor.mapFromTo(this.$inner, this.$sideRect);
    } else if (anchor instanceof MouseEvent) {
        // assume point is in viewport coords
        var pt = new GPoint(anchor.clientX, anchor.clientY);
        this.$anchor = pt.mapFromTo(null, this.$sideRect);
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
            this.$side != null);
}

TrackSizeRectInRect.prototype.trackPoint = function(pt) {
    if (this.isValid()) {
        // This can be remembered
        var allowedRect = null;
        switch (this.$side) {
            case "l":
                allowedRect = new GRect(   this.$outer.x, 
                                            this.$inner.y, 
                                            this.$inner.x - this.$outer.x + this.$inner.w, 
                                            this.$inner.h);
            break;
            case "t":
                allowedRect = new GRect(   this.$inner.x, 
                                            this.$outer.y, 
                                            this.$inner.w, 
                                            this.$inner.y - this.$outer.y + this.$inner.h);
            break;
            case "r":
                allowedRect = new GRect(   this.$inner.x, 
                                            this.$inner.y,
                                            this.$outer.x + this.$outer.w - this.$inner.x,
                                            this.$inner.h);
            break;
            case "b":
                allowedRect = new GRect(   this.$inner.x,
                                            this.$inner.y,
                                            this.$inner.w,
                                            this.$outer.h + this.$outer.y - this.$inner.y);
                    
            break;

        }   
        if (allowedRect == null || !allowedRect.isValid()) return null;

        
        var anchorRect = allowedRect.innerSpaceForAnchoredRectangle(this.$sideRect,this.$anchor)
        var pt = anchorRect.mapToInsides(pt)
        pt = pt.subtract(this.$anchor);
        pt = pt.mapFromTo(null, allowedRect);
        var r = null;
        switch (this.$side) {
            case "l":
                r = new GRect(pt.x,pt.y,allowedRect.w - pt.x,allowedRect.h);
            break;
            case "t":
                r = new GRect(pt.x,pt.y,allowedRect.w,allowedRect.h - pt.y);
            break;
            case "r":
                r = new GRect(0,0,pt.x + this.$sideRect.w,allowedRect.h);
            break;
            case "b":
                r = new GRect(0,0,allowedRect.w,pt.y + this.$sideRect.h);
            break;
        }    
        
        if (r != null) {
            return r.mapFromTo(allowedRect, this.$outer);
        } else {
            return this.$inner.mapFromTo(null, this.$outer);
        }
        
    }
    return null;
}

})();