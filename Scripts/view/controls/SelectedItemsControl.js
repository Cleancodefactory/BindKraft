
(function() {


    var IKeyboardProcessorImpl = InterfaceImplementer("IKeyboardProcessorImpl");

    function ISelectedItemsCallback() {}
    ISelectedItemsCallback.Interface("ISelectedItemsCallback");
    /**
     * @async
     * Translates the items bound directly to $items into the items displayable in the UI according to the item template used and identification used
     */
    ISelectedItemsCallback.prototype.translateItems = function(rawItems) { throw "Not implemented"; } // returns Operation<Array>|Array
    /**
     * @sync
     * Returns the same value translateItems will put in the identification property
     */
    ISelectedItemsCallback.prototype.identifyItem = function(rawItem) { throw "Not implemented"; } // returns Basic value

    

    /**
     * This component depends on translations provided by the host through the #interface ISelectedItemsCallback. The translation has to create 
     * an object for each item which can be anything, it just need to be in sync with the item template, but it also MUST HAVE a property named as the 
     * $identification parameter says.
     * 
     * Terminology:
     *  id - a value uniquely identifying an item
     *  identification - a field containing the id
     * 
     */
    function SelectedItemsControl() {
        Base.apply(this,arguments);
    }
    SelectedItemsControl.Inherit(Base, "SelectedItemsControl")
    .Implement(IUIControl)
    .Implement(IDisablable)
    .Implement(IKeyboardProcessorImpl)
    .Implement(ICustomParameterizationStdImpl, "identification", "interface")
    .Implement(IItemTemplateConsumerImpl)
    .Implement(ITemplateSourceImpl, new Defaults("templateName"), "autofill")
    .Implement(IItemTemplateSourceImpl, true, "single")
    .Defaults({
        templateName: "bindkraft/control-selecteditems"
    });

    SelectedItemsControl
        .ImplementActiveProperty("items", new Initialize("items shown in the list", null), true, function(oval, nval) {
            if (nval != null && !Array.isArray(nval)) {
                this.LASTERROR("items must be bound to an array or null");
            }
            // Setting the items even if the reference is the same can be often used to signal changes.
            this.$cachedItems.splice(0);
        })
        .ImplementProperty("interface", new Initialize("Bubble interface implementation of ISelectedItemsCallback"))
        .ImplementProperty("identification", new InitializeStringParameter("Property by which the items can be uniquely identified.", null), true, function(oval, nval) {
            this.ExecBeforeFinalInit(null, function() {
                var list = this.get_itemlist();
                if (BaseObject.is(list, "SelectableRepeater")) {
                    list.identification = nval;
                } else {
                    this.LASTERROR("Cannot find the items list (SelectableRepeater) - check your template!");
                }
            });
        })
        .ImplementProperty("itemlist");


    //#region Construction and initialization
    SelectedItemsControl.prototype.finalinit = function () {
        if (this.get_identification() != null) {
            if (this.get_itemlist() != null) {
                this.get_itemlist().identification = this.get_identification();
            }
        }
        if (this.get_itemTemplate() == null) {
            this.LASTERROR("No template for the selected items. Please specify the template as content of the control element.");
        } else {
            if (this.get_itemlist() == null) {
                this.LASTERROR("The template for the control does not bind the item list (SelectableRepeater) to the itemlist property.");
            } else {
                this.get_itemlist().set_itemTemplate(this.get_itemTemplate());
                this.keydataevent.add(new Delegate(this.get_itemlist(), this.get_itemlist().onKeyObject));
            }
        }
    };
    //#endregion

    //#region Events

    SelectedItemsControl.prototype.itemremovedevent = new InitializeEvent("Fired when one or more items have been removed");

    //#endregion

    //#region Data etc.
    SelectedItemsControl.prototype.TranslateItems = {
        ToTarget: function(v, bind, params) {
            return this.$translateItems(v); // Operation - the items binding MUST HAVE options=operation
        }
    }
    SelectedItemsControl.prototype.$cachedItems = new InitializeArray("Array of all the items which have been previously translated");
    SelectedItemsControl.prototype.$updateCache = function(transItems) { // TransItems have identification property
        var me = this;
        if (Array.isArray(transItems)) {
            var ind = this.get_identification();
            if (typeof ind != "string" || /^\s*$/.test(ind)) {
                this.LASTERROR("No identification specified");
                return;
            }
            for (var i = 0; i < transItems.length; i++) {
                // Use first or default to remove existing cache of the item in order to add it after that without more checks.
                var itm = this.$cachedItems.FirstOrDefault(function(idx, item) {
                    if (item[ind] == transItems[i][ind]) {
                        me.$cachedItems.splice(i,1);
                        return transItems[i];
                    }
                });
                this.$cachedItems.push(transItems[i]);
            }
        }
    }
    SelectedItemsControl.prototype.$mapRawItemsFromCache = function(rawItems) {
        var cache = this.$cachedItems;
        var ind = this.get_identification();
        if (typeof ind != "string" || /^\s*$/.test(ind)) {
            this.LASTERROR("No identification specified");
            return null;
        }
        if (Array.isArray(rawItems)) {
            return rawItems.Select(function(idx, item) { // item - raw item
                return cache.FirstOrDefault(function(_idx, _item) { // _item - translated cached item
                    if (_item[ind] == item[ind]) return _item;
                });
            });
        }
        return null;
    }
    SelectedItemsControl.prototype.$translateItems = function(allRawItems) {
        if (allRawItems == null) return Operation.From(null);
        if (!Array.isArray(allRawItems)) {
            this.LASTERROR("The items must be array of objects or null");
            return Operation.From(null);
        }
        var ind = this.get_identification();
        if (typeof ind != "string" || /^\s*$/.test(ind)) {
            this.LASTERROR("No identification specified");
            return Operation.From(allRawItems);
        }
        var iface = this.get_interface();
        if (BaseObject.is(iface, ISelectedItemsCallback)) {
            var me = this;
            var op = new Operation("Translated items");
            // Extract only non-cached items to minimize the external processing
            var forTrans = allRawItems.Select(function(idx, item) {
                if (me.$cachedItems.FirstOrDefault(function(i,it) {
                    if (iface.identifyItem(item) == it[ind]) return it;
                }) == null) return item;
            });
            if (forTrans.length > 0) {
                var r  = iface.translateItems(forTrans);// op or array
                if (BaseObject.is(r, "Operation")) {
                    r.onsuccess(function(_r) {
                        me.$updateCache(_r);
                        op.CompleteOperation(true, this.$mapRawItemsFromCache(allRawItems));
                    });
                } else {
                    this.$updateCache(r);
                    op.CompleteOperation(true, this.$mapRawItemsFromCache(allRawItems));
                }
            } else {
                op.CompleteOperation(true, this.$mapRawItemsFromCache(allRawItems));
            }

            return op;
        } else {
            return Operation.From(allRawItems);
        }

    }
    SelectedItemsControl.prototype.$removeRawItemById = function(id) {
        var originalItems = this.get_items();
        var iface = this.get_interface();
        if (BaseObject.is(iface, ISelectedItemsCallback)) {
            if (Array.isArray(originalItems)) {
                for (var i = originalItems.length - 1; i >= 0;i--) {
                    if (iface.identifyItem(originalItems[i]) == id) {
                        originalItems.splice(i,1);
                        return true;
                    }
                }
            }
        }
    }
    //#endregion

    //#region UI Callbacks
    /**
     * Handler removing the selected item
     */
    SelectedItemsControl.prototype.onSelectItem = function(sender, item) {
        var ind = this.get_identification();
        if (typeof ind != "string" || /^\s*$/.test(ind)) {
            this.LASTERROR("No identification specified");
            return;
        }
        if (item != null && item[ind] != null) {
            if (this.$removeRawItemById(item[ind])) {
                this.items_changed.invoke(this, null);
                this.itemremovedevent.invoke(this,null);
            }
        }
    }
    /**
     * Handler clearing the entire selection.
     */
    SelectedItemsControl.prototype.onClearAll = function() {
        var originalItems = this.get_items();
        if (Array.isArray(originalItems)) {
            originalItems.splice(0);
            this.items_changed.invoke(this, null);
            this.itemremovedevent.invoke(this,null);
        }
    }
    /**
     * A handler(sender, item) that can be directly bound to an $activatedevent or similar of a control that enables 
     * the user to select an item for adding to the selection.
     */
    SelectedItemsControl.prototype.onAddItem = function(e_sender, item) {
        if (item != null) {
            var originalItems = this.get_items();
            if (Array.isArray(originalItems)) {
                var iface = this.get_interface();
                if (BaseObject.is(iface, ISelectedItemsCallback)) {
                    var id = iface.identifyItem(item);
                    if (id != null) {
                        this.$removeRawItemById(id);
                        originalItems.push(item); 
                        this.items_changed.invoke(this, null);
                    } else {
                        this.LASTERROR("Cannot identify item", "onAddItem");
                    }
                } else {
                    this.LASTERROR("There is no callback interface - cannot identity item.");
                }
            } else {
                this.LASTERROR("Cannot add item if not bound to an existing array.");
            }
        }
    }
    //#endregion


})();