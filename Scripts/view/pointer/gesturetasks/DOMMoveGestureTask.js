
(function() {

    var GestureTaskBase = Class("GestureTaskBase"),
        GestureTrap = Class("GestureTrap"),
        DragGesture = Class("DragVHGesture"),
        GRect = Class("GRect"),
        GPoint = Class("GRect");
    
    function DOMMoveGestureTask(domEl, width) {
        GestureTaskBase.apply(this, arguments);
        this.$domEl = domEl;
        this.$width = width || 5; // 5 Pixel default drag area.
    }
    DOMMoveGestureTask.Inherit(GestureTaskBase,"DOMMoveGestureTask");

    DOMMoveGestureTask.prototype.$domEl = null;
    DOMMoveGestureTask.prototype.$width = null;


    DOMMoveGestureTask.prototype.applyAt = function(pt_ot_event) {
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
                var op = new Operation();
                GestureTrap.Trap(pt, new DragGesture()).complete(op, { move: true, anchor: pt });
                return op;
            }
        } 

        return Operation.Failed("unrecognized");

    }


})();