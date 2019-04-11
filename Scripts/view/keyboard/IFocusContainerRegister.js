


// Registration default implementation
// TODO: We should move this to implementer and clean up the interface definition. It may look unnecesary, for the functionality should fit all cases, but having a clean code at that level is important.
/*INTERFACE*/
function IFocusContainerRegister() {}
IFocusContainerRegister.Interface("IFocusContainerRegister");
IFocusContainerRegister.prototype.$FCSubordinates = new InitializeArray("Subordinates register");
IFocusContainerRegister.prototype.$FCIsRegisterSorted = false;
IFocusContainerRegister.prototype.$FCRegisterSortProc = function(a,b) {
	if (BaseObject.is(a, "IFocusContainer")) {
		if (BaseObject.is(b, "IFocusContainer")) {
			return a.get_focusindex() - b.get_focusindex();
		}
		return 1;
	} else if (BaseObject.is(b, "IFocusContainer")) {
		return -1;
	}
	return 0;
}
IFocusContainerRegister.prototype.$FCRegisterSort = function() {
	if (!this.$FCIsRegisterSorted && BaseObject.is(this.$FCSubordinates, "Array")) {
		this.$FCSubordinates.sort(this.$FCRegisterSortProc);
		this.$FCIsRegisterSorted = true;
	}
}
IFocusContainerRegister.prototype.FCRegisterSubordinate	= function(sub) {
	if (sub != null && BaseObject.is(sub, "IFocusContainer")) {
		if (!BaseObject.is(this.$FCSubordinates, "Array")) {
			this.$FCSubordinates = [];
		}
		if (this.$FCSubordinates.addElement(sub)) {
			this.$FCIsRegisterSorted = false;
			sub.set_focuscoordinator(this);
			return sub;
		}
	}
	return null;
}.Description("Registers subordinate container - it is either Base derived implementation of this Interface or a ElementBehaviorBase derived one (for simple DOM elements)")
	.Param("sub","The subordinate as framework object, it must be instantiated before the registration");
IFocusContainerRegister.prototype.FCUnregisterSubordinate	= function(sub) {
	if (BaseObject.is(this.$FCSubordinates, "Array")) {
		var r = this.$FCSubordinates.removeElement(sub);
		if (r != null) {
			if (BaseObject.is(r, "IFocusContainer")) {
				sub.set_focuscoordinator(null);
			}
			return r;
		}		
	}
	return null;
}.Description("Unregisters the subordinate. The comparison is done through the standard equals method.");
IFocusContainerRegister.prototype.FCGetSubordinate = function(anchor, which) {
	var cur_column, elset, elset2, t, n;
	if (BaseObject.is(this.$FCSubordinates, "Array")) {
		switch (which) {
			case "first":
				if (this.$FCSubordinates.length > 0) {
					return this.$FCSubordinates[0];
				}
			break;
			case "last":
				if (this.$FCSubordinates.length > 0) {
					return this.$FCSubordinates[this.$FCSubordinates.length - 1];
				}
			break;
			case "left":
				// Determine the place in our column
				if (anchor != null && BaseObject.is(this.$FCSubordinates, "Array")) {
					cur_column = anchor.get_focuscolumn();
					t = cur_column;
					// elset will contain the new column
					elset = this.$FCSubordinates.Select(function(idx, item) {
						if (item != null && item.get_focuscolumn() < cur_column) {
							if (t >= cur_column) { 
								t = item.get_focuscolumn(); 
							} else {
								if (item.get_focuscolumn() > t) {t = item.get_focuscolumn();}
							}
							return item;
						}
						return null;
					});
					if (t < cur_column && elset.length > 0) {
						elset = elset.Select(function(idx, item) {
							if (item.get_focuscolumn() == t) return item;
							return null;
						}).sort(function(a,b) { return a.get_focusindex() - b.get_focusindex();});
						elset2 = this.$FCSubordinates.Select(function(idx, item) {
							if (item.get_focuscolumn() == cur_column) return item;
							return null;
						}).sort(function(a,b) { return a.get_focusindex() - b.get_focusindex();});
						n = elset2.findElement(anchor);
						if (n >= 0) {
							if (elset.length > n) return elset[n];
							if (elset.length > 0) return elset[elset.length - 1];
						}
					}
				}
			break;
			case "right":
				// Determine the place in our column
				if (anchor != null && BaseObject.is(this.$FCSubordinates, "Array")) {
					cur_column = anchor.get_focuscolumn();
					t = cur_column;
					// elset will contain the new column
					elset = this.$FCSubordinates.Select(function(idx, item) {
						if (item != null && item.get_focuscolumn() > cur_column) {
							if (t <= cur_column) { 
								t = item.get_focuscolumn(); 
							} else {
								if (item.get_focuscolumn() < t) {t = item.get_focuscolumn();}
							}
							return item;
						}
						return null;
					});
					if (t > cur_column && elset.length > 0) {
						elset = elset.Select(function(idx, item) {
							if (item.get_focuscolumn() == t) return item;
							return null;
						}).sort(function(a,b) { return a.get_focusindex() - b.get_focusindex();});
						elset2 = this.$FCSubordinates.Select(function(idx, item) {
							if (item.get_focuscolumn() == cur_column) return item;
							return null;
						}).sort(function(a,b) { return a.get_focusindex() - b.get_focusindex();});
						n = elset2.findElement(anchor);
						if (n >= 0) {
							if (elset.length > n) return elset[n];
							if (elset.length > 0) return elset[elset.length - 1];
						}
					}
				}
			break;
			case "up":
				if (anchor != null && BaseObject.is(this.$FCSubordinates, "Array")) {
					cur_column = anchor.get_focuscolumn();
					// elset will contain the current column only
					elset = this.$FCSubordinates.Select(function(idx, item) {
						if (item != null && item.get_focuscolumn() == cur_column) {
							return item;
						}
						return null;
					}).sort(function(a,b) { return a.get_focusindex() - b.get_focusindex();});
					n = elset.findElement(anchor);
					if (n > 0) {
						return elset[n-1];
					}
				}
			break;
			case "down":
				if (anchor != null && BaseObject.is(this.$FCSubordinates, "Array")) {
					cur_column = anchor.get_focuscolumn();
					// elset will contain the current column only
					elset = this.$FCSubordinates.Select(function(idx, item) {
						if (item != null && item.get_focuscolumn() == cur_column) {
							return item;
						}
						return null;
					}).sort(function(a,b) { return a.get_focusindex() - b.get_focusindex();});
					n = elset.findElement(anchor);
					if (n < elset.length - 1) {
						return elset[n+1];
					}
				}
			break;
			case "next":
			case "prev":
				if (BaseObject.is(this.$FCSubordinates, "Array")) {
					if (!this.$FCIsRegisterSorted) this.$FCRegisterSort();
					var n = this.$FCSubordinates.findElement(anchor);
					if (n >= 0) {
						if (which == "next") {
							n++;
							if (n >= this.$FCSubordinates.length) {
								return null;
							}
						} else if (which == "prev") {
							n--;
							if (n < 0) return null;
						}
						if (n >= 0 && n < this.$FCSubordinates.length) return this.$FCSubordinates[n];
					}
				}
			break;
		}		
	}
	return null;
	
}.Description("Returns a subordinate by anchor (current) and relation (which). Implements a simple subordinate focus traversal, more complex containers should use directly the register.")
	.Param("anchor", "A subordinate - usually current or the one that loses focus")
	.Param("which","Can be 'first', 'last', number (index), 'prev','next'");
