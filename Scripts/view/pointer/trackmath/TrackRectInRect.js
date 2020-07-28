function TrackRectInRect(outer, inner, anchor) {
    TrackMathBase.apply(this,arguments);
    if (BaseObject.is(outer, "Rect")) {
        this.$outer = outer;
    } else if (outer instanceof HTMLElement) {
        
    }

}
TrackRectInRect.Inherit(TrackMathBase, "TrackRectInRect");
TrackRectInRect.prototype.$inner = null; // Rect
TrackRectInRect.prototype.$outer = null; // Rect
TrackRectInRect.prototype.$anchor = null; // Point