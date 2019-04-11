
// Abandoned - use VirtualDropDown in multiselect mode instead.


/* MultiSelectDropDown - select multiple items by clicking the checkbox */
/*CLASS*/
function MultiSelectDropDownControl() {
    LookupRepeater.apply(this, arguments);
};
MultiSelectDropDownControl.Inherit(LookupRepeater, "MultiSelectDropDownControl");
MultiSelectDropDownControl.Implement(IUIControl);
MultiSelectDropDownControl.prototype.get_selecteditems = function () {
    return this.selecteditems;
};
MultiSelectDropDownControl.prototype.set_selecteditems = function (arrItems) {
    if (!IsNull(arrItems) && BaseObject.is(arrItems, "Array")) {
        this.selecteditems = arrItems;
        var itms = this.get_items();
        if (itms.length > 0) {
            for (var i = 0; i < itms.length; i++) {
                for (var j = 0; j < arrItems.length; j++) {
                    if (arrItems[i] == itms[j]) {
                        itms[j].ischecked = true;
                    } else {
                        itms[j].ischecked = false;
                    }
                }
                if (IsNull(itms[i].ischecked)) {
                    itms[i].ischecked = false;
                }
                this.set_items(itms);
            }
        }
    }
    this.$resetUpdateTransaction();
    this.updateTargets();
    this.$resetUpdateTransaction();
};
MultiSelectDropDownControl.prototype.onItemCheck = function (e, dc) {
    this.updateSources();
    var arrItems = this.get_selecteditems();
    var i;
    if (!IsNull(dc) && !IsNull(dc.ischecked) && dc.ischecked == true) {
        if (!IsNull(arrItems) && !IsNull(arrItems.length) && arrItems.length > 0) {
            for (i = 0; i < arrItems.length; i++) {
                if (!BaseObject.Equals(dc, arrItems[i])) {
                    arrItems.addElement(dc);
                }
            }
        } else {
            arrItems.push(dc);
        }
    } else {
        if (!IsNull(arrItems) && !IsNull(arrItems.length)) {
            for (i = 0; i < arrItems.length; i++) {
                arrItems.removeElement(dc);
            }
        }
    }
};