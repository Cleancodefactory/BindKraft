



// This one is going out of fashion
/*CLASS*/
function ListBoxRepeater(el) {
    SelectableRepeater.apply(this, arguments);
    this.on("change", this.$onSelectionChanged);
}

ListBoxRepeater.Inherit(SelectableRepeater, "ListBoxRepeater");
ListBoxRepeater.prototype.applySelection = function(curIndex, prevIndex, bodyEl, headEl) {
    var el = $(this.root);
    if (el.is("select")) {
        el.get(0).selectedIndex = curIndex;
        this.$updateSelectBox();
        return true;
    }
    return false;
};
ListBoxRepeater.prototype.get_selectedindex = function() {
    var el = $(this.root);
    if (el.is("select")) {
        return el.get(0).selectedIndex;
    } else {
        return -1;
    }
};
ListBoxRepeater.prototype.set_selectedindex = function(v, bDontRaiseEvent) {
    var el = $(this.root);
    var itms = this.get_items();
    var itmsCount = (itms != null) ? itms.length : 0;
    this.$prevSelectedIndex = this.get_selectedindex();
    if (this.$prevSelectedIndex == null || this.$prevSelectedIndex < 0 || this.$prevSelectedIndex >= itmsCount) this.$prevSelectedIndex = -1;
    this.$selectedIndex = v;
    if (el.is("select")) {
        if (v == null || v < 0) {
            el.get(0).selectedIndex = this.$selectedIndex = -1;
        } else if (v >= itmsCount) {
            el.get(0).selectedIndex = this.$selectedIndex = 0;
        } else {
            el.get(0).selectedIndex = this.$selectedIndex = v;
        }
    }

    if (!bDontRaiseEvent) this.$fireSelChangedEvent();
};
ListBoxRepeater.prototype.OnRebind = function() {
    var el = $(this.root);
    if (el.is("select")) {
        el.get(0).selectedIndex = el.get(0).selectedIndex;
    }
};
ListBoxRepeater.prototype.onKeyPress = function(evnt) {
    if (evnt.which == 13 || evnt.which == 32) {
        var dc = this.get_items();
        if (dc != null && this.$selectedIndex >= 0 && this.$selectedIndex < dc.length) this.activatedevent.invoke(this, dc[this.$selectedIndex]);
        evnt.stopPropagation();
    }
    jbTrace.log("onKeyPress event (list): " + evnt.which);
};
ListBoxRepeater.prototype.$onSelectionChanged = function(evnt, dc) {
    var el = $(this.root);
    if (el.is("select")) {
        this.$selectedIndex = el.get(0).selectedIndex;
    }
    this.selchangedevent.invoke(this, this.get_selecteditem());
    this.$updateSelectBox();
};
ListBoxRepeater.prototype.$updateSelectBox = function() { // IE fix
    var old = $(this.root).css("display");
    $(this.root).css("display", "none");
    $(this.root).css("display", old);
};