


// Selectable repeater
/*
Should work only with arrays
*/

function SelectableRepeater() {
    Repeater.apply(this, arguments);
    this.findItem = null;
    var el = $(this.root);
    var localThis = this;
    el.keydown(function(evnt) { 
        //localThis.onKeyPress(evnt, null); 
        localThis.onKeyInput(evnt, null);
        evnt.stopPropagation(); 
    });
    //this.selchangedevent = new EventDispatcher(this);
    //this.activatedevent = new EventDispatcher(this);
    this.$bodyVisible = true;
    this.$headerVisible = true;
}

SelectableRepeater.Inherit(Repeater, "SelectableRepeater");
SelectableRepeater.Implement(IKeyboardHandler);
SelectableRepeater.Implement(InterfaceImplementer("IKeyboardProcessorImpl"));
SelectableRepeater.Implement(IDisplayDataSupplierImpl);
SelectableRepeater.prototype.obliterate = function() {
    Repeater.prototype.obliterate.call(this);
};
SelectableRepeater.prototype.selchangedevent = new InitializeEvent("Fires when the selection changes.");
SelectableRepeater.prototype.activatedevent = new InitializeEvent("Fires when an item is activated.");
SelectableRepeater.prototype.orderchangedevent = new InitializeEvent("Fires when the selected items are reordered.");

SelectableRepeater.prototype.identification = new InitializeStringParameter("How to compare/identify items. The default (internal) comparer supports only a porperty name and compares items by the value of that property.", null);
SelectableRepeater.prototype.nowrap = new InitializeBooleanParameter("Do not cycle through the items, instead pass the key event down the DOM if the selection is at the end", false);
SelectableRepeater.prototype.retainindex = new InitializeBooleanParameter("Attempts to retain the selected index after the items have been changed.", false);
SelectableRepeater.ImplementProperty("scrollintoview", new InitializeBooleanParameter("Try to scroll into view current item", true));

//SelectableRepeater.prototype.advancedfeatures = new InitializeBooleanParameter("Activates advanced potentially havier features.");
// identification cues for the items. The internal impl uses this as name of the id property
SelectableRepeater.prototype.selectedCssClass = new InitializeStringParameter("CSS class used to display the selected item", null);
SelectableRepeater.prototype.unselectedCssClass = new InitializeStringParameter("CSS class used to display the unselected items", null);
SelectableRepeater.prototype.doubleClickToActivate = new InitializeBooleanParameter("If true the activated event will not fire on click, but on double click", false);
SelectableRepeater.prototype.nofocus = new InitializeBooleanParameter("If set to true prevents the repeater from auto-getting the focus for its items", false);
SelectableRepeater.prototype.$headerElement = null;
SelectableRepeater.prototype.$bodyElement = null;

SelectableRepeater.prototype.$init = function() {
    // In the repeater we need to cut the innerHTML and keep it as a template for repeating items
    var el = $(this.root);
    if (this.get_itemTemplate() == null) {
        var it = this.child("itemtemplate");
        if (it != null && it.length > 0) {
            this.set_itemTemplate(it.Clean().children().clone().get(0));
            it.Empty();
            this.$bodyElement = it;
            this.$headerElement = this.child("headertemplate");
        } else {
            this.set_itemTemplate(el.Clean().children().clone().get(0));
            el.Empty();
            this.$bodyElement = el;
            this.$headerElement = $();
        }
    }
    if (this.$bodyElement == null) this.$bodyElement = el;
    if (this.$headerElement == null) this.$headerElement = $();
    this.init();
    this.initializedevent.invoke(this,null);
    this.rebind(); // Default behaviour, items controls should override this
    this.$bodyVisible = this.$bodyElement.is(":visible");
    //this.set_bodyVisible(this.$bodyVisible);
    //this.set_headerVisible(this.$headerVisible);
};
// Begin IDisplayDataSupplier
SelectableRepeater.prototype.get_displaydata = function() {
	return this.$displaydata;
}
SelectableRepeater.prototype.get_shortdisplaydata = function() {
	if (this.$displaydata != null) {
		return this.$displaydata;
	}
}
// End IDisplayDataSupplier
SelectableRepeater.prototype.get_bodyVisible = function() { return this.$bodyVisible; };
SelectableRepeater.prototype.set_bodyVisible = function(v) {
    this.$bodyVisible = v;
    if (this.$bodyElement != null) {
        if (this.$bodyVisible) {
            this.$bodyElement.show();
        } else {
            this.$bodyElement.hide();
        }
        this.updateTargets();
    }
}.Description("Gusss .... ");
SelectableRepeater.prototype.get_headerVisible = function() { return this.$headerVisible; };
SelectableRepeater.prototype.set_headerVisible = function(v) {
    this.$headerVisible = v;
    if (this.$headerElement != null) {
        if (this.$headerVisible && this.$headerElement != null) {
            this.$headerElement.show();
        } else {
            this.$headerElement.hide();
        }
        this.updateTargets();
    }
};
SelectableRepeater.prototype.showBody = function() { this.set_bodyVisible(true); };
SelectableRepeater.prototype.hideBody = function() { this.set_bodyVisible(false); };
SelectableRepeater.prototype.showHeader = function() { this.set_headerVisible(true); };
SelectableRepeater.prototype.hideHeader = function() { this.set_headerVisible(false); };
SelectableRepeater.prototype.$selectedIndex = -1;
SelectableRepeater.prototype.$previousSelectedIndex = -1;
SelectableRepeater.prototype.get_selectedindex = function() { return this.$selectedIndex; };
SelectableRepeater.prototype.set_selectedindex = function(v, bDontRaiseEvent) {
    var itms = this.get_items();
    var itmsCount = (itms != null) ? itms.length : 0;
    this.$prevSelectedIndex = this.$selectedIndex;
    if (this.$prevSelectedIndex == null || this.$prevSelectedIndex < 0 || this.$prevSelectedIndex >= itmsCount) this.$prevSelectedIndex = -1;
    this.$selectedIndex = v;
    if (this.$selectedIndex == null || this.$selectedIndex < 0) {
        this.$selectedIndex = -1;
    } else if (this.$selectedIndex >= itmsCount) {
        this.$selectedIndex = 0;
    }
    if (!bDontRaiseEvent) this.$fireSelChangedEvent();
    this.$applySelection();
};
SelectableRepeater.prototype.get_selecteditem = function() {
    var itms = this.get_items();
    var itmsCount = (itms != null) ? itms.length : 0;
    var curSelIndex = this.get_selectedindex();
    if (curSelIndex != null && curSelIndex >= 0 && curSelIndex < itmsCount) {
        return itms[curSelIndex];
    }
    return null;
};
SelectableRepeater.prototype.set_selecteditem = function(v) {
    var itms = this.get_items();
    var itmsCount = (itms != null) ? itms.length : 0;
    if (itmsCount > 0) {
        this.set_selectedindex(this.$findItemIndex(v));
    }
}.Description("Sets the selection by assigning an item.");
SelectableRepeater.prototype.$fireSelChangedEvent = function() {
    var curSelIndex = this.get_selectedindex();
    if (curSelIndex != this.$prevSelectedIndex) {
        var dc = this.get_items();
        if (dc != null && curSelIndex >= 0 && curSelIndex < dc.length) {
            this.selchangedevent.invoke(this, dc[curSelIndex]);
			this.$set_displaydata(dc[curSelIndex]);
        } else {
            this.selchangedevent.invoke(this, null);
			this.$set_displaydata(null);
        }
    }
}.Description("Gusss .... ");
SelectableRepeater.prototype.set_value = function(v) {
    var n = this.$findItem(v);
    this.set_selectedindex(n, true);
};
SelectableRepeater.prototype.get_value = function() {
    var itms = this.get_items();
    var curSelIndex = this.get_selectedindex();
    if (itms != null && itms.length > 0 && curSelIndex >= 0 && curSelIndex < itms.length) {
        var itm = itms[curSelIndex];
        if (this.identification != null && this.identification.length > 0) {
            return itm[this.identification];
        } else {
            return itm;
        }
    }
    return null;
}.Description("Gusss .... ");
SelectableRepeater.prototype.OnItemDisableEnable = function(itemInterface, itemData) {
    if (BaseObject.is(itemInterface,"Base")) {
        if (itemInterface.get_disable()) {
            $(itemInterface.root).addClass(this.itemdisabledCssClass);
        } else {
            $(itemInterface.root).removeClass(this.itemdisabledCssClass);
        }
        
    }
}

SelectableRepeater.prototype.$isElementDisabled = function(el) {
    var e = $(el);
    var ac = e.activeclass();
    if (BaseObject.is(ac,"IItemSetItemBehavior")) {
        if (ac.get_disable()) return true;
    }
    if (e!= null && e.length > 0) {
        if (e.get(0).disableitem) return true;
    }
    return false;
}
SelectableRepeater.prototype.fireActivatedEvent = function() {
    var dc = this.get_items();
    var curSelIndex = this.get_selectedindex();
    var el = this.get_selecteddomelement();
    if (!this.$isElementDisabled(el)) {
        if (dc != null && curSelIndex >= 0 && curSelIndex < dc.length) {
            this.activatedevent.invoke(this, dc[curSelIndex]);
        }
    }
}
SelectableRepeater.prototype.processKeyObject = function(keyData) {
    if (keyData == null || !keyData.__isKeyData) return true; // Prevents propagation of wrong data.
    if (keyData.key == "ArrowUp" || keyData.key == "ArrowLeft") {
        if (this.moveSelection(-1)) {
			return true;
        }
    } else if (keyData.key == "ArrowRigth" || keyData.key == "ArrowDown") {
        if (this.moveSelection(1)) {
			return true;
        }
    } else if (keyData.key == "Enter" || keyData.key == " ") {
        var dc = this.get_items();
        var curSelIndex = this.get_selectedindex();
        if (dc != null && curSelIndex >= 0 && curSelIndex < dc.length) {
            this.fireActivatedEvent();
            // this.activatedevent.invoke(this, dc[curSelIndex]);
        }
		return true;
    }
}
// legacy support
SelectableRepeater.prototype.processKeyData = function(e) { // e === kd e is keydata and not an event
	if (e == null) return false;
	if (e.which == 38 || e.which == 37) {
        if (this.moveSelection(-1)) {
			return true;
        }
    } else if (e.which == 40 || e.which == 39) {
        if (this.moveSelection(1)) {
			return true;
        }
    } else if (e.which == 13 || e.which == 32) {
        var dc = this.get_items();
        var curSelIndex = this.get_selectedindex();
        if (dc != null && curSelIndex >= 0 && curSelIndex < dc.length) {
            this.fireActivatedEvent();
            // this.activatedevent.invoke(this, dc[curSelIndex]);
        }
		return true;
    }
	return false;
}
// legacy support
SelectableRepeater.prototype.processKey = function(e) {
	return this.processKeyData(IKeyboardHandler.packKeyDataFromEvent(e,e.target));
	
}
// legacy support
SelectableRepeater.prototype.onKeyPress = function (evnt) {
	if (this.processKey(evnt)) {
		evnt.stopPropagation();
	}
    //if (evnt.which == 38 || evnt.which == 37) {
    //    if (this.moveSelection(-1)) {
    //        evnt.stopPropagation();
    //    }
    //} else if (evnt.which == 40 || evnt.which == 39) {
    //    if (this.moveSelection(1)) {
    //        evnt.stopPropagation();
    //    }
    //} else if (evnt.which == 13 || evnt.which == 32) {
    //    var dc = this.get_items();
    //    var curSelIndex = this.get_selectedindex();
    //    if (dc != null && curSelIndex >= 0 && curSelIndex < dc.length) this.activatedevent.invoke(this, dc[curSelIndex]);
    //    evnt.stopPropagation();
    //}
    //jbTrace.log("onKeyPress event: " + evnt.which);

};
SelectableRepeater.prototype.onItemClick = function(evnt) {
    if (evnt.target != null) {
        var dc = Base.get_dataContext(evnt.target);
        if (dc != null) {
            var n = this.$findItemIndex(dc);
            if (n >= 0) {
                this.set_selectedindex(n);
                if (!this.doubleClickToActivate) this.fireActivatedEvent(); // this.activatedevent.invoke(this, dc);
                evnt.stopPropagation();
            }
        }
    }
}.Description("Gusss .... ");
SelectableRepeater.prototype.onItemDblClick = function(evnt) {
    if (evnt.target != null) {
        var dc = Base.get_dataContext(evnt.target);
        if (dc != null) {
            var n = this.$findItemIndex(dc);
            if (n >= 0) {
                this.set_selectedindex(n);
                this.fireActivatedEvent();
                // this.activatedevent.invoke(this, dc);
                evnt.stopPropagation();
            }
        }
    }
}.Description("Gusss .... ");
SelectableRepeater.prototype.moveSelectedItem = function(how) { // This works only with arrays
    var si = this.get_selectedindex();
    var topos = null;
    if (how == -1 || how == "up") topos = (si > 0) ? si - 1 : null;
    if (how == 1 || how == "down") topos = (si < this.$items.length - 1) ? si + 1 : null;
    if (how == "top") topos = 0;
    if (how == "bottom") topos = this.$items.length - 1;
    if (si >= 0 && si < this.$items.length && topos != null) {
        var itm = this.$items[si];
        this.$items.splice(si, 1);
        this.$items.splice(topos, 0, itm);
        this.set_items(this.$items);
        this.set_selectedindex(topos);
        this.orderchangedevent.invoke(self, itm);
    }
};
SelectableRepeater.prototype.onMoveSelectedItem = function(e, dc, binding, param) {
    this.moveSelectedItem(param);
};
SelectableRepeater.prototype.get_canmoveup = function() {
    if (this.$items != null && this.get_selectedindex() > 0) return true;
    return false;
};
SelectableRepeater.prototype.get_canmovedown = function() {
    if (this.$items != null && this.get_selectedindex() < (this.$items.length - 1)) return true;
    return false;
};
SelectableRepeater.prototype.get_hasselection = function() {
    return (this.$items != null && this.$items.length > 0 && this.get_selectedindex() >= 0);
};
SelectableRepeater.prototype.get_hasitems = function() {
    return (this.$items != null && this.$items.length > 0);
};
SelectableRepeater.prototype.moveSelection = function (v) {
    var itms = this.get_items();
    var curSelIndex = this.get_selectedindex();
    if (curSelIndex == null) this.set_selectedindex(-1);
    if (itms.length <= 0) {
        this.set_selectedindex(-1);
    } else {
        if (this.get_selectedindex() < 0) {
            this.set_selectedindex(this.get_firstItemIndex());
            if (this.nowrap) {
                return false;
            }
        } else {
            var newIdx = curSelIndex + v;
            if (newIdx < this.get_firstItemIndex()) {
                if (this.nowrap) {
                    return false;
                } else {
                    this.set_selectedindex(this.get_lastItemIndex());
                }
            } else if (newIdx > this.get_lastItemIndex()) {
                if (this.nowrap) {
                    return false;
                } else {
                    this.set_selectedindex(this.get_firstItemIndex());
                }
            } else {
                this.set_selectedindex(newIdx);
            }
        }
    }
    this.$applySelection();
    return true;
};
SelectableRepeater.prototype.onMoveSelection = function(e, dc, binding, param) {
    if (param == "up") this.moveSelection(-1);
    if (param == "down") this.moveSelection(1);
    if (param == "top") this.moveSelection(-this.get_selectedindex());
    if (this.$items != null) {
        if (param == "bottom") this.moveSelection(this.$items.length - this.get_selectedindex() - 1);
    }
}.Description("Gusss .... ");
SelectableRepeater.prototype.get_itemindex = function(item) {
    return this.$findItemIndex(item);
};
SelectableRepeater.prototype.$findItemIndex = function(idObj) { // by item
    if (this.identification != null && this.identification.length > 0) {
        return this.$findItem(idObj[this.identification]);
    } else {
        return this.$findItem(idObj);
    }
}.Description("Gusss .... ");
SelectableRepeater.prototype.$findItem = function(idData) { // By value
    var itms = this.get_items();
    if (itms != null) {
        if (this.finditem == null) {
            var i;
            if (this.identification != null && this.identification.length > 0) {
                for (i = 0; i < itms.length; i++) {
                    if (itms[i][this.identification] == idData) return i;
                }
            } else {
                for (i = 0; i < itms.length; i++) {
                    if (itms[i] == idData) return i;
                }
            }
            return -1;
        } else {
            if (BaseObject.is(this.finditem, "Delegate")) {
                return this.finditem.invoke(idData, this.get_items());
            } else {
                return this.finditem.call(idData, this.get_items());
            }
        }
    } else {
        return -1;
    }
}.Description("Gusss .... ");
SelectableRepeater.prototype.finditem = null;
// custom callback to find item by data proto: function (idData,items): int; returns the index of the element
SelectableRepeater.prototype.set_items = function (v) { // override to disallow objects and allow only arrays
    if (v == null || BaseObject.is(v, "Array")) {
        // if (this.get_items() != null) {  } // What was that for ??? I shoul remember
        var oldindex = this.get_selectedindex();
        Repeater.prototype.set_items.call(this, v);
        if (this.retainindex && oldindex <= this.get_lastItemIndex() && oldindex >= this.get_firstItemIndex()) this.set_selectedindex(oldindex);
        //        var localThis = this;
        //        this.$bodyElement.children().click(function (evnt) {
        //            localThis.onItemClick(evnt, null);
        //        });

        return;
    }
    throw "SelectableRepeater: only arrays (lists) can be bound to the $items property";
}.Description("Gusss .... ");
SelectableRepeater.prototype.get_selecteddomelement = function() {
    var c = this.$bodyElement.children();
    if (this.$selectedIndex >= 0) {
        var s = c.get(this.$selectedIndex - this.$offset);
        return $(s);
    }
    return $();
}
SelectableRepeater.prototype.$applySelection = function () {
    if (this.$bodyElement == null || this.$bodyElement.length == 0) return;
    if (this.applySelection(this.$selectedIndex, this.$prevSelectedIndex, this.$bodyElement, this.$headerElement) === true) {
        return; // if the overriding method in the child class does this we exit
    }
    var anc;
    if (this.selectedCssClass != null && this.selectedCssClass.length > 0) {
        var c = this.$bodyElement.children();
        c.removeClass(this.selectedCssClass);
        if (this.unselectedCssClass != null) {
            c.addClass(this.unselectedCssClass);
        }
        if (this.$selectedIndex >= 0) {
            var s = c.get(this.$selectedIndex - this.$offset);
            var t = $(s);
            t.addClass(this.selectedCssClass);
            if (this.get_scrollintoview()) {
                if (s != null) {
                    s.scrollIntoView(false);
                }
            }
			if (!this.nofocus) {
				anc = t.filter("a");
				if (anc.length > 0) {
					anc.focus();
				} else {
					anc = t.find("a");
					if (anc.length > 0) anc.focus();
				}
			}
            if (this.unselectedCssClass != null) {
                t.removeClass(this.unselectedCssClass);
            }
        }
    } else {
        var localThis = this;
        this.$bodyElement.children().each(function (idx, el) {
            var t = $(this);
            var a = t.attr("data-cssselected");
            var b = t.attr("data-cssunselected");
            if (a != null && a.length > 0) {
                t.removeClass(a);
                if (b != null && b.length > 0) t.addClass(b);
                if (idx == localThis.$selectedIndex - localThis.$offset) {
                    t.addClass(a);
					if (!this.nofocus) {
						anc = t.filter("a");
						if (anc.length > 0) {
							anc.focus();
						} else {
							anc = t.find("a");
							if (anc.length > 0) anc.focus();
						}
					}
                }
            }
        });
    }
}.Description("Gusss .... ");
SelectableRepeater.prototype.applySelection = function(curIndex, prevIndex, bodyEl, headEl) {
    return false; // override and return true if you do NOT want the default logic to proceed.
};
SelectableRepeater.prototype.$createChildren = function() {
    var el = this.$bodyElement;
    if (el == null) return;
    if (this.get_itemTemplate() == null) return;
    el.Empty();
    var localThis = this;
    if (this.$items != null) {
        var item;
        var o;
        if (BaseObject.is(this.$items, "Array")) {
            for (var i = this.$offset; i < this.$items.length && (this.$limit < 0 || i - this.$offset < this.$limit); i++) {
                item = this.$items[i];
                o = ViewBase.cloneTemplate(el, this.get_itemTemplate(), item); // var o = $(this.itemTemplate).clone();
                if (this.storeIndexIn != null && this.storeIndexIn.length > 0) {
                    BaseObject.setProperty(item, this.storeIndexIn, i);
                }
                o.click(function(evnt) {
                    localThis.onItemClick(evnt, null);
                });
                o.dblclick(function(evnt) {
                    localThis.onItemDblClick(evnt, null);
                });
                // o.get(0).dataContext = item;
                //el.append(o);
            }
        } else {
            for (item in this.$items) {
                //var o = $(this.itemTemplate).clone();
                //o.get(0).dataContext = item;
                o = ViewBase.cloneTemplate(el, this.get_itemTemplate(), this.$items[item]);
                if (this.storeIndexIn != null && this.storeIndexIn.length > 0) {
                    BaseObject.setProperty(this.$items[item], this.storeIndexIn, item);
                }
                o.click(function(evnt) {
                    localThis.onItemClick(evnt, null);
                });
                o.dblclick(function(evnt) {
                    localThis.onItemDblClick(evnt, null);
                });
                //el.append(o);
            }
        }
    }
}.Description("Gusss .... ");
