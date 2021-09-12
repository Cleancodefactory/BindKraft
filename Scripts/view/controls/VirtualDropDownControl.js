


/*CLASS*/
function VirtualDropDownControl() {
	Base.apply(this, arguments);
	Messenger.Instance().subscribe("PageEvent",this.onHandlePageEvent);
}
VirtualDropDownControl.Inherit(Base,"VirtualDropDownControl");
VirtualDropDownControl.Implement(IUIControl);
VirtualDropDownControl.Implement(IDisablable);
VirtualDropDownControl.Implement(IItemKeyPropertiesDescriptor);
VirtualDropDownControl.Implement(ITemplateSourceImpl, new Defaults("templateName", "bindkraft/control-vdropdown"));
VirtualDropDownControl.$defaults = {
	templateName: "bindkraft/control-vdropdown",
};

VirtualDropDownControl.prototype.obliterate = function () {
    Messenger.Instance().unsubscribe("PageEvent",this.onHandlePageEvent);
    Base.prototype.obliterate.call(this);
}
VirtualDropDownControl.prototype.onHandlePageEvent = new InitializeMethodDelegate("",function(msg) {
    if (BaseObject.is(msg, "PageEvent")) {
		var t = msg.get_target();
		if (t != null) {
			if (this.root.contains(t)) return;
		}
        // this.Close();
    }
});
VirtualDropDownControl.prototype.set_disabled = function (v) {
    IDisablable.prototype.set_disabled.apply(this, arguments);
    if (this.enabledCss != null && this.enabledCss.length > 0) {
        if (v) {
            $(this.root).removeClass(this.enabledCss);
        } else {
            $(this.root).addClass(this.enabledCss);
        }
    }
    if (this.disabledCss != null && this.disabledCss.length > 0) {
        if (v) {
            $(this.root).addClass(this.disabledCss);
        } else {
            $(this.root).removeClass(this.disabledCss);
        }
    }
};
VirtualDropDownControl.prototype.defaultTemplateName = "bindkraft/control-vdropdown"; //".j_framework_control_vdropdown";
VirtualDropDownControl.prototype.defaultMultiTemplateName = "bindkraft/control-vmultidropdown"; //".j_framework_control_vmultidropdown";
VirtualDropDownControl.prototype.disabledCss = new InitializeStringParameter("Optional CSS class to assign to the root element when the repeater is disabled.","f_select_disabled");
VirtualDropDownControl.prototype.enabledCss = new InitializeStringParameter("Optional CSS class to assign to the root element when the repeater is enabled.", "f_select_enabled");
// These come from the Interface (IItemKeyPropertiesDescriptor), but we want different defaults
VirtualDropDownControl.ImplementProperty("keyproperty", new InitializeStringParameter("The name of the property that will be used as unique key to distinguish between the items.", "lookupkey"));
VirtualDropDownControl.ImplementProperty("descproperty", new InitializeStringParameter("The name of the property that will be used as display name for the items (this is what is visible for the user).", "lookupdescription"));
VirtualDropDownControl.ImplementProperty("titleproperty", new InitializeStringParameter("The name of the property that will be used as title for the items (this is what is visible for the user).", "title"));
VirtualDropDownControl.ImplementProperty("originalitemkey", new InitializeStringParameter("The name of the key under which to link the original property.","item"));

VirtualDropDownControl.ImplementProperty("maxlen", new InitializeNumericParameter("Limit the display text of the items to the specified number of symbols. Default is 55", 55));
VirtualDropDownControl.ImplementProperty("captlen", new InitializeNumericParameter("Limit the display text of the items to the specified number of symbols. Default is 55", null));
//VirtualDropDownControl.ImplementProperty("templateName", new InitializeStringParameter("The id of the control template. Null denotes the standard built-in templates.", null));
VirtualDropDownControl.ImplementProperty("pendingtimeout", new InitializeNumericParameter("Timeout for pending operations in milliseconds. Default is 50.",300));
VirtualDropDownControl.ImplementProperty("droppanel", new InitializeStringParameter("Drop panel's key query - default is ./da","./da"));
VirtualDropDownControl.ImplementProperty("multiselect", new InitializeBooleanParameter("Multiselct mode", false));
VirtualDropDownControl.ImplementProperty("multiselectdisplay", new InitializeStringParameter("What to show in closed state. Supported: count, list. list mode is default.", "list"));
VirtualDropDownControl.ImplementProperty("noselection", new InitializeStringParameter("What to show when nothing is selected", "(please select)"));
VirtualDropDownControl.ImplementProperty("itemsselectedtext", new InitializeStringParameter("N items selected", " selected"));
VirtualDropDownControl.ImplementProperty("showclear", new InitializeBooleanParameter("Show clear button (if available in the template)", false));
VirtualDropDownControl.ImplementProperty("scrollintoview", new InitializeBooleanParameter("Try to scroll into view when opened. null - do nothing, true - position at the top, false - position at the bottom.", null));

VirtualDropDownControl.prototype.itemdisabledCssClass = new InitializeStringParameter("CSS class used to display the disabled items", "disable");

VirtualDropDownControl.prototype.selchangedevent = new InitializeEvent("Fired every time the selection changes");
VirtualDropDownControl.prototype.activatedevent = new InitializeEvent("Fired whenever the selection is confirmed - enter pressed or when the user clicks on an item.");
VirtualDropDownControl.prototype.openevent = new InitializeEvent("Fired whenever the dropdown opens.");
VirtualDropDownControl.prototype.closeevent = new InitializeEvent("Fired whenever the dropdown closes.");
VirtualDropDownControl.prototype.updateuievent = new InitializeEvent("For usage mostly inside the control template. Fires when underlying data changes and full update is not performed. It can be used for readdata directives in certain bindings.");
VirtualDropDownControl.prototype.itemssuppliedevent = new InitializeEvent("Fired when items are set. Useful when a binding with options=operation is bound to $items the selection has to be (re)applied with another binding.")

VirtualDropDownControl.prototype.OnItemDisableEnable = function(itemInterface, itemData) {
    if (BaseObject.is(itemInterface,"Base")) {
        if (itemInterface.get_disable()) {
            $(itemInterface.root).addClass(this.itemdisabledCssClass);
        } else {
            $(itemInterface.root).removeClass(this.itemdisabledCssClass);
        }
    }
}

VirtualDropDownControl.prototype.$filterfields = null;
VirtualDropDownControl.prototype.get_filterfields = function() {
	if (BaseObject.is(this.$filterfields, "Array")) return this.$filterfields.join(",");
	return null;
}
VirtualDropDownControl.prototype.set_filterfields = function(v) {
	this.$filterfields = null;
	if (BaseObject.is(v,"string")) {
		this.$filterfields = v.split(",");
	} else if (BaseObject.is(v, "Array")) {
		this.$filterfields = v;
	}
}
VirtualDropDownControl.prototype.$inlineitemtemplate = null;
VirtualDropDownControl.prototype.$init = function() {
	var tmlLocal = $(this.root).children();
	var el = $(this.root);
	if (tmlLocal != null && tmlLocal.length > 0) {
		// Nothing for now
		var itmtml = tmlLocal.filter('[data-key="itemtemplate"]');
		if (itmtml == null || itmtml.length == 0) {
			itmtml = tmlLocal;
		}
		// itmtml - contains whatever we are going to use as item template.
		this.$inlineitemtemplate = itmtml;
	} 
	
	// var tmlName = this.get_templateName();
	// if (tmlName == null) tmlName = this.get_multiselect() ? this.defaultMultiTemplateName:this.defaultTemplateName;
	
	if(this.get_multiselect() && this.get_templateName() == this.defaultTemplateName) {
		this.set_templateName(this.defaultMultiTemplateName)
	}

	var template = $$(this.get_template()).clone();
	el.empty().append(template);

	// var tml = $(tmlName);
	// el.empty();
	// el.append(el.append(tml.children().clone()));
    
    if (!this.get_showclear()) {
        this.childElement("clearbutton").Remove();;
    }
	Base.prototype.$init.apply(this, arguments);
}
VirtualDropDownControl.$getHostViewContainer = new ProtoCaller("IViewHostQuery", "get_viewcontainerelement");
VirtualDropDownControl.prototype.Dimentions = function () {
    var th = this.getRelatedElements(this.get_droppanel());
    if (th != null && th.length > 0) {
        var query = new HostCallQuery(HostCallCommandEnum.gethost);
        this.throwStructuralQuery(query);
        if (query.host != null) {
            var viewcontainer = VirtualDropDownControl.$getHostViewContainer.invokeOn(query.host);
			if (viewcontainer == null) {
				InfoMessageQuery.emit(this, "Cannot obtain the view container from the view host.");
				return;
			}
			var containerRect = Rect.fromDOMElementInner(viewcontainer);
            var controlRect = Rect.fromDOMElementOffset(this.root);
            var pt = new Point(controlRect.x + (this.shiftLeft ? this.shiftLeft : 0), controlRect.y + (this.shiftTop ? this.shiftTop : 0));
            var ballonRect = Rect.fromDOMElementOffset(th);
			// Safety madness
            if (ballonRect.w <= 0) {
                ballonRect.w = 250;
            }
            if (ballonRect.h <= 0) {
                ballonRect.h = 20;
            }
            var placementRect = containerRect.adjustPopUp(controlRect, ballonRect, "aboveunder", 0);
            placementRect.x = placementRect.x - controlRect.x;
            placementRect.y = placementRect.y - controlRect.y;
            th.css("z-index", "9999");
            th.css("left", placementRect.x);
            th.css("top", placementRect.y);
        } else {
			
		}
    }

};
VirtualDropDownControl.prototype.$el_header = null;
VirtualDropDownControl.prototype.$el_dataarea = null;
VirtualDropDownControl.prototype.$el_list = null;
VirtualDropDownControl.prototype.$el_scrollable = null;
VirtualDropDownControl.prototype.init = function() {
	// Extract and verify nodes
	this.$el_header = this.child("headerelement");
	var f = $(this.$el_header).find('[data-purpose="focus"]');
	if (f != null && f.length > 0) f.prop("tabindex", -1); 
	this.$el_dataarea = this.child("da");
	this.$el_drop = this.$el_dataarea;
	this.$el_list = this.child("itemslist");
	this.$el_scrollable = this.childObject("sa");
	this.set_bodyVisible(this.get_bodyVisible());
	this.on("keyup", this.onKeyPress);
    this.on("keydown", this.onSwallow);
    this.on("keypress", this.onSwallow);
	this.set_disabled(this.get_disabled());
}
VirtualDropDownControl.prototype.postinit = function() {
	if (this.$el_list != null && this.$inlineitemtemplate != null) {
		var itemlist = this.$el_list.activeclass();
		if (BaseObject.is(itemlist, "IItemTemplateSource")) {
			itemlist.set_itemTemplate(this.$inlineitemtemplate);
		}
	}
}
VirtualDropDownControl.prototype.get_items = function() {
	return this.$items;
}
VirtualDropDownControl.prototype.set_items = function(v) {
	this.$items = v;
	this.discardAsync("update_targets");
	this.asyncUpdateTargets().then(this,function() { 
		this.itemssuppliedevent.invoke(this,this.$items);
		// TODO Consider removing this. The above event should be enough.
		this.selchangedevent.invoke(this,
        	(this.get_multiselect()?this.get_selecteditems():this.get_selecteditem())
		);
	});
}
VirtualDropDownControl.prototype.supplyPagedItems = function(start, end, params) {
	var result = null;
	var self = this;
	if (start == "length") {
		return (BaseObject.is(this.$items, "Array")?this.$items.length:0);
	} else {
		if (BaseObject.is(this.$items, "Array")) {
			if (start == null || start < 0) start = 1;
			var $items = this.$items;
			if (this.$filterfields != null && this.$filterfields.length > 0 && params != null && params.filter != null && typeof params.filter == "string") {
				if (params.filter.length > 0) {
					$items = $items.Select(function(idx, itm) {
						var j;
						for(j =0;j<self.$filterfields.length;j++) {
							if (itm[self.$filterfields[j]] != null && typeof itm[self.$filterfields[j]] == "string") {
								if (itm[self.$filterfields[j]].indexOf(params.filter) >= 0) return itm;
							}
						}
						return null;
					});
				}
			}
			if (start > 0) {
				if (end > 0) {
					result = $items.slice(start - 1, start - 1 + end);
				} else {
					result = $items.slice(start - 1);
				}
			} else {
				result = $items;
			}
		} else {
			result = this.$items; // All of them
		}
	}
	if (BaseObject.is(result, "Array")) {
	
		result = result.Select(function(idx , item) {
			return {
				key: item[self.get_keyproperty()],
				display: item[self.get_descproperty()],
				title: item[self.get_titleproperty()],
				selected: self.IsItemSelected(item),
				//CheckItem: function(e_s,dc,bind) { // Requires refs: value true|false  // example with CCheckbox ref[value]=self@value 
					/////////////////////////
				//},
				item: item
			};
		});
	}
	return result;	
}
VirtualDropDownControl.prototype.get_bodyVisible = function () { return this.$bodyVisible; };
VirtualDropDownControl.prototype.set_bodyVisible = function (v) {
    if (this.get_disabled()) {
        this.$bodyVisible = false;
    } else {
        this.$bodyVisible = v;
    }
    if (this.$el_drop != null) {
        if (this.$bodyVisible) {
            if (this.get_disabled()) {
                $(this.$el_drop).hide();
            } else {
				//this.Dimentions();
				$(this.$el_drop).show();
				JBUtil.adjustPopupInHost(this, this.get_droppanel(), 0, -30);
				if (this.$el_scrollable != null && $(this.$el_scrollable).activeclass() != null) {
					$(this.$el_scrollable).activeclass().onDataAreaChange();
				}
            }
        } else {
            $(this.$el_drop).hide();
        }
        // this.updateTargets();
    }
};
VirtualDropDownControl.prototype.FocusHeader = function (e, dc) {
	var f = $(this.$el_header).find('[data-purpose="focus"]');
	if (f != null && f.length > 0) {
		f.focus();
	}
};
VirtualDropDownControl.prototype.goActive = function (e, dc) {
    if (this.get_disabled()) return;
    if (this.get_bodyVisible()) return;
	var f = $(this.root).find('[data-purpose="focus"]');
	if (f != null && f.length > 0) {
		f.focus();
	}
	this.openevent.invoke(this, null);
	this.set_bodyVisible(true);
	if (this.root.scrollIntoView) {
		if (this.get_scrollintoview() != null) {
			this.root.scrollIntoView(this.get_scrollintoview()?true:false);
		}
	}
};
VirtualDropDownControl.prototype.goInactive = function (e, dc) {
    if (!this.get_bodyVisible()) return;
    this.closeevent.invoke(this, null);
    this.set_bodyVisible(false);
};
VirtualDropDownControl.prototype.toggleActive = function (e, dc) {
    if (this.get_bodyVisible()) {
        this.goInactive();
    } else {
        this.goActive();
    }
};
VirtualDropDownControl.prototype.Open = function () {
    this.$schedulePending("open");
    // jbTrace.log("open");
};
VirtualDropDownControl.prototype.Close = function () {
    this.$schedulePending("close");
    // jbTrace.log("close");
};
VirtualDropDownControl.prototype.ForceClose = function () {
    this.$schedulePending("close", true);
    // jbTrace.log("close");
};
VirtualDropDownControl.prototype.Toggle = function () {
    if (this.get_bodyVisible()) {
        this.$schedulePending("close");
    } else {
        this.$schedulePending("open");
    }
    // jbTrace.log("toggle");
};
VirtualDropDownControl.prototype.$pendingOperationHandler = function () {
    this.$pendingOperationHandlerWrapper = null;
    var op = this.$pendingOperation;
    this.$pendingOperation = null;
    if (op != null) {
        switch (op) {
            case "open":
                this.goActive();
                break;
            case "close":
            case "forceclose":
                this.goInactive();
                break;
        }
    }
};
VirtualDropDownControl.prototype.$pendingOperationHandlerWrapper = null;
VirtualDropDownControl.prototype.$pendingOperation = null;
VirtualDropDownControl.prototype.$schedulePending = function (op, force) {
    if (op != null) {
        if (op == "open" && this.$pendingOperation != "forceclose") {
            this.$pendingOperation = "open";
        } else if (op == "close" && this.$pendingOperation != "open") {
            this.$pendingOperation = op;
        } else if (op == "close" && force) {
            this.$pendingOperation = "forceclose";
        }
    }
    if (this.$pendingOperationHandlerWrapper == null) {
        this.$pendingOperationHandlerWrapper = Delegate.createWrapper(this, this.$pendingOperationHandler);
        window.setTimeout(this.$pendingOperationHandlerWrapper, this.get_pendingtimeout());
    }
};
VirtualDropDownControl.prototype.get_hasselection = function() {
    if (this.get_multiselect()) {
        var s = this.get_selectedkeys();
        if (s != null && s.length > 0) return true;
        return false;
    } else {
        var si = this.get_selectedindex();
        if (si == null || si >= 0) return true;
        return false;
    }
}
VirtualDropDownControl.prototype.get_selectedindex = function() {
	var items = this.get_items();
	var self = this;
	var key = this.get_keyproperty();
	if (BaseObject.is(items, "Array") && this.$value != null) {
		return items.FirstOrDefault(function(idx,itm) {
			if (itm[key] == self.$value) return idx;
			return null;
		});
	} else {
		return -1;
	}
}
VirtualDropDownControl.prototype.set_selectedindex = function(n) {
	var items = this.get_items();
	var key = this.get_keyproperty();
	if (BaseObject.is(items, "Array")) {
		if (items.length > n && n >= 0) {
			if (items[n] != null) {
				this.set_value(items[n][key]);
			}
		} else if (n < 0) {
            this.set_value(null);
        }
	}
}
VirtualDropDownControl.prototype.get_selectedindices = function() {
	var items = this.get_items();
	var self = this;
	var key = this.get_keyproperty();
	if (BaseObject.is(items, "Array") && this.$value != null) {
		return items.Select(function(idx,itm) {
			if (self.$selectedkeys.indexOf(itm[key]) >= 0) return idx;
			return null;
		});
	} else {
		return null;
	}
}
VirtualDropDownControl.prototype.set_selectedindices = function(n) {
	var items = this.get_items();
	var key = this.get_keyproperty();
	var self = this;
	if (BaseObject.is(items, "Array")) {
		if (BaseObject.is(n,"Array")) {
			this.set_selectedkeys(items.Select(function(idx,itm) {
				if (n.indexOf(idx) >= 0) return itm[self.get_keyproperty()];
				return null;
			}));
			return;
		} else if (typeof n == "number") {
			if (n >=0 && n < items.length) {
				this.InternalClearSelection();
				var itm = items[n];
				if (itm != null) {
					this.set_selectedkeys(itm[this.get_keyproperty()]);
				}
			}
			return;
		}
	}
}
VirtualDropDownControl.prototype.get_selecteditem = function() {
	var items = this.get_items();
	var self = this;
	var key = this.get_keyproperty();
	if (BaseObject.is(items, "Array") && this.$value != null) {
		return items.FirstOrDefault(function(idx,itm) {
			if (itm[key] == self.$value) return itm;
			return null;
		});
	} else {
		return null;
	}
}
VirtualDropDownControl.prototype.get_selectedinternalitem = function() {
	var item = this.get_selecteditem();
	if (item == null) return null;
	return {
				key: item[this.get_keyproperty()],
				display: item[this.get_descproperty()],
				title: item[this.get_titleproperty()]
			};
}
VirtualDropDownControl.prototype.set_selecteditem = function(v) {
	if (v == null) {
		this.set_value(null);
	} else {
		this.set_value(v[this.get_keyproperty()]);
	}
}
VirtualDropDownControl.prototype.multiselectionformatter = { // Attach it to $selecteditems
	ToTarget: function(v,bind,args) {
		if (this.get_multiselect()) {
            var sitems = this.get_selecteditems();
            var s = "";
            if (sitems == null || sitems.length == 0) {
                return this.get_noselection();
            }
            switch (this.get_multiselectdisplay()) {
                case "list":
                    s = "";
                    for (var i = 0; i < sitems.length; i++) {
                        if (s.length > 0) s += ",";
                        s += sitems[i][this.get_descproperty()];
                    }
                    return s;
                case "count":
                default:
                    return (sitems.length + this.get_itemsselectedtext());

            }
        }
        else
        {
            if (!this.get_hasselection()) {
                return this.get_noselection();
            }
            else {
                var item = this.get_selecteditem();
                if (item != null) {
                    return item[this.get_descproperty()];
                }
                else {
                    return this.get_noselection();
                }
            }
        }
	},
	FromTarget: function() {} // do nothing
}
VirtualDropDownControl.prototype.get_selecteditems = function() {
    var items = this.get_items();
	var self = this;
	var key = this.get_keyproperty();
	if (BaseObject.is(items, "Array") && BaseObject.is(this.$selectedkeys,"Array")) {
		return items.Select(function(idx,itm) {
			if (self.$selectedkeys.indexOf(itm[key]) >= 0) return itm;
			return null;
		});
	} else {
		return null;
	}
}
VirtualDropDownControl.prototype.set_selecteditems = function(v) {
	this.InternalClearSelection();
	var i, item;
	if (v != null) {
		if (BaseObject.is(v, "Array")) {
			for (i = 0; i < v.length; i++) {
				this.selectItem(v[i]);
			}
		} else if (typeof v == "object") {
			this.selectItem(v);
		}
	}
}
VirtualDropDownControl.prototype.InternalClearSelection = function() {
    if (this.get_multiselect()) {
        this.$selectedkeys = null;
        this.asyncUpdateTargets();
        this.selchangedevent.invoke(this, null);
    } else {
        this.set_value(null);
    }
}
VirtualDropDownControl.prototype.ClearSelection = function() {
    this.InternalClearSelection();
	this.activatedevent.invoke(this, null);
}
VirtualDropDownControl.prototype.$value = null;
VirtualDropDownControl.prototype.get_value = function() {
	return this.$value;
}
VirtualDropDownControl.prototype.set_value = function(v) {
	if (this.$value != v) {
		this.$value = v;
		this.discardAsync("update_targets");
		this.asyncUpdateTargets();
		this.selchangedevent.invoke(this, this.get_selecteditem());
	}
}
VirtualDropDownControl.prototype.selectItem = function(item, bUnselect) {
    if (item != null) {
        this.selectKey(item[this.get_keyproperty()],bUnselect);    
    } else {
        this.selectKey(null,bUnselect);
    }
}
VirtualDropDownControl.prototype.unselectItem = function(item) {
    this.selectItem(item,true);
}
VirtualDropDownControl.prototype.selectKey = function(key, bUnselect) {
    if (this.get_multiselect()) {
        if (key != null) {
            if (this.$selectedkeys == null) {
                this.$selectedkeys = [];
            }
            if (bUnselect) {
                this.$selectedkeys.removeElement(key);
            } else {
                this.$selectedkeys.addElement(key);
            }
            this.selchangedevent.invoke(this,this.get_selecteditems());
            this.asyncUpdateTargets();
        }
        
    } else {
        if (bUnselect) {
            if (this.get_value() == key) this.set_value(null);
        } else {
            this.set_value(key);
        }
    }
}
VirtualDropDownControl.prototype.unselectKey = function(key) {
    this.selectKey(key,true);
}

// Should be called by multiselect templates when an item state is changed.
// Requires a ref named "value" to carry true for select and false for unselect
// Requires a ref named "item" to carry a reference to the current item (the one being selected/unselected).
VirtualDropDownControl.prototype.onCheckItem = function(e_sender, dc, bind) {
	var v = bind.getRef("value");
    var item = bind.getRef("item");
    if (item != null) {
        this.selectKey(item.key,!v);
    }
    
}
VirtualDropDownControl.prototype.$selectedkeys = null;
VirtualDropDownControl.prototype.get_selectedkeys = function() {
	return this.$selectedkeys;
}
VirtualDropDownControl.prototype.set_selectedkeys = function(v) {
	if (BaseObject.is(v, "Array")) {
        this.$selectedkeys = v;
        this.selchangedevent.invoke(this, this.get_selecteditems());
		this.asyncUpdateTargets();
    } else if (v != null) {
        this.selectKey(v);
    } else {
		this.InternalClearSelection();
	}
}
VirtualDropDownControl.prototype.IsKeySelected = function(key) {
	if (key == null || this.$selectedkeys == null) return false;
	if (this.$selectedkeys.FirstIndexOf(key) >= 0) return true;
	return false;
}
VirtualDropDownControl.prototype.IsItemSelected = function(item) {
	if (item == null || this.$selectedkeys == null) return false;
	return this.IsKeySelected(item[this.get_keyproperty()]);
}

VirtualDropDownControl.prototype.onSelectionChanged = function(sender, dc) {
	this.Open();
	this.FocusHeader();
}
VirtualDropDownControl.prototype.onItemActivated = function(sender, dc) {
	if (dc != null) {
        if (this.get_multiselect()) {
            if (dc != null) {
                if (this.IsKeySelected(dc.key)) {
                    this.unselectKey(dc.key);
                } else {
                    this.selectKey(dc.key);
                }
                this.activatedevent.invoke(this, this.get_selecteditems());
            }
        } else {
            this.set_value(dc.key);
		    this.FocusHeader();
		    this.ForceClose();
		    this.activatedevent.invoke(this, this.get_selecteditem());
        }
		
	}
}
VirtualDropDownControl.$ignoreKeys = [9,13,27];
VirtualDropDownControl.prototype.onSwallow = function (e) {
    jbTrace.log("onSwallow event: " + e.which);
    var count = VirtualDropDownControl.$ignoreKeys.Aggregate(function (idx, item, result) {
        var rs = (result == null) ? 0 : result;
        if (item == e.which) return rs + 1;
        return rs;
    });
    if (count > 0) return;
    e.stopPropagation();
    //e.preventDefault();
};
VirtualDropDownControl.prototype.onKeyPress = function (evnt) {
    if (evnt.which == 27) {
        //this.escapeevent.invoke(this, null);
		this.ForceClose();
        evnt.stopPropagation();
    } else if ((evnt.which >= 37 && evnt.which <= 40) || evnt.which == 13 || evnt.which == 32) {
        if ($(this.$el_list).activeclass() != null) {
			if (!$(this.$el_list).activeclass().processKey(evnt)) {
				if ($(this.$el_scrollable).activeclass() != null) {
					if ($(this.$el_scrollable).activeclass().processKey(evnt)) {
						evnt.stopPropagation();
					}
				}
			} else {
				if (this.get_bodyVisible()) {
					evnt.stopPropagation();
				}
			}
		}
    } else if (this.get_bodyVisible()) {
		evnt.stopPropagation();
	}
   // jbTrace.log("onKeyPress event: " + evnt.which);
};