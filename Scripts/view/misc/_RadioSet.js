



// ----------------------------------- RadioSet -----------------------------
/*
    <div data-class="RadioSet"
        >
        <span>button1</span>
        <span>button2</span>
        <span>button3</span>
    </div>

*/
/*CLASS*/
function RadioSet() {
    Base.apply(this, arguments);
}
RadioSet.Inherit(Base, "RadioSet");
RadioSet.Implement(IDisablable);
// Params
RadioSet.ImplementProperty("cssActive", new InitializeStringParameter("CSS class assigned to an active button", "f_rd_active"));
RadioSet.ImplementProperty("initialIndex", new InitializeNumericParameter("Initial selection", 0));

RadioSet.prototype.FILTER_CHILDS = "'span[data-exclude!=\"true\"]'";
// End Params
// Events
RadioSet.prototype.selchangedevent = new InitializeEvent("Fired when the selected radio button has changed");
// End Events
RadioSet.prototype.init = function () {
    var self = this;
    var cldrn = $(this.root).children().filter(this.FILTER_CHILDS);
    cldrn.each(function (idx) {
        $(this).bind("click",
            { handler: new Delegate(self, self.onRadioButtonClick, [idx, this]) },
            RadioSet.$domInternalHanler);
        if (self.get_initialIndex() == idx) $(this).addClass(self.get_cssActive());
    });
    this.$selectedindex = -1;
    if (this.get_initialIndex() >= 0 && this.get_initialIndex() < cldrn.length) {
        this.$selectedindex = this.get_initialIndex();
    }
}
RadioSet.$domInternalHanler = function (evnt) {
    if (evnt.data != null && evnt.data.handler != null) {
        evnt.data.handler.invoke(evnt, null);
    }
}
RadioSet.prototype.$inactivateAll = function () {
    if (this.root != null) {
        $(this.root).children().filter(this.FILTER_CHILDS).removeClass(this.get_cssActive());
    }
}
RadioSet.prototype.onRadioButtonClick = function (evnt, dc, idx, el) {
    if (this.get_disabled()) return;
    this.$inactivateAll();
    $(el).addClass(this.get_cssActive());
    this.$selectedindex = idx;
    this.selchangedevent.invoke(this, this.get_dataContext());
}
RadioSet.prototype.$selectedindex = 0;
RadioSet.prototype.get_selectedindex = function () {
    return this.$selectedindex;
}
RadioSet.prototype.set_selectedindex = function (v) {
    if (this.root != null) {
        var c = $(this.root).children().filter(this.FILTER_CHILDS);
        if (v >= 0 && v < c.length) {
            this.$selectedindex = v;
            this.$inactivateAll();
            $(c.get(v)).addClass(this.get_cssActive());
        }
    }
}
RadioSet.prototype.get_selectedelement = function () {
    if (this.root != null) {
        var c = $(this.root).children().filter(this.FILTER_CHILDS);
        if (this.$selectedindex >= 0 && this.$selectedindex < c.length) return $(c.get(this.$selectedindex));
    }
    return null;
}
