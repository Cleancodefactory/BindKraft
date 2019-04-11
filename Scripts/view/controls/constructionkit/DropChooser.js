


/*CLASS*/
function DropChooserControl() {
	Base.apply(this,arguments);
}
DropChooserControl.Description("Drop panel with virtualized selectable list. Somewhat similar to a virtual drop down, but nonusable without an element that controls it. Think of UChooser as a component for drop-down like contraptions.");
DropChooserControl.Inherit(Base,"DropChooserControl");
DropChooserControl.Implement(IUIControl);
DropChooserControl.Implement(IDisablable);
DropChooserControl.Implement(IHintedSelector);
DropChooserControl.Implement(IKeyboardHandler);
DropChooserControl.Implement(IKeyboardEventHandler);
DropChooserControl.Implement(IPartnershipTarget);
DropChooserControl.Implement(IItemKeyPropertiesDescriptorImpl);
DropChooserControl.prototype.set_disabled = function (v) {
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
DropChooserControl.prototype.defaultTemplateName = ".j_framework_control_dropchooser";
DropChooserControl.prototype.disabledCss = new InitializeStringParameter("Optional CSS class to assign to the root element when the repeater is disabled.","f_select_disabled");
DropChooserControl.prototype.enabledCss = new InitializeStringParameter("Optional CSS class to assign to the root element when the repeater is enabled.", "f_select_enabled");
DropChooserControl.ImplementProperty("pendingtimeout", new InitializeNumericParameter("Timeout for pending operations in milliseconds. Default is 50.",300));

// Templates and element names
DropChooserControl.ImplementProperty("templateName", new InitializeStringParameter("The id of the control template. Null denotes the standard built-in templates.", null));
DropChooserControl.ImplementProperty("droppanel", new InitializeStringParameter("Drop panel's key query - default is ./da","./da"));
DropChooserControl.ImplementProperty("itemlist", new InitializeStringParameter("Drop panel's key query - default is ./itemlist","./itemslist"));
DropChooserControl.ImplementProperty("dataarea", new InitializeStringParameter("Drop panel's key query - default is ./da","./da"));
DropChooserControl.ImplementProperty("scrollable", new InitializeStringParameter("Drop panel's key query - default is ./sa","./sa"));

// Connector specification - optional, instead a connector can be set explicitly
DropChooserControl.ImplementProperty("lastCallProcessing", new InitializeBooleanParameter("Set this to true to instruct the area to use connector in last call mode - concurrent calls are ignored, only the last is actually processed.", false));
DropChooserControl.ImplementProperty("contentaddress", new Initialize("URL/address or connector from/to which to fetch/store items.", null));
DropChooserControl.ImplementProperty("itemscountaddress", new Initialize("URL/address or connector from which to fetch data items count (if paging is a concern).", null));
DropChooserControl.ImplementProperty("bindhost", new Initialize("Binding host for the connector. If null the DataArea will set itself as host.", null));
DropChooserControl.ImplementProperty("contentflags", new Initialize("Specific option for some connectors. Override content request flags. -1 will set this to STUFFRESULT.ALL", null));
DropChooserControl.ImplementIndexedProperty("parameters", new InitializeObject("Arbitrary parameters for binding access: data-bind-parameters[<someparam>]."));
DropChooserControl.ImplementProperty("filterparametername", new InitializeStringParameter("The name of the parameter to set into the connector for filtering.","filter"));

DropChooserControl.prototype.selchangedevent = new InitializeEvent("Fired every time the selection changes");
DropChooserControl.prototype.activatedevent = new InitializeEvent("Fired whenever the selection is confirmed - enter pressed or when the user clicks on an item.");
DropChooserControl.prototype.openevent = new InitializeEvent("Fired whenever the dropdown opens.");
DropChooserControl.prototype.closeevent = new InitializeEvent("Fired whenever the dropdown closes.");
// Proxy out the data area events to support bindings on the chooser
DropChooserControl.prototype.preloadevent = new InitializeEvent("Fired before any load operation starts - both for data and count. Use this event in bindings setting parameters on the data area.");
DropChooserControl.prototype.dataloadedevent = new InitializeEvent("Fired whenever data has been loaded. prototype: handler(sender_dataarea,loaded_data)");
DropChooserControl.prototype.dataappliedevent = new InitializeEvent("Fired whenever data has been applied after loading. prototype: handler(sender_dataarea,loaded_data)");
DropChooserControl.prototype.loaderrorevent = new InitializeEvent("Fired whenever error has occurred during data loading. prototype: handler(sender_dataarea,error_info)");
DropChooserControl.prototype.loadfinishedevent = new InitializeEvent("Fired whenever data load operation finishes (after the success and error events). prototype: handler(sender_dataarea,succes_failure_boolean)");
DropChooserControl.prototype.loadstartedevent = new InitializeEvent("Fired whenever data load operation starts. prototype: handler(sender_dataarea,connector)");
DropChooserControl.prototype.countsetevent = new InitializeEvent("Fired whenever the item count is set.");
//// TODO: The parameters here and these on the data area are different! We need to transfer or link them.
DropChooserControl.prototype.firePreloadEvent = function() { 
	this.preloadevent.invokeWithArgsArray(arguments); 
}
DropChooserControl.prototype.fireDataLoadedEvent = function() { this.dataloadedevent.invokeWithArgsArray(arguments); }

DropChooserControl.prototype.$filterfields = null;
DropChooserControl.prototype.get_filterfields = function() {
	if (BaseObject.is(this.$filterfields, "Array")) return this.$filterfields.join(",");
	return null;
}
DropChooserControl.prototype.set_filterfields = function(v) {
	this.$filterfields = null;
	if (BaseObject.is(v,"string")) {
		this.$filterfields = v.split(",");
	} else if (BaseObject.is(v, "Array")) {
		this.$filterfields = v;
	}
}

// IHintedSelector implementation
DropChooserControl.prototype.processExplicitHintData = function(hint) {
	this.processImplicitHintData(hint);
}
DropChooserControl.prototype.processImplicitHintData = function(hint) {
	if (hint != null) {
		if (typeof hint == "string") {
			this.set_parameters(this.get_filterparametername(), hint);
		} else if (hint.defaultHint != null) {
			this.set_parameters(this.get_filterparametername(), hint.defaultHint);
		}
	} else {
		this.set_parameters(this.get_filterparametername(), null);
	}
	this.Refresh();
}
DropChooserControl.prototype.handleStartHintProcessingUI = function() {
	this.Open();
}
DropChooserControl.prototype.handleStopHintProcessingUI = function() {
	this.Close();
}
// IKeyboardHandler implementation
DropChooserControl.prototype.processKeyData = function(kd) {
	if (kd != null && (kd.which == KeyboardEnum.KeyCode.down || kd.which == KeyboardEnum.KeyCode.up || kd.which == KeyboardEnum.KeyCode.enter || kd.which == KeyboardEnum.KeyCode.esc || kd.which == KeyboardEnum.KeyCode.space)) {
		if (BaseObject.is(this.$obj_list, "IKeyboardHandler")) return this.$obj_list.processKeyData(kd);
	}
	return false;
};
// IKeyboardEventHandler - default impl. redirects to processKeyData.
DropChooserControl.prototype.advisePartner = function(partner) {
	var i;
	if (partner != null) {
		for (i = 1; i < arguments.length; i++) {
			var p = arguments[i];
			if (p == "IKeyboardLogicalSource") {
				partner.keydataevent.add(new Delegate(this,this.handleProcessKeyData));
			} else if (p == "IFilterDataSource") {
				//partner.explicithintevent.add(new Delegate(this,this.handleProcessExplicitHintData));
				partner.implicithintevent.add(new Delegate(this,this.handleProcessImplicitHintData));
			} else if (p == "ISelectionConsumer") {
				this.selectionsuggestevent.add(new Delegate(partner, partner.handleSuggestSelection));
			} else if (p == "IHintedSelectorUIController") {
				partner.starthintprocessinguievent.add(new Delegate(this, this.handleStartHintProcessingUI));
				partner.stophintprocessinguievent.add(new Delegate(this, this.handleStopHintProcessingUI));
			}
		}
	}
}

DropChooserControl.prototype.$_tmlLocal = null;
DropChooserControl.prototype.$init = function() {
	var tmlLocal = $(this.root).children();
	var el = $(this.root);
	var tmlName = this.get_templateName();
	if (tmlName == null) tmlName = this.defaultTemplateName;
	var tml = $(tmlName);
	if (tmlLocal != null && tmlLocal.length > 0) {
		this.$_tmlLocal = tmlLocal;
	} 
	el.empty();
	el.append(el.append(tml.children().clone()));
    
	Base.prototype.$init.apply(this, arguments);
}
DropChooserControl.prototype.$el_drop = null;
DropChooserControl.prototype.$obj_dataarea = null;
DropChooserControl.prototype.$el_list = null;
DropChooserControl.prototype.$obj_list = null;
DropChooserControl.prototype.$el_scrollable = null;
DropChooserControl.prototype.$obj_scrollable = null;
DropChooserControl.prototype.init = function() {
}
DropChooserControl.prototype.postinit = function() {
	Base.prototype.postinit.apply(this, arguments);
	var t;
	t = this.getRelatedElements(this.get_dataarea());
	if (t.length == 1) {
		this.$obj_dataarea = t.activeclass();
	}
	this.$el_drop = this.getRelatedElements(this.get_droppanel());
	this.$el_list = this.getRelatedElements(this.get_itemlist());
	this.$obj_list = this.$el_list.activeclass();
	this.$el_scrollable = this.getRelatedElements(this.get_scrollable());
	this.$obj_scrollable = this.$el_scrollable.activeclass();
	
	if (this.$_tmlLocal != null) {
		if (BaseObject.is(this.$obj_list, "IItemTemplateSource")) {
			this.$obj_list.set_itemTemplate(this.$_tmlLocal);
		}
	}
	this.set_bodyVisible(this.get_bodyVisible());
	this.on("keyup", this.onKeyPress);
    this.on("keydown", this.onSwallow);
    this.on("keypress", this.onSwallow);
	this.set_disabled(this.get_disabled());
}
//#region Connectors
DropChooserControl.prototype.$applyParameters = function() {
	// NOT TODO: We must refactor the get/set_parameters of DataArea to not override the entire object in the connector in order this to make sense
	// ACTUALY DONE: Changed the Connector set_parameters to combine objects when object is set. This is much better!
	if (BaseObject.is(this.$contentconnector,"Connector")) {
		this.$contentconnector.set_parameters(this.get_parameters());
	}
};

DropChooserControl.prototype.$prepareContentConnector = function() {
	if (this.__obliterated) return;
    var m = this.get_contentaddress();
    if (m != null) {
        if (BaseObject.is(m, "Connector")) {
            this.$contentconnector = m;
			this.$applyParameters();
            // Old: m.set_parameters(this.$genParameters());
            return true;
        } else if (BaseObject.is(m, "string")) {
            if (this.connectorType != null && Function.classes[this.connectorType] != null) {
                if (!BaseObject.is(this.$contentconnector, this.connectorType)) {
                    // Different connector - replace it
                    var host = this.get_bindhost();
                    var opts = { };
                    if (this.get_lastCallProcessing()) opts.last = true;
					if (this.get_contentflags() != null) {
						if (this.get_contentflags() == -1) {
							opts.contentFlags = STUFFRESULT.ALL;
						} else {
							opts.contentFlags = this.get_contentflags();
						}
					}
                    if (host == null) {
                        this.$contentconnector = new Function.classes[this.connectorType](m, this, opts);
                    } else {
                        this.$contentconnector = new Function.classes[this.connectorType](m, host, opts);
                    }
                } else {
                    this.$contentconnector.resetState(m);
                }
				this.$applyParameters();
                // Old: this.$contentconnector.set_parameters(this.$genParameters());
                return true;
            }
        }
    }
    return false; // helps the comm methods to bail out
}.Description("Creates and configures the content connector if it is not set.");
DropChooserControl.prototype.$prepareCountConnector = function() {
	if (this.__obliterated) return;
    var m = this.get_itemscountaddress();
    if (m != null) {
        if (BaseObject.is(m, "Connector")) {
            this.$countconnector = m;
			this.$applyParameters();
            // Old: m.set_parameters(this.$genParameters());
            return true;
        } else if (BaseObject.is(m, "string")) {
            if (this.connectorType != null && Function.classes[this.connectorType] != null) {
                if (!BaseObject.is(this.$countConnector, this.connectorType)) {
                    // Different connector - replace it
                    var host = this.get_bindhost();
                    if (host == null) {
                        this.$countconnector = new Function.classes[this.connectorType](m, this);
                    } else {
                        this.$countconnector = new Function.classes[this.connectorType](m, host);
                    }
                } else {
                    this.$countconnector.resetState(m);
                }
				this.$applyParameters();
                // Old: this.$countconnector.set_parameters(this.$genParameters());
                return true;
            }
        }
    }
    return false; // helps the comm methods to bail out
};
DropChooserControl.prototype.$contentconnector = null;
DropChooserControl.prototype.get_contentconnector = function() {
	this.$prepareContentConnector();
	return this.$contentconnector;
}
// DropChooserControl.prototype.set_contentconnector = function(m) {
	// if (m != null && !BaseObject.is(m,"Connector")) {
		// throw "set_contentconnector is called with a value which is not null or a Connector derived class";
	// }
	// this.$contentconnector = m;
// }
DropChooserControl.prototype.$countconnector = null;
DropChooserControl.prototype.get_countconnector = function() {
	this.$prepareCountConnector();
	return this.$countconnector;
}
// DropChooserControl.prototype.set_countconnector = function() {
	// if (m != null && !BaseObject.is(m,"Connector")) {
		// throw "set_countconnector is called with a value which is not null or a Connector derived class";
	// }
	// this.$countconnector = m;
// }
//#endregion
DropChooserControl.prototype.get_items = function() {
	return this.$items;
}
DropChooserControl.prototype.set_items = function(v) {
	this.$items = v;
	this.discardAsync("update_targets");
	this.asyncUpdateTargets();
}
DropChooserControl.prototype.supplyPagedItems = function(start, end, params) {
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
				title: item[self.get_titleproperty()]
			};
		});
	}
	return result;	
}
DropChooserControl.prototype.get_bodyVisible = function () { return this.$bodyVisible; };
DropChooserControl.prototype.set_bodyVisible = function (v) {
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
				JBUtil.adjustPopupInHost(this, this.get_droppanel(), 0, -30);
                $(this.$el_drop).show();
				if (this.$obj_scrollable != null) {
					this.$obj_scrollable.onDataAreaChange();
				}
            }
        } else {
            $(this.$el_drop).hide();
        }
    }
};
DropChooserControl.prototype.Refresh = function() {
	if (this.get_disabled()) return;
	this.$obj_dataarea.loadContent();
}
DropChooserControl.prototype.goActive = function (e, dc) {
    if (this.get_disabled()) return;
    if (this.get_bodyVisible()) {
		return;
	}
    this.openevent.invoke(this, null);
    this.set_bodyVisible(true);
};
DropChooserControl.prototype.goInactive = function (e, dc) {
    if (!this.get_bodyVisible()) return;
    this.closeevent.invoke(this, null);
    this.set_bodyVisible(false);
};
DropChooserControl.prototype.toggleActive = function (e, dc) {
    if (this.get_bodyVisible()) {
        this.goInactive();
    } else {
        this.goActive();
    }
};
DropChooserControl.prototype.Open = function () {
    this.$schedulePending("open");
    // jbTrace.log("open");
};
DropChooserControl.prototype.Close = function () {
    this.$schedulePending("close");
    // jbTrace.log("close");
};
DropChooserControl.prototype.ForceClose = function () {
    this.$schedulePending("close", true);
    // jbTrace.log("close");
};
DropChooserControl.prototype.Toggle = function () {
    if (this.get_bodyVisible()) {
        this.$schedulePending("close");
    } else {
        this.$schedulePending("open");
    }
    // jbTrace.log("toggle");
};
DropChooserControl.prototype.$pendingOperationHandler = function () {
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
DropChooserControl.prototype.$pendingOperationHandlerWrapper = null;
DropChooserControl.prototype.$pendingOperation = null;
DropChooserControl.prototype.$schedulePending = function (op, force) {
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
// Inappropriate
DropChooserControl.prototype.get_selectedindex = function() {
	var items = this.get_items();
	var self = this;
	var key = this.get_keyproperty();
	if (BaseObject.is(items, "Array") && this.$value != null) {
		return items.FirstOrDefault(function(idx,itm) {
			if (itm[key] == self.$value) return idx;
			return null;
		});
	} else {
		return null;
	}
}
// Inappropriate
DropChooserControl.prototype.set_selectedindex = function(n) {
	var items = this.get_items();
	var key = this.get_keyproperty();
	if (BaseObject.is(items, "Array")) {
		if (items.length > n) {
			if (items[n] != null) {
				this.set_value(items[n][key]);
			}
		}
	}
}
// Inappropriate
DropChooserControl.prototype.get_selecteditem = function() {
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
DropChooserControl.prototype.get_selectedinternalitem = function() {
	var item = this.get_selecteditem();
	if (item == null) return null;
	return {
				key: item[this.get_keyproperty()],
				display: item[this.get_descproperty()],
				title: item[this.get_titleproperty()]
			};
}
DropChooserControl.prototype.set_selecteditem = function(v) {
	if (v == null) {
		this.set_value(null);
	} else {
		this.set_value(v[this.get_keyproperty()]);
	}
}
DropChooserControl.prototype.$value = null;
DropChooserControl.prototype.get_value = function() {
	return this.$value;
}
DropChooserControl.prototype.set_value = function(v) {
	if (this.$value != v) {
		this.$value = v;
		this.discardAsync("update_targets");
		this.asyncUpdateTargets();
		this.selchangedevent.invoke(this, this.get_selecteditem());
	}
}
DropChooserControl.prototype.onSelectionChanged = function(sender, dc) {
	this.Open();
}
DropChooserControl.prototype.onItemActivated = function(sender, dc) {
	if (dc != null) {
		this.set_value(dc.key);
		this.ForceClose();
        var k = this.get_originalitemkey();
        if (k != null && k.length > 0) {
            this.activatedevent.invoke(this, dc[k]);
		    this.selectionsuggestevent.invoke(this, dc[k]);    
        } else {
            this.activatedevent.invoke(this, dc);
		    this.selectionsuggestevent.invoke(this, dc);
        }
	}
}
DropChooserControl.$ignoreKeys = [9,13,27];
DropChooserControl.prototype.onSwallow = function (e) {
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
DropChooserControl.prototype.onKeyPress = function (evnt) {
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