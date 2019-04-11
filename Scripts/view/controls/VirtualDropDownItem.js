


// Helper item data-class for custom templetes.
// Not needed in typical usage of VirtualDropDownControl, only when a custom item template is supplied and then only if full control over the item behavior is a must.
function VirtualDropDownItemControl() {
	Base.apply(this, arguments);
}
VirtualDropDownItemControl.Inherit(Base, "VirtualDropDownItemControl");
VirtualDropDownItemControl.Implement(IItemSetItemBehavior);
VirtualDropDownItemControl.prototype.get_dropdown = function() {
	var el = this.getRelatedElements("__control");
	if (el != null && el.length > 0) {
		return el.activeclass();
	}
	return null;
}
VirtualDropDownItemControl.prototype.SelectItem = function() {
	var dd = this.get_dropdown();
	dd.selectItem(this.get_data().item);
}
VirtualDropDownItemControl.prototype.UnselectItem = function() {
	var dd = this.get_dropdown();
	dd.unselectItem(this.get_data().item);
}
VirtualDropDownItemControl.prototype.ToggleItem = function() {
	var dd = this.get_dropdown();
	var item = this.get_data().item;
	dd.selectItem(item,dd.IsItemSelected(item));
}