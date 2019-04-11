function CScrollable() {
	CBase.apply(this, arguments);
}
CScrollable.inherit(CBase, "CScrollable");
CScrollable.implement(PUIControl);
CScrollable.implementProperty("direction", new IntentStringParameter("Direction - H or V - only the first letter matters","H"));
CScrollable.implementProperty("carefor", new IntentStringParameter("child elements to care for. Null for all of them.",null));
CScrollable.implementProperty("prevhandle", new IntentStringParameter("Child element for left handle (its data-key).","prevhandle"));
CScrollable.implementProperty("nexthandle", new IntentStringParameter("Child element for right handle (its data-key).","nexthandle"));
CScrollable.prototype.changedevent = new IntentEvent("Firest every time the position changes");
CScrollable.prototype.$scrollablecontainer = null; // if null this element, if string parent/chid address, if DOM element the element itself
CScrollable.prototype.get_scrollablecontainer = function() {
	if (this.$scrollablecontainer == null) return this.root;
	if (typeof this.$scrollablecontainer == "string") {
		var el = this.getRelatedElements("./" + this.$scrollablecontainer);
		if (el != null && el.length > 0) return el.get(0);
	}
	return this.$scrollablecontainer;
}.Returns("The naked element that is driven by this class. It is recommended to control element inside the DOM hierarchy of this element.")
	.Description("This property will sort out that to do depending on the what was assigned to it through the setter. See the setter for more details.");
CScrollable.prototype.set_scrollablecontainer = function(v) {
	this.$scrollablecontainer = v;
}.Returns("Sets the element that contains the tiles to move around. It can be set in 3 different ways - as string parent/child key, as element (naked) directly, or as null which means this element will be the container (this is default).")
CScrollable.prototype.init = function() {
	//
	this.on("mouseover", this.onMouseOver);
	this.on("mouseout", this.onMouseOut);
	this.on("./" + this.get_prevhandle(),"click", this.movePrev);
	this.on("./" + this.get_nexthandle(),"click", this.moveNext);
	if (window.addWheelListener) window.addWheelListener(this.root, CDelegate.createWrapper(this, this.$onMouseWheel));
}
CScrollable.prototype.get_direction = function() {
	if (this.$direction) {
		if (this.$direction.charAt(0).toUpperCase() == "V") return "V";
	}
	return "H";
}
CScrollable.prototype.get_booldirection = function() { // H is true, V is false
	return ((this.get_direction() == "V")?false:true);
}
CScrollable.prototype.$elementsToCareFor = function() {
	var els = null;
	if (this.get_carefor() != null) {
		els = $(this.get_scrollablecontainer()).children(); // We have to filter them, but how? Needs decision.
	} else {
		els = $(this.get_scrollablecontainer()).children();
	}
	if (this.get_prevhandle() != null && this.get_prevhandle().length > 0) {
		els = els.not('[data-key="' + this.get_prevhandle() + '"]');
	}
	if (this.get_nexthandle() != null && this.get_nexthandle().length > 0) {
		els = els.not('[data-key="' + this.get_nexthandle() + '"]');
	}
	return els;
}
CScrollable.prototype.$getHandles = function(which) {
	var result = $();
	var r;
	if (which == null || (which == "prev" && this.get_prevhandle() != null && this.get_prevhandle().length > 0)) {
		r = this.getRelatedElements("./" + this.get_prevhandle());
		if (r.length > 0) result.push(r.get(0));
	}
	if (which == null || (which == "next" && this.get_nexthandle() != null && this.get_nexthandle().length > 0)) {
		r = this.getRelatedElements("./" + this.get_nexthandle());
		if (r.length > 0) result.push(r.get(0));
	}
	return result;
}
CScrollable.prototype.showHideHandles = function(show) {
	var handles = this.$getHandles();
	if (show) {
		this.$recalcHandles();
		handles.show();
	} else {
		handles.hide();
	}
}
CScrollable.prototype.$recalcHandles = function() { // We will probably deprecate this
	if (this.get_booldirection()) { // Horizontal
		var width = $(this.get_scrollablecontainer()).width();
		var height = $(this.get_scrollablecontainer()).width();
		var w;
		var x = this.get_scrollablecontainer().offsetLeft;
		var y = this.get_scrollablecontainer().offsetTop;
		var h = this.$getHandles("prev");
		if (h.length > 0) {
			w = h.width();
			h = h.get(0);
			h.style.left = (x + width - $(h).width()) + "px";
			h.style.top = y + "px";
			h.style.width = w + "px";
			h.style.height = height;
		}
		h = this.$getHandles("next");
		if (h.length > 0) {
			w = h.width();
			h = h.get(0);
			h.style.left = x + "px";
			h.style.width = w + "px";
			h.style.height = height;
			h.style.top = y + "px";
		}
	} else {
	}
}
CScrollable.prototype.onMouseOver = function(e) {
	this.showHideHandles(true);
}
CScrollable.prototype.onMouseOut = function(e) {
	this.showHideHandles(false);
}
CScrollable.prototype.isRectVisible = function(rect) {
	if (this.get_booldirection()) { // Horizontal
		var curScroll = this.get_scrollablecontainer().scrollLeft;
		var width = $(this.get_scrollablecontainer()).width();
		if (rect.x - curScroll >= 0) {
			if ((rect.x + rect.w - curScroll) <= width) {
				return true;
			}
		}
		return false;
	} else {
	}
}
CScrollable.prototype.$onMouseWheel = function(e) {
	if (e != null) {
		if (e.deltaY < 0) {
			this.moveNext();
		} else {
			this.movePrev();
		}
        e.preventDefault();
    }
}
CScrollable.prototype.movePrev = function(e, dc, bind) {
	if (this.get_booldirection()) { // Horizontal
		var curScroll = this.get_scrollablecontainer().scrollLeft;
		var itemEls = this.$elementsToCareFor();
		var arrRects = [];
		var rect;
		for (var i = 0; i < itemEls.length; i++) {
			rect = new CRect(itemEls[i].offsetLeft,itemEls[i].offsetTop);
			rect.w = $(itemEls[i]).width();
			rect.h = $(itemEls[i]).height();
			arrRects.push(rect);
		}
		// var b = false;
		var firstVisible = -1;
		for (i = 0; i < arrRects.length; i++) {
			if (this.isRectVisible(arrRects[i])) {
				firstVisible = i;
				break;
			}
		}
		if (i > 0) {
			rect = arrRects[i-1];
			this.get_scrollablecontainer().scrollLeft -= (this.get_scrollablecontainer().scrollLeft - rect.x);
		}
	} else { // Vertical
	
	}
	this.$recalcHandles();
	this.changedevent.invoke(this, null);
}
CScrollable.prototype.moveNext = function(e, dc, bind) {
	if (this.get_booldirection()) { // Horizontal
		var curScroll = this.get_scrollablecontainer().scrollLeft;
		var itemEls = this.$elementsToCareFor();
		var width = $(this.get_scrollablecontainer()).width();
		var arrRects = [];
		var rect;
		for (var i = 0; i < itemEls.length; i++) {
			rect = new CRect(itemEls[i].offsetLeft,itemEls[i].offsetTop);
			rect.w = $(itemEls[i]).width();
			rect.h = $(itemEls[i]).height();
			arrRects.push(rect);
		}
		// var b = false;
		var firstVisible = -1;
		for (i = arrRects.length - 1; i >= 0; i--) {
			if (this.isRectVisible(arrRects[i])) {
				firstVisible = i;
				break;
			}
		}
		if (i < arrRects.length - 1) {
			rect = arrRects[i + 1];
			this.get_scrollablecontainer().scrollLeft += ((rect.x + rect.w) - (this.get_scrollablecontainer().scrollLeft + width));
		}
	} else { // Vertical
	}
	this.$recalcHandles();
	this.changedevent.invoke(this, null);
}
CScrollable.prototype.get_prevactive = function() {
	if (this.get_booldirection()) { // Horizontal
		var i;
		var itemEls = this.$elementsToCareFor();
		var rect;
		var firstVisible = -1;
		for (i = 0; i < itemEls.length; i++) {
			rect = new CRect(itemEls[i].offsetLeft,itemEls[i].offsetTop);
			rect.w = $(itemEls[i]).width();
			rect.h = $(itemEls[i]).height();
			if (this.isRectVisible(rect)) {
				firstVisible = i;
				break;
			}
		}
		if (firstVisible > 0) return true;
	} else { // Vertical
	}
	return false;
}.Description("Returns true if there are prev elements partialy or fully invisible");
CScrollable.prototype.get_nextactive = function() {
	if (this.get_booldirection()) { // Horizontal
		var i;
		var itemEls = this.$elementsToCareFor();
		var rect;
		var firstVisible = itemEls.length;
		for (i = itemEls.length - 1; i >= 0; i--) {
			rect = new CRect(itemEls[i].offsetLeft,itemEls[i].offsetTop);
			rect.w = $(itemEls[i]).width();
			rect.h = $(itemEls[i]).height();
			if (this.isRectVisible(rect)) {
				firstVisible = i;
				break;
			}
		}
		if (firstVisible < (itemEls.length - 1)) return true;
	} else { // Vertical
	}
	return false;
}.Description("Returns true if there are next elements partialy or fully invisible");
CScrollable.prototype.moveTo = function(e, dc, bind) {
	// TODO: write me ;)
	this.$recalcHandles();
	this.changedevent.invoke(this, null);
}