(function() {

    var GestureTaskBase = Class("GestureTaskBase"),
        GestureTrap = Class("GestureTrap"),
        DragVHGesture = Class("DragVHGesture"),
        GRect = Class("GRect"),
        GPoint = Class("GRect");
    
    function DOMSimpleResizeGestureTask(domEl, width) {
        GestureTaskBase.apply(this, arguments);
        this.$domEl = domEl;
        this.$width = width || 5; // 5 Pixel default drag area.
    }
    DOMSimpleResizeGestureTask.Inherit(GestureTaskBase,"DOMSimpleResizeGestureTask");

    DOMSimpleResizeGestureTask.prototype.$domEl = null;
    DOMSimpleResizeGestureTask.prototype.$width = null;

    DOMSimpleResizeGestureTask.prototype.$calcPlace = function(pt) { // pt in DOM element's coords
        var rect = GRect.fromDOMElementViewport(this.$domEl); // We ignore the x,y
        if (pt.x >= 0 && pt.x < this.$width) {
            return "l"
        } else if (pt.x >= rect.w - this.$width && pt.x < rect.w) {
            return "r"
        } else if (pt.y >= 0 && pt.y < this.$width) {
            return "t"
        } else if (pt.y >= rect.h - this.$width && pt.y < rect.h) {
            return "b";
        }
        return null;
    }

    DOMSimpleResizeGestureTask.prototype.applyAt = function(pt_ot_event) {
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