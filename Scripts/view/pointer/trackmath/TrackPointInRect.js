(function () {

    var GRect = Class("GRect"),
        TrackMathBase = Class("TrackMathBase"),
        GPoint = Class("GPoint");


    function TrackPointInRect(outer) {
        TrackMathBase.apply(this, arguments);
        if (BaseObject.is(outer, "IGRect")) {
            this.$outer = outer;
        } else if (outer instanceof HTMLElement) {
            this.$outer = GRect.fromDOMElementClientViewport(outer);
        }
    }
    TrackPointInRect.Inherit(TrackMathBase, "TrackPointInRect");
    TrackPointInRect.prototype.$outer = null; // Rect

    TrackPointInRect.prototype.isValid = function () {
        return (BaseObject.is(this.$outer, "GRect"));
    }

    TrackPointInRect.prototype.trackPoint = function (pt) {
        if (this.isValid()) {
            // This can be remembered
            var pt = this.$outer.mapToInsides(pt);
            return pt.mapFromTo(null, this.$outer);
        }
        return null;
    }
})();