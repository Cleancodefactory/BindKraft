(function() {

    var GestureTaskBase = Class("GestureTaskBase"),
        GestureTrap = Class("GestureTrap"),
        DragVHGesture = Class("DragVHGesture"),
        GRect = Class("GRect"),
        GPoint = Class("GRect");
    
    function DOMResizeGestureTask(domEl, width) {
        GestureTaskBase.apply(this, arguments);
        this.$domEl = domEl;
        this.$width = width || 5; // 5 Pixel default drag area.
    }
    DOMResizeGestureTask.Inherit(GestureTaskBase,"DOMResizeGestureTask");

    DOMResizeGestureTask.prototype.$domEl = null;
    DOMResizeGestureTask.prototype.$width = null;

    DOMResizeGestureTask.prototype.$calcPlace = function(pt) { // pt in DOM element's coords
        var rect = GRect.fromDOMElementViewport(this.$domEl); // We ignore the x,y
        if (pt.x >= 0 && pt.x < this.$width) {
            if (pt.y >= 0 && pt.y < this.$width) return "lt"; // left top
            if (pt.y >= rect.h - this.$width && pt.y < rect.h) return "lb";
            return "l"
        } else if (pt.x >= rect.w - this.$width && pt.x < rect.w) {
            if (pt.y >= 0 && pt.y < this.$width) return "rt"; // left top
            if (pt.y >= rect.h - this.$width && pt.y < rect.h) return "rb";
            return "r"
        } else if (pt.y >= 0 && pt.y < this.$width) {
            return "t"
        } else if (pt.y >= rect.h - this.$width && pt.y < rect.h) {
            return "b";
        }
        return null;
    }
    DOMResizeGestureTask.prototype.suggestCursor = function() {
        return null;
    }
    DOMResizeGestureTask.prototype.applyAt = function(pt_ot_event) {
        var pt = null;
        if (BaseObject.is(pt_ot_event, "IGPoint")) { // Assume in DOM element's coordinates
            pt = new GPoint(pt_ot_event);
        } else if (pt_ot_event instanceof Event) {
            pt = new GPoint(pt_ot_event.clientX, pt_ot_event.clientY);
            pt = pt.mapFromToElements(null, this.$domEl);
        }

        if (pt != null) {
            var place = this.$calcPlace(pt);
            if (place != null) {
                var op = new Operation();
                switch (place) {
                    case "lt":
                    case "rb":
                        GestureTrap.Trap(pt, new DragVHGesture("nwse")).complete(op, { direction: place, anchor: pt });
                    break;
                    case "lb":
                    case "rt":
                        GestureTrap.Trap(pt, new DragVHGesture("nesw")).complete(op, { direction: place, anchor: pt });
                    break;
                    case "l":
                    case "r":
                        GestureTrap.Trap(pt, new DragVHGesture("h")).complete(op, { direction: place, anchor: pt });
                    break;
                    case "t":
                    case "b":
                        GestureTrap.Trap(pt, new DragVHGesture("v")).complete(op, { direction: place, anchor: pt });
                    break;
                    default:
                        return Operation.Failed("unrecognized");
                    break;
                }
                return op;
            }
        } 

        return Operation.Failed("unrecognized");

    }


})();