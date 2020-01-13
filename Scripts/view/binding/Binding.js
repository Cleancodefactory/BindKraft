/**
	Binding syntax
	
	options
	~~~~~~~
		nonpersistable				- kept for backward compatibility - see persistable (all bindings are nonpersistable by default)
		disabled					- the binding is disabled (updateTarget/updateSource only), the properties still work.
		async						- asynchronous read/write (see below)
		asyncread 					- asynchronous read (ToTarget)
		asyncwrite					- asynchronous write (FromTarget)
		freezesite					- data-on handlers are called inside a freeze block if they are defined on instance supporting IFreezable
		persistable					- marks the binding as one that impacts the underlying object state
		operation					- ?
		nodefault|preventdefault 	- only data-on for DOM events - prevents default

*/


// Binding(
//  domTarget - (required) a dom or extended jQuery dom element. If it is also extended with an activeClass the binding will take care on its own
//  target - (can be null) Normally null. If the actual target is not the DOM element, nor the active class (Base derived) attached to it the object is passed here.
//  targetAction - (required if set) property to set, if it starts with $ it is an active property of the activeClass, otherwise it is a prop of the DOM element
//  expr - (required) the binding expression
//  parentContext - (optional) if true the binding is processed over the parent data contexts and not over the data context of this element (if context exist in it).
// )
// tracing: trace=type,path,source, create, set,get,dc, rule

function Binding(domTarget, target, targetAction, expr, parentContext) {
    BaseObject.apply(this, arguments);
    this.$target = $(domTarget).get(0);
    this.$useParentContext = parentContext;
    // Plsease do not remove the commented lines below, we may still decide to change the implementation this way
    //if (this.$target != null) {
    // Register the binding with the element
    //    if (this.$target.activebindings == null) this.$target.activebindings = [];
    //    this.$target.activebindings.addElement(this);
    //}
    this.$actualTarget = target;
    // this.$targetAction = targetAction;
    this.$parseTargetExpression(targetAction); // New 09 Feb 2012 - enables indexed properties. Sets $targetIndex if available
    this.$expression = expr;
    this.flags = {};
    this.options = {};
    if (BaseObject.is(expr, "string")) {
        //this.$newParsing(expr.slice(1, expr.length - 1));
        this.$parseExpression(expr);
    } else if (typeof (expr) == "object") {
        this.$parseExpressionObject(expr);
    }

}
Binding.Inherit(BaseObject, "Binding");
Binding.interfaces = { PBinding: true };
Binding.Implement(ITargeted);
Binding.prototype.obliterate = function (bFull) {
	if ( this.__obliterated ) { return; }
    // Just to make sure we do not forget what is what lets delete some refs manually. It may be needed to do more over some of them.
    this.unBind();
    if (this.$target != null) delete this.$taget;
    if (this.$actualTarget != null) delete this.$actualTarget;
    if (this.$sourceObject != null) delete this.$sourceObject;
    if (this.$sourceNode != null) delete this.$sourceNode;
    if (this.$controlElement != null) delete this.$controlElement;
    BaseObject.prototype.obliterate.call(this, bFull);
}.Description("Destructor")
 .Param("bFull","...");

//Binding.$tempRegEx = /(bind|read|probe)\b(?:\((\d+)\))*|(?:(source|service)=(\S+))|(?:(path)=(\S+))|(?:(format|inverseformat)=(\S+))|(?:(customformat|inversecustomformat)=(\S+))|(?:options=(\S+))|(?:flags=(\S+))|(?:(create|createleaf)=(\S+))|(?:checkstate=(\S+))|(?:readdata=(\S+))|(?:writedata=(\S+))|(?:[ref|reference]\[(.*?)\]=(\S+))|(?:debug=(\S+))|(?:(text|number)=\'(.*?)\')|(?:(object)=(\S+))|(?:validator=\'(\S+)\')|(?:name=(\S+))|(?:trace=(\S+))|(?:(onload|onenter|onleave|onclose)=(\S+))|(?:(parameter|argument)=\'(\S+)\')/gi;
Binding.$regExpSource = /(source|service|shellcommand)=(\S+)/i;
Binding.$regExpPath = /(path|trigger)\=(\S+)/i;
Binding.$regExpLiteral = /(text|number|object)\=\'(.*?)\'/i;
Binding.$regExpLiteralObject = /(object)\=(\S+)/i;
Binding.$regExpThrowQuery = /(throw)\=(\S+)/i;
Binding.$regExpValidator = /(validator)\=(?:(?:\'(.*?)\')|(\S+))/i;
Binding.$regExpContent = /\{(bind|read|probe)(?:\((\d+)\))?\s*(.*)\}/i;
Binding.$regExpFormatter = /(inverseformat|inversecustomformat|format|customformat)=((?:(?:[^\(\s]+)|(?:\((?:[^\)]|\)\))*\)))+)/i;
Binding.$regExpSingleFormatter = /([^\(]+)(?:\(((?:[^\)]|\)\))*)\))?/i;
Binding.$regExpFlags = /(flags)=(\S+)/i;
Binding.$regExpOptions = /(options)=(\S+)/i; // currently supported: nonpersistable, disabled, async, asyncread, asyncwrite, freezesite, persistable, operation, (nodefault, preventdefault)
Binding.$regExpName = /(name)=(\S+)/i;
Binding.$regExpCreate = /(create|createleaf)=(\S+)/i;
Binding.$regExpCreateLeafs = { create: false, createleaf: true };
Binding.$regExpTrace = /(trace)=(\S+)/i;
Binding.$regExpDebug = /(debug)=(\S+)/i;
Binding.$regExpAllows = /(allowread|allowwrite)=(\S+)/gi;
Binding.$regExpAllow = /(allowread|allowwrite)=(\S+)/i;
Binding.$regExpRule = /(onload|onenter|onleave|onclose)=(\S+)/i;
Binding.$regExpRules = /(onload|onenter|onleave|onclose)=(\S+)/gi;
Binding.$regCheckState = /(checkstate)=(\S+)/i; // comma separated list of events on which to check if the binding will change the object state if the sources were updated
Binding.$regAutoRead = /(readdata)(?:\((\d+)\))?=(\S+)/i; // comma separated list of events on the SOURCE at which to update the target
Binding.$regAutoWrite = /(writedata)(?:\((\d+)\))?=(\S+)/i; // comma separated list of events on TARGET at which to update the source
Binding.$regExpParam = /(parameter|argument|controlparam)\=\'(.*?)\'/i;
Binding.$regRefs = /\b(?:ref|reference)\[([a-zA-Z0-9_]+)\]=(\S+)/gi; // Search for reference definitions
Binding.$regReplacements = /\%\%([A-Za-z0-9_]+)\%\%/gi; // Replacements before doing anything
Binding.$regExpColor = /\#([0-9a-fA-F]{6})/i;
Binding.$reSplitPath = /\.(?=[^\/\.]|\()/gi;
Binding.$reArray = /([^\[\-\)]+)(?:(?:\-|\[|\()(\S*?)(?:\)|\]|$))?/i; // $1 = arrname, $2/$3 - elindex
Binding.resources = null; // global resources (consumed faster without query for update)
Binding.$lookups = null; // global lookups cache StringResources
Binding.dynamicresources = null; // dynamic global resources (consumed with query for update if needed)
Binding.updateEntityState = false; // Default, should be false from (including) version 1.7.5 because of the new policy to explicitly allow it on each individual binding
								   // The old code still works if this is true, but in future versions this and the entire old mechanism will be removed.
Binding.entityStatePropertyName = "state";
Binding.entityOldStatePropertyName = "$__oldstate__";
Binding.entityStateValues = null;
Binding.bindingLibrary = {};

Binding.markChangedState = function (el, bUnDelete) { this.markDataState(el, null, bUnDelete); };
Binding.markDeletedState = function (el) { this.markDataState(el, true); };
// Core method - marks the object (el) as changed, marks it deleted if bDelete is true, undeletes items (restores the old state) if bDelete is False and bUndelete is true
Binding.markDataState = function (el, bDelete, bUnDelete) {
    if (BaseObject.is(el, "Array")) {
        for (var i = 0; i < el.length; this.markDataState(el[i++], bDelete, bUnDelete));
        return;
    }
    if (el != null) {
        var state;
        if (BaseObject.is(el, "IDataStateManager")) {
            state = el.get_DataItemState();
            if (bDelete) {
                if (typeof state == "undefined" || state == Binding.entityStateValues.Insert) {
                    // Remove any state
                    el.set_DataItemState(null);
                } else if (state == Binding.entityStateValues.Unchanged || state == Binding.entityStateValues.Update) {
                    //Binding.entityOldStatePropertyName
                    el.set_DataItemState(Binding.entityStateValues.Delete);
                }
            } else {
                if (bUnDelete) el.set_DataItemState(Binding.entityStateValues.Undelete);
                if (typeof state == "undefined") {
                    el.set_DataItemState(Binding.entityStateValues.Insert);
                } else if (state == Binding.entityStateValues.Unchanged) {
                    el.set_DataItemState(Binding.entityStateValues.Update);
                }
            }
        } else if (!BaseObject.is(el, "BaseObject")) {
            state = el[Binding.entityStatePropertyName];
            if (bDelete) {
                if (typeof state == "undefined" || state == Binding.entityStateValues.Insert) {
                    // Remove any state
                    delete el[Binding.entityStatePropertyName];
					delete el[Binding.entityOldStatePropertyName];
                } else if (state == Binding.entityStateValues.Unchanged || state == Binding.entityStateValues.Update) {
                    el[Binding.entityOldStatePropertyName] = el[Binding.entityStatePropertyName];
                    el[Binding.entityStatePropertyName] = Binding.entityStateValues.Delete;
                }
            } else {
                if (bUnDelete && state == Binding.entityStateValues.Delete) el[Binding.entityStatePropertyName] = el[Binding.entityOldStatePropertyName];
                if (typeof state == "undefined") {
                    el[Binding.entityStatePropertyName] = Binding.entityStateValues.Insert;
                } else if (state == Binding.entityStateValues.Unchanged) {
                    el[Binding.entityStatePropertyName] = Binding.entityStateValues.Update;
                }
            }
        }
    }
}.Description("...")
 .Param("el","...")
 .Param("bDelete","...")
 .Param("bUnDelete","...");

Binding.entityStateIsChanged = function (o) { // pass a single object
    if (o == null) return false;
    var s = o[Binding.entityStatePropertyName];
    return (s == DataStateEnum.New || s == DataStateEnum.Updated || s == DataStateEnum.Deleted);
}.Description("...")
 .Param("o","Binding which state will be checked")
 .Returns ("true or false");

Binding.entityStateIsMaterial = function (o) { // pass a single object
    if (o == null) return false;
    var s = o[Binding.entityStatePropertyName];
    return (s == DataStateEnum.Unchanged || s == DataStateEnum.New || s == DataStateEnum.Updated || s == DataStateEnum.Deleted);
}.Description("...")
 .Param("o","Binding which state will be checked")
 .Returns ("true or false");

Binding.entityStateWillExist = function (o) { // pass a single object
    if (o == null) return false;
    var s = o[Binding.entityStatePropertyName];
    return (s == DataStateEnum.Unchanged || s == DataStateEnum.New || s == DataStateEnum.Updated);
}.Description("...")
 .Param("o","Binding which state will be checked")
 .Returns ("true or false");

// Izlishen prazen red
Binding.$entityTreeStateInfo = function (dc, r, newState) { // recursor
    if (dc == null) return;
    var itm;
    if (BaseObject.is(dc, "Array")) {
        for (var i = 0; i < dc.length; i++) {
            itm = dc[i];
            if (BaseObject.is(itm, "Array") || typeof itm == "object") Binding.$entityTreeStateInfo(itm, r, newState);
        }
    } else if (typeof dc == "object") {
        if (newState != null) {
            if (typeof newState == "string") {
                if (newState == DataStateEnum.Undefined) {
                    delete dc[Binding.entityStatePropertyName];
                } else if (newState == DataStateEnum.Undelete) {
                    dc[Binding.entityStatePropertyName] = dc[Binding.entityOldStatePropertyName];
                } else {
                    dc[Binding.entityStatePropertyName] = newState;
                }
            } else if (BaseObject.is(newState, "Delegate")) {
                dc[Binding.entityStatePropertyName] = newState.invoke(dc, r);
            } else if (typeof newState == "function") {
                dc[Binding.entityStatePropertyName] = newState.call(dc, dc, r);
            }
        }
        if (dc[Binding.entityStatePropertyName] != null) {
            switch (dc[Binding.entityStatePropertyName]) {
                case Binding.entityStateValues.Unchanged:
                    r.Unchanged++;
                    break;
                case Binding.entityStateValues.New:
                    r.New++;
                    r.Changed++;
                    break;
                case Binding.entityStateValues.Updated:
                    r.Updated++;
                    r.Changed++;
                    break;
                case Binding.entityStateValues.Deleted:
                    r.Deleted++;
                    r.Changed++;
                    break;
            }

        } else {
            r.Unchanged++;
        }
        for (var k in dc) {
            itm = dc[k];
            if (BaseObject.is(itm, "Array") || typeof itm == "object") Binding.$entityTreeStateInfo(itm, r, newState);
        }
    }
}.Description("...")
 .Param("dc","...")
 .Param("r","...")
 .Param("newState","...");

Binding.entityTreeStateInfo = function (dc, newState) {
    var r = { Unchanged: 0, New: 0, Updated: 0, Deleted: 0, Changed: 0 };
    Binding.$entityTreeStateInfo(dc, r, newState);
    return r;
}.Description("Checks a data tree for node states and returns statistics. Can be used like if (Binding.entityTreeStateInfo(dc).Deleted > 0) { do something }. With second parameter can be used to set the state to all or some of the objects in the data tree. The parameter can be a string (the new state) or a callback Delegate or function(object, statistics) which is called for each object in the tree and has the opportunity to change its state as desired.")
 .Param("dc","...")
 .Param("newState","...")
 .Returns("object");

// newState can be:
// (omitted) - the statistics are returned only
// state     - the state is set to every node everywhere
// callback  - a callback function or delegate called for each node to return a state which is then set to the node.
Binding.entityState = function (dc, newState) {
    return Binding.entityTreeStateInfo(dc, newState);
}.Description("Checks a data tree for node states and returns statistics. Can be used like if (Binding.entityTreeStateInfo(dc).Deleted > 0) { do something }. With second parameter can be used to set the state to all or some of the objects in the data tree. The parameter can be a string (the new state) or a callback Delegate or function(object, statistics) which is called for each object in the tree and has the opportunity to change its state as desired.")
 .Param("dc","...")
 .Param("newState","...")
 .Returns("object");

Binding.$asStateSetTo = function(obj, state, recursive) {
	if (obj != null && typeof obj == "object") {
		if (recursive) {
			Binding.entityState(obj, state);
		} else {
			obj[Binding.entityStatePropertyName] = state;
		}
	}
	return obj;
}.Description("...")
 .Param("obj","...")
 .Param("state","...")
 .Param("recursive","Indicates if the call is recursive")
 .Returns("object");

Binding.asNew = function(obj,recursive) {
	return Binding.$asStateSetTo(obj, DataStateEnum.New, recursive);
}.Description("returns the obj with state set to new, recursively sets it in subobjects if recursive parameter is true")
 .Param("obj", "the object whos entity state will be set to new")
 .Param("recursive", "if true the change will be applied to any subobjects as well")
 .Returns("object");

Binding.asChanged = function(obj,recursive) {
	return Binding.$asStateSetTo(obj, DataStateEnum.Updated, recursive);
}.Description("returns the obj with state set to changed, recursively sets it in subobjects if recursive parameter is true")
 .Param("obj","...")
 .Param("recursive","...")
 .Returns("object");

Binding.asDeleted = function(obj,recursive) {
	return Binding.$asStateSetTo(obj, DataStateEnum.Deleted, recursive);
}.Description("returns the obj with state set to deleted, recursively sets it in subobjects if recursive parameter is true")
 .Param("obj","...")
 .Param("recursive","...")
 .Returns("...");

Binding.asUnchanged = function(obj,recursive) {
	return Binding.$asStateSetTo(obj, DataStateEnum.Unchanged, recursive);
}.Description("returns the obj with state set to unchanged, recursively sets it in subobjects if recursive parameter is true")
 .Param("obj","...")
 .Param("recursive","...")
 .Returns("...");

Binding.bindingContainerOf = function (_el) {
    var el = $(_el);
    var ac;
    if (JBUtil.isTemplateRoot(el)) {
        ac = el.activeclass();
        if (ac != null) return ac;
        return null;
    }
    // If not template root the bindings on the element are handled by the closest Base parent.
    el = el.parent();
    while (el != null && el.length > 0) {
        ac = el.activeclass();
        if (ac != null) return ac;
        if (JBUtil.isTemplateRoot(el)) return null; // not found
        el = el.parent();
    }
    return null;
}.Description("...")
 .Param("_el","...")
 .Returns("object or null");

Binding.$updateElementSources = function (el, patt, bOverridePolicy) {
    if (el != null && el.length > 0) {
        var rawEl = el.get(0);
        var ac = Binding.bindingContainerOf(el);
        if (ac != null) {
            var bindings = ac.findBindings(function (idx, item) {
                if (item.$target == rawEl) return item;
                return null;
            });
            var cpatt = JBUtil.$parseFlagSelector(patt);
            for (var i = 0; i < bindings.length; i++) {
                bindings[i].updateSource(cpatt, bOverridePolicy);
            }
        }
    }
}.Description("...")
 .Param("el","...")
 .Param("patt","...")
 .Param("bOverridePolicy","...")
 .Returns("...");

Binding.updateElementSources = function (el, patt, bOverridePolicy) {
    var e = $(el);
    for (var i = 0; i < e.length; i++) {
        Binding.$updateElementSources($(e.get(i)), patt, bOverridePolicy);
    }
}.Description("...")
 .Param("el","...")
 .Param("patt","...")
 .Param("bOverridePolicy","...")
 .Returns("...");

Binding.updateSourcesOf = function (baseEl, keyquery, patt, bOverridePolicy) {
    var e = JBUtil.getRelatedElements(baseEl, keyquery);
    Binding.updateElementSources(e, patt, bOverridePolicy);
}.Description("...")
 .Param("baseEl","...")
 .Param("keyquery","...")
 .Param("patt","...")
 .Param("bOverridePolicy","...");

Binding.$updateElementTargets = function (el, patt, bOverridePolicy) {
    if (el != null && el.length > 0) {
        var rawEl = el.get(0);
        var ac = Binding.bindingContainerOf(el);
        if (ac != null) {
            var bindings = ac.findBindings(function (idx, item) {
                if (item.$target == rawEl) return item;
                return null;
            });
            var cpatt = JBUtil.$parseFlagSelector(patt);
            for (var i = 0; i < bindings.length; i++) {
                bindings[i].updateTarget(cpatt, bOverridePolicy);
            }
        }
    }
}.Description("...")
 .Param("el","...")
 .Param("patt","...")
 .Param("bOverridePolicy","...")
 .Returns("object or null");

Binding.updateElementTargets = function (el, patt, bOverridePolicy) {
    var e = $(el);
    for (var i = 0; i < e.length; i++) {
        Binding.$updateElementTargets($(e.get(i)), patt, bOverridePolicy);
    }
}.Description("...")
 .Param("el","...")
 .Param("patt","...")
 .Param("bOverridePolicy","...");

Binding.updateTargetsOf = function (baseEl, keyquery, patt, bOverridePolicy) {
    var e = JBUtil.getRelatedElements(baseEl, keyquery);
    Binding.updateElementTargets(e, patt, bOverridePolicy);
}.Description("...")
 .Param("baseEl","...")
 .Param("keyquery","...")
 .Param("patt","...")
 .Param("bOverridePolicy","...");

// Instance members
Binding.prototype.getRelatedElements = function (patt) {
	if ( this.__obliterated ) { return; }
    return JBUtil.getRelatedElements(this.$target, patt);
}.Description("...")
 .Param("patt","...")
 .Returns("...");

// Override policy evaluator
// In the past this was a boolean, now we want more.
// Supported policies:
//	"write" or null - returns write override instructions
//  "reversesources" - returns if the sources should be updated from leaves to root.
Binding.GetOverridePolicy = function(bOverridePolicy, policy) {
	if (policy == null || policy == "write") {
		if (typeof bOverridePolicy == "object") {
			return bOverridePolicy.write; // Allows write always (updateSources)
		} else {
			return bOverridePolicy;
		}
	} else if (policy == "reversesources") {
		if (JBCoreConstants.ReverseSources) return true;
		if (typeof bOverridePolicy == "object") {
			return bOverridePolicy.reversesources;
		}
		return false;
	}
	return false; // By default
}
// Source object is used when source is specified, this binds to DOM object or its ext class instead of binding to a datacontext.
Binding.prototype.$getSourceObject = function (o, bActiveClassOnly) {
	if ( this.__obliterated ) { return; }
    try {
        if (o == null) return null;
        if (BaseObject.is(o, "Base")) return o;
        var os = $(o);
        if (os.length > 0) {
            if (BaseObject.is(os.get(0).activeClass, "Base")) return os.get(0).activeClass;
			if (bActiveClassOnly) return null;
            return os.get(0);
        } else {
            return null;
        }
    } catch (e) {
        alert(loc_BindCannotDetSource + '\n' + this.$expression);
    }
    return null;
}.Description("...")
 .Param("o","...")
 .Returns("object or null");

// Binding.prototype.$target = null; // (naked DOM element)
// Binding.prototype.$targetAction = null;

// Binding.prototype.$expression = null;
Binding.prototype.$type = "bind";
Binding.prototype.$path = null;
Binding.prototype.$literalValue = null;
Binding.prototype.$trigger = null;
Binding.prototype.$source = null; // source name - usually the value of attribute data-key=
Binding.prototype.$sourceType = "default";

Binding.prototype.$sourceObject = null; // The base source object (naked DOM element)
Binding.prototype.$sourceNode = null; // The object on which a property or method are called (naked DOM element)
Binding.prototype.$sourceAction = null;

Binding.prototype.$formatter = null;
Binding.prototype.$formatterType = null;
Binding.prototype.$formatterObject = null;
Binding.prototype.$formatterThis = null;
Binding.prototype.$formatterInverse = false;
// New - multiple formatters
Binding.prototype.$formatters = null; // Array of { formatter:,type:,inverse:,fmtobj:,fmtthis:}

Binding.prototype.$ruleWrapper = null;
Binding.prototype.$debugDelegate = null;

Binding.prototype.$controlElement = null; // The UI control if any. This is calculated on first use.

Binding.$targetUpdatejQueryEvent = "targetupdated";

Binding.prototype.flags = null;
Binding.prototype.options = null;
Binding.prototype.createIfNotExist = null;
Binding.prototype.bindingName = null;
Binding.prototype.bindingParameter = null;
Binding.prototype.path = null;
Binding.prototype.validators = null;
Binding.prototype.equals = function (obj) {
	if ( this.__obliterated ) { return; }
    if (BaseObject.prototype.equals.call(this, obj)) {
        if (this == obj) return true;
    }
    return false;
}.Description("Checks if bindings are equal")
 .Param("obj","...")
 .Returns("true or false");

Binding.prototype.$allowTransfer = function (bToSource) {
	if ( this.__obliterated ) { return; }
    if (bToSource) {
        if (this.$allowWriteDelegate != null) {
            if (!this.$allowWriteDelegate.invoke(this, bToSource)) return false;
        }
    } else {
        if (this.$allowReadDelegate != null) {
            if (!this.$allowReadDelegate.invoke(this, bToSource)) return false;
        }
    }

    if (this.options != null && this.options.disabled == true) return false;
    if (this.$type == "probe") return false;
    if (this.$type == "bind") return true;
    if (this.$type == "read" && !bToSource) return true;
    return false;
}.Description("...")
 .Param("bToSource","...")
 .Returns("true or false");

Binding.prototype.$parseTargetExpression = function (expr) {
	if ( this.__obliterated ) { return; }
    if (expr != null) {
        var m = expr.match(Binding.$reArray);
        if (m != null) {
            this.$targetAction = m[1];
            this.$targetIndex = (m[2] != null && m[2].length > 0) ? m[2] : null;
        } else {
            this.$targetAction = expr;
        }
    }
}.Description("...")
 .Param("expr","...");

Binding.prototype.$parseExpressionObject = function (obj) {
	if ( this.__obliterated ) { return; }
    this.$type = (obj.type != null) ? obj.type : "bind";
    if (obj.source != null) {
        this.$sourceType = "static";
        this.$sourceObject = obj.source;
    }
    this.$path = obj.path;
    this.$formatter = obj.formatter;
    this.$formatterType = (obj.formatterType != null) ? obj.formatterType : "format";
    this.flags = {};
}.Description("...")
 .Param("obj","...");

Binding.prototype.$constructRules = function (cnt) {
	if ( this.__obliterated ) { return; }
    var rules, arr, wrapper, rule, r, func, bRulesFound = false;
    if (this.$ruleWrapper != null) {
        this.$ruleWrapper.$attach();
        return;
    }
    if (cnt != null && cnt.length > 0) {
        rules = cnt.match(Binding.$regExpRules);
        if (rules != null) {
            // for performance sake this code is not in a separate function
            var ruleSupplier = null, node, o;
            node = $(this.$target);
            while (node != null && node.length > 0) {
                o = node.activeclass();
                if (BaseObject.is(o, "IRuleSource")) {
                    ruleSupplier = o;
                    break;
                }
                node = node.parent();
            }
            if (ruleSupplier == null) {
                jbTrace.log("No rule source is found in the binding: " + this.$expression);
                return;
            }
            // Attach wrapper and produce the produce ;).
            wrapper = new RuleWrapperControl(this);
            for (var i = 0; i < rules.length; i++) {
                rule = rules[i];
                r = rule.match(Binding.$regExpRule);
                if (r != null && r.length > 2) {
                    func = ruleSupplier.getRuleByName(r[2].trim(), null);
                    if (func != null) {
                        // (optimize) this helps us to discard any wrappers for which no rules are found or the rules are for non-supported events
                        if (wrapper.$setRule(r[1], func)) bRulesFound = true;
                        this.$traceBinding("rule", r[1]);
                    }
                }
            }

            if (bRulesFound) {
                // The wrapper really deserves to live
                wrapper.$attach();
                this.$ruleWrapper = wrapper;
            }
            // todo: Some corrections may be needed
        }
    }
}.Description("...")
 .Param("cnt","...");

//Binding.prototype.$newParsing = function (bindStr) {
//    //Using the $tempRegEx
//    this.$type = "bind";
//    this.$path = null;
//    this.$source = null;
//    this.$sourceType = "default";
//    this.$tempRegEx = Binding.$tempRegEx;
//    this.$tempRegEx.lastIndex = 0;
//    var r, s;
//    while (r = this.$tempRegEx.exec(bindStr)) {
//        if (r[1] != null && r[1] != "") {
//            this.$type = r[1];
//            //	Read Bind Probe
//            this.$order = (r[2] == null || r[2].length == 0) ? 0 : parseInt(r[2]);
//        }
//        else if (r[3] != null && r[3] != "") {
//            //	source|service
//            s = r[3].trim();
//            this.$source = r[4];
//            if (s == "source") {
//                switch (this.$source) {
//                    case "self":
//                        this.$sourceType = "self";
//                        break;
//                    case "static":
//                        this.$sourceType = "static";
//                        break;
//                    case "globalresource":
//                        this.$sourceType = "globalresource";
//                        break;
//                    case "dynamicresource":
//                        this.$sourceType = "dynamicresource";
//                        break;
//                    case "parentcontext":
//                        this.$source = null;
//                        this.$sourceType = "default";
//                        this.$useParentContext = true;
//                        break;
//                    case "systemsettings":
//                        this.$source = null;
//                        this.$sourceType = "systemsettings";
//                        break;
//                    case "appletstorage":
//                        this.$source = null;
//                        this.$sourceType = "appletstorage";
//                        break;
//                    case "settings":
//                        this.$source = null;
//                        this.$sourceType = "systemsettings";
//                        break;
//                    case "ajaxsettings":
//                        this.$source = null;
//                        this.$sourceType = "ajaxsettings";
//                        break;
//                    default:
//                        // translates to source or service
//                        this.$sourceType = s;
//                }
//            } else {
//                this.$sourceType = s; // service and others
//            }
//            this.$traceBinding("type", this.$sourceType);
//        }
//        else if ((r[5] != null && r[5] != "") || (r[21] != null && r[21] != "") || (r[23] != null && r[23] != "")) {
//            var t = (r[5] == null) ? ((r[21] == null) ? r[23] : r[21]) : r[5];
//            // path
//            switch (t) {
//                case "path":
//                    this.$path = r[6].trim();
//                    break;
//                case "text":
//                    if (this.$sourceType != "static") alert('source must be static for literal value to take effect\n' + this.$expression);
//                    this.$path = null;
//                    this.$literalValue = r[22].trim();
//                    break;
//                case "number":
//                    if (this.$sourceType != "static") alert('source must be static for literal value to take effect\n' + this.$expression);
//                    this.$path = null;
//                    this.$literalValue = parseInt(r[22].trim(), 10);
//                    break;
//                case "object":
//                    if (this.$sourceType != "static") alert('source must be static for literal value to take effect\n' + this.$expression);
//                    this.$path = null;
//                    var s = r[24].trim();
//                    if (s.length > 0 && Function.classes[s] != null) {
//                        this.$literalValue = new Function.classes[s];
//                    } else if (s.length == 0 || s.toLowerCase() == "object") {
//                        this.$literalValue = {};
//                    } else if (s.length > 0 && s.toLowerCase() == "array") {
//                        this.$literalValue = [];
//                    } else {
//                        this.$literalValue = null;
//                        jbTrace.log("The class name not found in expression: " + this.$expression);
//                    }
//                    break;
//            }
//            this.$traceBinding("path", this.$path);
//        }
//        else if ((r[7] != null && r[7] != "") || (r[9] != null && r[9] != "")) {
//            // format|inverseformat
//            this.$formatterType = (r[7] == null || r[7] == "") ? r[9].trim() : r[7].trim();
//            if (this.$formatterType.indexOf("inverse") == 0) {
//                this.$formatterType = this.$formatterType.slice(7); // "inverse".length == 7
//                this.$formatterInverse = true;
//            }
//            this.$formatter = (r[8] != null || r[8] == "") ? r[8].trim() : r[10].trim();
//            // customformat|inversecustomformat
//            switch (this.$formatterType) {
//                case "format":
//                    this.$formatterObject = Function.classes[this.$formatter];
//                    break;
//                case "customformat":
//                    if (this.$formatter != null) {
//                        this.$formatterObject = this.$getCustomFormatterObject(this.$formatter);
//                    }
//                    break;
//            }
//        }
//        else if (r[11] != null && r[11] != "") {
//            // options
//            var opts = r[10].split(",");
//            for (var i = 0; i < opts.length; i++) {
//                this.options[opts[i]] = true;
//            }
//        }
//        else if (r[12] != null && r[12] != "") {
//            //flags
//            var flags = r[12].split(",");
//            for (var i = 0; i < flags.length; i++) {
//                this.flags[flags[i]] = true;
//            }
//        }
//        else if (r[13] != null && r[13] != "") {
//            // create|createleaf
//            this.createIfNotExist = {
//                Leaf: r[13],
//                Type: r[14].trim()
//            };
//        }
//        else if (r[15] != null && r[15] != "") {
//            // checkstate
//            var opts = r[15].split(",");
//            if (opts.length > 0) {
//                var delegate = new Delegate(this, this.$onCheckSourceState);
//                var wrapper = delegate.getWrapper();
//                var e = null;
//                var el = $(this.$target);
//                var ac = el.activeclass();
//                for (var i = 0; i < opts.length; i++) {
//                    // Register with the target for state checks
//                    e = opts[i];
//                    if (e.length > 0) {
//                        if (e.charAt(0) == "$") {
//                            if (ac != null) {
//                                // TODO: Change this to handle events like readdata/writedata !!!
//                                var pureAction = e.slice(1).trim();
//                                if (BaseObject.is(ac[pureAction], "EventDispatcher")) {
//                                    ac[pureAction].add(delegate, true);
//                                } else if (BaseObject.is(ac["set_" + pureAction], "function")) {
//                                    ac["set_" + pureAction].call(ac, delegate);
//                                } else {
//                                    ac[pureAction] = delegate;
//                                }
//                            } else {
//                                jbTrace.log("The target element has no data-class and the event '" + e + "' cannot be attached in binding: " + this.$expression);
//                            }
//                        } else {
//                            // DOM
//                            el.bind(e, wrapper);
//                        }
//                    }
//                }
//            }
//        }
//        else if (r[16] != null && r[16] != "") {
//            //readdata
//            this.$autoReadEvents = r[16];
//            this.$autoReadAttached = false;
//        }
//        else if (r[17] != null && r[17] != "") {
//            // writedata
//            this.$autoWriteEvents = r[17];
//            this.autoWrite(this.$target, this.$autoWriteEvents);
//        }
//        else if (r[18] != null && r[18] != "") {
//            // ref reference
//            if (this.references == null) this.references = {};
//            this.references[r[18].trim()] = r[19].trim();
//        }
//        else if (r[20] != null && r[20] != "") {
//            // debug
//            //to do - cleaned!
//            var arr = r[20].split(":");
//            if (arr != null && arr.length > 1) {
//                var handlerEl = JBUtil.getRelatedElements(this.$target, arr[0]);
//                var ac = handlerEl.activeclass();
//                if (ac != null) {
//                    if (ac[arr[1]] != null) {
//                        this.$debugDelegate = new Delegate(ac, ac[arr[1]]);
//                    } else {
//                        alert("The object referred by the debug clause does not support the specified method: " + this.$expression);
//                    }
//                } else {
//                    alert("The object referred by the debug clause has no attached active class: " + this.$expression);
//                }
//            } else {
//                alert("Syntax error in debug clause in binding: " + this.$expression);
//            }
//        }
//        //        else if (r[19] != "") {
//        //            // text|number
//        //        }
//        //        else if (r[21] != "") {
//        //            // object
//        //        }
//        else if (r[25] != null && r[25] != "") {
//            // validator
//            var validator, vs = JBUtil.getRelatedElements(this.$target, r[24]);
//            for (var i = 0; i < vs.length; i++) {
//                validator = vs.get(i);
//                if (validator != null) {
//                    validator = validator.activeClass;
//                    if (BaseObject.is(validator, "IValidator")) {
//                        validator.add_binding(this);
//                        // Uncomment if there is real need to let the bindings know their validators (unlikely, but ... who knows)
//                        if (this.validators == null) this.validators = [];
//                        this.validators.push(validator);
//                    }
//                }
//            }
//        }
//        else if (r[26] != null && r[26] != "") {
//            // name
//            this.bindingName = r[26].trim();
//        }
//        else if (r[27] != null && r[27] != "") {
//            // trace
//            this.$traceBinding("type", this.$sourceType);
//        }
//        else if (r[28] != null && r[28] != "") {
//            //onload|onenter|onleave|onclose
//        }
//        else if (r[30] != null && r[30] != "") {
//            // parameter|argument
//            this.bindingParameter = r[31].trim();
//            if (r[30] == "controlparam") {
//                this.$controlParameterName = this.bindingParameter;
//                this.$resolveBindingParameter = this.$resolveControlParameter;
//            }
//        }
//    }

//    //Checking for null
//    if (this.flags == null) {
//        this.flags = {};
//    }
//    if (this.options == null) {
//        this.options = {};
//    }
//};

Binding.prototype.$parseExpression = function (expr) {
	if ( this.__obliterated ) { return; }
    this.$type = "bind";
    this.$path = null;
    this.$source = null;
    this.$sourceType = "default";
    var s; // for local use
    var arr = Binding.$regExpContent.exec(expr);

    if (arr != null) {

        this.$type = arr[1];
        this.$order = (arr[2] == null || arr[2].length == 0) ? 0 : parseInt(arr[2]);
        var cnt = arr[3].trim();

        // Read all references as strings - they are resolved on request.
        while (arr = Binding.$regRefs.exec(cnt)) {
            if (this.references == null) this.references = {};
            this.references[arr[1]] = arr[2];
        }

        arr = Binding.$regExpTrace.exec(cnt);
        if (arr != null) {
            if (arr[1] == "trace") {
                this.traceBinding = arr[2].trim();
            }
        } else {
            this.traceBinding = null;
        }
        arr = Binding.$regExpSource.exec(cnt);
        if (arr != null) {
            s = arr[1].trim();
            this.$source = arr[2].trim();
            //            var _srctype = this.$source;
            //            if (_srctype != null && _srctype.length > 0) {
            //                var s = _srctype.split("/");
            //                if (s != null && s.length > 1 && (s.indexOf("__") == 0)) _srctype = s[0].trim();
            //            }
            if (s == "source") {
                switch (this.$source) {
                    case "self":
                        this.$sourceType = "self";
                        break;
                    case "static":
                        this.$sourceType = "static";
                        break;
                    case "globalresource":
                        this.$sourceType = "globalresource";
                        break;
                    case "dynamicresource":
                        this.$sourceType = "dynamicresource";
                        break;
                    case "parentcontext":
                        this.$source = null;
                        this.$sourceType = "default";
                        this.$useParentContext = true;
                        break;
                    case "systemsettings":
                        this.$source = null;
                        this.$sourceType = "systemsettings";
                        break;
                    case "appletstorage":
                        this.$source = null;
                        this.$sourceType = "appletstorage";
                        break;
                    case "settings":
                        this.$source = null;
                        this.$sourceType = "systemsettings";
                        break;
					case "~":
						this.$source = null;
                        this.$sourceType = "builtin";
						break;
                    case "ajaxsettings":
                        this.$source = null;
                        this.$sourceType = "ajaxsettings";
                        break;
                    //                case "__control":
                    //                    this.$sourceType = "control";
                    //                    this.$source = null;
                    //                    break;
                    //                case "__view":
                    //                    this.$sourceType = "view";
                    //                    this.$source = null;
                    //                    break;
                    default:
                        // translates to source or service
                        this.$sourceType = arr[1].trim();
                }
            } else {
                this.$sourceType = s; // for now it can be only "service" or "shellcommand"
            }
        } else {
            this.$source = null;
            this.$sourceType = "default";
        }
        this.$traceBinding("type", this.$sourceType);
        arr = Binding.$regExpPath.exec(cnt);
        if (arr == null) arr = Binding.$regExpLiteral.exec(cnt);
        if (arr == null) arr = Binding.$regExpLiteralObject.exec(cnt);
        if (arr != null) {
            switch (arr[1]) {
                case "path":
					if (this.$targetAction == "pluginto") {
						this.$path = arr[2].trim();
						this.$literalValue = null;
						this.$plug = true;
					} else {
						this.$path = arr[2].trim();
					}
                    break;
				//case "plug":
				// break;
				case "trigger":
                    this.$path = null;
                    this.$literalValue = null;
                    this.$trigger = arr[2].trim();
                    break;
                case "text":
                    if (this.$sourceType != "static") alert('source must be static for literal value to take effect\n' + this.$expression);
                    this.$path = null;
                    this.$literalValue = arr[2].trim();
                    break;
                case "number":
                    if (this.$sourceType != "static") alert('source must be static for literal value to take effect\n' + this.$expression);
                    this.$path = null;
                    this.$literalValue = parseInt(arr[2].trim(), 10);
                    break;
                case "object":
                    if (this.$sourceType != "static") alert('source must be static for literal value to take effect\n' + this.$expression);
                    this.$path = null;
                    s = arr[2].trim();
                    if (s.length > 0 && Function.classes[s] != null) {
                        this.$literalValue = new Function.classes[s];
                    } else if (s.length == 0 || s.toLowerCase() == "object") {
                        this.$literalValue = {};
                    } else if (s.length > 0 && s.toLowerCase() == "array") {
                        this.$literalValue = [];
                    } else {
                        this.$literalValue = null;
                        jbTrace.log("The class name not found in expression: " + this.$expression);
                    }
                    break;
            }
        } else {
            this.$path = null;
        }
		// throw
		arr = Binding.$regExpThrowQuery.exec(cnt);
		if (arr != null) {
			this.$throwQuery = arr[2].trim();
		}

        this.$traceBinding("path", this.$path);
        arr = Binding.$regExpFormatter.exec(cnt);
        if (arr != null) {
            this.$formatterType = arr[1].trim();
            if (this.$formatterType.indexOf("inverse") == 0) {
                this.$formatterType = this.$formatterType.slice(7); // "inverse".length == 7
                this.$formatterInverse = true;
            }
            //this.$formatter = arr[2].trim();
			s = arr[2].split(",");
			if (s != null) {
				this.$formatters = [];
				for (var i = 0; i < s.length; i++) {
					var y,x = Binding.$regExpSingleFormatter.exec(s[i]);
					if (x != null) {
						y = x[2];
						if (x[1].indexOf(":") >= 0) {
							this.$formatters.push({
								$formatterObject: this.$getCustomFormatterObject(x[1]),
								$formatter: x[1].trim(),
								$custom: true,
								$param: ((y != null && y.length > 0)?y.replace("))",")"):null),
								$this: this.$formatterThis // This changes all the time  -valid only after the call to this.$getCustomFormatterObject
							});
						} else {
							this.$formatters.push({
								$formatterObject: this.$getSystemFormatterObject(x[1]), // was: Function.classes[x[1]], now the sys register is tried first and fall-back to this suports legacy code
								$formatter: x[1].trim(),
								$custom: false,
								$param: ((y != null && y.length > 0)?y.replace("))",")"):null),
								$this: null
							});
						}
					} else {
						jbTrace.log("binding formatter syntex error: " + s[i]);
					}
				}
			}
        } else {
            this.$formatter = null;
            this.$formatterType = null;
			this.$formatters = null;
        }
		/*
        if (this.$formatter != null && this.$formatterObject == null) {
            switch (this.$formatterType) {
                case "format":
                    this.$formatterObject = Function.classes[this.$formatter];
                    break;
                case "customformat":
                    if (this.$formatter != null) {
                        this.$formatterObject = this.$getCustomFormatterObject(this.$formatter);
                    }
                    break;
            }
        }
		*/
        arr = Binding.$regExpFlags.exec(cnt);
        if (arr != null) {
            var flags = arr[2].split(",");
            for (var i = 0; i < flags.length; i++) {
                this.flags[flags[i]] = true;
            }
        } else {
            this.flags = {};
        }
        arr = Binding.$regExpOptions.exec(cnt);
        if (arr != null) {
            var opts = arr[2].split(",");
            for (var i = 0; i < opts.length; i++) {
				if (opts[i].length > 0) {
					this.options[opts[i]] = true;
				}
            }
        } else {
            this.options = {};
        }
        arr = Binding.$regCheckState.exec(cnt);
        if (arr != null) {
            var opts = arr[2].split(",");
            if (opts.length > 0) {
                var delegate = new Delegate(this, this.$onCheckSourceState);
                var wrapper = delegate.getWrapper();
                var e = null;
                var el = $(this.$target);
                var ac = el.activeclass();
                for (var i = 0; i < opts.length; i++) {
                    // Register with the target for state checks
                    e = opts[i];
                    if (e.length > 0) {
                        if (e.charAt(0) == "$") {
                            if (ac != null) {
                                // TODO: Change this to handle events like readdata/writedata !!!
                                var pureAction = e.slice(1).trim();
                                if (BaseObject.is(ac[pureAction], "EventDispatcher")) {
                                    ac[pureAction].add(delegate, true);
                                } else if (BaseObject.is(ac["set_" + pureAction], "function")) {
                                    ac["set_" + pureAction].call(ac, delegate);
                                } else {
                                    ac[pureAction] = delegate;
                                }
                            } else {
                                jbTrace.log("The target element has no data-class and the event '" + e + "' cannot be attached in binding: " + this.$expression);
                            }
                        } else {
                            // DOM
                            el.bind(e, wrapper);
                        }
                    }
                }
            }
        }

        arr = Binding.$regAutoRead.exec(cnt);
        if (arr != null) {
            this.$autoReadEvents = arr[3];
            this.$autoReadAttached = false;
            this.$autoReadPriority = arr[2];
        }
        arr = Binding.$regAutoWrite.exec(cnt);
        if (arr != null) {
            this.$autoWriteEvents = arr[3];
            this.autoWrite(this.$target, this.$autoWriteEvents, arr[2]); // last param is priority
        }
        //Binding.$regAutoRead = /(read)=(\S+)/i; // comma separated list of events on the SOURCE at which to update the target
        //Binding.$regAutoWrite = /(write)=(\S+)/i; // comma separated list of events on TARGET at which to update the source

        arr = Binding.$regExpCreate.exec(cnt);
        if (arr != null) {
            this.createIfNotExist = {
                Leaf: Binding.$regExpCreateLeafs[arr[1]],
                Type: arr[2].trim()
            };
        } else {
            this.createIfNotExist = null;
        }
        arr = Binding.$regExpName.exec(cnt);
        if (arr != null) {
            if (arr[1] == "name") {
                this.bindingName = arr[2].trim();
            }
        } else {
            this.bindingName = null;
        }
        arr = Binding.$regExpParam.exec(cnt);
        if (arr != null) {
            this.bindingParameter = arr[2].trim();
            if (arr[1] == "controlparam") {
                this.$controlParameterName = this.bindingParameter;
                this.$resolveBindingParameter = this.$resolveControlParameter;
            }
        } else {
            this.bindingParameter = null;
        }

        arr = Binding.$regExpValidator.exec(cnt);
        if (arr != null) {
            if (arr[1] == "validator") {
				s = arr[2];
				if (s == null || s.length == 0) s = arr[3];
                var validator, vs = JBUtil.getRelatedElements(this.$target, s);
                for (var i = 0; i < vs.length; i++) {
                    validator = vs.get(i);
                    if (validator != null) {
                        validator = validator.activeClass;
                        if (BaseObject.is(validator, "IValidator")) {
                            validator.add_binding(this);
                            // Uncomment if there is real need to let the bindings know their validators (unlikely, but ... who knows)
                            if (this.validators == null) this.validators = [];
                            this.validators.push(validator);
                        }
                    }
                }
            }
        } else {
            this.validators = null;
        }
        if (this.$path && this.$path.length > 0) {
            this.path = this.$path.split(Binding.$reSplitPath);
        } else {
            this.path = null;
        }
        this.$constructRules(cnt);
        arr = Binding.$regExpDebug.exec(cnt);
        if (arr != null) {
            if (arr[1] == "debug") {
                arr = arr[2].split(":");
                if (arr != null && arr.length > 1) {
                    var handlerEl = JBUtil.getRelatedElements(this.$target, arr[0]);
                    var ac = handlerEl.activeclass();
                    if (ac != null) {
                        if (ac[arr[1]] != null) {
                            this.$debugDelegate = new Delegate(ac, ac[arr[1]]);
                        } else {
                            alert("The object referred by the debug clause does not support the specified method: " + this.$expression);
                        }
                    } else {
                        alert("The object referred by the debug clause has no attached active class: " + this.$expression);
                    }
                } else {
                    alert("Syntax error in debug clause in binding: " + this.$expression);
                }
            }
        } else {
            this.$debugDelegate = null;
        }
        this.$linkAllowHandlers(cnt);
    }
}.Description("...")
 .Param("expr","...");

Binding.prototype.$linkAllowHandlers = function (cnt) {
	if ( this.__obliterated ) { return; }
    if (cnt != null && cnt.length > 0) {
        var allows = cnt.match(Binding.$regExpAllows);
        if (allows != null) {
            for (var i = 0; i < allows.length; i++) {
                var allow = allows[i];
                var arr = allow.match(Binding.$regExpAllow);
                if (arr != null) {
                    var atype = arr[1];
                    arr = arr[2].split(":");
                    if (arr != null && arr.length > 1) {
                        var handlerEl = JBUtil.getRelatedElements(this.$target, arr[0]);
                        var ac = handlerEl.activeclass();
                        if (ac != null) {
                            if (ac[arr[1]] != null) {
                                if (atype == "allowread") {
                                    this.$allowReadDelegate = new Delegate(ac, ac[arr[1]]);
                                } else if (atype = "allowwrite") {
                                    this.$allowWriteDelegate = new Delegate(ac, ac[arr[1]]);
                                }
                            } else {
                                alert("The object referred by the allow clause does not support the specified method: " + this.$expression);
                            }
                        } else {
                            alert("The object referred by the allow clause has no attached active class: " + this.$expression);
                        }
                    } else {
                        alert("Syntax error in allow clause in binding: " + this.$expression);
                    }

                } else {
                    this.$allowReadDelegate = null;
                    this.$allowWriteDelegate = null;
                }
            }
        }
    }
}.Description("...")
 .Param("cnt","...");

Binding.prototype.$traceBinding = function (act, data) {
	if ( this.__obliterated ) { return; }
    if (this.traceBinding == null || this.traceBinding.length <= 0) return;
    if (this.traceBinding.indexOf(act) >= 0) {
        var arr = Binding.$regExpColor.exec(this.traceBinding);
        var clr = "44CFFF";
        if (arr != null) clr = arr[1];
        var s = this.$expression + " (" + act + ")<br/>";
        if (data != null) {
            jbTrace.logObject(s, data, clr);
        } else {
            jbTrace.log(s, clr);
        }
    }
}.Description("...")
 .Param("act","...")
 .Param("data","...");

//Binding.prototype.$findBindingContainer = function () {
//    cur = $(this.$target);
//    var ao = null;
//    while (cur != null && cur.length > 0) {
//        ao = cur.activeclass();
//        if (ao != null)
//        cur = cur.get(0);
//        if (cur == null) break;
//        if (cur.dataContext != null) return cur.dataContext;
//        cur = $(cur).parent();
//    }
//    return null;
//};
Binding.prototype.$findDataContext = function () {
	if ( this.__obliterated ) { return; }
    var cur;
    if (this.$useParentContext) {
        cur = $(this.$target).parent();
    } else {
        cur = $(this.$target);
    }

    while (cur != null) {
        cur = cur.get(0);
        if (cur == null) break;
        if (cur.dataContext != null || cur.hasDataContext === true) return cur.dataContext;
        cur = $(cur).parent();
    }
    return null;
}.Description("...")
 .Returns("object or null");

Binding.prototype.get_dataContext = function (dataKeyPattern, useParentContext) {
	if ( this.__obliterated ) { return; }
    var anchor = this.$target;
    if (BaseObject.is(dataKeyPattern, "string")) anchor = JBUtil.getRelatedElements(this.$target, dataKeyPattern);
    return JBUtil.findDataContext(anchor, useParentContext);
}.Description("...")
 .Param("dataKeyPattern","...")
 .Param("useParentContext","...")
 .Returns("object");
//#region setup source

Binding.prototype.$setupSource = function () {
	if ( this.__obliterated ) { return; }
    var p;
    switch (this.$sourceType) {
        case "source":
            // var p = $(this.$target).parents('[data-key="' + this.$source + '"]');
            p = JBUtil.getRelatedElements(this.$target, this.$source);
            this.$sourceObject = this.$getSourceObject(p);
            break;
        case "self":
            this.$sourceObject = this.$getSourceObject(this.$target);
            break;
		case "builtin":
			this.$sourceObject = null;
			if (this.is("Handler")) {
				this.$sourceObject = Handler.bindingLibrary;
			}
			break;
        case "static": // The context is provided on creation
            this.$sourceObject = null;
            break;
        case "globalresource":
            this.$sourceObject = (BaseObject.is(Binding.resources, "StringResources")) ? Binding.resources.data : Binding.resources;
            // this.$sourceObject = (BaseObject.is(Binding.resources, "ResourceSet")) ? Binding.resources.data : Binding.resources;
            break;
        case "dynamicresource":
            this.$sourceObject = (BaseObject.is(Binding.dynamicresources, "ResourceSet")) ? Binding.dynamicresources.data : Binding.dynamicresources;
            break;
        case "ajaxsettings":
            this.$sourceObject = new AjaxContextParametersRequester(this.$target);
            break;
        case "systemsettings":
            this.$sourceObject = System.Default().settings;
            // this.$sourceObject = (BaseObject.is(Binding.resources, "ResourceSet")) ? Binding.resources.data : Binding.resources;
            break;
        case "service":
            this.$sourceObject = null;
			if 	(this.$source == "system") {
				return System.Default();
			} else if (this.$source == "shell") {
				return window.Shell;
			} else {
				p = FindServiceQuery.findService(this.$target, this.$source);
				if (p != null) this.$sourceObject = p;
				// TODO: Should this throw an exception if the service is unavailable?
			}
            break;
		case "shellcommand":
			this.$sourceObject = null;
			break;
        case "appletstorage":
            this.$sourceObject = null; // no access to any applet storage
            p = FindServiceQuery.findService(this.$target, "IAppletStorage");
            if (p != null) this.$sourceObject = p.get_appletstorage();
            // this.$sourceObject = System.Default().settings;
            // this.$sourceObject = (BaseObject.is(Binding.resources, "ResourceSet")) ? Binding.resources.data : Binding.resources;
            break;
        //        case "control":
        //            p = JBUtil.getSpecialParent(this.$target, JBUtil.EParentKinds.control);
        //            this.$sourceObject = this.$getSourceObject(p);
        //            break;
        //        case "view":
        //            p = JBUtil.getSpecialParent(this.$target, JBUtil.EParentKinds.templateRoot);
        //            this.$sourceObject = this.$getSourceObject(p);
        //            break;
        default:
            this.$sourceObject = this.$findDataContext();
            break;
    }
    this.$traceBinding("source", this.$sourceObject);
    this.$setupPath();
    if (this.$autoReadEvents != null && this.$autoReadEvents.length > 0 && !this.$autoReadAttached) {
        this.$autoReadAttached = this.autoRead(this.$sourceObject, this.$autoReadEvents, this.$autoReadPriority); // autoRead will check if there is a source object and attempt to find the specified event over it
        // this.$autoReadAttached = true;
    }
    return this.$sourceObject;
}.Description("...");

Binding.prototype.$resolveBindingParameter = function () {
	if ( this.__obliterated ) { return; }
    // Do nothing. The return result is just a helper.
    return this.bindingParameter;
}.Description("...");

Binding.prototype.$resolveControlParameter = function () {
	if ( this.__obliterated ) { return; }
    var bpname = this.$controlParameterName;
    //if (bp == null) {
    this.bindingParameter = this.readControlValue(bpname);
    //}
    return this.bindingParameter;
}.Description("...")
 .Returns("object");

// Used by code that needs to resolve parent/child:binding
Binding.reBindingExecuteParts = /^(\S+?(?:\/\S+?)?)(?:\:(\S+))?$/i;

Binding.prototype.evalBindingPC = function (parent, child, bindname, bGetSource) {
	if ( this.__obliterated ) { return; }
    var t; // binding provider
    t = JBUtil.getRelatedElementsPC(this.$target, parent, child);
    var b = JBUtil.getNamedBinding(t, bindname);
    if (b != null) return (bGetSource) ? b.get_sourceValue() : b.get_targetValue();
    jbTrace.log("Cannot execute binding '" + bindname + "' in the context of " + this.$expression);
    return null;
}.Description("...")
 .Param("parent","...")
 .Param("child","...")
 .Param("bindname","...")
 .Param("bGetSource","...")
 .Returns("object or null");

// Split the path in parts separated with "."
// Binding.$rePathPartsMatcher = /(?:^|\.)((?:(?:\[\S+?\])|[^\.])+)(?=\.|$)/gi;
Binding.$rePathPartsMatcher = /(?:^|\.)(\#?(?:[a-zA-Z0-9\~_\$\:\/]*(?:(?:\(\S+?\))|(?:\[\S+?\]))?)|(?:[a-zA-Z0-9_\$]+)|(?:\[\S+?\]))(?=\.|$)/gi;
// split a part into method call and parameters (unparsed)
// Part can be:
//      [a.b.c] - a source expression (fetches the value from the specified source and uses it as name/index for this part)
//      optional <parent>:<method> or <parent>/<child>:method
//          with optional (<argument_list>)
//
// 1: source expression, 2: parent, 3: child, 4:method, 5: methodargs
Binding.$rePartTokens = /^(?:\[(\S+)\])|(?:([^\.\/:\(]+)(?:\/([^\.\/:\(]+))?\:([^\.\/:\(]+))?(?:\((\S+)\))?$/i;
//Binding.$rePartTokens = /^(?:(\[\S+\]))|(?:([^\.\/:\(]+)(?:\/([^\.\/:\(]+))?\:([^\.\/:\(]+))?(?:\((\S+)\))?$/i;
// [] get source parts:
// 1: parent, 2: child, 3: :(binding), 4: @(path)
// target parts:
// 5: parent, 6: child, 7: :(binding), 8: @(path)
// Notes: The general argument syntax is a) parent/child:binding or b) parent/child@<path> where path is any valid property path
//  The child is optional and can be omited if the parent is addressed
Binding.$reParseArg = /^(?:\[([^\.\/:\(\]]+)(?:\/([^\.\/:\(\]]+))?(?:(?:\:([^\.\/:\(\[]+))|(?:\@([^\]\[\(\)]+)))\])|(?:([^\.\/:\(\]]+)(?:\/([^\.\/:\(\]]+))?(?:(?:\:([^\.\/:\(\[]+))|(?:\@([^\]\[\(\)]+))))$/i;
// Helper light-weight object to carry the pre-parsed source paths. This class does not participate in the JB hierarchy
// arg - string , argMode- true if parsing arguments, binding
Binding.HSourcePathPart = function (argpart, argMode, binding) { // arg can be a string (static part) or an array processed positionally
    if (typeof argpart != "string") {
        this.kind = "error";
        return; // TODO: Perhaps an error message? Or may be exception or alert? Is this really impossible?
    }
    var arg, bTrivial = false;
    if (argMode) {
        // argument mode
        arg = Binding.$reParseArg.exec(argpart);
        if (arg == null) bTrivial = true;
    } else {
        // not argument mode
		if (argpart.indexOf("#") == 0) {
			argpart = argpart.slice(1);
			this.isindex = true;
		}
        arg = Binding.$rePartTokens.exec(argpart);
        if (arg != null && arg[1] != null && arg[1].length > 0) { // [source expression]
            // Turn on argument parsing mode
            argMode = true;
            arg = Binding.$reParseArg.exec(arg[1]);
        } else if (arg[5] != null && arg[5].length > 0 && (arg[2] == null || arg[2].length == 0)) {
            // Trivial method execution - the SINGLE (must be one and only one) argument is the method and should be parsed as argument
            argMode = true;
            arg = Binding.$reParseArg.exec(arg[5]);
        } else if (arg[2] != null && arg[2].length > 0 && arg[4] != null && arg[4].length > 0) {
            this.kind = "method";
            this.parent = arg[2];
            this.child = arg[3];
            this.method = arg[4];
            this.arguments = null;
            if (arg[5] != null && arg[5].length > 0) { // method call with or without arguments
                var arr = arg[5].split(",");
                // Process each argument in the same manner as path part
                if (arr != null) {
                    this.arguments = [];
                    for (var i = 0; i < arr.length; i++) {
                        this.arguments[i] = new Binding.HSourcePathPart(arr[i], true, binding);
                    }
                }
            }
            return;
        } else {
            bTrivial = true;
        }
    }
    if ((bTrivial || arg == null) && !argMode) {
        arg = argpart;
    } else if (arg == null && argMode) {
        this.kind = "literal";
        this.prop = argpart;
        return;
        // We treat everything unknown as literal
        //this.kind = "error";
        //jbTrace.log("Syntax error in path part '" + argpart + "' in binding " + (binding != null) ? binding.$expression : "");
    } else if (arg == null) {
        this.kind = "error";
        jbTrace.log("Syntax error in path part '" + argpart + "' in binding " + (binding != null) ? binding.$expression : "");
        return;
    }

    if (typeof arg == "string") { // argMode == true (can't happen otherwise - see the logic above)
        this.kind = "property";
        if (arg.charAt(0) == "$") {
            this.prop = arg.slice(1);
            this.pseudo = true;
			if (this.isindex) jbTrace.log("Pseudo property is marked as index parameter. This is intentionally not supported to reserve the option for the future. Currently there is no decision over which object this property should be executed.");
        } else {
            this.prop = arg;
            this.pseudo = false;
        }
    } else if (BaseObject.is(arg, "Array")) {
        if (argMode) {
            if (arg != null) {
                if (arg[3] != null && arg[3].length > 0) {
                    this.kind = "sourcebind";
                    this.binding = arg[3];
                    this.parent = arg[1];
                    this.child = arg[2];
                } else if (arg[4] != null && arg[4].length > 0) {
                    this.kind = "sourcepath";
                    this.path = arg[4];
                    this.parent = arg[1];
                    this.child = arg[2];
                } else if (arg[7] != null && arg[7].length > 0) {
                    this.kind = "targetbind";
                    this.binding = arg[7];
                    this.parent = arg[5];
                    this.child = arg[6];
                } else if (arg[8] != null && arg[8].length > 0) {
                    this.kind = "sourcepath";
                    this.path = arg[8]; // was: this.binding = arg[8];
                    this.parent = arg[5];
                    this.child = arg[6];
                } else {
                    this.kind = "error";
                    jbTrace.log("Syntax error in path part '" + argpart + "' in binding " + (binding != null) ? binding.$expression : "");
                }
            } else {
                this.kind = "error";
                jbTrace.log("Syntax error in path part '" + argpart + "' in binding " + (binding != null) ? binding.$expression : "");
            }
        } else {

            this.kind = "error";
            jbTrace.log("Syntax error in path part '" + argpart + "' in binding " + (binding != null) ? binding.$expression : "");

        }
    }
}.Description("...")
 .Param("argpart","...")
 .Param("argMode","...")
 .Param("binding","...");

Binding.HSourcePathPart.prototype.$sourcepathRead = function (binding) {
    var ac = null;
    if (this.parent == "~" && (this.child == null || this.child.length == 0)) {
        ac = binding.get_dataContext();
    } else {
        var src = JBUtil.getRelatedElementsPC(binding.$target, this.parent, this.child);
        if (src.length > 0) {
            var ac = src.activeclass();
            if (ac == null) ac = src.get(0);
        }
    }
    if (ac != null) {
        if (this.path != null && this.path.length > 0) {
            var arr = this.path.split(".");
            if (arr != null) {
                for (var i = 0; i < arr.length; i++) {
                    if (arr[i].charAt(0) == "$") {
                        ac = ac["get_" + arr[i].slice(1)]();
                    } else {
                        ac = ac[arr[i]];
                    }
                }
            }
        }
        return ac;
    }
    return null;
}.Description("...")
 .Param("binding","...")
 .Returns("object or null");
// The solution is object containing methods for reading and writing
// They both accept obj - base over which to perform the operation and the write method accepts als a value
Binding.HSourcePathPart.prototype.solution = function(binding) {
	var s;
    switch (this.kind) {
        case "literal":
            return {
			    prop: this.prop,
				read: function(obj) { return obj[this.prop];},
				write: function(obj,v) { obj[this.prop] = v;}
			};
        case "property":
            if (this.pseudo) {
				if (this.indexes != null) {
					var indices = [];
					for (var i = 0; i < this.indexes.length; i++) {
						indices[i] = this.indexes[i].solution(binding);
					}
					
					if (obj == null) {
						jbTrace.log("Indexes are specified, but cannot be applied with not source object for get_" + this.prop + " in binding " + binding.$expression);
					} else {
						return obj["get_" + this.prop].apply(obj,indices);
					}
				} else {
					if (obj == null) return ("$" + this.prop);
					return obj["get_" + this.prop].call(obj);
				}
            } else {
                if (obj == null) return this.prop;
                return obj[this.prop];
            }
        case "sourcebind":
            s = binding.evalBindingPC(this.parent, this.child, this.binding, true);
            if (obj != null && s != null) return JBUtil.$getProperty(obj, null, s);
            return s;
        case "targetbind":
            s = binding.evalBindingPC(this.parent, this.child, this.binding, false);
            if (obj != null && s != null) return JBUtil.$getProperty(obj, null, s);
            return s;
        case "sourcepath":
            s = this.$sourcepathRead(binding);
            if (obj != null && s != null) return JBUtil.$getProperty(obj, null, s);
            return s;
        case "method":
            var o;
            if (this.parent == "~") {
                o = Binding.bindingLibrary;
                if (this.child != null && this.child.length > 0) {
                    o = o[this.child];
                }
                if (o != null) {
                    if (o[this.method] != null && typeof o[this.method] == "function") {
                        var args = [obj];
                        if (this.arguments != null && this.arguments.length > 0) {
                            for (var i = 0; i < this.arguments.length; i++) {
                                if (this.arguments[i] != null) {
                                    args[i + 1] = this.arguments[i].resolve(null, binding);
                                }
                            }
                        }
                        s = o[this.method].apply(o, args);
                        if (obj != null) return JBUtil.$getProperty(obj, null, s);
                        return s;
                    } else {
                        jbTrace.log("Binding: Lirary reference is null: " + this.parent + "/" + (this.child != null) ? this.child : "");
                        return null;
                    }
                } else {
                    jbTrace.log("Binding: Unknown lirary reference: " + this.parent + "/" + (this.child != null) ? this.child : "");
                    return null;
                }
            }
            o = JBUtil.getRelatedElementsPC(binding.$target, this.parent, this.child);
            if (o.length > 0) {
                var ac = o.activeclass();
                if (ac != null) {
                    if (ac[this.method] != null && typeof ac[this.method] == "function") {
                        var args = [obj];
                        if (this.arguments != null && this.arguments.length > 0) {
                            for (var i = 0; i < this.arguments.length; i++) {
                                if (this.arguments[i] != null) {
                                    args[i + 1] = this.arguments[i].resolve(null, binding);
                                }
                            }
                        }
                        s = ac[this.method].apply(ac, args);
                        if (obj != null) return JBUtil.$getProperty(obj, null, s);
                        return s;
                    } else {
                        jbTrace.log("Binding: The method " + this.method + " does not exist in " + ac.fullClassType() + ". Binding: " + binding.$expression);
                    }
                } else {
                    if (o[this.method] != null && typeof o[this.method] == "function") {
                        var args = [];
                        if (this.arguments != null && this.arguments.length > 0) {
                            for (var i = 0; i < this.arguments.length; i++) {
                                if (this.arguments[i] != null) {
                                    args[i] = this.arguments[i].resolve(null, binding);
                                }
                            }
                        }
                        s = o[this.method].apply(o, args);
                        if (obj != null) return JBUtil.$getProperty(obj, null, s);
                        return s;
                    } else {
                        jbTrace.log("Binding: No jquery (extension) method " + this.method + " exists in binding: " + binding.$expression);
                    }
                }
            }
    }
    return null;
}
// The active parts must behave in two possible ways:
// 1. When obj is null - they return the elementary operation (string)
// 2. When obj is not null they execute on it and return the result
// This way we have both - extraction and calculation of naming in one method
Binding.HSourcePathPart.prototype.resolve = function (obj, binding) {
    var s,o;
    switch (this.kind) {
        case "literal":
            return this.prop;
        case "property":
            if (this.pseudo) {
				if (this.indexes != null) {
					var indices = [];
					for (var i = 0; i < this.indexes.length; i++) {
						indices[i] = this.indexes[i].resolve(null, binding);
					}
					if (obj == null) {
						jbTrace.log("Indexes are specified, but cannot be applied with not source object for get_" + this.prop + " in binding " + binding.$expression);
					} else {
						return obj["get_" + this.prop].apply(obj,indices);
					}
				} else {
					if (obj == null) return ("$" + this.prop);
					o = obj["get_" + this.prop];
					if (typeof o != "function") throw "get_" + this.prop + " does not exist";
					return o.call(obj);
				}
            } else {
                if (obj == null) return this.prop;
                return obj[this.prop];
            }
        case "sourcebind":
            s = binding.evalBindingPC(this.parent, this.child, this.binding, true);
            if (obj != null && s != null) return JBUtil.$getProperty(obj, null, s);
            return s;
        case "targetbind":
            s = binding.evalBindingPC(this.parent, this.child, this.binding, false);
            if (obj != null && s != null) return JBUtil.$getProperty(obj, null, s);
            return s;
        case "sourcepath":
            s = this.$sourcepathRead(binding);
            if (obj != null && s != null) return JBUtil.$getProperty(obj, null, s);
            return s;
        case "method":
            var o;
            if (this.parent == "~") {
                o = Binding.bindingLibrary;
                if (this.child != null && this.child.length > 0) {
                    o = o[this.child];
                }
                if (o != null) {
                    if (o[this.method] != null && typeof o[this.method] == "function") {
                        var args = [obj];
                        if (this.arguments != null && this.arguments.length > 0) {
                            for (var i = 0; i < this.arguments.length; i++) {
                                if (this.arguments[i] != null) {
                                    args[i + 1] = this.arguments[i].resolve(null, binding);
                                }
                            }
                        }
                        s = o[this.method].apply(o, args);
                        if (obj != null) return JBUtil.$getProperty(obj, null, s);
                        return s;
                    } else {
                        jbTrace.log("Binding: Lirary reference is null: " + this.parent + "/" + (this.child != null) ? this.child : "");
                        return null;
                    }
                } else {
                    jbTrace.log("Binding: Unknown lirary reference: " + this.parent + "/" + (this.child != null) ? this.child : "");
                    return null;
                }
            }
            o = JBUtil.getRelatedElementsPC(binding.$target, this.parent, this.child);
            if (o.length > 0) {
                var ac = o.activeclass();
                if (ac != null) {
                    if (ac[this.method] != null && typeof ac[this.method] == "function") {
                        var args = [obj];
                        if (this.arguments != null && this.arguments.length > 0) {
                            for (var i = 0; i < this.arguments.length; i++) {
                                if (this.arguments[i] != null) {
                                    args[i + 1] = this.arguments[i].resolve(null, binding);
                                }
                            }
                        }
                        s = ac[this.method].apply(ac, args);
                        if (obj != null) return JBUtil.$getProperty(obj, null, s);
                        return s;
                    } else {
                        jbTrace.log("Binding: The method " + this.method + " does not exist in " + ac.fullClassType() + ". Binding: " + binding.$expression);
                    }
                } else {
                    if (o[this.method] != null && typeof o[this.method] == "function") {
                        var args = [];
                        if (this.arguments != null && this.arguments.length > 0) {
                            for (var i = 0; i < this.arguments.length; i++) {
                                if (this.arguments[i] != null) {
                                    args[i] = this.arguments[i].resolve(null, binding);
                                }
                            }
                        }
                        s = o[this.method].apply(o, args);
                        if (obj != null) return JBUtil.$getProperty(obj, null, s);
                        return s;
                    } else {
                        jbTrace.log("Binding: No jquery (extension) method " + this.method + " exists in binding: " + binding.$expression);
                    }
                }
            }
    }
    return null;
}.Description("...")
 .Param("obj","...")
 .Param("binding","...")
 .Returns("object or null");

Binding.prototype.preparseSourcePath = function (path) { // returns and array of HSourcePathPart-s
	if ( this.__obliterated ) { return; }
    if (path == null || typeof path != "string") return null;
    var parts = [];
    Binding.$rePathPartsMatcher.lastIndex = 0;
    var r;
    while (r = Binding.$rePathPartsMatcher.exec(path)) {
        parts.push(r[1]);
    }
    // var parts = path.match(Binding.$rePathPartsMatcher);
    if (parts == null) return null; // TODO: Check if we are missing something
    // The array now contains all the parts we need to process separately
    var parsedParts = []; // Here we will save object descriptions with the preparsed data - ready for further execution later
    for (var i = 0; i < parts.length; i++) {
		var p = new Binding.HSourcePathPart(parts[i], false, this);
		if (p.isindex) {
			if (parsedParts.length > 0) {
				var indexer = parsedParts[parsedParts.length - 1];
				if (indexer.prop != null && indexer.pseudo) { // The part named indexer here will call resolve on its indexes when it is resolved.
					if (indexer.indexes == null) {
						indexer.indexes = [p];
					} else {
						indexer.indexes.push(p);
					}
				} else {
					jbTrace.log("an index is specified in a binding path, but there is no pseudo-property to use it on");
				}
			} else {
				jbTrace.log("an index is specified in a binding path, but it is the first part of the path which makes it unusable.");
			}
		} else {
			parsedParts.push(p);
		}
    }
    this.$parsedPath = parsedParts;
    return parsedParts;
}.Description("...")
 .Param("path","...")
 .Returns("...");

Binding.prototype.$setupPath = function () {
	if ( this.__obliterated ) { return; }
    this.$resolveBindingParameter();
    this.$sourceNode = this.$sourceObject; // source object is naked DOM el here
    this.$sourceAction = null;
    if (this.$parsedPath == null) {
        if (this.$path != null && this.$path.length > 0) {
            this.preparseSourcePath(this.$path);
        }
    }
    if (this.$parsedPath != null && this.$parsedPath.length > 0) {
        if (this.$sourceType == "dynamicresource" && BaseObject.is(Binding.dynamicresources, "IReloadableData")) {
            Binding.dynamicresources.ensureLoaded(this.$path); // TODO: If we ever decide to support this extend it to use better hash source.
        }
        var o = this.$sourceObject;
        var t;
        if (o != null) {
            for (var i = 0; i < this.$parsedPath.length - 1 && o != null; i++) {
                var pathPart = this.$parsedPath[i];
                if (pathPart.kind == "error") {
                    // We return null on error
                    jbTrace.log("Error in a preparsed path part element#" + i + " in binding: " + this.$expression);
                    o = null;
                    break;
                } else {
                    t = pathPart.resolve(o, this);
                    if (t == null) {
                        if (this.createIfNotExist != null) {
                            this.$traceBinding("create", this.createIfNotExist.Type);
                            switch (this.createIfNotExist.Type) {
                                case "object": t = {}; break;
                                case "array": t = []; break;
                            }
                        }
                        if (t != null) {
                            o[pathPart.resolve(null, this)] = t;
                        }
                    }
                    o = t;
                }
            }
        }
        this.$sourceAction = this.$parsedPath[this.$parsedPath.length - 1];
        this.$sourceNode = o;
    }
}.Description("...")
 .Returns("...");
Binding.$sysformattersreg = Registers.getRegister("systemformatters");
Binding.prototype.$getSystemFormatterObject = function (action) {
	if ( this.__obliterated ) { return; };
	var fmt = Binding.$sysformattersreg.item(action);
	if (fmt == null) {
		// TODO: Supports the legacy formatters - should be removed when possible
		fmt = Function.classes[action];
	}
	if (fmt == null) throw "Formatter " + action + " is not found";
	return fmt;
}
Binding.prototype.$getCustomFormatterObject = function (action) {
	if ( this.__obliterated ) { return; }
	var o;
    var arrParts = action.trim().match(Binding.reBindingExecuteParts);
    if (arrParts != null) {
        var t = JBUtil.getRelatedElements(this.$target, arrParts[1]);
        t = t.activeclass();
        if (t != null && BaseObject.is(t, "Base")) {
            this.$formatterThis = t;
            var s = arrParts[2];
            if (s.charAt(0) == "$") {
                s = "get_" + s.slice(1);
                if (t[s] != null) {
					o = t[s].call(t);
                    return o;
                } else {
					throw "Cannot find " + s + " on " + t.classType();
				}
            } else {
				if (typeof t[s] != "object") {
					throw "Class " + t + " does not have a custom formatter in its field " + s;
				}
                return t[s];
            }
        } else {
			jbTrace.log("custom formatter object not resolved.");
			throw "Custom formatter " + action + " cannot be resolved." + arrParts[1] + " is not found at all or is not an object of Base derived class.";
		}
        return null;
    }
}.Description("...")
 .Param("action","...")
 .Returns("object or null");

//#endregion setup source
Binding.prototype.unBind = function () {
	if ( this.__obliterated ) { return; }
    // God forbid! This should not be done - ever!
    // I am leaving the clean up code for non-existing feature in order to remind us not to do this again!
    if (this.$target != null && BaseObject.is(this.$target.activebindings, "Array")) {
        this.$target.activebindings.removeElement(this);
    }
    if (this.$ruleWrapper != null) {
        this.$ruleWrapper.$detach();
    }
    if (this.validators != null) {
        for (var i = 0; i < this.validators.length; i++) {
            this.validators[i].remove_binding(this);
        }
    }
    // readdata/writedata unbind
    EventHandlerHelperRegister.On(this, "$readwritedata").unbind();
	this.$target = null;
}.Description("...")
 .Returns("...");

Binding.prototype.$get_htmlExtractForErrorInfo = function () {
	if ( this.__obliterated ) { return; }
    var s = $('<div>').append($(this.$target).clone()).remove().html();
    return ((s.length > 1024) ? s.slice(0, 1024) : s);
}.Description("...")
 .Returns("...");

Binding.prototype.$set_targetValue = function (vin) {
	if ( this.__obliterated ) { return; }
    this.$traceBinding("set", vin);
    this.$resolveBindingParameter();
    if (this.$debugDelegate != null) this.$debugDelegate.invoke("$set_targetValue", this, this.$target, vin);
    try {
        if (this.$targetAction != null && this.$targetAction.length > 0) {
            if (this.$actualTarget != null) {
                var v = this.$formatToTarget(vin);
                if (this.$targetAction.charAt(0) == "$") {
                    if (this.$targetIndex != null) {
                        this.$actualTarget["set_" + this.$targetAction.slice(1)].call(this.$actualTarget, this.$targetIndex, v);
                    } else {
                        this.$actualTarget["set_" + this.$targetAction.slice(1)].call(this.$actualTarget, v);
                    }
                } else {
					// TODO: This branch does not make much sense
                    if (this.$targetIndex != null) { // TO DO: see if it makes sense to create objects in this case
                        $(this.$actualTarget)[this.$targetAction] = v; //this.$target[this.$targetAction] = v;
                    } else {
                        $(this.$actualTarget)[this.$targetAction] = v; //this.$target[this.$targetAction] = v;
                    }
                }
            } else if (this.$target != null) {
                var v = this.$formatToTarget(vin);
                if (this.$targetAction.charAt(0) == "$") {
                    if (this.$targetIndex != null) {
                        this.$target.activeClass["set_" + this.$targetAction.slice(1)].call(this.$target.activeClass, this.$targetIndex, v);
                    } else {
                        this.$target.activeClass["set_" + this.$targetAction.slice(1)].call(this.$target.activeClass, v);
                    }
                } else {
                    if (this.$targetIndex != null) {
						Binding.TargetOperations.$callwriteindexed(this.$targetAction, this.$target, this.$targetIndex, v, this);
                    } else {
						Binding.TargetOperations.$callwrite(this.$targetAction, this.$target, v, this);
                    }
                }
            }
            $(this.$target).trigger(Binding.$targetUpdatejQueryEvent);
        }

    } catch (ex) {
        if (window.g_JDebug) {
            //debugger;
            Base.$resetUpdateTransaction();
            throw (ex + "<br/>\n ERROR in Binding.prototype.$set_targetValue of " +
					((this.$targetAction != null)?this.$targetAction + "--":"") +
					this.$expression + "<br/>\nHTML Extract: " + this.$get_htmlExtractForErrorInfo());
        } else {
            var msg = new InfoMessageQuery(ex + "<br/>\n ERROR in Binding.prototype.$set_targetValue of " + this.$expression + "<br/>\nHTML Extract: " + this.$get_htmlExtractForErrorInfo());
            throw (ex + "<br/>\n ERROR in Binding.prototype.$set_targetValue of " + this.$expression + "<br/>\n HTML extract: " + this.$get_htmlExtractForErrorInfo());
            JBUtil.throwStructuralQuery(this.$target, msg);
            // InfoMessageQuery.emit(this,
        }
    }
}.Description("...")
 .Param("vin","...")
 .Returns("...");

Binding.prototype.$get_targetValue = function (bRaw) { // if bRaw is present and true the raw value is returned
	if ( this.__obliterated ) { return; }
    this.$resolveBindingParameter();
    if (this.$debugDelegate != null) this.$debugDelegate.invoke("$get_targetValue", this, this.$target);
    if (this.$targetAction != null && this.$targetAction.length > 0) {
        var r;
        try {
            if (this.$actualTarget != null) {
                if (this.$targetAction.charAt(0) == "$") {
                    if (this.$targetIndex != null) {
                        r = this.$actualTarget["get_" + this.$targetAction.slice(1)].call(this.$actualTarget, this.$targetIndex);
                    } else {
                        r = this.$actualTarget["get_" + this.$targetAction.slice(1)].call(this.$actualTarget);
                    }
                } else {
                    // TO DO: This branch does not make sense
                    r = $(this.$actualTarget)[this.$targetAction];
                }
                this.$traceBinding("get", r);
                if (bRaw) return r;
                return this.$formatFromTarget(r);
            } else if (this.$target != null && this.$targetAction != null) {
                if (this.$targetAction.charAt(0) == "$") {
                    if (this.$targetIndex != null) {
                        r = this.$target.activeClass["get_" + this.$targetAction.slice(1)].call(this.$target.activeClass, this.$targetIndex);
                    } else {
                        r = this.$target.activeClass["get_" + this.$targetAction.slice(1)].call(this.$target.activeClass);
                    }
                } else {
                    if (this.$targetIndex != null) {
						r = Binding.TargetOperations.$callreadindexed(this.$targetAction,this.$target,this.$targetIndex, this);
                        
                    } else {
						r = Binding.TargetOperations.$callread(this.$targetAction,this.$target, this);
                    }
                }
                this.$traceBinding("get", r);
                if (bRaw) return r;
                return this.$formatFromTarget(r);
            }
        } catch (ex) {
            if (window.g_JDebug) {
                //debugger;
                Base.$resetUpdateTransaction();
                throw (ex + "<br/>\n ERROR in Binding.prototype.$get_targetValue of " +
						((this.$targetAction != null)?this.$targetAction + "--":"") +
						+ this.$expression + "<br/>\n HTML extract: " + this.$get_htmlExtractForErrorInfo());
            } else {
                var msg = new InfoMessageQuery(ex + "<br/>\n ERROR in Binding.prototype.$get_targetValue of " + this.$expression + "<br/>\n HTML extract: " + this.$get_htmlExtractForErrorInfo());
                JBUtil.throwStructuralQuery(this.$target, msg);
                throw (ex + "<br/>\n ERROR in Binding.prototype.$get_targetValue of " + this.$expression + "<br/>\n HTML extract: " + this.$get_htmlExtractForErrorInfo());
                // InfoMessageQuery.emit(this,
            }

        }
    }
    this.$traceBinding("get", null);
    return null;
};

Binding.prototype.$get_sourceValue = function (bFormat) { // The source is considered persistent so the role of the parameter is reversed - request formatting is an exception
    if ( this.__obliterated ) { return; }
	var result;
    if (this.$debugDelegate != null) this.$debugDelegate.invoke("$get_sourceValue", this, this.$target);
    try {
        this.$setupSource();
        if (this.$sourceType == "static") {
            result = this.$literalValue;
        } else {
            if (this.$sourceAction != null && this.$sourceNode != null) {
                result = this.$sourceAction.resolve(this.$sourceNode, this);
                if (result == null && this.createIfNotExist != null && this.createIfNotExist.Leaf && this.createIfNotExist.Type.length > 0) {
                    switch (this.createIfNotExist.Type) {
                        case "object":
                            result = {};
                            break;
                        case "array":
                            result = [];
                            break;
                    }
                }
            } else {
                result = this.$sourceNode;
            }
        }
        if (bFormat) return this.$formatToTarget(result);
    } catch (ex) {
        if (window.g_JDebug) {
            //debugger;
            Base.$resetUpdateTransaction();
            throw (ex + "<br/>\n ERROR in Binding.prototype.$get_sourceValue of " + this.$expression + "<br/>\n HTML extract: " + this.$get_htmlExtractForErrorInfo());
        } else {
            var msg = new InfoMessageQuery(ex + "<br/>\n ERROR in Binding.prototype.$get_sourceValue of " + this.$expression + "<br/>\n HTML extract: " + this.$get_htmlExtractForErrorInfo());
            JBUtil.throwStructuralQuery(this.$target, msg);
            throw (ex + "<br/>\n ERROR in Binding.prototype.$get_sourceValue of " + this.$expression + "<br/>\n HTML extract: " + this.$get_htmlExtractForErrorInfo());
            // InfoMessageQuery.emit(this,
        }
    }
    return result;

};

Binding.prototype.compareValues = function (vnew, vold) { // default comparison
    return (vnew == vold);
};

Binding.prototype.$set_sourceState = function () { // Should be called only after this.$setupSource
	if ( this.__obliterated ) { return; }
    if (this.$sourceNode != null) {
        var state;
        if (BaseObject.is(this.$sourceNode, "IDataStateManager")) {
            state = this.$sourceNode.get_DataItemState();
            if (typeof state == "undefined") {
                this.$sourceNode.set_DataItemState(Binding.entityStateValues.Insert);
            } else if (state == Binding.entityStateValues.Unchanged) {
                this.$sourceNode.set_DataItemState(Binding.entityStateValues.Update);
            }
        } else if (!BaseObject.is(this.$sourceNode, "BaseObject")) {
            state = this.$sourceNode[Binding.entityStatePropertyName];
            if (typeof state == "undefined") {
                this.$sourceNode[Binding.entityStatePropertyName] = Binding.entityStateValues.Insert;
            } else if (state == Binding.entityStateValues.Unchanged) {
                this.$sourceNode[Binding.entityStatePropertyName] = Binding.entityStateValues.Update;
            }
        }
    }
};
Binding.prototype.$isPersistable = function(dontmark) {
	return (this.options.persistable || (Binding.updateEntityState && !this.options.nonpersistable && !dontmark));
}.Description("Checks if the binding is configured to change the state of the data (only on write)");
Binding.prototype.$set_sourceValue = function (val, bFormat, bDontMarkState) {
	if ( this.__obliterated ) { return; }
    try {
        this.$setupSource();
        if (val == null && this.createIfNotExist != null && this.createIfNotExist.Leaf && this.createIfNotExist.Type.length > 0) {
            switch (this.createIfNotExist.Type) {
                case "object":
                    val = {};
                    break;
                case "array":
                    val = [];
                    break;
            }
        }
        if (bFormat) val = this.$formatFromTarget(val);
        if (this.$sourceNode != null) {
            if (this.$sourceAction != null) {
                var action = this.$sourceAction.resolve(null, this); // Return the action to perform (prop/pseudo prop)
                if ( this.$isPersistable(bDontMarkState) ) {
                    var oldVal = JBUtil.$getProperty(this.$sourceNode, null, action);
                    if (bFormat) oldVal = this.$formatToTarget(oldVal);
                    if (!this.compareValues(val, oldVal)) {
                        this.$set_sourceState();
                    }
                }
                JBUtil.$setProperty(this.$sourceNode, null, action, val);
            } else {
                // Nothing - source objects cannot be updated
            }
        }
    } catch (ex) {
        if (window.g_JDebug) {
            //debugger;
            Base.$resetUpdateTransaction();
            throw (ex + "<br/>\n ERROR in Binding.prototype.$set_sourceValue of " + this.$expression + "<br/>\n HTML extract: " + this.$get_htmlExtractForErrorInfo());
        } else {
            var msg = new InfoMessageQuery(ex + "<br/>\n ERROR in Binding.prototype.$set_sourceValue of " + this.$expression + "<br/>\n HTML extract: " + this.$get_htmlExtractForErrorInfo());
            JBUtil.throwStructuralQuery(this.$target, msg);
            throw (ex + "<br/>\n ERROR in Binding.prototype.$set_sourceValue of " + this.$expression + "<br/>\n HTML extract: " + this.$get_htmlExtractForErrorInfo());
            // InfoMessageQuery.emit(this,
        }

    }
};

Binding.prototype.$onCheckSourceState = function (eventOrSender, dcOrNothing) {
	if ( this.__obliterated ) { return; }
    if (this.testSourceState()) {
        JBUtil.throwStructuralQuery(this.$target, new DataStateQuery(true, this), null);
    } else {
		JBUtil.throwStructuralQuery(this.$target, new DataStateQuery(false, this), null);
	}
};

Binding.prototype.testSourceState = function (bFormat, bOverridePolicy) { // Does fake update source to determine if the source's state will change
	if ( this.__obliterated ) { return; }
    if (!Binding.GetOverridePolicy(bOverridePolicy) && !this.$allowTransfer(true)) return;
    var val = this.$get_targetValue();
    if (this.$sourceNode != null) {
        if (this.$sourceAction != null) {
            var action = this.$sourceAction.resolve(null, this); // Return the action to perform (prop/pseudo prop)
            if (this.$allowTransfer(true) && this.$isPersistable()) {
                var oldVal = JBUtil.$getProperty(this.$sourceNode, null, action);
                if (bFormat) oldVal = this.$formatToTarget(oldVal);
                if (!this.compareValues(val, oldVal)) {
                    return true;
                }
            }
        }
    }
    return false;
};

Binding.prototype.$formatToTarget = function (inpVal) {
	if ( this.__obliterated ) { return; }
	var v = inpVal;
	if (this.$formatters != null) {
		for (var i = 0; i < this.$formatters.length; i++) {
			var f = this.$formatters[i];
			if (f.$formatterObject) {
				var _method = (this.$formatterInverse) ? "FromTarget" : "ToTarget";
				if (f.$this != null) {
					v = f.$formatterObject[_method].call(f.$this, v, this, f.$param);
				} else {
					v = f.$formatterObject[_method](v, this, f.$param);
				}
			}
		}
	}
	return v;
};

Binding.prototype.$formatFromTarget = function (inpVal) {
	if ( this.__obliterated ) { return; }
	var v = inpVal;
	if (this.$formatters != null) {
		for (var i = this.$formatters.length - 1; i >= 0; i--) {
			var f = this.$formatters[i];
			if (f.$formatterObject) {
				var _method = (this.$formatterInverse) ? "ToTarget" : "FromTarget";
				if (f.$this != null) {
					v = f.$formatterObject[_method].call(f.$this, v, this, f.$param);
				} else {
					v = f.$formatterObject[_method](v, this, f.$param);
				}
			}
		}
	}
	return v;
};

// PUBLIC PART
// We decided to make these public, but we keep the protected ones for backward compatibility
Binding.prototype.get_targetValue = function (bRaw) {
	if ( this.__obliterated ) { return; }
    return this.$get_targetValue(bRaw);
};

Binding.prototype.set_targetValue = function (vin) {
    if ( this.__obliterated ) { return; }
    if (this.options.operation && BaseObject.is(vin, "Operation")) {
        var me = this;
        vin.onsuccess(function(_val){ me.$set_targetValue(_val); }).onfailure(function(errinfo){ me.$set_targetValue(null); });
    } else {
        this.$set_targetValue(vin);
    }
};

Binding.prototype.get_sourceValue = function (bFormat) { // move me up there
	if ( this.__obliterated ) { return; }
    return this.$get_sourceValue(bFormat);
};

Binding.prototype.set_sourceValue = function (val, bFormat, bDontMarkState) {
	if ( this.__obliterated ) { return; }
    this.$set_sourceValue(val, bFormat, bDontMarkState);
};

Binding.prototype.callOnTarget = function (f) {
	if ( this.__obliterated ) { return; }
    var r = (this.$actualTarget != null) ? this.$actualTarget : $(this.$target);
    var arr = new Array();
    var i;
    for (i = 1; i < arguments.length; i++) {
        arr[arr.length] = arguments[i];
    }
    return r[f].apply(r, arr);
};

Binding.prototype.get_target = function () {
	if ( this.__obliterated ) { return; }
    return this.$target;
};
Binding.prototype.get_targetObject = function () {
	if ( this.__obliterated ) { return; }
    if (this.$target != null) {
		return $(this.$taget).activeclass();
	};
	return null;
};
Binding.prototype.get_actualTarget = function () {
	if ( this.__obliterated ) { return; }
    if (this.$actualTarget != null) return this.$actualTarget;
    if ($(this.$target).length > 0) {
        if (this.$targetAction != null && this.$targetAction.charAt(0) == "$" && $(this.$target).get(0).activeClass != null) return $(this.$target).get(0).activeClass;
        return $(this.$target);
    }
    return null;
};

Binding.prototype.updateTarget = function (compiledPatt, bOverridePolicy) {
	if (this.__obliterated) { return; }
    if (!Binding.GetOverridePolicy(bOverridePolicy) && !this.$allowTransfer()) {
        if (this.$autoReadEvents != null && this.$autoReadEvents.length > 0 && !this.$autoReadAttached) this.$setupSource();
        return;
    }
    if (compiledPatt != null) {
        if (!this.matchFlags(compiledPatt)) return;
    }
	if (this.options.async || this.options.asyncread) {
		this.callAsync(this.$asyncUpdateTarget);
	} else {
        var val = this.$get_sourceValue();
        this.set_targetValue(val);
        
	}
};

Binding.prototype.$asyncUpdateTarget = function() {
	if (this.__obliterated) { return; }
	var val = this.$get_sourceValue();
	this.set_targetValue(val);
};

Binding.prototype.updateSource = function (compiledPatt, bOverridePolicy) {
	if (this.__obliterated) { return; }
    if (!Binding.GetOverridePolicy(bOverridePolicy) && !this.$allowTransfer(true)) return;
    if (compiledPatt != null) {
        if (!this.matchFlags(compiledPatt)) return;
    }
	if (this.options.async || this.options.asyncwrite) {
		this.callAsync(this.$asyncUpdateSource);
	} else {
		var val = this.$get_targetValue();
		this.$set_sourceValue(val);
	}
};

Binding.prototype.$asyncUpdateSource = function() {
	if ( this.__obliterated ) { return; }
	var val = this.$get_targetValue();
		this.$set_sourceValue(val);
};

Binding.prototype.disableTarget = function (b) {
	if ( this.__obliterated ) { return; }
    if (this.$actualTarget != null) {
        if (BaseObject.is(this.$actualTarget, "IDisablable")) {
            this.$actualTarget.set_disabled(b ? true : false);
        } else {
            $(this.$actualTarget).elementdisabled(b ? true : false);
        }
    } else {
        var el = $(this.$target);
        var a = el.activeclass();
        if (BaseObject.is(a, "IDisablable")) {
            this.$actualTarget.set_disabled(b ? true : false);
        } else {
            el.elementdisabled(b ? true : false);
        }
    }
    //    var el = (this.$actualTarget != null) ? this.$actualTarget : $(this.$target);
    //    if (b) {
    //        this.callOnTarget("attr", "disabled", true);
    //    } else {
    //        this.callOnTarget("removeAttr", "disabled");
    //    }
};

Binding.prototype.$matchFlagGroup = function (arrflags) {
	if ( this.__obliterated ) { return; }
    if (arrflags == null) return false;
    for (var i = 0; i < arrflags.length; i++) {
        if (arrflags[i] != null && arrflags[i].length == 0) return true;
        if (!this.flags[arrflags[i]]) return false;
    }
    return true;
};

Binding.prototype.matchFlags = function (arrflags) {
	if ( this.__obliterated ) { return; }
    if (arrflags == null) return false;
    for (var i = 0; i < arrflags.length; i++) {
        if (this.$matchFlagGroup(arrflags[i])) return true;
    }
    return false;
};

Binding.prototype.container = function (skipThis) {
	if ( this.__obliterated ) { return; }
    var el = $(this.$target);
    var ac;
    if (BaseObject.is(skipThis, "string")) {
        var o = el.parents('[data-key="' + skipThis + '"]');
        if (o == null || o.length == null || o.length == 0) return null;
        for (var i = 0; i < o.length; i++) {
			if (JBUtil.isTemplateRoot($(o).get(i))) {
				return null;
			}
            if (BaseObject.is($(o).get(i).activeClass, "Base")) return $(o).get(i).activeClass;
        }
        return null;
    }
    if (!skipThis) {
        ac = el.activeclass();
        if (ac != null) return ac;
    }
    el = el.parent();
    while (el != null && el.length > 0) {
        ac = el.activeclass();
        if (ac != null) return ac;
        el = el.parent();
    }
    return null;
}.Description("Seeks a parent (a container) element that contains the target of the binding.")
	.Param("skipThis","string or boolean - if boolean skips the current element and seeks parents until the first one with data-class. If string, finds the first parent with that data-key that has data-class.")
	.Returns("returns the instance of Base found or null.");

Binding.prototype.updateTargets = function (skipThis) {
	if ( this.__obliterated ) { return; }
    var obj = this.container(skipThis);
    if (obj != null) obj.updateTargets();
}.Description("Uses the logic of container() metod and invokes updateTargets on that parent.");

Binding.prototype.readData = function (e, dc, binding, param) {
	if ( this.__obliterated ) { return; }
    this.updateTarget(null, true);
};

Binding.prototype.writeData = function (e, dc, binding, param) {
	if ( this.__obliterated ) { return; }
    this.updateSource(null, true);
};

Binding.prototype.$autoBind = function (elIn, evnts, proc, priority /*bUnbind - scrapped */) {
	if ( this.__obliterated ) { return; }
    if (!BaseObject.is(evnts, "string")) return false;
    var el = elIn;
    var arr = evnts.split(",");
    for (var i = 0; i < arr.length; i++) {
        var evnt = (arr[i] != null) ? arr[i].trim() : "";
        if (evnt.length > 0) {
            var parts = evnt.split(":");
            if ((parts != null) && (parts.length > 1) && (parts[0].length > 0) && parts[1].length > 0) {
                el = this.getRelatedElements(parts[0].trim());
                evnt = parts[1].trim();
            }
            var e = null, act = null;
            if (BaseObject.is(el, "BaseObject")) {
                if (evnt.charAt(0) == "$") {
                    act = el;
                } else {
                    e = $(el.root);
                }
            } else if (el != null) {
                if (evnt.charAt(0) == "$") {
                    act = $(el).activeclass();
                } else {
                    e = $(el);
                }
            }
            if (e != null) {
                EventHandlerHelperRegister.On(this, "$readwritedata").bind(this, proc).to(e, evnt);
            }
            if (act != null) {
                var evntActual = evnt.slice(1);
                var np = null;
                if (priority != null && !isNaN(np = parseInt(priority))) {
                    EventHandlerHelperRegister.On(this, "$readwritedata").bind(this, proc).to(act, evntActual, np);
                } else {
                    EventHandlerHelperRegister.On(this, "$readwritedata").bind(this, proc).to(act, evntActual, true);
                }
            }

            /* Code replaced with a new feature
            if (e != null) {
            if (bUnbind) {
            e.unbind(evnt + "." + this.__instanceId);
            } else {
            e.bind(evnt + "." + this.__instanceId, Delegate.createWrapper(this, proc));
            }
            }
            if (act != null) {
            var evntActual = evnt.slice(1);
            if (BaseObject.is(act[evntActual], "EventDispatcher")) {
            if (bUnbind) {
            act[evntActual].remove(new Delegate(this, proc));
            } else {
            var np = null;
            if (priority != null && !isNaN(np = parseInt(priority))) {
            act[evntActual].add(new Delegate(this, proc), np);
            } else {
            act[evntActual].add(new Delegate(this, proc), true);
            }
            }
            }
            }
            */

        }
    }
    return true;
};

Binding.$getAutoTransferEvents = function (el, evnts) {
    if (evnts != null && evnts.length > 0 && evnts != "auto") return evnts;
    var c = null;
    if (BaseObject.is(el, "Base")) {
        c = el;
    }
    c = $(el).activeclass();
    if (c != null) {
        return c.get_autoupdateevents();
    }
    return "";
};

Binding.prototype.autoRead = function (el, evnts, priority) {
	if ( this.__obliterated ) { return; }
    return this.$autoBind(el, Binding.$getAutoTransferEvents(el, evnts), this.readData, priority);
};

Binding.prototype.autoWrite = function (el, evnts, priority) {
	if ( this.__obliterated ) { return; }
    return this.$autoBind(el, Binding.$getAutoTransferEvents(el, evnts), this.writeData, priority);
};

Binding.prototype.autoUnRead = function (el, evnts, priority) {
	if ( this.__obliterated ) { return; }
    return this.$autoBind(el, Binding.$getAutoTransferEvents(el, evnts), this.readData, priority, true);
};

Binding.prototype.autoUnWrite = function (el, evnts, priority) {
	if ( this.__obliterated ) { return; }
    return this.$autoBind(el, Binding.$getAutoTransferEvents(el, evnts), this.writeData, priority, true);
};

Binding.prototype.resolveReferenceTo = function (refstr) {
	if ( this.__obliterated ) { return; }
    return JBUtil.resolveBindingReference(this.$target, refstr);
};

Binding.prototype.getRef = function (refname) {
	if ( this.__obliterated ) { return; }
    if (this.references != null && BaseObject.is(this.references[refname], "string")) {
        return this.resolveReferenceTo(this.references[refname]);
    }
    return null;
};

Binding.prototype.readControlValue = function (ctlvalname) {
	if ( this.__obliterated ) { return; }
    if (this.$controlElement == null) {
        var node = $(this.$target);
        var o;
        while (node != null && node.length > 0) {
            o = node.activeclass();
            if (BaseObject.is(o, "IUIControl")) {
                this.$controlElement = o;
                break;
            }
            if (BaseObject.is(o, "ITemplateRoot")) break;
            if (node.attr("data-template-root")) break;
            node = node.parent();
        }
    }
    if (this.$controlElement != null) {
        return this.$controlElement.get_controlparameter(ctlvalname);
    }
    return null;
};
