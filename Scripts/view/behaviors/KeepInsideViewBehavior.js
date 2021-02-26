(function(){

    var ElementBehaviorBase = Class("ElementBehaviorBase"),
        GRect = Class("GRect"),
        GPoint = Class("GPoint");
    

    // Hover behavour
    function KeepInsideViewBehavior(node, phase) {
        ElementBehaviorBase.apply(this, arguments);
    }
    KeepInsideViewBehavior.Inherit(ElementBehaviorBase, "KeepInsideViewBehavior")
        .ImplementProperty("container" , new InitializeStringParameter("Address of container or empty. If empty the view is the container.", null))
        .ImplementProperty("mode", new InitializeStringParameter("Valid modes move, moveandsize. Default: moveandsize", "moveandsize" ))
        .ImplementProperty("pause", new InitializeBooleanParameter("Stops the behavior temporarily", false));

    KeepInsideViewBehavior.prototype.$view = null;

    KeepInsideViewBehavior.prototype.obliterate = function() {
        if (this.__obliterated) return;
        this.$detachFromView();
        ElementBehaviorBase.prototype.obliterate.apply(this, arguments);
    }
    KeepInsideViewBehavior.prototype.$attachToView = function() {
        // onviewsizechangedevent
        var arr = this.getRelatedObjects("__view","IViewContainerInflictedChanges");
        if (arr.length > 0) {
            this.$view = arr[0];
            this.$view.onviewsizechangedevent.add(this.onViewSizeChanged);
        } else {
            this.LASTERROR("Cannot get hold on a view supporting IViewContainerInflictedChanges", "init");
        }
    }
    KeepInsideViewBehavior.prototype.$detachFromView = function() {
        if (this.$view != null) {
            this.$view.onviewsizechangedevent.remove(this.onViewSizeChanged);
            this.$view = null;
        }
    }

    KeepInsideViewBehavior.bindBehavior = function (node, behParams, phase) {
        if (phase == BehaviorPhaseEnum.bind) {
            var beh = new KeepInsideViewBehavior(node, phase);
            JBUtil.parametrize.call(beh, node, null, behParams); // JBUtil.parametrize.call(beh, behParams);
            beh.init();
            return beh;
        }
        return null;
    };

    KeepInsideViewBehavior.prototype.init = function() {
        this.$attachToView();
    }
    KeepInsideViewBehavior.prototype.$reposition = function(container) {
        var crect = GRect.fromDOMElementClient(container);
        crect.x = crect.y = 0;
        var myrect = GRect.fromDOMElementOffset(this.$target);
        if (GRect.nullOrEmpty(myrect)) return;
        var validrect = crect.mapToInsides(myrect);
        if (validrect == null) return;
        var anchor = new GPoint(0,0);
        anchor = anchor.mapFromTo(myrect, validrect);
        anchor = validrect.mapToInsides(anchor);
        if (anchor == null) return;
        myrect.set_left(anchor.x);
        myrect.set_top(anchor.y);
        myrect.toDOMElement(this.$target);
    }
    KeepInsideViewBehavior.prototype.$repositionandsize = function(container) {
        var crect = GRect.fromDOMElementClient(container);
        crect.x = crect.y = 0;
        var myrect = GRect.fromDOMElementOffset(this.$target);
        if (GRect.nullOrEmpty(myrect)) return;
        var validrect = crect.mapToInsides(myrect);
        if (validrect == null) {
            if (myrect.w > crect.w) myrect.w = crect.w;
            if (myrect.h > crect.h) myrect.h = crect.h;
            validrect = crect.mapToInsides(myrect);
            if (validrect == null) return;
        }
        var anchor = new GPoint(0,0);
        anchor = anchor.mapFromTo(myrect, validrect);
        anchor = validrect.mapToInsides(anchor);
        if (anchor == null) return;
        myrect.set_left(anchor.x);
        myrect.set_top(anchor.y);
        myrect.toDOMElement(this.$target);
    }
    KeepInsideViewBehavior.prototype.onViewSizeChanged = new InitializeMethodDelegate("handles view size changes", function() {
        if (this.get_pause() || this.$view == null) return;
        var container = this.get_container();
        
        if (typeof container == "string" && container.length > 0) {
            container = this.getRelatedElements(container);
            if (container.length > 0) {
                container = container[0];
            } else {
                container = this.$view.root;
            }
        } else {
            container = this.$view.root;
        }
        if (this.get_mode() == "move") {
            this.$reposition(container);
        } else {
            this.$repositionandsize(container);
        }
        
    });

})();