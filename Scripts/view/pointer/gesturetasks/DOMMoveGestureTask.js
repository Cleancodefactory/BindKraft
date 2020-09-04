
(function() {

    var GestureTaskBase = Class("GestureTaskBase"),
        GestureTrap = Class("GestureTrap"),
        DragGesture = Class("DragGesture"),
        GRect = Class("GRect"),
        GPoint = Class("GRect"),
        PointerCursor = Class("PointerCursor");
    
    function DOMMoveGestureTask(domEl, width, cursor) {
        GestureTaskBase.apply(this, arguments);
        this.$domEl = domEl;
        this.$width = width || 5; // 5 Pixel default drag area.
        if (BaseObject.is(cursor,"PointerCursor")) {
            this.$cursor = cursor;
        }
        
    }
    DOMMoveGestureTask.Inherit(GestureTaskBase,"DOMMoveGestureTask");

    DOMMoveGestureTask.prototype.$domEl = null;
    DOMMoveGestureTask.prototype.$width = null;
    DOMMoveGestureTask.prototype.$cursor = null;

    DOMMoveGestureTask.prototype.$checkPlace = function(pt_ot_event) {
        var pt = null;
        if (BaseObject.is(pt_ot_event, "IGPoint")) { // Assume in DOM element's coordinates
            pt = new GPoint(pt_ot_event);
        } else if (pt_ot_event instanceof Event) {
            pt = new GPoint(pt_ot_event.clientX, pt_ot_event.clientY);
            pt = pt.mapFromToElements(null, this.$domEl);
        }

        if (pt != null) {
            var rect = GRect.fromDOMElementViewport(this.$domEl);
            if (pt.x > this.$width && pt.x < rect.w - this.$width && pt.y > this.$width && pt.y < rect.h - this.$width) {
                return pt;
            }
        } 
        return null;
    }

    DOMMoveGestureTask.prototype.suggestCursor = function(pt_or_event) {
        var pt = this.$checkPlace(pt_or_event);
        if (pt != null) {
            if (this.$cursor != null) return this.$cursor;
            return PointerCursor.Move();
        }
    }
    DOMMoveGestureTask.prototype.applyAt = function(pt_or_event) {
        var pt = this.$checkPlace(pt_or_event);
        if (pt != null) {
            var op = new Operation();
            GestureTrap.Trap(pt_or_event, new DragGesture()).complete(op, { move: true, anchor: pt });
            return op;
        }
        return Operation.Failed("unrecognized");
    }


})();