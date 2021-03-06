(function() {

    var ElementBehaviorBase = Class("ElementBehaviorBase"),
        DOMSimpleResizeGestureTask = Class("DOMSimpleResizeGestureTask"),
        DOMMoveGestureTask = Class("DOMMoveGestureTask"),
        TrackSizeRectInRect = Class("TrackSizeRectInRect"),
        TrackPointer = Class("TrackPointer"),
        AggregateGestureTask = Class("AggregateGestureTask"),
        TrackRectInRect = Class("TrackRectInRect"),
        PointerCursor = Class("PointerCursor");

// Hover behavour
function DragSizeBehavior(node, phase) {
    ElementBehaviorBase.apply(this, arguments);
}
DragSizeBehavior.Inherit(ElementBehaviorBase, "DragSizeBehavior");
DragSizeBehavior.bindBehavior = function (node, behParams, phase) {
    if (phase == BehaviorPhaseEnum.bind) {
        var beh = new DragSizeBehavior(node, phase);
        JBUtil.parametrize.call(beh, node, null, behParams); // JBUtil.parametrize.call(beh, behParams);
        beh.init();
		return beh;
    }
	return null;
};
DragSizeBehavior.ImplementProperty("resizeWidth", new InitializeNumericParameter("", 15));
DragSizeBehavior.ImplementProperty("dragWidth", new InitializeNumericParameter("", 15));
DragSizeBehavior.ImplementProperty("drag", new InitializeNumericParameter("", true));
DragSizeBehavior.ImplementProperty("size", new InitializeNumericParameter("", true));
DragSizeBehavior.prototype.$dragDetectTask = null;
DragSizeBehavior.prototype.$doing = false;
DragSizeBehavior.prototype.init = function () {
    
    var t = this;
    if (this.get_drag() && this.get_size()) {
        this.$dragDetectTask = new AggregateGestureTask(
                new DOMSimpleResizeGestureTask(this.$target, this.get_resizeWidth()),
                new DOMMoveGestureTask(this.$target, this.get_dragWidth()));
    } else if (this.get_drag()) {
        this.$dragDetectTask = new AggregateGestureTask(
            new DOMMoveGestureTask(this.$target, this.get_dragWidth())
            );
    } else if (this.get_size()) {
        this.$dragDetectTask = new AggregateGestureTask(
            new DOMSimpleResizeGestureTask(this.$target, this.get_resizeWidth())
            );
    }
    //this.$target.addEventListener("mousedown", Delegate.createWrapper(this, this.onDragDo));
    //this.$target.addEventListener("mousemove", Delegate.createWrapper(this, this.onDragCursor));
    this.on("pointerdown", this.onDragDo);
    this.on("pointermove", this.onDragCursor);
};
DragSizeBehavior.prototype.onDragDo = function(e, dc) {
    if (this.$dragDetectTask == null) return;
    var el = this.$target;
    var me = this;
    var _parent = el.offsetParent;
    if (_parent == null) _parent = document;
    this.$dragDetectTask.applyAt(e.originalEvent).onsuccess(
        function(r) {
            if (r.move) {
                me.$doing = true;
                TrackPointer.Track(
                    e.originalEvent,
                    function(op, pt)  {
                        if (pt != null) {
                            el.style.left = pt.x + "px";
                            el.style.top = pt.y + "px";
                            el.style.right = null;
                            el.style.bottom = null;
                        }
                    }            
                    ,new TrackRectInRect(_parent, el, e.originalEvent),
                    (new PointerCursor("grabbing")).defaultElement(me.$target)
                ).then(function() {
                    me.$doing = false;
                });
            } else if (r.direction != null) {
                me.$doing = true;
                TrackPointer.Track(e.originalEvent,
                    function(op, rect) {
                        if (rect != null) {
                            rect.toDOMElement(el);
                        }
                    },
                    new TrackSizeRectInRect(_parent,el, e.originalEvent,r.direction, me.get_resizeWidth())).then(function() {me.$doing = false;}); 
            }
        }
       
    );
}
DragSizeBehavior.prototype.onDragCursor = function(e, dc) {
    if (this.$dragDetectTask != null && !this.$doing) {
        this.$dragDetectTask.cursorAt(e.originalEvent, this.$target);
    }
}

})();