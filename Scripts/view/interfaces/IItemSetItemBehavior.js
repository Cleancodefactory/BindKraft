


// Helps to standardize behavior requirements of items in all kinds of lists. Can be extended to cover more concepts in future.
// Will the particular list honor the behavior indicated depends on its Implementation.
function IItemSetItemBehavior() {}
IItemSetItemBehavior.Interface("IItemSetItemBehavior");
IItemSetItemBehavior.RequiredTypes("Base");
IItemSetItemBehavior.ImplementProperty("disable", new InitializeBooleanParameter("Is the item disabled", false), null, "$onItemDisableChanged");
IItemSetItemBehavior.prototype.disable_changed = new InitializeEvent("Fired when the disable property changes. Args: sender (this), item (item data)");
IItemSetItemBehavior.prototype.$onItemDisableChanged = function(oldval ,newval) {
	var dc = this.get_data();
	this.OnDisableChanged(dc);
	this.disable_changed.invoke(this, dc);
}
IItemSetItemBehavior.prototype.OnDisableChanged = function() {
	// By default empty
}.Description("This is emtpy method in IItemSetItemBehavior, but can be implemented to change the visual representation of the item. In general one should choose between handing the disable_changed and doing the change from outside or implementing this here. Combining both methods is probably not a very good idea.");