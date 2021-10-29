/*CLASS*/
function ScrollableArea() {
    Base.apply(this, arguments);
}
ScrollableArea.Inherit(Base, "ScrollableArea");
ScrollableArea.Implement(IFreezable);
//ScrollableArea.Implement(ITemplateSourceImpl);
ScrollableArea.Implement(InterfaceImplementer("IAmbientDefaultsConsumerImpl"));
ScrollableArea.Implement(ITemplateSourceImpl, new Defaults("templateName", "bindkraft/control-scrollablearea"));
ScrollableArea.$defaults = {
	templateName: "bindkraft/control-scrollablearea"
};


ScrollableArea.prototype.$scroller = null;
ScrollableArea.ImplementProperty("dataarea", new InitializeObject("When bound to data area this object will command it."));
ScrollableArea.ImplementProperty("cssclass", new InitializeStringParameter("The class of the scroller, the insides should be styled as contained elements: up, down and pos", "scroller"));
ScrollableArea.ImplementProperty("width", new InitializeNumericParameter("Width of the scoller", 18));
//ScrollableArea.prototype.$arrowsize = 16;
//ScrollableArea.prototype.get_arrowsize = function () {
//    return this.$arrowsize;
//}
//ScrollableArea.prototype.set_arrowsize = function (v) {
//    this.$arrowsize = v;
//    this.sizeScroller();
//}
ScrollableArea.ImplementProperty("arrowsize", new InitializeNumericParameter("Height of arrows", 16), null, "sizeScroller");
ScrollableArea.ImplementProperty("minvalue", new InitializeNumericParameter("Minmum value", 0), null, "sizeScroller");
ScrollableArea.ImplementProperty("maxvalue", new InitializeNumericParameter("Maximum value", 100), null, "sizeScroller");
ScrollableArea.ImplementProperty("smallmove", new InitializeNumericParameter("A size of the small step", 1));
ScrollableArea.ImplementProperty("bigmove", new InitializeNumericParameter("A size of the big step", 10));
ScrollableArea.ImplementProperty("posoffset", new InitializeNumericParameter("Pos offset", 30), null, "sizeScroller");
ScrollableArea.ImplementProperty("poslimit", new InitializeNumericParameter("Pos limit", 10), null, "sizeScroller");
ScrollableArea.ImplementProperty("autocorrect", new InitializeBooleanParameter("Pos limit", true));
ScrollableArea.prototype.poschangedevent = new InitializeEvent("Fired when the position is changed");
// ScrollableArea.scrollerTemplate = "<div class=\"\"><div data-key=\"scroller_up\"></div><div data-key=\"scroller_pos\"></div><div data-key=\"scroller_down\"></div>";
ScrollableArea.prototype.$isinitialized = false;

ScrollableArea.prototype.init = function () {
	this.$scroller = $(this.get_template()); //$('<div/>').html("<div class=\"" + this.get_cssclass() + "\"><div class=\"up\" data-key=\"scroller_up\"><a tabindex=\"-1\" style=\"display:block;width:100%;height:100%;\"></a></div><div class=\"pos\" data-key=\"scroller_pos\"><a tabindex=\"-1\" style=\"display:block;width:100%;height:100%;\"></a></div><div class=\"down\" data-key=\"scroller_down\"><a tabindex=\"-1\" style=\"display:block;width:100%;height:100%;\"></a></div></div>").children().clone();
    var root = $(this.root);
    root.append(this.$scroller);
    this.$scrollerUp = $(this.$scroller.children()[0])
    this.$scrollerPos = $(this.$scroller.children()[1])
    this.$scrollerDown = $(this.$scroller.children()[2])
    this.$scrollerAnchor = $(this.$scrollerPos.children()[0])
    var self = this;
    this.$scrollerPos.draggable({
        disabled: false,
        appendTo: this.$scroller,
        axis: "y",
        containment: "parent",
        cursor: "e-resize",
        distance: 3,
        iframeFix: false,
        scroll: false,
        zIndex: 10000,
        start: Delegate.createWrapper(this, this.$posDragHandlers.begin),
        drag: Delegate.createWrapper(this, this.$posDragHandlers.drag),
        stop: Delegate.createWrapper(this, this.$posDragHandlers.end)
    });
    this.$scrollerUp.click(Delegate.createWrapper(this, this.upOneStep));
    this.$scrollerDown.click(Delegate.createWrapper(this, this.downOneStep));
    this.$scroller.click(Delegate.createWrapper(this, this.$insideClick));
    //this.$scrollerAnchor.keydown(Delegate.createWrapper(this, this.$anchorKeyEvent));
    root.keydown(Delegate.createWrapper(this, this.$anchorKeyEvent));
    this.$scrollerPos.click(this.$swallow);
    if (window.addWheelListener) window.addWheelListener(this.root, Delegate.createWrapper(this, this.$onMouseWheel));

    var xpos = root.css("position");
    if (xpos != "relative" && xpos != "absolute" && xpos != "fixed") {
        root.css("position", "relative"); // Enforce that if the developer forgot it.
    }
    this.$isinitialized = true;
    this.freezeEvents(this, function () {
        this.sizeScroller();
    });
}
ScrollableArea.prototype.$posDragHandlers = {
    begin: function (e, ui) {

    },
    drag: function (e, ui) {
        var p = this.$scrollerPos.position();
        if (p != null) this.relativeMove(p.top, this.$scrollerPos.height());
    },
    end: function (e, ui) {
        var p = this.$scrollerPos.position();
        if (p != null) this.relativeMove(p.top, this.$scrollerPos.height());
    }
};
ScrollableArea.prototype.$swallow = function (e) {
    if (e != null) e.stopPropagation();
}
ScrollableArea.prototype.$onMouseWheel = function (e) {
    if (e != null) {
        this.moveSteps(-((e.deltaY < 0)?-3:3));
        if (e != null) e.preventDefault();
    }
}
ScrollableArea.prototype.processKey = function(e) {
	if (e.which == 40) { // down
		this.downOneStep(e);
		return true;
	} else if (e.which == 38) { //up
		this.upOneStep(e);
		return true;
	} else if (e.which == 33) { // big up
		this.upOneBigStep(e);
		return true;
	} else if (e.which == 34) { // pgdown
		this.downOneBigStep(e);
		return true;
	}
	return false;
}
ScrollableArea.prototype.$anchorKeyEvent = function (e) {
    if (e != null) {
        if (this.processKey(e)) e.stopPropagation();
    }
}
ScrollableArea.prototype.moveSteps = function (steps) {
    var offset = this.get_posoffset() - this.get_smallmove() * steps;
    if (offset > this.get_maxvalue() - this.get_poslimit()) {
        offset = this.get_maxvalue() - this.get_poslimit();
    }
    if (offset < this.get_minvalue()) {
        offset = this.get_minvalue();
    }
    this.set_posoffset(offset);
}
ScrollableArea.prototype.upOneStep = function (e) {
    var offset = this.get_posoffset() - this.get_smallmove();
    if (offset < this.get_minvalue()) offset = this.get_minvalue();
    this.set_posoffset(offset);
    if (e != null) e.stopPropagation();
}
ScrollableArea.prototype.upOneBigStep = function (e) {
    var offset = this.get_posoffset() - this.get_bigmove();
    if (offset < this.get_minvalue()) offset = this.get_minvalue();
    this.set_posoffset(offset);
    if (e != null) e.stopPropagation();
}
ScrollableArea.prototype.downOneStep = function (e) {
    var offset = this.get_posoffset() + this.get_smallmove();
    if (offset > this.get_maxvalue() - this.get_poslimit()) offset = this.get_maxvalue() - this.get_poslimit();
    this.set_posoffset(offset);
    if (e != null) e.stopPropagation();
};
ScrollableArea.prototype.downOneBigStep = function (e) {
    var offset = this.get_posoffset() + this.get_bigmove();
    if (offset > this.get_maxvalue() - this.get_poslimit()) offset = this.get_maxvalue() - this.get_poslimit();
    this.set_posoffset(offset);
    if (e != null) e.stopPropagation();
};
ScrollableArea.prototype.relativeMove = function (y, h) {
    if (y != null) {
        if (h != null) {
            var x = y - this.get_arrowsize();
            x = this.get_minvalue() + (this.get_maxvalue() - this.get_minvalue() - this.get_poslimit()) * x / (this.$scroller.height() - (2 * this.get_arrowsize()) - h);
            var offset = x;
            if (offset < this.get_minvalue()) offset = this.get_minvalue();
            if (offset + this.get_poslimit() > this.get_maxvalue()) {
                if (this.get_maxvalue() - this.get_poslimit() > this.get_minvalue()) {
                    offset = this.get_maxvalue() - this.get_poslimit();
                } else {
                    offset = this.get_minvalue();
                }
            }
            this.$posoffset = offset;
            this.sizeScroller();
        } else {
            var x = y - this.get_arrowsize();
            x = this.get_minvalue() + (this.get_maxvalue() - this.get_minvalue()) * x / (this.$scroller.height() - (2 * this.get_arrowsize()));
            var offset = x; // -(this.get_poslimit() / 2);
            if (offset < this.get_minvalue()) offset = this.get_minvalue();
            if (offset + this.get_poslimit() > this.get_maxvalue()) {
                if (this.get_maxvalue() - this.get_poslimit() > this.get_minvalue()) {
                    offset = this.get_maxvalue() - this.get_poslimit();
                } else {
                    offset = this.get_minvalue();
                }
            }
            this.$posoffset = offset;
            this.sizeScroller();
        }
        //this.set_posoffset(offset);
    }
};
ScrollableArea.prototype.$insideClick = function (e) {
    this.relativeMove(e.offsetY);
    e.stopPropagation();
};
ScrollableArea.prototype.sizeScroller = function (e) {
    if (!this.$isinitialized) return;
    this.$scroller.css("width", this.get_width()).css("position", "absolute").css("height", "100%").css("top", 0).css("right", 0);
    this.$scrollerUp.css("position", "absolute").css("top", 0).css("left", 0).css("width", this.get_width()).css("height", this.get_arrowsize());
    this.$scrollerDown.css("position", "absolute").css("bottom", 0).css("left", 0).css("width", this.get_width()).css("height", this.get_arrowsize());
    this.$scrollerPos.css("position", "absolute").css("width", this.get_width());
    this.adjustPos();
};
ScrollableArea.prototype.adjustPos = function () {
    if (!this.$isinitialized) return;
    var offset = this.get_posoffset();
    if (offset > this.get_maxvalue() - this.get_poslimit()) offset = this.get_maxvalue() - this.get_poslimit();
    if (offset < this.get_minvalue()) offset = this.get_minvalue();
    this.$posoffset = offset;
    var bHidden = false;
    if (this.$forceHideScrollbar || (this.get_maxvalue() < this.get_minvalue()) || (this.get_poslimit() >= (this.get_maxvalue() - this.get_minvalue()))) {
        this.$scroller.hide();
        bHidden = true;
    } else {
        this.$scroller.show();
    }

    if (!bHidden) { // no need to do anything if the scrollbar is invisible
        var vrange = $(this.root).height() - (this.get_arrowsize() * 2);

        var prange = this.get_maxvalue() - this.get_minvalue() - this.get_poslimit();
        var pstart = (this.get_posoffset() - this.get_minvalue()) / prange;
        var pheight = this.get_poslimit() / (this.get_maxvalue() - this.get_minvalue());

        var prealheight = pheight * vrange;

        if (prealheight < this.get_arrowsize()) prealheight = this.get_arrowsize();
        var uirange = $(this.root).height() - (this.get_arrowsize() * 2) - prealheight;

        this.$scrollerPos.css("top", (pstart * uirange) + this.get_arrowsize()).css("height", prealheight);
    }

    this.poschangedevent.invoke(this, { pos: this.get_posoffset(), limit: this.get_poslimit() });
    if (!this.areEventsFrozen()) {
        var da = this.get_dataarea();
        if (da != null) {
            da.gotoOffset(this.get_posoffset());
        }
    }
};
ScrollableArea.prototype.onDataAreaInit = function(e,dc,binding,param) {
}.Description("");
ScrollableArea.prototype.$initializedDataArea = null;
ScrollableArea.prototype.onDataAreaChange = function (sender, dc) {
    if (this.get_dataarea() != null) {
        var da = this.get_dataarea();
		if (this.$initializedDataArea == null || this.$initializedDataArea != da) {
			this.$initializedDataArea = da;
			this.callAsync(function() {da.loadContent();});
			return;
		}
        if (da.get_iscountdirty()) {
            da.loadCountIfDirty();
            return;
        }
        var _min = 1, _max = da.get_count();
        // We do this to avoid mixing up the autocorrect
        if (_min > _max) {
            this.$forceHideScrollbar = true;
        } else {
            this.$forceHideScrollbar = false;
        }
        if (!da.get_iscountdirty() && _min <= _max) {
            if (!this.areEventsFrozen()) {
                this.freezeEvents(this, function () {
                    this.set_minvalue(_min);
                    this.set_maxvalue(_max + 1);
                    this.set_poslimit(da.get_limit());
                    this.set_posoffset(da.get_offset());
                    // we are frozen - no update is made to the dataarea so...
                    if (this.get_autocorrect() && this.get_posoffset() != da.get_offset()) {
                        da.gotoOffset(this.get_posoffset());
                    }
                });
            }
            //$(this.root).show();
            //        } else if (_max == null || da.get_iscountdirty()) {
            //            da.loadCount();
        } else {
            //$(this.root).hide();
            this.sizeScroller();
        }
    }
}