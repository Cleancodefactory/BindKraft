


/* Bucket selector - select multiple items by moving them from one list to another
    Important
        Parameters:
            templateName, keyName,displayName
            storeIndexIn, saveorderprop, orderable
            selectedTitle, nonselectedTitle
            trackstate, mode
        Binds:
            FeedIn:
                $items
            Selection:
                $selectedkeys, get_nonselecteditems, $trulyselectedkeys, $selecteditems
                $materialitems
                get_hasselecteditems, get_hasunselecteditems

*/
/*CLASS*/
function BucketSelectorControl() {
    Base.apply(this, arguments);
}
BucketSelectorControl.Inherit(Base, "BucketSelectorControl");
BucketSelectorControl.Implement(IUIControl);
BucketSelectorControl.Implement(ITemplateSourceImpl, new Defaults("templateName", "bindkraft/control-vbucketselector"));
BucketSelectorControl.$defaults = {
	templateName: "bindkraft/control-vbucketselector"
};

// Events
BucketSelectorControl.prototype.itemschangedevent = new InitializeEvent("Fired whenever the items are changed");
BucketSelectorControl.prototype.selchangedevent = new InitializeEvent("Fired whenever the selection changes");
BucketSelectorControl.prototype.transferelement = new InitializeEvent("Fired whenever the element is transferred");
BucketSelectorControl.prototype.selectelementevent = new InitializeEvent("Fired when element(s) gets selected");
BucketSelectorControl.prototype.unselectelementevent = new InitializeEvent("Fired when element(s) gets unselected");
// Parameters
BucketSelectorControl.prototype.asynchUpdate = new InitializeBooleanParameter("Update targets occurs asynchronously later in time.", true); 
BucketSelectorControl.prototype.keyName = new InitializeStringParameter("The name of the key property by which the items are uniquely recognized.", "key");
BucketSelectorControl.prototype.displayName = new InitializeStringParameter("The name of the display property which is shown to the user in the list.", "description");
BucketSelectorControl.prototype.storeIndexIn = new InitializeStringParameter("The name of the property in which the order index is stored (only for the selected items).", null);
BucketSelectorControl.ImplementProperty("useproperties", new InitializeStringParameter("A comma separated list of property names of the properties to use in the repeaters. Copies them to the proxy objects and back, the key and description are reserved names.", null));
BucketSelectorControl.ImplementProperty("saveorderprop", new InitializeStringParameter("Takes effect only in orderable buckets. The name of the property to save the order index in.", null));
//BucketSelectorControl.ImplementProperty("setstate", new InitializeStringParameter("Set the state of the selected items to something", null));
BucketSelectorControl.ImplementProperty("orderable", new InitializeBooleanParameter("Allow ordering of the selected items", false));
// BucketSelectorControl.ImplementProperty("templateName", new InitializeStringParameter("The id of the control template. Null denotes the standard built-in templates.", null));
BucketSelectorControl.ImplementProperty("nonselectedTitle", new InitializeStringParameter("The title for the non-selected items.", "Not selected"));
BucketSelectorControl.ImplementProperty("selectedTitle", new InitializeStringParameter("The title for the selected items.", "Selected"));
BucketSelectorControl.ImplementProperty("enforcestate", new InitializeStringParameter("State to set on all selected elements. The state is set when they are read through get_selecteditems ONLY!", null));
BucketSelectorControl.ImplementProperty("trackstate", new InitializeBooleanParameter("Track the items state as they get selected or unseleced by the user (ONLY!)", false));
BucketSelectorControl.ImplementProperty("updateitems", new InitializeBooleanParameter("set_selecteditems will replace the existing items with the ones being set.", false));
BucketSelectorControl.ImplementProperty("cloneitems", new InitializeBooleanParameter("Creates a clone of the $items and works with them.", false));
BucketSelectorControl.ImplementProperty("initstate", new InitializeStringParameter("If specified initializes all the new $items to the state specified.", null));

BucketSelectorControl.ImplementActiveProperty("shownonselectedfilter", new InitializeBooleanParameter("Show (true)/hide (false) the filter textbox for the non-selected items.", false));
BucketSelectorControl.ImplementActiveProperty("showselectedfilter", new InitializeBooleanParameter("Show (true)/hide (false) the filter textbox for the selected items.", false));
BucketSelectorControl.prototype.get_anyfiltervisible = function() {
	return (this.get_shownonselectedfilter() || this.get_showselectedfilter());
}

BucketSelectorControl.prototype.$mode = null;
BucketSelectorControl.prototype.set_mode = function (v) {
    this.$mode = v;
    if (v == "entity") {
        this.set_trackstate(true);
        this.set_updateitems(true);
        this.set_cloneitems(true);
        this.set_initstate(DataStateEnum.Undefined);
        this.clearCachedProxies();
    }
};
BucketSelectorControl.prototype.get_mode = function () {
    return this.$mode;
};
BucketSelectorControl.prototype.init = function () {
    var el = $(this.root);
    var tml = this.get_template();
    el.empty();
    el.append(tml);
}
/* Deprecated - keep it for awhile - we have to create policy for multi-template controls
BucketSelectorControl.prototype.$init = function () {
    var el = $(this.root);
    var tml;
    if (this.get_templateName() != null) {
        tml = $(this.get_templateName());
    } else {
        tml = ((this.get_orderable()) ? $(".j_framework_control_orderedbucketselector") : $(".j_framework_control_vbucketselector"));
    }
    el.empty();
    el.append(tml.children().clone());
    Base.prototype.$init.apply(this, arguments);
};
*/
BucketSelectorControl.prototype.$items = null;
BucketSelectorControl.prototype.get_items = function () {
    return this.$items;
};
BucketSelectorControl.prototype.set_items = function (v) {
    if (this.get_cloneitems()) {
        this.$items = ((v != null) ? BaseObject.DeepClone(v) : null);
    } else {
        this.$items = v;
    }
    this.clearCachedProxies();
    if (this.get_initstate() != null && this.get_initstate() != "") {
        Binding.entityState(this.$items, this.get_initstate());
    }
    if (this.asynchUpdate) {
        EventPump.Default().post(new Dispatchable(new Delegate(this, this.$asyncUpdateTargetsOnSetItems)));
    } else {
        this.$resetUpdateTransaction();
        this.updateTargets();
        this.$resetUpdateTransaction();
        this.itemschangedevent.invoke(this, this.$items);
    }
};
BucketSelectorControl.prototype.$selectedkeys = new InitializeArray("Selected keys");
BucketSelectorControl.prototype.$asyncUpdateTargetsOnSetItems = function () {
    this.$resetUpdateTransaction();
    this.updateTargets();
    this.$resetUpdateTransaction();
    this.itemschangedevent.invoke(this, this.$items);
}

BucketSelectorControl.prototype.getItemByKey = function (_key) {
    var self = this;
    if (BaseObject.is(this.$items, "Array")) {
        return this.$items.FirstOrDefault(function (idx, itm) {
            return ((itm[self.keyName] == _key) ? itm : null);
        });
    }
    return null;
};
BucketSelectorControl.prototype.set_selectedkeys = function (v) {
    this.clearCachedProxies();
    if (BaseObject.is(v, "Array")) {
        this.$selectedkeys = v;
    } else {
        if (this.$selectedkeys == null) this.$selectedkeys = [];
        //this.$selectedkeys.push(v);
        this.$selectedkeys.addElement(v);
    }
    this.$updateOrderProp();
    if (this.asynchUpdate) {
        EventPump.Default().post(new Dispatchable(new Delegate(this, this.$asyncUpdateTargetsOnSelChanged)));
    } else {
        this.$resetUpdateTransaction();
        this.updateTargets();
        this.$resetUpdateTransaction();
        this.selchangedevent.invoke(this, this.$selectedkeys);
    }
};
BucketSelectorControl.prototype.$asyncUpdateTargetsOnSelChanged = function () {
    this.$resetUpdateTransaction();
    this.updateTargets();
    this.$resetUpdateTransaction();
    this.selchangedevent.invoke(this, this.$selectedkeys);
}
BucketSelectorControl.prototype.get_selectedkeys = function () {
    if (this.$selectedkeys == null) {
        this.$selectedkeys = [];
    }
    return this.$selectedkeys;
};
BucketSelectorControl.prototype.onUpdateSelectedKeysFromUI = function (e_s, dc, binding) { // Requires a ref[selected]
    // Read the proxy items from the list
    var lst = binding.getRef("selected");
    if (lst != null && BaseObject.is(lst, "Array")) {
        this.clearCachedProxies();
        this.$selectedkeys = lst.Select(function (idx, item) { return item.key; });
        this.$updateOrderProp();
        this.selchangedevent.invoke(this, this.$selectedkeys);
    }
};
BucketSelectorControl.prototype.copyUseProps = function (o1, o2) {
    if (this.get_useproperties() != null && this.get_useproperties().length > 0) {
        if (o1 != null && o2 != null) {
            var arr = this.get_useproperties().split(",");
            if (arr != null) {
                for (var i = 0; i < arr.length; i++) {
                    if (typeof o1[arr[i]] != "undefined") o2[arr[i]] = o1[arr[i]];
                }
            }
        }
    }
};
BucketSelectorControl.prototype.itemsBySelectionUnOrdered = function (sel) {
    if (BaseObject.is(this.$items, "Array")) {
        var self = this;
        return this.$items.Select(function (idx, item) {
            var key = item[self.keyName];
            if (self.$selectedkeys.FirstOrDefault(function (idx, _key) {
                return ((_key == key) ? true : null);
            })) {
                if (sel) return item;
            } else {
                if (!sel) return item;
            };
            return null;
        });
    }
    return this.$items;
};
BucketSelectorControl.prototype.itemsBySelection = function (sel) {
    if (BaseObject.is(this.$items, "Array")) {
        var self = this;
        //var copyprops = false;
        //if (this.get_useproperties() != null && this.get_useproperties().length > 0) copyprops = true;
        if (sel) {
            return this.$selectedkeys.Select(function (idx, _key) {
                return self.$items.FirstOrDefault(function (idx2, item) {
                    if (item[self.keyName] == _key) {
                        if (self.storeIndexIn != null && self.storeIndexIn.length > 0) item[self.storeIndexIn] = idx;
                        return item;
                    } else {
                        return null;
                    }
                });
            });
        } else {
            return this.$items.Select(function (idx, item) {
                var key = item[self.keyName];
                if (self.$selectedkeys.FirstOrDefault(function (idx, _key) {
                    return ((_key == key) ? true : null);
                })) {
                    return null;
                } else {
                    return item;
                }
            });
        }
    }
    return this.$items;
};
BucketSelectorControl.prototype.get_hasselecteditems = function () {
    if (BaseObject.is(this.$items, "Array")) {
        if (this.$selectedkeys == null || this.$selectedkeys.length == 0) return false;
        return true;
    }
    return true;
};
BucketSelectorControl.prototype.get_hasunselecteditems = function () {
    if (BaseObject.is(this.$items, "Array")) {
        if (this.$selectedkeys != null && this.$selectedkeys.length >= this.$items.length) return false;
        return true;
    }
    return true;
};
BucketSelectorControl.prototype.$updateOrderProp = function () {
    var p = this.get_saveorderprop();
    var keyName = this.keyName;
    var $selectedkeys = this.$selectedkeys;
    if (BaseObject.is(p, "string") && p.length > 0) {
        if (BaseObject.is(this.$items, "Array") && BaseObject.is(this.$selectedkeys, "Array")) {
            this.$items.Select(function (idx, item) {
                var k = ((item != null) ? item[keyName] : null);
                var ord = $selectedkeys.findElement(k);
                if (k != null) item[p] = (ord >= 0) ? ord : null;
            });
        }
    }
};
BucketSelectorControl.prototype.get_selecteditems = function () {
    var result = this.itemsBySelection(true);
    var enforce_state = ((this.get_enforcestate() == null) ? null : DataStateEnum[this.get_enforcestate()]);
    if (BaseObject.is(result, "Array") && (enforce_state != null)) result.Select(function (idx, itm) {
        itm[Binding.entityStatePropertyName] = enforce_state;
        return null;
    });
    return result;
};
BucketSelectorControl.prototype.$updateItems = function (arrItems) {
    var self = this;
    if (BaseObject.is(this.$items, "Array")) {
        this.$items.Select(function (idx, itm) {
            var initem = arrItems.FirstOrDefault(function (idx1, el) {
                if (itm[self.keyName] == el[self.keyName]) {
                    for (var k in el) {
                        if (k != Binding.entityStatePropertyName || k != Binding.entityOldStatePropertyName) {
                            itm[k] = el[k];
                        }
                    }
                    return itm;
                }
                return null;
            });
        });
    }
};
BucketSelectorControl.prototype.set_selecteditems = function (arrItems) {
    if (BaseObject.is(arrItems, "Array")) {
        var self = this;
        this.set_selectedkeys(arrItems.Select(function (idx, itm) {
            return itm[self.keyName];
        }));
        if (this.get_updateitems()) this.$updateItems(arrItems);
        // Read this! When you define a selection by setting a set of items there are two possible cases:
        // a) you just want to make sure the matching items in the bucket are selected (whatever the matching actually means)
        // b) you may want to be shure also that the items inside the bucket are exactly the 
        //      items you are passing to set_selecteditems - then you need updateitems parameter to be set to true!
    } else if (arrItems != null) { // Assume this is a single item
        this.set_selectedkeys(arrItems[keyName]);
        if (this.get_updateitems()) this.$updateItems([arrItems]);
    } else if (arrItems == null) {
        this.unSelectAll(true);
    }
    // todo: May be an error?!?
};
BucketSelectorControl.prototype.get_materialitems = function () {
    if (BaseObject.is(this.$items, "Array")) {
        return this.$items.Select(function (idx, item) {
            if (Binding.entityStateIsMaterial(item)) return item;
            return null;
        });
    }
    return null;
};
BucketSelectorControl.prototype.set_materialitems = function (arrItems) {
    if (BaseObject.is(arrItems, "Array")) {
        var self = this;
        this.set_selectedkeys(arrItems.Select(function (idx, itm) {
            if (Binding.entityStateWillExist(itm)) return itm[self.keyName];
            return null;
        }));
        if (this.get_updateitems()) this.$updateItems(arrItems);
    } else if (arrItems != null) { // Assume this is a single item
        if (Binding.entityStateWillExist(arrItems)) this.set_selectedkeys(arrItems[keyName]);
        if (this.get_updateitems()) this.$updateItems([arrItems]);
    } else if (arrItems == null) {
        this.unSelectAll(true);
    }
};
BucketSelectorControl.prototype.get_nonselecteditems = function () {
    return this.itemsBySelection(false);
};
BucketSelectorControl.prototype.proxyItemsBySelectionUnOrdered = function (sel) {
    if (BaseObject.is(this.$items, "Array")) {
        var self = this;
        return this.$items.Select(function (idx, item) {
            var key = item[self.keyName];
            if (self.$selectedkeys.FirstOrDefault(function (idx, _key) {
                return ((_key == key) ? true : null);
            })) {
                if (sel) return { key: item[self.keyName], display: item[self.displayName]};
            } else {
                if (!sel)return { key: item[self.keyName], display: item[self.displayName]};
            };
            return null;
        });
    }
    return this.$items;
};
BucketSelectorControl.prototype.genProps = function (proxy, item, prp) {
    var self = this;
    var arrprop = prp.split(":");
    var apname = prp;
    if (arrprop != null && arrprop.length > 1) {
        prp = arrprop[0];
        apname = arrprop[1];
    }
    proxy["get_" + apname] = function () {
        if (prp.charAt(0) == "$") {
            return item["get_" + prp.slice(1)]();
        } else {
            return item[prp];
        }
    };
    proxy["set_" + apname] = function (v) {
        if (prp.charAt(0) == "$") {
            item["set_" + prp.slice(1)](v);
        } else {
            item[prp] = v;
        }
    };
};


BucketSelectorControl.prototype.proxyItemsBySelection = function (sel) {
    if (BaseObject.is(this.$items, "Array")) {
        var self = this;
        var itm, arrprops = null;
        if (this.get_useproperties() != null && this.get_useproperties().length > 0) {
            arrprops = this.get_useproperties().split(",");
        }
        if (sel) {
            return this.$selectedkeys.Select(function (idx, _key) {
                return self.$items.FirstOrDefault(function (idx2, item) {
                    if (item[self.keyName] == _key) {
                        itm = { key: item[self.keyName], display: item[self.displayName] };
                        if (arrprops != null) {
                            for (var i = 0; i < arrprops.length; i++) {

                                self.genProps(itm, item, arrprops[i]);
                            }
                        }
                        return itm;
                    } else {
                        return null;
                    }
                });
            });
        } else {
            return this.$items.Select(function (idx, item) {
                var key = item[self.keyName];
                if (self.$selectedkeys.FirstOrDefault(function (idx, _key) {
                    return ((_key == key) ? true : null);
                })) {
                    return null;
                } else {
                    return { key: item[self.keyName], display: item[self.displayName] };
                };
                return null;
            });
        }
    }
    return this.$items;
};
/*
BucketSelectorControl.prototype.dsSelectedProxyItems = {
    dataSourceCount: function () {
        return ((this.$selectedkeys != null) ? this.$selectedkeys.length : 0);
    },
    dataSourceGet: function (cond, offset, limit) {
        var _offset = (offset != null) ? offset : 1;
        if (_offset < 1) _offset = 1;
        var _limit = ((limit != null) ? offset + limit : this.$selectedkeys.length);
        var results = [];
        var key, itm;
        var self = this;
        for (var i = offset - 1; i < limit; i++) {
            key = this.$selectedkeys[i];
            itm = this.$items.FirstOrDefault(function (idx, item) {
                if (item[self.keyName] == _key) {
                    itm = { key: item[self.keyName], display: item[self.displayName] };
                    if (arrprops != null) {
                        for (var i = 0; i < arrprops.length; i++) {
                            self.genProps(itm, item, arrprops[i]);
                        }
                    }
                    return itm;
                }
            });
            if (itm != null) results.push(itm);
        }
        return results;
    }
};
*/
BucketSelectorControl.prototype.$unselectedCache = null;
// Begin Cache
BucketSelectorControl.prototype.cachedUnselected = new InitializeDelegatedProperty("The cached unselected proxies", function () {
    var self = this;
    if (BaseObject.is(this.$items, "Array")) {
        return this.$items.Select(function (idx, item) {
            var key = item[self.keyName];
            if (self.$selectedkeys.FirstOrDefault(function (idx, _key) {
                return ((_key == key) ? true : null);
            })) {
                return null;
            } else {
                return { key: item[self.keyName], display: item[self.displayName] };
            };
            return null;
        });
    }
    return this.$items;
});
BucketSelectorControl.prototype.cachedSelected = new InitializeDelegatedProperty("The cached selected proxies", function () {
    if (BaseObject.is(this.$items, "Array")) {
        var self = this;
        var itm, arrprops = null;
        if (this.get_useproperties() != null && this.get_useproperties().length > 0) {
            arrprops = this.get_useproperties().split(",");
        }
        return this.$selectedkeys.Select(function (idx, _key) {
            return self.$items.FirstOrDefault(function (idx2, item) {
                if (item[self.keyName] == _key) {
                    itm = { key: item[self.keyName], display: item[self.displayName] };
                    if (arrprops != null) {
                        for (var i = 0; i < arrprops.length; i++) {
                            self.genProps(itm, item, arrprops[i]);
                        }
                    }
                    return itm;
                } else {
                    return null;
                }
            });
        });
    }
    return this.$items;
});
BucketSelectorControl.prototype.clearCachedProxies = function () {
    this.cachedSelected.clear();
    this.cachedUnselected.clear();
}
BucketSelectorControl.prototype.get_cachedselectedproxyitems = function () {
    return this.cachedSelected.get();
}
BucketSelectorControl.prototype.get_cachednonselectedproxyitems = function () {
    return this.cachedUnselected.get();
}
// End Cache
/*
BucketSelectorControl.prototype.dsUnselectedProxyItems = {
    dataSourceCount: function () {
        return ((this.$selectedkeys != null && this.$items != null) ? this.$items.length - this.$selectedkeys.length : 0);
    },
    dataSourceGet: function (cond, offset, limit) {
        if (this.$items == null) return null;
        var key;
        if (this.$unselectedCache == null) {
            // Regenerate
            this.$unselectedCache = this.$items.Select(function (idx, item) {
                var key = item[self.keyName];
                if (self.$selectedkeys.FirstOrDefault(function (idx, _key) {
                    return ((_key == key) ? true : null);
                })) {
                    return null;
                } else {
                    return { key: item[self.keyName], display: item[self.displayName] };
                };
                return null;
            });
        }
        if (this.$unselectedCache == null) return null;
        return this.$unselectedCache.slice(((offset != null) ? offset - 1 : 0), ((limit != null) ? offset + limit - 1 : this.$unselectedCache.length - 1));
    }
};
*/
BucketSelectorControl.prototype.get_selectedproxyitems = function () {
    var m1 = (new Date()).getTime();
    var r = this.proxyItemsBySelection(true);
    var m2 = (new Date()).getTime();
    return r;
};
BucketSelectorControl.prototype.get_nonselectedproxyitems = function () {
    return this.proxyItemsBySelection(false);
};
BucketSelectorControl.prototype.selectItem = function (item) {
    var skeys = this.get_selectedkeys();
    this.clearCachedProxies();
    skeys.addElement(item[this.keyName]);
    this.$updateOrderProp();
    this.$resetUpdateTransaction();
    this.updateTargets();
    this.$resetUpdateTransaction();
    this.selchangedevent.invoke(this, this.$selectedkeys);
    this.selectelementevent.invoke(this, item);
};
BucketSelectorControl.prototype.selectKey = function (key) {
    if (key == null) return;
    var skeys = this.get_selectedkeys();
    skeys.addElement(key);
    this.clearCachedProxies();
    this.$updateOrderProp();
    this.$resetUpdateTransaction();
    this.updateTargets();
    this.$resetUpdateTransaction();
    //set this so I know it is removing or adding value from the bucket
    this.removeElement = false;
    this.selchangedevent.invoke(this, this.$selectedkeys);
    var _selItem = this.getItemByKey(key);
    this.transferelement.invoke(this, _selItem, true);
    this.selectelementevent.invoke(this, _selItem);
    if (this.get_trackstate()) {
        Binding.markChangedState(_selItem, true);
    }
};
BucketSelectorControl.prototype.onSelectProxy = function (source, proxyitem) {
    this.selectKey(proxyitem.key);
};
BucketSelectorControl.prototype.onAddSelected = function (source, dc, binding) {
    this.selectKey(binding.getRef("key"));
};
BucketSelectorControl.prototype.unSelectItem = function (item) {
    var skeys = this.get_selectedkeys();
    skeys.removeElement(item[this.keyName]);
    this.clearCachedProxies();
    this.$updateOrderProp();
    this.$resetUpdateTransaction();
    this.updateTargets();
    this.$resetUpdateTransaction();
    this.selchangedevent.invoke(this, this.$selectedkeys);
};
BucketSelectorControl.prototype.unSelectKey = function (key) {
    if (key == null) return;
    var skeys = this.get_selectedkeys();
    skeys.removeElement(key);
    this.clearCachedProxies();
    this.$updateOrderProp();
    this.$resetUpdateTransaction();
    this.updateTargets();
    this.$resetUpdateTransaction();
    //set this so I know it is removing a value from the bucket
    this.removeElement = true;
    this.selchangedevent.invoke(this, this.$selectedkeys);
    var _selItem = this.getItemByKey(key);
    this.transferelement.invoke(this, _selItem, false);
    this.unselectelementevent.invoke(this, _selItem);
    if (this.get_trackstate()) {
        Binding.markDeletedState(_selItem);
    }
};
BucketSelectorControl.prototype.onUnSelectProxy = function (source, proxyitem) {
    this.unSelectKey(proxyitem.key);
};
BucketSelectorControl.prototype.onRemoveSelected = function (source, dc, binding) {
    this.unSelectKey(binding.getRef("key"));
};
BucketSelectorControl.prototype.selectAll = function (bNoEvents) {
    if (this.$items != null) {
        var self = this;
        var arr = this.$items.Select(function (idx, itm) {
            return itm[self.keyName];
        });
        this.$selectedkeys = arr;
        this.$updateOrderProp();
    }
    this.clearCachedProxies();
    this.$resetUpdateTransaction();
    this.updateTargets();
    this.$resetUpdateTransaction();
    this.selchangedevent.invoke(this, this.$selectedkeys);
    if (bNoEvents !== true) {
        this.transferelement.invoke(this, this.$items);
        this.selectelementevent.invoke(this, this.$items);
        Binding.markChangedState(this.$items, true);
    }
};
BucketSelectorControl.prototype.unSelectAll = function (bNoEvents) {
    this.$selectedkeys = [];
    this.clearCachedProxies();
    this.$updateOrderProp();
    this.$resetUpdateTransaction();
    this.updateTargets();
    this.$resetUpdateTransaction();
    this.selchangedevent.invoke(this, this.$selectedkeys);
    if (bNoEvents !== true) {
        this.transferelement.invoke(this, this.$items);
        this.unselectelementevent.invoke(this, this.$items);
        Binding.markDeletedState(this.$items);
    }
};
BucketSelectorControl.prototype.isKeySelected = function (key) {
    if (BaseObject.is(this.$selectedkeys, "Array")) {
        return this.$selectedkeys.FirstOrDefault(function (idx, k) {
            if (k == key) return true;
            return null;
        });
    }
    return false;
};
BucketSelectorControl.prototype.isItemSelected = function (itm) {
    if (itm != null && BaseObject.is(this.keyName, "string")) {
        return this.isKeySelected(itm[this.keyName]);
    }
    return false;
};
BucketSelectorControl.prototype.set_trulyselectedkeys = function (v) {
    this.set_selectedkeys(v);
}
BucketSelectorControl.prototype.get_trulyselectedkeys = function () {
    if (this.$selectedkeys == null) {
        this.$selectedkeys = [];
    }
    var self = this;
    var itms = this.get_selecteditems();
    if (itms != null && this.$items != null) {
        return this.$selectedkeys.Select(function (idx, _key) {
            return self.$items.FirstOrDefault(function (idx2, item) {
                if (item[self.keyName] == _key) {
                    return _key;
                } else {
                    return null;
                }
            });
        });
    } else {
        return [];
    }
};