



/*CLASS*/
function Repeater(viewRootElement) {
    ViewBase.apply(this, arguments);
    //Repeater.instanceNum = (Repeater.instanceNum != null)? Repeater.instanceNum + 1:1;
    //this.instanceNum = Repeater.instanceNum;
}

Repeater.Inherit(ViewBase, "Repeater");
Repeater.Implement(ITemplateSource);
Repeater.Implement(IItemTemplateSource);
Repeater.prototype.obliterate = function() {
    if (this.root != null) delete this.root.jboundItemTemplate;
    ViewBase.prototype.obliterate.call(this);
}.Description("Destructor");

Repeater.prototype.itemschangedevent = new InitializeEvent("Fired when the items collection changes");
Repeater.ImplementProperty("optimizeitemupdates", new InitializeBooleanParameter("If set to true the repeater will try to avoid rematerializing the items when possible.",false));
Repeater.prototype.itemTemplate = null;
Repeater.prototype.storeIndexIn = new InitializeStringParameter("A name of a property to create in each item and store its index in it.", Initialize.DontInit);
Repeater.prototype.reverseMode = new InitializeStringParameter("If true like the items are shown in reverse order", false);
// example data-parameters="storeIndexIn='_viewdata.index'"
Repeater.prototype.hideDeleted = new InitializeBooleanParameter("Hide the elements with state deleted.", false);
Repeater.prototype.isTemplateRoot = function() { return false; };
Repeater.prototype.$limit = -1;
Repeater.prototype.$offset = 0;
Repeater.prototype.multiTemplate = new InitializeBooleanParameter("Enables/disables support for multi rooted templates. Default is false.", false);

Repeater.prototype.get_firstItemIndex = function() {
    if (BaseObject.is(this.$items, "Array")) {
        if (this.$offset >= 0 && this.$offset < this.$items.length) return this.$offset;
    }
    return 0;
}.Description ( "Returns index of first item or 0")
 .Returns("number");

Repeater.prototype.get_lastItemIndex = function() {
    if (BaseObject.is(this.$items, "Array")) {
        if (this.$limit < 0) return this.$items.length - 1;
		var c;
		if (this.reverseMode) {
			c = this.$offset - this.$limit;
			if (c >= 0 && c < this.$items.length) return c;
			return 0;
		} else {
			c = this.$offset + this.$limit - 1;
			if (c >= 0 && c < this.$items.length) return c;
			return this.$items.length - 1;
		}
    }
    return 0;
}.Description("Returns index of last item or 0")
 .Returns("number");

// the repeater cannot be used as template root! This will cause endless recursion.
Repeater.prototype.$isInitialized = false;

Repeater.prototype.$init = function() {
    // In the repeater we need to cut the innerHTML and keep it as a template for repeating items
    var el = $(this.root);
    if (this.get_itemTemplate() == null) {
        this.set_itemTemplate(el.Clean().children().clone()); //.Clean());
    }
    el.Empty();
    this.init();
    this.initializedevent.invoke(this,null);
    this.rebind(); // Default behaviour, items controls should override this
	this.templatenotapplied = true;
    this.$isInitialized = true;
}.Description( "Initializes the Repeater, copies from template and raizes an event" );

Repeater.prototype.init = function() {
    //alert("Repeater initialized: " + this.iid + "\n" + this.instanceNum);
}.Description("Empty method, reserved");

Repeater.prototype.get_itemTemplate = function(n) {
	if (n == null) return this.root.jboundItemTemplate;
	return null;
}.Description( "Gets the template" )
 .Returns("string or null");
Repeater.prototype.$templatenotapplied = false;
Repeater.prototype.set_itemTemplate = function(v) {
	if (arguments.length > 1) {
		if (arguments[0] == null) {
			this.root.jboundItemTemplate = arguments[1];
			this.$templatenotapplied = true;
		}
	} else {
		this.root.jboundItemTemplate = v;
		this.$templatenotapplied = true;
	}
}.Description( "Sets the template" )
 .Param("v","Template class ( html class ) ");

Repeater.prototype.get_template = function() {
	return this.get_itemTemplate();
}.Description("Returns the template")
 .Returns("string or null");

Repeater.prototype.set_template = function(v) {
	this.set_itemTemplate(v);
}.Description("Sets the template")
 .Param("v","Template class ( html class ) ");

Repeater.prototype.$items = null;
Repeater.prototype.get_items = function() {
    if (this.hideDeleted) {
        return BaseObject.is(this.$items, "Array") ? this.$items.Select(function(idx, item) {
            return (item != null && item[Binding.entityStatePropertyName] != DataStateEnum.Deleted) ? item : null;
        }) : this.$items;
    } else {
        return this.$items;
    }
}.Description("Returns all items")
 .Returns("array or null");

Repeater.prototype.set_items = function (newData) {
	var countnotchanged = (BaseObject.is(newData,"Array") && BaseObject.is(this.$items,"Array") && (newData.length == this.$items.length));
	
    this.$items = newData;
    if (this.getAsyncInstruction("items") > 0 && BaseObject.is(this.$items, "Array")) {
        this.discardAsync("set_items");
        this.discardAsync("update_descendants");
        var asyncOp = this.async(this.$asyncSetItems).key("set_items").maxAge(120000);
        asyncOp.execute(asyncOp); // passing itself
    } else {
        //if (!BaseObject.equals(newData,this.$items)) {
        // Recreate, rebind and update
		if (this.get_optimizeitemupdates() && countnotchanged && !this.templatenotapplied && this.$limit < 0 && this.$offset == 0 /*TODO: we have to account for offset and limit also */) {
			this.$createChildren(true);
		} else {
			this.$createChildren();
			this.rebind();
		}
        this.updateTargets();
        this.itemschangedevent.invoke(this, this.$items);
        //}
    }
}.Description("Sets the items to be repeated")
 .Param("newData","Array with the new items");

Repeater.prototype.$asyncSetItems = function (asyncOp) {
	this.$templatenotapplied = false;
    var el = $(this.root);
    if (this.get_itemTemplate() == null) return;
    el.Empty();
	if (this.reverseMode) {
		for (var i = this.$offset; i >= 0 && i < this.$items.length && (this.$limit < 0 || this.$offset - i < this.$limit); i -= this.getAsyncInstruction("items")) {
			this.asyncOp(this.$asyncSetSomeItems).maxAge(120000).chain(asyncOp).execute(i, el);
		}
	} else {
		for (var i = this.$offset; i < this.$items.length && (this.$limit < 0 || i - this.$offset < this.$limit); i += this.getAsyncInstruction("items")) {
			this.asyncOp(this.$asyncSetSomeItems).maxAge(120000).chain(asyncOp).execute(i, el);
		};
	}
    this.asyncUpdateTargets(null, false, asyncOp);
    asyncOp.then(this, function () {
        this.itemschangedevent.invoke(this, this.$items);
    });
}.Description("Sets items asynchronously")
 .Param("async","...");

Repeater.prototype.$asyncSetSomeItems = function (nStart, container) {
    if (this.$items != null) {
        var item, $items;
        $items = this.get_items();
        var o;
		if (this.reverseMode) {
			for (var i = nStart; i >= 0 && i < $items.length && (i > nStart - this.getAsyncInstruction("items")); i--) {
				item = $items[i];
				o = ViewBase.cloneTemplate(container, this.get_itemTemplate(), item, this.multiTemplate); // var o = $(this.itemTemplate).clone();
				if (this.storeIndexIn != null && this.storeIndexIn.length > 0) {
					BaseObject.setProperty(item, this.storeIndexIn, i);
				}
				this.$recursiveBind(o, false, false, true);
				this.$configureBindings();
			}
		} else {
			for (var i = nStart; i < $items.length && (i < nStart + this.getAsyncInstruction("items")); i++) {
				item = $items[i];
				o = ViewBase.cloneTemplate(container, this.get_itemTemplate(), item, this.multiTemplate); // var o = $(this.itemTemplate).clone();
				if (this.storeIndexIn != null && this.storeIndexIn.length > 0) {
					BaseObject.setProperty(item, this.storeIndexIn, i);
				}
				this.$recursiveBind(o, false, false, true);
				this.$configureBindings();
			}
		}
    }
}.Description("...")
 .Param("nStart","...")
 .Param("container","...");

Repeater.prototype.get_limit = function() {
    return this.$limit;
}.Description( "Gets the limit" );

Repeater.prototype.set_limit = function(v) {
    this.$limit = v;
    if (!this.$isInitialized) return;
    this.set_items(this.get_items());
}.Description( "Sets the limit, if the Repeater is not initialized" )
 .Param("v","Size of the limit");

Repeater.prototype.get_offset = function() {
    return this.$offset;
}.Description( "Gets the offset" );

Repeater.prototype.set_offset = function(v) {
    this.$offset = v;
    if (!this.$isInitialized) return;
    this.set_items(this.get_items());
}.Description( "Sets the offset, if the Repeater is not initialized" )
 .Param("v","Size of the offset");

Repeater.prototype.get_itemsCount = function() {
    var itms = this.get_items();
    var l = -1;
    if (itms != null && typeof itms.length == "number") l = itms.length;
    return l;
}.Description( "Returns the count of the items or -1 if there are none" )
 .Returns("number");

Repeater.prototype.$createChildren = function(setdataonly) {
	this.$templatenotapplied = false;
	var item, $items;
    var el = $(this.root);
    if (this.get_itemTemplate() == null) return;
	if (setdataonly) {
		$items = this.get_items();
		if (BaseObject.is($items, "Array")) {
			if (this.reverseMode) {
				var els = el.children(); // JQuery
				if (els.length > 0) {
					var item_element = els.get(0); // JQuery
					var g = ElementGroup.getElementSet(item_element); // we trust this code to always return an array
					var step = g.length;
					for (var i = this.$offset; i >= 0 && i < $items.length && (this.$limit < 0 || this.$offset - i < this.$limit); i--) {
						for (var j = 0; j < step; j++) {
							item_element = els.get((this.$offset - i) * step + j); // JQuery
						}
					}
				}
			} else {
				var els = el.children(); // JQuery
				if (els.length > 0) {
					var item_element = els.get(0); // JQuery
					var g = ElementGroup.getElementSet(item_element); // we trust this code to always return an array
					var step = g.length;
					for (var i = this.$offset; i < $items.length && (this.$limit < 0 || i - this.$offset < this.$limit); i ++) {
						for (var j = 0; j < step; j++) {
							item_element = els.get((i - this.$offset) * step + j); // JQuery
							item_element.dataContext = $items[i];
						}
					}
				}
			}
		}
	} else {
		el.Empty();
		if (this.$items != null) {
			var o;
			$items = this.get_items();
			if (BaseObject.is(this.$items, "Array")) {
				if (this.reverseMode) {
					for (var i = this.$offset; i >= 0 && i < $items.length && (this.$limit < 0 || this.$offset - i < this.$limit); i--) {
						item = $items[i];
						o = ViewBase.cloneTemplate(el, this.get_itemTemplate(), item, this.multiTemplate); // var o = $(this.itemTemplate).clone();
						if (this.storeIndexIn != null && this.storeIndexIn.length > 0) {
							BaseObject.setProperty(item, this.storeIndexIn, i);
						}
						// o.get(0).dataContext = item;
						//el.append(o);
					}
				} else {
					for (var i = this.$offset; i < $items.length && (this.$limit < 0 || i - this.$offset < this.$limit); i++) {
						item = $items[i];
						o = ViewBase.cloneTemplate(el, this.get_itemTemplate(), item, this.multiTemplate); // var o = $(this.itemTemplate).clone();
						if (this.storeIndexIn != null && this.storeIndexIn.length > 0) {
							BaseObject.setProperty(item, this.storeIndexIn, i);
						}
						// o.get(0).dataContext = item;
						//el.append(o);
					}
				}
			} else {
				for (item in $items) {
					//var o = $(this.itemTemplate).clone();
					//o.get(0).dataContext = item;
					o = ViewBase.cloneTemplate(el, this.get_itemTemplate(), $items[item], this.multiTemplate);
					if (this.storeIndexIn != null && this.storeIndexIn.length > 0) {
						BaseObject.setProperty($items[item], this.storeIndexIn, item);
					}
					//el.append(o);
				}
			}
		}
	}
}.Description("...");
