


/*INTERFACE*/
function IDragContainer() {
}
IDragContainer.Interface("IDragContainer");
IDragContainer.RequiredTypes("Base");
IDragContainer.ImplementProperty("dragprojection", new InitializeStringParameter("The data-key of the drag projection element/helper element. Default: dragprojection", "dragprojection"));
IDragContainer.prototype.get_dragProjectionElement = function () {
    var el = this.child(this.get_dragprojection());
    if (el != null && el.length > 0) return el.get(0);
    return null;
}