/*
	Helper class for recent shortcuts reporting/clear etc.
*/
function CLRecentShortcuts(dir) {
	BaseObject.apply(this, arguments);
	this.$dir = dir;
}
CLRecentShortcuts.Inherit(BaseObject, "CLRecentShortcuts");
CLRecentShortcuts.MaxRecents = 10;
CLRecentShortcuts.prototype.add = function(/*ShellShotcut*/sh) {
	if (BaseObject.is(sh, ShellShotcut)) {
		var name = sh.get_name();
		if (!this.$dir.exists(name)) {
			this.$dir.register(name, sh);
			if (this.$dir.count() > CLRecentShortcuts.MaxRecents) {
				this.$clearOldest();
			}
		}
	}
}
CLRecentShortcuts.prototype.clear = function(/*ShellShotcut*/sh) {
	var file_items = this.$dir.get_files();
	for (var i = 0; i < file_items.length; i++) {
		var itm = file_items[i];
		this.$dir.unregister(itm.key);
	}
}
CLRecentShortcuts.prototype.$clearOldest = function() {
	var file_items = this.$dir.get_files();
	var oldest = null;
	if (file_items.length > 1) {
		for (var i = 0; i < file_items.length; i++) {
			var itm = file_items[i];
			if (itm != null && BaseObject.is(itm.value,"IMemoryFile")) {
				if (oldest == null) {
					oldest = itm;
				} else {
					if (itm.value.get_filedatemodified() < oldest.value.get_filedatemodified()) {
						oldest = itm;
					}					
				}
			}
		}
	}
	if (oldest != null) {
		this.$dir.unregister(oldest.key);
	}
}