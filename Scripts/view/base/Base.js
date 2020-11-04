


/*CLASS*/
function Base(viewRootElement) {
    this.$setRootElement(viewRootElement);
	DataHolder.apply(this, arguments);
	this.$finalInitPending = true;
	this.initializedevent.set_adviseNewComers(true);
    this.postinitializedevent.set_adviseNewComers(true);
}
Base.Inherit(DataHolder, "Base");
Base.interfaces = { PBase: true }; // Obsolete - will be removed soon
Base.Implement(IStructuralQueryRouter)
    .Implement(IStructuralQueryEmiter)
    .Implement(IFindService)
    .Implement(IDOMConnectedObject)
    .Implement(IEventSubscriberImpl);

Base.registerDOMDestructor("activeClass");
Base.getRelatedElements = function (baseEl, patt) {
    return JBUtil.getRelatedElements(baseEl, patt);
};
Base.getRelatedObjects = function (baseEl, patt, types) {
    return JBUtil.getRelatedObjects.apply(JBUtil, arguments);
};
//                              1         2          3          4          5          6          7
Base.$reAsyncInstruction = /^(\d+)?(?:M(\d+))?(?:R(\d+))?(?:B(\d+))?(?:D(\d+))?(?:I(\d+))?(?:C(\d+))?$/i;
Base.prototype.obliterate = function (bFull) {
    this.unsubscribeAll();
    this.unBind();
    if (this.root != null && this.root.activeClass != null) {
        try {                               ////// TODO: Workaround for cases when trying to delete objects from another browser window. Needs better solution.
            delete this.root.activeClass;
        }
        catch (e) {

        }
    }
    DataHolder.prototype.obliterate.call(this, bFull);
};
// Event handling helper
/* Replaced by implementing IEventSubscriberImpl
Base.prototype.$generalDispatcherHandlers = null;
Base.prototype.subscribeFor = function(evenDisp, handler, priority) {
    if (handler != null && BaseObject.is(evenDisp, "IEventDispatcher")) {
        var handlerHelper = EventHandlerHelperRegister.On(this, "$generalDispatcherHandlers").bind(this, handler);
        handlerHelper.to(evenDisp, priority);
        return handlerHelper;
    }
    return null;
}
Base.prototype.unsubscribeAll = function() {
    EventHandlerHelperRegister.On(this, "$generalDispatcherHandlers").unbind();
}
*/

// examples 
// on a Repeater data-async="I10"
// on whatever data-async="B10D5"
Base.prototype.getAsyncInstruction = function (kind) {
    if (this.$asyncInstruction == null) {
        this.$asyncInstruction = 0;
        if (this.root != null) {
            var val = $(this.root).attr("data-async");
            if (val != null && val != "") {
                var arr = Base.$reAsyncInstruction.exec(val);
                if (arr != null && arr.length > 0) {
                    var def = ((arr[1] != null && arr[1].length > 0) ? parseInt(arr[1], 10) : 0);
                    this.$asyncInstruction = {
                        defaultValue: ((arr[1] != null && arr[1].length > 0) ? parseInt(arr[1], 10) : def),
                        materialize: ((arr[2] != null && arr[2].length > 0) ? parseInt(arr[2], 10) : def),
                        rebind: ((arr[3] != null && arr[3].length > 0) ? parseInt(arr[3], 10) : def),
                        bind: ((arr[4] != null && arr[4].length > 0) ? parseInt(arr[4], 10) : def), // update targets
                        descent: ((arr[5] != null && arr[5].length > 0) ? parseInt(arr[5], 10) : def),
                        items: ((arr[6] != null && arr[6].length > 0) ? parseInt(arr[6], 10) : def),
                        custom: ((arr[7] != null && arr[7].length > 0) ? parseInt(arr[7], 10) : def)
                    };
                } else {
                    val = parseInt(val, 10);
                    if (!isNaN(val)) {
                        this.$asyncInstruction = val;
                    }
                }
            }
        }
    }
    if (typeof this.$asyncInstruction == "number") return this.$asyncInstruction;
    if (typeof this.$asyncInstruction == "object") {
        if (typeof kind == "string") {
            if (this.$asyncInstruction[kind] != null) return this.$asyncInstruction[kind];
            return this.$asyncInstruction.defaultValue;
        } else {
            return this.$asyncInstruction.defaultValue;
        }
    }
    return 0; // Just in case some change above breaks it up
}
// Work in progress - replacing core jquery dependent stuff gradually. Adding some other DOM management members too.
// +V: 2.17.7
//  V: 2.17.10 - will not return null, but non-initialized DOMUtilElement inetead - check DOMUtilElement.prototype.get_isepty().
Base.prototype.$ = function(selector) {
	if (typeof selector == "string") {
		try {
			var el = DOMUtil.queryOne(this.root, selector);
			return new DOMUtilElement(el);
		} catch (ex) {
			return new DOMUtilElement();
		}
	} else if (selector instanceof HTMLElement) {
		return new DOMUtilElement(selector);
	} else if (BaseObject.isJQuery(selector)) { 
		if (selector.length > 0) {
			return this.$(selector.get(0));
		}
	} else if (window.DOMMNode && selector instanceof DOMMNode) {
		if (selector._node != null) return this.$(selector._node);
	} else {
		return new DOMUtilElement(this.root);
	}
	return new DOMUtilElement();
}
// -V: 2.17.7
Base.prototype.isLive = function () { // True if the element is in the dom
	return (this.$().findParent("html") != null);
    // return ($(this.root).closest("html").length > 0);
};
Base.prototype.get_liveelement = function () { // Returns a jquery wrapped element if the element is live (attached to DOM)
    if (this.root != null) {
        var j = $(this.root);
        if (j.closest("html").length > 0) return j;
    }
    return null;
};
// IDOMConnectedObject implementation
Base.prototype.get_connecteddomelement = function (key) {
    return ((this.root != null) ? $(this.root) : null);
}
// IStructuralQueryRouter implementation
Base.prototype.get_structuralQueryRoutingType = function () { return "DOM"; };
Base.prototype.routeStructuralQuery = function (query, processInstructions) {
    var pinst = (processInstructions == null) ? { routingType: "DOM"} : processInstructions;
    return JBUtil.throwStructuralQuery(this.root, query, pinst);
}

Base.prototype.$setRootElement = function (viewRootElement) {
    if (this.root != null) this.root.activeClass = null;
    if (viewRootElement != null && viewRootElement.length > 0) {
        this.root = $(viewRootElement).get(0);
    } else {
        this.root = null;
    }
    if (this.root != null) {
        this.root.activeClass = this;
    }
} .Description("For internal framework use only! Sets/changes the dom element to which this class is attached.");
Base.prototype.bindings = new Array();
Base.prototype.namedBindings = null;
Base.prototype.contextBinding = null;
Base.prototype.bindingDescendants = new Array();
Base.prototype.handlers = new Array();
Base.prototype.initializedevent = new InitializeEvent("Fires after init to enable external handlers to mess up with the initialization. This event cannot be handled through data-on bindings, it happens before they are ready.");
Base.prototype.postinitializedevent = new InitializeEvent("Fires after postinit to enable external handlers to do something after all initialization is finished (but not bindings!). This event cannot be handled through data-on bindings.");
Base.prototype.boundevent = new InitializeEvent("Fires when rebinding occurs");
//Base.prototype.adviseevent = new InitializeEvent("Initialization event, fired only once during the life time of the element after the first rebind. This event supports external initialization handlers through bindings and must be handled with care - do not point it to handlers of dynamically removed elements.")
Base.prototype.resourceUrl = null;
Base.prototype.datachangedevent = new InitializeEvent("Fires when data context has changed");
Base.prototype.$rebindAndUpdate = false;
Base.prototype.$parametrize = function (sParams) {
    JBUtil.parametrize.call(this, this.root, this, sParams); // JBUtil.parametrize.call(this, sParams);
};
Base.prototype.set_disabled = function (v) {
    if (BaseObject.is(this, "IDisablable")) {
        this.set_disabled(v);
    } else {
        $(this.root).elementdisabled(v ? true : false);
    }

    //    if (v) {
    //        $(this.root).attr("disabled", true);
    //    } else {
    //        $(this.root).removeAttr("disabled");
    //    }
};
Base.prototype.get_disabled = function () {
    // override to do something
};
// BEGIN Overridables
// --> PHASE Materialization
	// +VERSION 2.7.1
	Base.prototype.inspectTemplate = function() {
		// TODO: This new hook is dedicated to template loading/setting the component's template - it is the first one happening. It should be used only for template loading and settings
		// 	Not all components can make use of this method - components that have data dependent templates and change them whenever data is assigned to some property/ies will need to reset the template
		//  then rematerialize it (clonetemplate/materializeIn), rebind it and updateTargets on the new one. These should inherit from ViewBase at least and can use this method for an initial template if 
		//  one is needed at all.
		
		// Being template only dedicated this new hook can be implemented by implementers that automate the template loading/choosing.
	};
	// -VERSION 2.7.1
	Base.prototype.init = function () {
		// todo: Initialization before bindings and before materialization of the sub-tree (data-class of any children are not yet created.
		// 	At this point it is possible to replace/modify the contained DOM without the need to do anything more - after leaving init() the materialization
		//	of the sub-tree will begin. It will work with whatever DOM exists after leaving the method.
	};
	Base.prototype.postinit = function () {
		// todo: Initialization before binding if needed, but after materialization of the sub-tree. The data-class objects of the children are now created, their init and postinit methods executed
		//	At this point no bindings other than those used in object parameters exist. Data transfer (updateTarget/Sources) is NOT yet possible, nor finding a binding - no normal bindings exist.
		//  One can set basic parameters and/or find specific children and save references to them or their data-class (the normal care to not save volatile elements that are dynamically created/destroyed
		//	should be taken).
	};
// --> PHASE Rebind
Base.prototype.OnRebind = function () {
    // todo: add any custom, created from code bindings (see createExplicitBinding).
    // fyi: When rebind occurs all the bindings are destroyed and must be recreated, any manually created ones must be created in this method to ensure
    //      they are recreated if a rebinding occurs (The unbinding is done automatically).
	//  At this phase any
};
// +VERSION 2.7.1
Base.prototype.finalinit = function() {
	// todo: This is the recommended initialization method for classes that initialize without replacing templates and avoiding digging into the DOM too much
};
// -VERRSION 2.7.1
// +VERSION 2.11.2
Base.prototype.isFullyInitialized = function() {
	return (this.$finalInitPending?false:true);
}
// -VERSION 2.11.2
Base.prototype.OnBeforeDataContextChanged = function () {
    // todo: handle data context changed
};
Base.prototype.OnDataContextChanged = function () {
    // todo: handle data context changed
};
// +VERSION 2.21+
// Default handlers for dummy handling
Base.prototype.onSwallowEvent = function(e, dc) {
    // This handler does nothing - use it when you want to use only some binding option.
}
// -VERSION 2.21+

// END Overridables
// Delayer
Base.prototype.$execBeforeFinalInit = null;
Base.prototype.ExecWhenInitialized = function(args, action) {
	if (typeof action == "function") {
		if (this.isFullyInitialized()) {
			action.apply(this, args);
		} else {
			if (this.$execBeforeFinalInit == null) this.$execBeforeFinalInit = [];
			var d = new Delegate(this, action, args);
			this.$execBeforeFinalInit.removeElement(d);
			this.$execBeforeFinalInit.addElement(d);
		}
	}	
}
Base.prototype.ExecBeforeFinalInit = Base.prototype.ExecWhenInitialized;

Base.prototype.$execAfterFinalInit = null;
Base.prototype.ExecAfterFinalInit = function(args, action) {
	if (typeof action == "function") {
		if (this.isFullyInitialized()) {
			action.apply(this, args);
		} else {
			if (this.$execAfterFinalInit == null) this.$execAfterFinalInit = [];
			var d = new Delegate(this, action, args);
			this.$execAfterFinalInit.removeElement(d);
			this.$execAfterFinalInit.addElement(d);
		}
	}	
}


// END Delayer

//
Base.prototype.$init = function () {
	this.inspectTemplate();
    this.init();
    this.initializedevent.invoke(this, null);
    // this.rebind(); // Default behaviour, items controls should override this
}.Fires("initializedevent");

Base.prototype.$postinit = function () {
    // this.rebind(); // Default behaviour, items controls should override this
    this.postinit();
    this.postinitializedevent.invoke(this, null);
};

Base.prototype.cascadeApply = function(prot_or_class, method, argsArray) {
	var c = 0;
	if (this.is(prot_or_class)) {
		this[method].apply(this,argsArray);
		c++;
	}
	var ac;
	if (this.bindingDescendants != null && this.bindingDescendants.length > 0) {
		for (var i = 0; i < this.bindingDescendants.length;i++) {
			ac = this.bindingDescendants[i];
			c += ac.cascadeApply(prot_or_class, method, argsArray);
		}
	}
	return c;
}
Base.prototype.cascadeCall = function(prot_or_class, method, args) {
	var ar = Array.createCopyOf(arguments, 2);
	return this.cascadeApply(prot_or_class,method,ar);	
}
Base.prototype.makeCascadeCall = function(e_sender, dc, bind) {
	if (bind.bindingParameter != null && bind.bindingParameter.length > 0) {
		var arr = bind.bindingParameter.split(".");
		if (arr.length == 2) {
			this.cascadeCall(arr[0],arr[1],dc);
			return;
		}
	}
	throw "makeCascadeCall requires bindingParameter in the form Type.Method e.g. {bind source=x/y path=makeCascadeCall parameter='PMyProtocol.MyMethod'}"
}

Base.prototype.cascadeInstances = function(prot_or_class, stopType1, stopType2 /* ... */) {
	var results = [];
	var i, stopTypes = Array.createCopyOf(arguments, 1);
	function checkStops(o) {
		for (i = 0; i < stopTypes.length; i++) {
			if (o.is(stopTypes[i])) return true;
		}
		return false;
	}
	
	if (this.is(prot_or_class)) {
		results.push(this);
	}
	function recurseDescendants(o) {
		var i,x;
		if (o.bindingDescendants != null && o.bindingDescendants.length > 0) {
			for (i = 0; i < o.bindingDescendants.length;i++) {
				x = o.bindingDescendants[i];
				if (BaseObject.is(x, prot_or_class)) {
					results.push(x);
				}
				if (!checkStops(x)) recurseDescendants(x);
			}
		}
	}
	recurseDescendants(this);
	return results;
}.Description("Goes through the bindingDescendants and collects all the data-classes that are of the specified prot_ot_class, stops searching deeper at any element that is any of the stop types");
Base.prototype.isTemplateRoot = function () {
	if (DOMUtil.attr(this.root, "data-template-root") != null) return true;
    if (this.is("ITemplateRoot")) return true;
    return false;
};
Base.prototype.get_data = function () {
    if (IsNull(this.root)) {
        return null;
    }
    return this.root.dataContext;
};
Base.prototype.$freezeUpdateSources = false;
Base.prototype.set_data = function (newData) {
    if (IsNull(this.root)) {
        return null;
    }
    this.$freezeUpdateSources = true;
    this.root.dataContext = newData;
    this.OnBeforeDataContextChanged();
    /* // OLD double callbacks for two separate requests for resources and lookups
    var localThis = this;
    if (!this.loadClassResources(function () {
    this.updateTargets();
    this.OnDataContextChanged();
    this.datachangedevent.invoke(this, newData);
    })) {
    return;
    }
    */

    var ar = this.updateTargets();
    if (ar == null) ar = CallContext.currentAsyncResult();
    this.afterAsync(ar, function () {
        this.$freezeUpdateSources = false;
        this.OnDataContextChanged();
        this.datachangedevent.invoke(this, newData);
    });
	return ar;
}.Fires("datachangedevent");
Base.prototype.get_refdata = function () {
    return this.$referenceData;
};
Base.prototype.set_refdata = function (v) {
    this.$referenceData = v;
};
Base.get_dataContext = function (startEl) {
    var cur = $(startEl);
    while (cur != null) {
        cur = cur.get(0);
        if (cur == null) break;
        if (cur.dataContext || cur.hasDataContext === true) return cur.dataContext;
        cur = $(cur).parent();
    }
    return null;
};
Base.prototype.get_dataContext = function () { // In contrast to get_data this method will search for the actual data context down the tree
    return Base.get_dataContext(this.root);
};

// usage: this.on("somedatakey[*][,somedatakey1[*][, ...]]","eventname",this.handler);
// usage A: arg1 - event name
//			arg2 - handler (will be called with the "this" of this object).
// usage B: arg1 - parent[/child] keys, 1 or more comma delimited (e.g. self/el1,self/el2,self/buttonX*)
//					or dom or jquery element for DOM event, or if arg2 starts with "$" event on data-class if it exists.
//					or Base object (if arg2 starts with "$")
//			arg2 - event name
//			arg3 - hanler (will be called with the "this" of this object).
//
Base.prototype.on = function (arg1, arg2, arg3) {
    var els;
    if (arguments.length == 3) {
        if (BaseObject.is(arg1, "string")) {
            els = this.getRelatedElements(arg1);
            if (arg2.indexOf("$") == 0) {
                for (var i = 0; i < els.length; i++) {
                    if (els.get(i).activeClass != null) {
                        els.get(i).activeClass[arg2.slice(1)].add(new Delegate(this, arg3));
                    }
                }
            } else {
                // els.bind(arg2, { obj: this, handler: new Delegate(this, arg3) }, ElementBehaviorBase.$domOmniHandler);
                for (var i = 0; i < els.length; i++) {
                    if (els.get(i) != null) {
                        $(els.get(i)).bind(arg2, { obj: els.get(i), handler: new Delegate(this, arg3) }, Base.$domOmniHandler);

                    }
                }
            }
        } else if (typeof arg1 == "object") {
            if (arg2.indexOf("$") == 0) {
                if (BaseObject.is(arg1, "Base")) {
					if (BaseObject.is(arg1[arg2.slice(1)], "EventDispatcher")) {
						arg1[arg2.slice(1)].add(new Delegate(this, arg3));
					}
                } else {
					if (BaseObject.isJQuery(arg1) || BaseObject.isDOM(arg1)) {
						var dataClass = $(arg1).activeclass();
						if (BaseObject.is(dataClass, "Base")) {
							if (BaseObject.is(arg1[arg2.slice(1)], "EventDispatcher")) {
								arg1[arg2.slice(1)].add(new Delegate(this, arg3));
							}
						}
					} else {
						jbTrace.log("Event handler cannot be attached to non Base class:" + arg2);
					}
                }
            } else {
                // Note: the following line was wrong, but there might be some code depending on this. I am leaving it commented out as a hint in case bugs surface.
                // $(arg1).bind(arg2, { obj: this, handler: new Delegate(this, arg3) }, ElementBehaviorBase.$domOmniHandler);
                $(arg1).bind(arg2, { obj: arg1, handler: new Delegate(this, arg3) }, Base.$domOmniHandler);
            }
        }
    } else if (arguments.length == 2) {
        $(this.root).bind(arg1, { obj: this, handler: new Delegate(this, arg2) }, Base.$domOmniHandler);
    }
};
//Base.prototype.on = function (eventName, method) {
//    $(this.root).bind(eventName, { obj: this, handler: new Delegate(this, method) }, Base.$domOmniHandler);
//};
Base.$domOmniHandler = function (evnt) {
    if (evnt.data != null && evnt.data.handler != null) {
        // evnt.data.handler.invoke(evnt, evnt.data.obj.get_dataContext());
        evnt.data.handler.invoke(evnt, Base.get_dataContext(evnt.data.obj));
    }
};
Base.prototype.getRelatedElements = function (patt) {
    return JBUtil.getRelatedElements(this.root, patt);
};
Base.prototype.getRelatedObjects = function (patt, types) {
	var arr = Array.createCopyOf(arguments);
	arr.unshift(this.root);
    return JBUtil.getRelatedObjects.apply(JBUtil, arr);
};
// +V: 2.17.7 Removed (added different one under the same name - see above)
/*
Base.prototype.$ = function (sel) {
    return $(this.root).find(sel);
};
*/
// -V: 2.17.7
Base.prototype.get_datakey = function() {
    var root = $(this.root);
    return root.attr("data-key");
}
Base.prototype.child = function (key, preSelector) {
    var root = $(this.root);
    if (!IsNull(preSelector)) {
        root = root.find(preSelector);
    }
    return root.find('[data-key="' + key + '"]');
};
Base.prototype.childElement = function (key, preSelector) {
    var root = $(this.root);
    if (!IsNull(preSelector)) {
        root = root.find(preSelector);
    }
    var el = root.find('[data-key="' + key + '"]');
    if (el.length > 0) return $(el.get(0));
    return $();
};
Base.prototype.childByKeyAndIdTogether = function (key, id) {
    return $(this.root).find('[data-key="' + key + '"][id="' + id + '"]');
};
Base.prototype.childObject = function (key) {
    var o = $(this.root).find('[data-key="' + key + '"]');
    if (o == null || o.length == 0) return null;
    if (BaseObject.is($(o).get(0).activeClass, "Base")) return $(o).get(0).activeClass;
    return $(o).get(0);
};
Base.prototype.findParent = function (key) {
	var o = this.getRelatedElements(key);
	if (o != null && o.length > 0) {
		if (BaseObject.is($(o).get(0).activeClass, "Base")) return $(o).get(0).activeClass;
		return $(o).get(0);
	} else {
		return null;
	}
}.Description("Searches recursively the parent elements of this one for a parent with the given data-key.")
 .Param("key", "The data-key to look for")
 .Returns("The parent with the requested data-key or null if not found. The returned parent will be Base class if the element has data-class specified or the element itself if data-class is not specified on it.")
 .Problem("Search does not obey the template borders!");
Base.prototype.get_validators = function (vgrp_in, bReturnDeiabled) {
// +V:2.20.1 - retiring the old code in favor of faster andmore precise one
	var vgrp = ((typeof vgrp_in == "string" && vgrp_in.length > 0) ? vgrp_in:null);
	var arr = this.cascadeInstances("IValidator",IUIControl,IValidator); // Validators in sub-components are not included - their components should deal with them
	var v, results = [];
    for (var i = 0; i < arr.length; i++) {
        v = arr[i];
		if (vgrp != null) {
			if (v.isOfGroup(vgrp) && (bReturnDeiabled || !v.get_disabled())) results.push(v);
		} else {
			results.push(v);
		}
        
    }
    return results;

    // TODO: (URGENT ;) ) Fo it right - honour the boundaries
    // TODO: (NOT SO URGENT) It may be wise to not return the currently disabled validators, but this needs some thought.
	/* DEPRECATED
    var vgrp = ((typeof vgrp_in == "string" && vgrp_in.length > 0) ? vgrp_in:null);
    var arr = $(this.root).find('[data-class]');
    var a, results = [];
    for (var i = 0; i < arr.length; i++) {
        a = $(arr[i]).activeclass();
        if (BaseObject.is(a, "IValidator")) {
            if (vgrp != null) {
                if (a.isOfGroup(vgrp)) results.push(a);
            } else {
                results.push(a);
            }
        }
    }
    return results;
	*/
 // -V:2.20.1
};
Base.prototype.get_incorrectvalidators = function (vgrp) {
    var arr = this.get_validators(vgrp);
    for (var i = arr.length - 1; i >= 0; i--) {
        var a = arr[i];
        if (a.result < ValidationResultEnum.incorrect) {
            arr.splice(i, 1);
        }
    }
    return arr;
};
Base.prototype.displayAllValidationErrors = function(bFailedOnly) {
	var arr;
	if (bFailedOnly) {
		arr = this.get_failedvalidators();
	} else {
		arr = this.get_incorrectvalidators();
	}
	if (arr != null && arr.length > 0) {
		for (var i = 0; i < arr.length; i++) {
			InfoMessageQuery.emit(this, arr[i].get_message(), InfoMessageTypeEnum.warning);
		}
	}
}
Base.prototype.get_failedvalidators = function (vgrp) {
    var arr = this.get_validators(vgrp);
    for (var i = arr.length - 1; i >= 0; i--) {
        var a = arr[i];
        if (a.result < ValidationResultEnum.fail) {
            arr.splice(i, 1);
        }
    }
    return arr;
};
Base.prototype.get_correctvalidators = function (vgrp) {
    var arr = this.get_validators(vgrp);
    for (var i = arr.length - 1; i >= 0; i--) {
        var a = arr[i];
        if (a.result > ValidationResultEnum.correct) {
            arr.splice(i, 1);
        }
    }
    return arr;
};
Base.prototype.closeValidators = function (vgrp) {
    var arr = this.get_validators(vgrp);
    for (var i = 0; i < arr.length; i++) {
        if (arr[i] != null) arr[i].closeValidator();
    }
};
Base.prototype.uninitValidators = function (vgrp) {
    var arr = this.get_validators(vgrp);
    for (var i = 0; i < arr.length; i++) {
        if (arr[i] != null) arr[i].uninit();
    }
};
Base.prototype.validate = function (fCallBack, vgrp) {
    var v, r = ValidationResultEnum.uninitialized, arr = this.get_validators(vgrp);
    var waitingValidators = 0, hasAsync = false;
    var localThis = this;
    for (var i = 0; i < arr.length; i++) {
        if (arr[i] != null) {
            if (fCallBack != null) {
                v = arr[i].validate(true, function (result) {
                    waitingValidators--;
                    if (result > r) r = result;
                    if (waitingValidators <= 0) {
                        fCallBack.call(localThis, r);
                    }
                });
                if (v == ValidationResultEnum.pending) {
                    waitingValidators++;
                }
            } else {
                v = arr[i].validate(true);
				if (v == ValidationResultEnum.pending) {
					throw "There are one or more asynchronous validators, validate should be called with a callback";
				}
            }
            if (v > r) r = v;
        }
    }
    if (fCallBack != null && waitingValidators <= 0) {
        fCallBack.call(localThis, r);
    }
    return r;
}.Description("Invokes all the validators in the view or only the validators of a given group (if the second param vgrp is a non-empty string)");
Base.prototype.createExplicitBinding = function (targetElement, targetAction, source, sourcePath, formatter) {
    var b = new Binding(targetElement, null, targetAction, { source: source, path: sourcePath, formatter: formatter });
    this.$registerBinding(b);
}.Description("Use this with care - this creates explicity from the code a binding which goes " + 
				"in the normal binding set - i.e. it should live and die with the normal rebinding" + 
				" process. Creating this before the rebinfd phase will deactivate the binding when the rebind occurs.");
Base.prototype.throwStructuralQuery = function (query, processInstructions) {
    return JBUtil.throwStructuralQuery(this.root, query, processInstructions);
};
Base.prototype.throwDownStructuralQuery = function (query, processInstructions) {
    return JBUtil.throwDownStructuralQuery(this.root, query, processInstructions);
};
Base.prototype.findService = function (iface, reason) {
    return FindServiceQuery.findService(this, iface, reason);
};
Base.prototype.$registerBinding = function (binding, bNoList) {
    if (binding != null) {
        if (this.bindings == null) this.bindings = [];
        if (!bNoList) this.bindings.push(binding);
        if (binding.bindingName != null) {
            if (this.namedBindings == null) this.namedBindings = {};
            this.namedBindings[binding.bindingName] = binding;
        }
    }
};
Base.prototype.findBindingByName = function (bname) {
    if (this.namedBindings != null && BaseObject.is(this.namedBindings[bname], "Binding")) return this.namedBindings[bname];
    var b = null;
    for (var i = 0; i < this.bindingDescendants.length; i++) {
        b = this.bindingDescendants[i].findBindingByName(bname);
        if (b != null) return b;
    }
    return null;
};
Base.EachClassConditionFlags = { // Process, but no enter - should not be needed.
    Ok: 0, // Proess the node and enter inside
    Skip: 1, // Skip processing but enter inside
    Stop: 2 // Do not process, do not enter inside
};
Base.$checkEachClassCondition = function (cond, ac) {
    var t; // temp
    if (cond == null) return Base.EachClassConditionFlags.Ok;
    if (ac == null) return Base.EachClassConditionFlags.Skip;
    if (typeof cond == "string") {
        if (ac.is(cond)) return Base.EachClassConditionFlags.Ok;
    } else if (BaseObject.is(cond, "Array")) {
        if (cond.FirstOrDefault(function (idx, str) {
            if (ac.is(str)) return true;
            return null;
        }) === true) return Base.EachClassConditionFlags.Ok;
    } else if (BaseObject.isCallback(cond)) {
        t = BaseObject.callCallback(cond, ac);
        if (t === true || t == Base.EachClassConditionFlags.Ok) {
            return Base.EachClassConditionFlags.Ok;
        } else if (t === false || t == Base.EachClassConditionFlags.Stop) {
            Base.EachClassConditionFlags.Stop;
        } else {
            Base.EachClassConditionFlags.Skip;
        }
    }
    return Base.EachClassConditionFlags.Skip;
}
Base.prototype.eachClass = function (cond, callback, param) {
    Base.eachClass(this.root, cond, callback, 0, param);
}.Description("Traverses the DOM tree and applies the callback over each node with attached framework class. Supports condition as type(s) or callback")
    .Param("cond","Can be string, array of strings - types to be processed or a callback that returns Base.EachClassConditionFlags.*")
    .Param("callback", "Processing routine/delegate args: (activeclass, current_depth, userparameter), if it returns false the further processing of the branch is abandoned.")
    .Param("param", "User parameter - passed to the processing routine/delegate." )
Base.eachClass = function (domel, cond, callback, depth, param) {
    var ac, el = $(domel);
    var _depth = depth | 0;
    var _cond = Base.EachClassConditionFlags.Ok;
    ac = el.activeclass();
    if (ac != null) {
        _cond = Base.$checkEachClassCondition(cond, ac)
        if (_cond == Base.EachClassConditionFlags.Ok) {
            if (BaseObject.callCallback(callback, ac, _depth, param) === false) return;
        } else if (_cond == Base.EachClassConditionFlags.Stop) {
            return;
        }
    }
    var c, ibattr;
    var cs = el.children();
    for (var i = 0; i < cs.length; i++) {
        c = $(cs[i]);
        if (c != null) {
            ibattr = c.attr("data-template-root");
            if (ibattr != null) continue;
            ac = c.activeclass();
            if (ac != null) {
                if (ac.isTemplateRoot()) continue;
                _cond = Base.$checkEachClassCondition(cond, ac); 
                if (_cond == Base.EachClassConditionFlags.Ok) {
                    if (BaseObject.callCallback(callback, ac, _depth, param) === false) continue;
                } else if (_cond == Base.EachClassConditionFlags.Stop) {
                    continue;
                }
            }
            Base.eachClass(cs[i], cond, callback, _depth + 1, param);
        }
    }
}.Description("Allows traversing the DOM tree from certain start element in leaves direction. For more details see the instance method eachClass.")
Base.prototype.onPhaseBinding = function (node, cls) { };
// override to Implement additional logic
Base.prototype.$recursiveBind = function (n, skipThisDataContext, ignoreTemplateRoot, processOwnBindings, asyncResult) {
    var node, nodeRaw;
    if (BaseObject.is(n, "Base")) {
        node = $(n.root);
    } else {
        node = $(n);
    }
    nodeRaw = node.get(0);
    var ctx, o;
    ctx = node.attr("data-context");
    if (ctx != null && ctx.length > 0 && !skipThisDataContext) {
        this.$registerBinding(new Binding(nodeRaw, null, "datacontext", ctx, true));
        nodeRaw.hasDataContext = true;
    }
    ctx = node.attr("data-context-border");
    if (ctx != null) {
        nodeRaw.hasDataContext = true;
    }

    var attrs, attr;
    if (processOwnBindings) {
        attrs = node.getAttributes("data-bind-(\\S+)");
        for (attr in attrs) {
            this.$registerBinding(new Binding(nodeRaw, null, attr, attrs[attr], false));
        }
    }
    attrs = node.getAttributes("data-on-(\\S+)");
    for (attr in attrs) {
        if (BaseObject.is(attrs[attr], "string")) {
            var exprs = JBUtil.getEnclosedTokens("{", "}", "\\", attrs[attr]); // var behs = expr.match(BehaviorBinder.reParseBehaviors);
            if (exprs != null) {
                for (var i = 0; i < exprs.length; i++) {
                    o = new Handler(nodeRaw, null, attr, exprs[i], false);
					// For handlers (Events) set_targetValue does the actual attachment to the event source
					// Although the search for the source of the handler is done each time thevent occurs we call updateTarget and not
					// set_targetValue only - some implementations may need this!
                    o.updateTarget(); // TODO: really? Be careful if change is decided on - this makes handlers available after bind.
					this.handlers.push(o);
                }
            }
        }
    }
	/* TODO: This should be done with data-on-$reboundevent
	ctx = node.attr("data-push");
    if (ctx != null && ctx.length > 0) {
        if (BaseObject.is(ctx, "string")) {
            var exprs = JBUtil.getEnclosedTokens("{", "}", "\\", ctx); // var behs = expr.match(BehaviorBinder.reParseBehaviors);
            if (exprs != null) {
                for (var i = 0; i < exprs.length; i++) {
                    o = new Handler(nodeRaw, null, "activeClass", exprs[i], false);
                    this.handlers.push(o);
                    o.updateTarget(); // TODO: really? Be careful if change is decided on - this makes handlers available after bind.
                }
            }
        }
    }*/
    var behaviorAttrs = node.getAttributes("data-behavior(?:-(\\S*))?");
    for (attr in behaviorAttrs) {
        BehaviorBinder.$bindBehaviors(node, attr, behaviorAttrs[attr], BehaviorPhaseEnum.bind);
    }
    this.onPhaseBinding(node, nodeRaw.activeClass);

    var cs = node.children();
    var o, oraw, ibattr;
    for (var i = 0; i < cs.length; i++) {
        // Check if this is a classed object
        o = $(cs[i]);
        oraw = o.get(0);
        ibattr = o.attr("data-context-border");
        if (ibattr != null && oraw != null) {
            oraw.hasDataContext = true;
        }
        ibattr = o.attr("data-template-root"); // Should we check for non data-class template roots at all?
        if (BaseObject.is(oraw.activeClass, "Base")) {
            if (ignoreTemplateRoot || (!oraw.activeClass.isTemplateRoot())) {
                this.bindingDescendants.push(oraw.activeClass);
                attrs = o.getAttributes("data-bind-(\\S+)");
                for (attr in attrs) {
                    this.$registerBinding(new Binding(oraw, null, attr, attrs[attr], false));
                }
                oraw.activeClass.rebind(false, asyncResult);
            }
        } else {
            if (ibattr != null) continue;
            this.$recursiveBind(o, false, false, true, asyncResult);
        }
    }
    for (attr in behaviorAttrs) {
        BehaviorBinder.$bindBehaviors(node, attr, behaviorAttrs[attr], BehaviorPhaseEnum.postbind);
    }
    // this.onPhasePostBinding(node, nodeRaw.activeClass);
};
//Base.prototype.$recursiveBindMore = function (jqNode, ignoreTemplateRoot) {
//    // Check if this is a classed object
//        var o = $(jqNode);
//        var oraw = o.get(0);
//        var ibattr = o.attr("data-context-border");
//        if (ibattr != null && oraw != null) {
//            oraw.hasDataContext = true;
//        }
//        ibattr = o.attr("data-template-root"); // Should we check for non data-class template roots at all?
//        if (BaseObject.is(oraw.activeClass, "Base")) {
//            if (ignoreTemplateRoot || (!oraw.activeClass.isTemplateRoot())) {
//                this.bindingDescendants.push(oraw.activeClass);
//                var attrs = o.getAttributes("data-bind-(\\S+)");
//                var attr;
//                for (attr in attrs) {
//                    this.$registerBinding(new Binding(oraw, null, attr, attrs[attr], false));
//                }
//                oraw.activeClass.rebind(false);
//            }
//        } else {
//            if (ibattr != null) continue;
//            this.$recursiveBind(o, false, false, true);
//        }
//}
//Base.prototype.$finalInitPending = true; // This is negative indication - the field is deleted when found
Base.prototype.rebind = function (ignoreTemplateRoot, asyncResult) {
    var i;
    /*
    if (this.bindings != null) {
    for (i = 0; i < this.bindings.length; i++) {
    this.bindings[i].unBind();
    }
    }
    this.bindings = new Array();
    if (this.handlers != null) {
    for (i = 0; i < this.handlers.length; i++) {
    this.handlers[i].unBind();
    }
    }
    */

    this.unBind();
    this.handlers = new Array();
    this.bindings = [];
    this.bindingDescendants = new Array();
    this.contextBinding = null;
    var ctx;

    ctx = $(this.root).attr("data-context");
    if (ctx != null && ctx.length > 0) {
        this.contextBinding = new Binding(this.root, null, "datacontext", ctx, true);
        this.$registerBinding(this.contextBinding, true);
        this.root.hasDataContext = true;
    }
	var ar = null;
    if (this.getAsyncInstruction("rebind") > 0) {
        this.discardAsync(["rebind","update_descendants","update_bindings","update_targets"]);
        var asynch_rebind = this.async(this.$recursiveBind).chainOnOrCurrent(asyncResult).key("rebind").maxAge(JBCoreConstants.ClientViewTasksMaxAge);
        if (this.isTemplateRoot()) {
            asynch_rebind.execute(this.root, true, true, true, asynch_rebind);
        } else {
            asynch_rebind.execute(this.root, true, ignoreTemplateRoot, false, asynch_rebind);
        }
        ar = (asyncResult != null) ? asyncResult : CallContext.currentAsyncResult();
        if (ar == null) ar = asynch_rebind;
    } else {
        if (this.isTemplateRoot()) {
            this.$recursiveBind(this.root, true, true, true);
        } else {
            this.$recursiveBind(this.root, true, ignoreTemplateRoot, false);
        }
    }
    this.afterAsync(ar, function () {
        // Apply order tags
        this.$configureBindings();
		if (this.$finalInitPending) {
			this.$finalInitPending = false;
			delete this.$finalInitPending;
			if (this.$execBeforeFinalInit != null) {
				for (i = 0; i < this.$execBeforeFinalInit.length; i++) {
					this.$execBeforeFinalInit[i].invoke();
				}
				delete this.$execBeforeFinalInit;
			}
			this.finalinit();
			if (this.$execAfterFinalInit != null) {
				for (i = 0; i < this.$execAfterFinalInit.length; i++) {
					this.$execAfterFinalInit[i].invoke();
				}
				delete this.$execAfterFinalInit;
			}
		}
        this.OnRebind();
        this.boundevent.invoke(this, this.get_data());
        if (!this.$updateTransactionInitiator) this.$updateTransactionId = 0;
        this.$freezeUpdateSources = false;
    });
}.Fires("boundevent");

Base.prototype.$configureBindings = function () { // Can be called as many times as neccessary
    if (this.bindings != null) this.bindings = this.bindings.sort(Base.$internalSortBindings);
    if (this.handlers != null) this.handlers = this.handlers.sort(Base.$internalSortBindings);
}
Base.prototype.unBind = function () {
    var i;
    /* TODO: Why was this disabled?
    if (false && this.bindingDescendants != null) {
        for (i = 0; i < this.bindingDescendants.length; i++) {
            if (BaseObject.is(this.bindingDescendants[i], "Base")) {
                this.bindingDescendants[i].unBind();
            }
        }
    }
    */
    if (this.bindings != null) {
        for (i = 0; i < this.bindings.length; i++) {
            if (this.bindings[i] != null) {
                this.bindings[i].unBind();
                this.bindings[i].obliterate();
            }
        }
    }
    if (this.handlers != null) {
        for (i = 0; i < this.handlers.length; i++) {
            if (this.handlers[i] != null) {
                this.handlers[i].unBind();
                this.handlers[i].obliterate();
            }
        }
    }
};
Base.$internalSortBindings = function (b1, b2) {
    if (b1 == null || b2 == null) return -1;
    if (isNaN(b1.$order)) return -1;
    if (isNaN(b2.$order)) return 1;
    return (b1.$order - b2.$order);
};
Base.prototype.get_autoupdateevents = function () {
    return "";
} .Description("Override to return a comma separated list of events that can be used by a binding to auto update its targets or source");
// Call tracker for updateTargets
Base.$resetUpdateTransaction = function () {
    Base.$updatingCurrentTransactionId = 0;
    Base.$updatingLastTransactionId++;
};
Base.$updatingLastTransactionId = 0;
Base.$updatingCurrentTransactionId = 0;
Base.prototype.$beginUpdatingTargets = function (pattIn) {
    if (pattIn != null && pattIn != "") return true;
    if (Base.$updatingCurrentTransactionId == 0) {
        Base.$updatingCurrentTransactionId = Base.$updatingLastTransactionId + 1;
        this.$updateTransactionInitiator = true;
        this.$updateTransactionId = Base.$updatingCurrentTransactionId;
        return true;
    } else if (this.$updateTransactionId != Base.$updatingCurrentTransactionId) {
        this.$updateTransactionId = Base.$updatingCurrentTransactionId;
        this.$updateTransactionInitiator = false;
        return true;
    }
    return false;
};
Base.prototype.$asyncBeginUpdatingTargets = function (pattIn, rootAR) {
    if (pattIn != null && pattIn != "") return true;
    if (rootAR != null) {
        var syncdata = rootAR.get_syncdata();
        if (syncdata == null) {
            syncdata = { update_targets_participants: {} };
            rootAR.set_syncdata(syncdata);
        }
        if (syncdata.update_targets_participants[this.$__instanceId]) return false;
        syncdata.update_targets_participants[this.$__instanceId] = true;
    }
    return true;
};
Base.prototype.$finishUpdatingTargets = function (pattIn) {
    if (pattIn != null && pattIn != "") return;
    this.$freezeUpdateSources = false;
    if (this.$updateTransactionInitiator) {
        this.$updateTransactionInitiator = false;
        Base.$updatingLastTransactionId = Base.$updatingCurrentTransactionId;
        Base.$updatingCurrentTransactionId = 0;
        return;
    }
    this.$updateTransactionInitiator = false;
};
Base.prototype.$asyncFinishUpdatingTargets = function (pattIn, rootAR) {
    if (pattIn != null && pattIn != "") return;
    if (rootAR != null) {
        var syncdata = rootAR.get_syncdata();
        if (syncdata != null && syncdata.update_targets_participants != null) {
            delete syncdata.update_targets_participants[this.$__instanceId];
        }
    }
}
Base.prototype.$resetUpdateTransaction = function () {
    this.$updateTransactionId = 0;
    var i;
    for (i = 0; i < this.bindingDescendants.length; this.bindingDescendants[i++].$resetUpdateTransaction());
};
// Updates all binding targets
Base.prototype.$updateTransactionId = 0;
Base.prototype.$updateTransactionInitiator = false;
Base.prototype.updateTargets = function (pattIn, bOverridePolicy, asyncResult) { // The asyncResult is transferred to asyncUpdateTargets if so instructed
	if (this.__obliterated) { return; }
	if (pattIn != null && typeof pattIn == "object" && !BaseObject.is(pattIn, "Array")) {
		//								 event,  dc, 			  binding
		return this.updateTargetsHandler(pattIn, bOverridePolicy, asyncResult);
	}
    if (this.getAsyncInstruction("bind") > 0 || this.getAsyncInstruction("descent") > 0) return this.asyncUpdateTargets(pattIn, bOverridePolicy, asyncResult);
    if (typeof this.OnUpdatingTargets == "function") {
        if (this.OnUpdatingTargets(pattIn, bOverridePolicy) === false) return;
    }
    if (!this.$beginUpdatingTargets(pattIn)) return;
    var patt = (BaseObject.is(pattIn, "string")) ? JBUtil.$parseFlagSelector(pattIn) : pattIn;
    this.$rebindAndUpdate = false;
    if (this.contextBinding != null) this.contextBinding.updateTarget(patt, bOverridePolicy);
    if (this.$rebindAndUpdate) {
        this.$rebindAndUpdate = false;
        this.rebind();
    }
    var i;
    for (i = 0; i < this.bindings.length; this.bindings[i++].updateTarget(patt, bOverridePolicy));
    for (i = 0; i < this.handlers.length; this.handlers[i++].updateTarget(patt));
    for (i = 0; i < this.bindingDescendants.length; this.bindingDescendants[i++].updateTargets(patt, bOverridePolicy, asyncResult));
    this.$finishUpdatingTargets(pattIn);
    if (typeof this.OnUpdatedTargets == "function") {
        this.OnUpdatedTargets(pattIn, bOverridePolicy);
    }
};
Base.prototype.updateTargetsHandler = function(evnt_sender, dc, binding) {
	var pattIn = null;
	if (binding != null) pattIn = binding.bindingParameter;
	if (this.getAsyncInstruction("bind") > 0 || this.getAsyncInstruction("descent") > 0) return this.asyncUpdateTargets(pattIn, false);
    if (typeof this.OnUpdatingTargets == "function") {
        if (this.OnUpdatingTargets(pattIn, false) === false) return;
    }
	this.$resetUpdateTransaction();
    if (!this.$beginUpdatingTargets(pattIn)) return;
    var patt = (BaseObject.is(pattIn, "string")) ? JBUtil.$parseFlagSelector(pattIn) : pattIn;
    this.$rebindAndUpdate = false;
    if (this.contextBinding != null) this.contextBinding.updateTarget(patt, false);
    if (this.$rebindAndUpdate) {
        this.$rebindAndUpdate = false;
        this.rebind();
    }
    var i;
    for (i = 0; i < this.bindings.length; this.bindings[i++].updateTarget(patt, false));
    for (i = 0; i < this.handlers.length; this.handlers[i++].updateTarget(patt));
    for (i = 0; i < this.bindingDescendants.length; this.bindingDescendants[i++].updateTargets(patt, false));
    this.$finishUpdatingTargets(pattIn);
	this.$resetUpdateTransaction();
    if (typeof this.OnUpdatedTargets == "function") {
        this.OnUpdatedTargets(pattIn, false);
    }
}
// The asyncResult parameter serves as synch node over which the tasks can query and set the get_asyncdata/set_asyncdata
//      if null the one created by this call is passed further
Base.prototype.asyncUpdateTargets = function (pattIn, bOverridePolicy, asyncResult) {
	if (this.__obliterated) { return; }
	if (pattIn != null && typeof pattIn == "object" && !BaseObject.is(pattIn, "Array")) {
		//								 	  event,  dc, 			   binding
		return this.asyncUpdateTargetsHandler(pattIn, bOverridePolicy, asyncResult);
	}
    var rootAR = asyncResult;
    var ar = this.async(this.$asyncUpdateTargets).maxAge(JBCoreConstants.ClientViewTasksMaxAge).key("update_targets")
    if (rootAR == null) {
        // Check if we need to chain this on a running operation
        ar.chainIf(null); // Chain on any running operation
    } else {
        ar.chain(rootAR);
    }
    if (rootAR == null) rootAR = ar;
    ar.execute(pattIn, bOverridePolicy, rootAR, ar);
    return rootAR; // ??? Is this better than returning the particular result???
}
Base.prototype.asyncUpdateTargetsHandler = function (e_sender, dc, binding) {
	var pattIn = null;
	if (binding != null) pattIn = binding.bindingParameter;
    var ar = this.async(this.$asyncUpdateTargets).maxAge(JBCoreConstants.ClientViewTasksMaxAge).key("update_targets")
    // Check if we need to chain this on a running operation
    ar.chainIf(null); // Chain on any running opration
    ar.execute(pattIn, false, ar, ar);
}
Base.prototype.$asyncUpdateTargets = function (pattIn, bOverridePolicy, asyncResult, ownAr) {
    if (typeof this.OnUpdatingTargets == "function") {
        if (this.OnUpdatingTargets(pattIn, bOverridePolicy) === false) return;
    }
    if (!this.$asyncBeginUpdatingTargets(pattIn, asyncResult)) return;
    var patt = (BaseObject.is(pattIn, "string")) ? JBUtil.$parseFlagSelector(pattIn) : pattIn;
    this.$rebindAndUpdate = false;
    if (this.contextBinding != null) this.contextBinding.updateTarget(patt, bOverridePolicy);
    if (this.$rebindAndUpdate) {
        this.$rebindAndUpdate = false;
        this.rebind();
    }
    var stepB = this.getAsyncInstruction("bind");
    var stepD = this.getAsyncInstruction("descent");
    // Split in steps owned bindings first
    var j, i = 0;
    for (i = 0; i < this.handlers.length; this.handlers[i++].updateTarget(patt)); // syncronously
    if (stepB > 0 && stepD > 0) {
        // Bindings are shceduled first to give them later chance to discard descent updates
        for (i = 0; i < this.bindings.length; i += stepB) {
            this.async(this.$asyncUpdateTargets_Bindings).chain(asyncResult).key("update_bindings").maxAge(JBCoreConstants.ClientViewTasksMaxAge).execute(patt, bOverridePolicy, asyncResult, i);
        }
    }
    // If the decendants are to be update asynchronously we should schedule them early. This gives any functionality triggered by bindings in them to
    // discard them if it needs/prefers to do so.
    if (stepD > 0) {
        //for (i = 0; i < this.bindingDescendants.length; i += stepD) {
        for (i = 0, j = 0; i < this.bindingDescendants.length; j++, i ++) {
            this.async(this.$asyncUpdateTargets_Descendants, this.bindingDescendants[i])
                .chain(asyncResult).key("update_descendants")
                .maxAge(JBCoreConstants.ClientViewTasksMaxAge)
                .continuous((j + 1) % stepD != 0)
                .execute(patt, bOverridePolicy, asyncResult, i);

        }
    }
    if (stepB <= 0) {
        // Do them synchronously
        for (i = 0; i < this.bindings.length; this.bindings[i++].updateTarget(patt, bOverridePolicy));
    } else if (stepD <= 0) {
        for (i = 0; i < this.bindings.length; i += stepB) {
            this.async(this.$asyncUpdateTargets_Bindings).chain(asyncResult).key("update_bindings").maxAge(JBCoreConstants.ClientViewTasksMaxAge).execute(patt, bOverridePolicy, asyncResult, i);
        }
    }
    if (stepD <= 0) {
        for (i = 0; i < this.bindingDescendants.length; this.bindingDescendants[i++].updateTargets(patt, bOverridePolicy, asyncResult));
    }
    ownAr.then(this, function () {
        this.$asyncFinishUpdatingTargets(pattIn, asyncResult);
        if (typeof this.OnUpdatedTargets == "function") {
            this.OnUpdatedTargets(pattIn, bOverridePolicy);
        }
    });
}
Base.prototype.$asyncUpdateTargets_Bindings = function (patt, bOverridePolicy, asyncResult, start) {
    for (var i = start; i < this.bindings.length && i < start + this.getAsyncInstruction("bind"); i++) {
        if (this.bindings[i] != null) this.bindings[i].updateTarget(patt, bOverridePolicy);
    }
}
Base.prototype.$asyncUpdateTargets_Descendants = function (patt, bOverridePolicy, asyncResult, start) {
    if (this.bindingDescendants[start] != null) this.bindingDescendants[start].updateTargets(patt, bOverridePolicy, asyncResult);
//    for (var i = start; i < this.bindingDescendants.length && i < start + this.getAsyncInstruction("descent"); i++) {
//        if (this.bindingDescendants[i] != null) this.bindingDescendants[i].updateTargets(patt, bOverridePolicy, asyncResult);
//    }
}

Base.prototype.updateTargetsOfElements = function (keyquery, pattIn, bOverridePolicy) {
    this.$freezeUpdateSources = false;
    if (keyquery == null || keyquery.length == 0) {
        this.updateTargets(pattIn, bOverridePolicy);
    } else {
        Binding.updateTargetsOf(this.root, keyquery, pattIn, bOverridePolicy);
    }
};
Base.prototype.updateTargetsOf = function (e, dc, binding) {
    var parameter = (binding != null) ? binding.bindingParameter : null;
    this.updateTargetsOfElements(parameter);
};
/**
	May be deprecated or changed, please avoid using this (it should not be needed outside of the framework)
*/
Base.prototype.updateHandlers = function () {
    var h;
    for (var i = 0; i < this.handlers.length; i++) {
        h = this.handlers[i];
        h.unBind();
        h.updateTarget();
    }
    for (i = 0; i < this.bindingDescendants.length; this.bindingDescendants[i++].updateHandlers());
};
Base.prototype.updateSources = function (pattIn, bOverridePolicy,null_or_binding) {
	if (this.__obliterated) { return; }
	if (pattIn != null && typeof pattIn == "object" && !BaseObject.is(pattIn, "Array")) {
		//								 event,  dc,			 binding
		return this.updateSourcesHandler(pattIn, bOverridePolicy,null_or_binding);
	}
    if (this.$freezeUpdateSources) return;
    var i;
    var patt = (BaseObject.is(pattIn, "string")) ? JBUtil.$parseFlagSelector(pattIn) : pattIn;
	if (Binding.GetOverridePolicy(bOverridePolicy,"reversesources")) {
		for (i = 0; i < this.bindingDescendants.length; this.bindingDescendants[i++].updateSources(patt, bOverridePolicy));
		if (this.contextBinding != null) this.contextBinding.updateSource(patt, bOverridePolicy);
		for (i = 0; i < this.bindings.length; this.bindings[i++].updateSource(patt, bOverridePolicy));
	} else {
		if (this.contextBinding != null) this.contextBinding.updateSource(patt, bOverridePolicy);
		for (i = 0; i < this.bindings.length; this.bindings[i++].updateSource(patt, bOverridePolicy));
		for (i = 0; i < this.bindingDescendants.length; this.bindingDescendants[i++].updateSources(patt, bOverridePolicy));
	}
};
Base.prototype.updateSourcesHandler = function (e_sender, dc,binding) {
	var pattIn = null;
	if (binding != null) pattIn = binding.bindingParameter;
    if (this.$freezeUpdateSources) return;
    var i;
    var patt = (BaseObject.is(pattIn, "string")) ? JBUtil.$parseFlagSelector(pattIn) : pattIn;
	if (JBCoreConstants.ReverseSources) {
		if (this.contextBinding != null) this.contextBinding.updateSource(patt, false);
		for (i = 0; i < this.bindings.length; this.bindings[i++].updateSource(patt, false));
		for (i = 0; i < this.bindingDescendants.length; this.bindingDescendants[i++].updateSources(patt, false));
	} else {
		if (this.contextBinding != null) this.contextBinding.updateSource(patt, false);
		for (i = 0; i < this.bindings.length; this.bindings[i++].updateSource(patt, false));
		for (i = 0; i < this.bindingDescendants.length; this.bindingDescendants[i++].updateSources(patt, false));
	}
};
Base.prototype.updateSourcesInReverseHandler = function (e_sender, dc,binding) {
	var pattIn = null;
	if (binding != null) pattIn = binding.bindingParameter;
    if (this.$freezeUpdateSources) return;
    var i;
    var patt = (BaseObject.is(pattIn, "string")) ? JBUtil.$parseFlagSelector(pattIn) : pattIn;
	for (i = 0; i < this.bindingDescendants.length; this.bindingDescendants[i++].updateSources(patt, {reversesources:true}));
	if (this.contextBinding != null) this.contextBinding.updateSource(patt, {reversesources:true});
    for (i = 0; i < this.bindings.length; this.bindings[i++].updateSource(patt, {reversesources:true}));
}.Description("Enforced update from leaves to root.");
Base.prototype.updateSourcesOfElements = function (keyquery, pattIn, bOverridePolicy) {
    if (keyquery == null || keyquery.length == 0) {
        this.updateSources(pattIn, bOverridePolicy);
    } else {
        Binding.updateSourcesOf(this.root, keyquery, pattIn, bOverridePolicy);
    }
};
Base.prototype.updateSourcesOf = function (e, dc, binding) {
    var parameter = (binding != null) ? binding.bindingParameter : null;
    this.updateSourcesOfElements(parameter);
};
Base.prototype.disableTargets = function (b) {
    for (var i = 0; i < this.bindings.length; this.bindings[i++].disableTarget(b));
    for (var i = 0; i < this.bindingDescendants.length; this.bindingDescendants[i++].disableTargets(b));
};
Base.prototype.getBindingTargets = function (selector, results) {
    var n = JBUtil.$parseFlagSelector(selector);
    var aj = (results == null) ? $() : results;
    var bindings = this.bindings;
    do {
        for (var i = 0; i < bindings.length; i++) {
            if (bindings[i].matchFlags(n)) {
                aj.push(bindings[i].get_target());
            }
        }
        bindings = (bindings == this.bindings) ? this.handlers : null;
    } while (bindings != null);
    for (var i = 0; i < this.bindingDescendants.length; this.bindingDescendants[i++].getBindingTargets(selector, aj));
    return aj;
};
// Finds bindings determined by the condition proc through the entire subtree. The second parameter is internal - do nat pass it explicitly
// The conditionProc is the same as in Array.prototype.Select: function(idx, item) { // ret non-null for inclusion and null for exclusion from the result set }
Base.prototype.findBindings = function (conditionProc, _resultContainer) {
    var arr = _resultContainer;
    if (arr == null) arr = [];
    var a = this.bindings.Select(conditionProc);
    if (a != null && a.length > 0) {
        for (var i = 0; i < a.length; i++) arr.push(a[i]);
    }
    if (this.bindingDescendants != null && this.bindingDescendants.length > 0) {
        for (var i = 0; i < this.bindingDescendants.length; i++) this.bindingDescendants[i].findBindings(conditionProc, arr);
    }
    return arr;
};
Base.prototype.messageBox = function (e, dc, b, bp) {
    if (bp != null && typeof bp == "string" && bp.length > 0) {
        alert(bp);
    }
};
// Settings access
Base.prototype.appSettings = function (sPath, defVal) {
    // TO DO: Change this to use the local applet settings when we decide how to support this.
    var s = System.Default().settings;
    if (s != null && BaseObject.is(sPath, "string")) {
        return BaseObject.getProperty(s, sPath, defVal);
    }
    return s;
};
Base.prototype.sysSettings = function (sPath, defVal) {
    var s = System.Default().settings;
    if (s != null && BaseObject.is(sPath, "string")) {
        return BaseObject.getProperty(s, sPath, defVal);
    }
    return s;
};
Base.prototype.get_hostcontainer = function () {
    var p = new HostCallQuery(HostCallCommandEnum.gethost);
    var h = null;
    if (this.throwStructuralQuery(p)) {
        h = p.host;
    }
    return h;
};
Base.prototype.executeActionRules = function(rules, purpose, contextBuilder, multirules) {
    return PActionRulesAPI.executeActionRules(this,rules,purpose,contextBuilder,multirules).CopyDocFrom(PActionRulesAPI.executeActionRules);
}
// DEBUG BREAKPOINT
Base.prototype.OnDebugBinding = function() {
	// Place for debug breakpoints
	var a = 1;
}
