


/*CLASS*/
function SlidableArea() {
    ViewBase.apply(this, arguments);
}
SlidableArea.Inherit(ViewBase, "SlidableArea");
SlidableArea.Implement(IFreezable);
SlidableArea.prototype.scrollEnclosure = null;
SlidableArea.prototype.$init = function () {
    // Modify the DOM as we need it
    var root = $(this.root);
    var children = root.children().clone();
    root.Empty();
    this.scrollEnclosure = $('<div/>').html('<div><div></div></div>').children().clone();
    root.append(this.scrollEnclosure);
    this.scrollPlate = this.scrollEnclosure.children();
    this.scrollPlate.append(children);
    this.onSizeViewPort();
    //ViewBase.prototype.$init.call(this);
};
SlidableArea.prototype.onSizeViewPort = function () { // Calculates and configures the structure
    var root = $(this.root);
    root.css("overflow", "hidden");
    this.scrollEnclosure.css("position", "relative").css("width", root.width() + JBUtil.getScrollbarWidth()).css("height", root.height()).css("overflow-y","scroll");
    this.scrollPlate.css("height", root.height() * 3).css("width", root.width());
};
