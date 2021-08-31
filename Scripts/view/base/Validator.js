


// Validator container - validator
/*CLASS*/
function Validator(domEl) {
    ViewBase.apply(this, arguments);
    this.validateBindings = new Array();
    this.$rules = new Array();
	
	
	
}
Validator.Inherit(ViewBase, "Validator");
Validator.Implement(IValidator);
Validator.Implement(ITemplateSourceImpl,new Defaults("templateName"));
Validator.Implement(ITemplateConsumerImpl);
Validator.Implement(IDisablable);
Validator.$defaults = {
    templateName: "bindkraft/default-validator" 
}

Validator.ImplementProperty("throwqueryonvaliditychanged", new InitializeStringParameter("Any string will enable that, values of view, window, app will limit it to the corresponding scope (ignored for now)",null));
Validator.ImplementProperty("waitreadiness", new InitializeBooleanParameter("If truthy value is set the validator will run the rules after the control is ready (if there is a control attached to the binding's target and no effect otherwise)",false));
Validator.ImplementProperty("notreadymessage", new InitializeStringParameter("Message when readiness fails","The component failed to complete its task."));

Validator.prototype.validitychanged = new InitializeEvent("Fired whenever the validity changes");
Validator.prototype.validating = new InitializeEvent("Fired before performing validation");

Validator.validatorsRegistry = {};
Validator.reRegistrationNameCheck = /^[a-z0-9]+$/;
// Defaults. Here they are only marked, the true system wide defaults should be set in the mmm.framework.conf.js file
Validator.correctImage = null;
Validator.incorrectImage = null;
Validator.failImage = null;
Validator.showhint = false;
Validator.autohidehint = false;
Validator.events = "blur";
Validator.prototype.obliterate = function () {
    this.closeValidator();
    ViewBase.prototype.obliterate.apply(this);
}.Description("Destructor");

Validator.prototype.$init = function () {
    // In the repeater we need to cut the innerHTML and keep it as a template for repeating items
    var el = $(this.root);
    if (this.get_template() == null) {
        var c = el.children();
        this.set_template(c);
        c.remove();
    }
    //this.$createAutoValidators();
	var imprules = this.get_importrules();
	if (imprules != null) {
		this.$buildRulesFromData(imprules);
	}
	this.$buildRulesFromDedicatedAtttributes();
	this.$sortRules();
	
    this.init();
    this.initializedevent.invoke(this, null);
    this.rebind(); // Default behaviour, items controls should override this
    this.onValidityChanged(); // initial state
};
Validator.prototype.get_importrules = function() {
	// This getter is provided for parameterization only: @importrules={read service=someservice path=pathtoruledefs}
	return null;
}
// +Validation rules building
/**
	v :=
		"{classdef}{classdef}..."
		|
		["classdef"*]
		|
		[ruleinstance]
		|
		[{ className:,parameters:}*]
*/
Validator.prototype.$buildRulesFromData = function(v) {
	var arr = v;
    var me = this;
	if (typeof arr == "string") {
		var arr = JBUtil.getEnclosedTokens("{","}","\\",v);
		// array of validator rule defs (being class defs) - convert them to object defs
	}
	if (!BaseObject.is(arr, "Array")) arr = [arr];
	if (BaseObject.is(arr, "Array")) { // A bit crazy, eh?
		var rules = arr.Select(function(idx, item) {
			if (BaseObject.is(item, "ValidateValue")) {
				// The rule must be prepared and parametrized.
				return item;
			}
			var def = null;
			if (BaseObject.is(item,"string")) {
				def = JBUtil.parseDataClass(item);
			} else if (typeof item == "object") {
				def = item;
			} else {
				jbTrace.log("Unrecognised rule definition.");
			}
			if (def != null && def.className != null) {
				if (Validator.validatorsRegistry[def.className] != null) def.className = Validator.validatorsRegistry[def.className];
				if (Class.is(Function.classes[def.className],"ValidateValue")) {
					var rule = new Function.classes[def.className](me);
					JBUtil.parametrize.call(rule, me.root, me, def.parameters);
					return rule;
				} else {
					jbTrace.log("The " + def.className + " is not a validation rule (ValidateValue)");
				}
			}
		});
		this.$rules = rules;
	}
}
Validator.prototype.$buildRulesFromDedicatedAtttributes = function() {
	var attrs = this.$().getAttributes("data-validate-(\\S+)");
    var clsDesc;
    if (attrs != null) {
        for (var attr in attrs) {
            if (Validator.validatorsRegistry[attr] != null) {
                clsDesc = {
                    className: Validator.validatorsRegistry[attr],
                    parameters: attrs[attr]
                };
            } else {
                clsDesc = JBUtil.parseDataClass(attrs[attr]);// A bit of craziness - jumbled attribute name is any validator rule with explicitly specified class name
            }
            if (clsDesc != null) {
                if (Class.is(Function.classes[clsDesc.className], "ValidateValue")) {
                    var rule = new Function.classes[clsDesc.className](this);
                    this.$rules.push(rule);
                    JBUtil.parametrize.call(rule, this.root, this, clsDesc.parameters);
                }
            }
        }
        this.$sortRules();
    }
}
Validator.prototype.$sortRules = function() {
	if (this.$rules != null) {
		this.$rules = this.$rules.sort(function (a, b) {
			if (a == null) return -1;
			if (b == null) return 1;
			if (a.get_order != null && b.get_order != null) return (a.get_order() - b.get_order());
			return 0;
		});
	}
}
Validator.prototype.$clearRules = function() {
	if (BaseObject.is(this.$rules, "Array")) {
		for (var i = 0; i < this.$rules.length; this.$rules[i++].obliterate());
	}
	this.$rules = [];
}

// -Validation rules building


// +Validation rules autobuilt from meta info (DEPRECATED - commented code will be removed soon)
// Validator.prototype.$autoValidatorsCreated = false;
// Validator.prototype.$createAutoValidators = function () {
//     if (this.$autoValidatorsCreated) return;
//     var metaData = this.get_metaData();
//     if (!IsNull(metaData)) {
//         this.$autoValidatorsCreated = true;
//         var rule;
//         switch (metaData.Type) {
//             case "Int16":
//             case "Int32":
//             case "Int64":
//                 rule = new CNumberValidator(this);
//                 // rule.fail = 1; // Really?!?
//                 this.$rules.push(rule);
//                 if (metaData.Size > 0) {
//                     rule = new CLengthValidator(this);
//                     rule.set_minChar(0);
//                     rule.set_maxChar(metaData.Size);
//                     this.$rules.push(rule);
//                 }
//                 break;
//             case "String":
//                 if (metaData.Size > 0) {
//                     if (metaData.Size > 0) {
//                         rule = new CLengthValidator(this);
//                         rule.set_minChar(0);
//                         rule.set_maxChar(metaData.Size);
//                         this.$rules.push(rule);
//                     }
//                 }
//                 break;
//             case "DateTime":
//                 break;
//             default:
//         }
//         if (!metaData.AllowNull) {
//             rule = new CRequiredFieldValidator(this);
//             rule.fail = 1;
//             this.$rules.push(rule);
//         }
//     }
// }.Description("Creates validators and adds them to the array of Rules");
// -Validation rules autobuilt from meta info (candidate for deprecation)

// Implemented by ITemplateSourceImpl.
// Validator.prototype.$template = null;

// Validator.prototype.get_template = function () {
//     if (this.templateSource != null) {
//         var o = this.findParent(this.templateSource);
//         if (BaseObject.is(o, "ITemplateSource")) {
//             return o.get_template();
//         } else if (BaseObject.is(o, "BaseObject")) {
//             return null;
//         }
//         return o;
//     } else {
//         return this.$template;
//     }
// }.Description("...")
//  .Returns("object or null");

// Validator.prototype.set_template = function (v) {
// 	this.$template = v;
// }.Description("Sets the tamplate")
//  .Param("v","Template");

Validator.prototype.isTemplateRoot = function () { return false; };
Validator.prototype.getTemplateByKey = function (v) {
    var tml = this.get_template();
    if (typeof tml == "string") {
        var fr = new DOMUtilFragment(tml);
        return fr.filterByKeyAsFragment(v, true);
    }
    return null;


    var a = $(this.get_template());
    var el;
    if (a != null && a.length > 0) {
        for (var i = 0; i < a.length; i++) {
            el = $(a[i]);
            if (el.attr("data-key") == v) return el;
        }
    }
    return null;
}.Description("Returns template by data-key")
 .Param("v","Template data-key to search for")
 .Returns("object or null");

// params
Validator.prototype.multiple = false;
Validator.prototype.mincorrect = 1; // if multiple is true, the minimal number of bindings that must be correct for success
Validator.prototype.message = null; // General non-rule dependent message (mostly useful for multiple bindings validation)
Validator.prototype.stoponfailure = new InitializeBooleanParameter("Do not try further validation rules after the first failure detected, default is false. ex: #stoponfailure='1'", false);
Validator.prototype.correctImage = new InitializeStringParameter("The path to the image for correct state (usually left empty)", null);
Validator.prototype.incorrectImage = new InitializeStringParameter("The path to the image for incorrect state.", null);
Validator.prototype.failImage = new InitializeStringParameter("The path to the image for failed state.", null);
Validator.prototype.showhint = new InitializeBooleanParameter("Show hints. ex: #showhint='1'", false);
Validator.prototype.autohidehint = new InitializeBooleanParameter("Autohide hints. ex: #autohidehint='1'", false);
// For now we support only events on the binding's target. We will probably extend this to support events from arbitrary targets.
Validator.prototype.events = new InitializeStringParameter("Which events of the element to cause validation (the one who's binding refers this validator). Default is blur, you can supply comma separated list including DOM and custom events, the latter are denoted with a $ as first character.", "blur");
Validator.prototype.instructions = new InitializeStringParameter("Instructions to show when uninitialized. Not fully supported in the current version.", null);
Validator.ImplementProperty("groupname", new InitializeStringParameter("Optional. Group name. The validation routines can validate by groups", null));
Validator.ImplementProperty("positiontip", new InitializeStringParameter("Optional. Set the text position of the warning massage", "leftMiddle"));
Validator.ImplementProperty("positiontarget", new InitializeStringParameter("Optional. Set the text position of the warning massage", "rightMiddle"));
Validator.ImplementActiveProperty("adjustmentx", new InitializeNumericParameter("Adjustment x parameter.", 0));
Validator.ImplementActiveProperty("adjustmenty", new InitializeNumericParameter("Adjustment y parameter.", 0));
Validator.ImplementActiveProperty("domholder", new InitializeStringParameter("Dom holder where the qtip will be rendered.", ""));

Validator.prototype.isOfGroup = function (reqGrp) {
    if (reqGrp == null || reqGrp.length == 0) return true;
    var g = this.get_groupname();
    if (typeof g == "string" && g.length > 0) {
        g = g.split(/\s*,\s*/);
        return g.Any(function(idx, item) {
            return (item == reqGrp);
        });
    } 
    return false;
}.Description("...")
 .Param("reqGrp","...")
 .Returns("true or false");

// members
Validator.prototype.$metaData = null;
Validator.prototype.get_metaData = function () {
    return this.$metaData;
};
Validator.prototype.set_metaData = function (v) {
    this.$metaData = v;
};
Validator.prototype.$messages = null;
Validator.prototype.get_messages = function () {
    return this.$messages;
};
Validator.prototype.get_message = function () {
    if (this.$messages != null && this.$messages.length > 0) {
        var s = "";
        for (var i = 0; i < this.$messages.length; i++) {
            if (i > 0) s += " "; //Robert have to add this as html
            s += this.$messages[i];
        }
        return s;
    } else {
        return "";
    }
};
Validator.prototype.validateBindings = null; // Bindings to validate
Validator.prototype.$rules = null;
Validator.prototype.get_rules = function() {
	return this.$rules;
}
Validator.prototype.get_ruleByName = function(name) {
    if (Array.isArray(this.$rules)) {
        return this.$rules.FirstOrDefault( function(i, r){
            if (r.get_ruleName() == name) return r;
            return null;
        } )
    }
    return null;
}
/**
 * getRuleByClass(cls [, props]) - searches for a rule by class and also optionally by matching property values.
 */
Validator.prototype.getRuleByClass = function(cls, props) {
    if (Array.isArray(this.$rules)) {
        return this.$rules.FirstOrDefault( function(i, r){
            if (r.is(cls)) {
                if (props != null) {
                    for (var k in props) {
                        if (typeof r["get_" + k] != "function" || r["get_" + k] != props[k]) return null;
                    }

                }
                return r;
            }
        });
    }
    return null;
}
/**
	set_rules enables to dynamically reset the rules with a new set. This can happen with bindings data-bind-$rules={read ...}
	
	Dynamic rules (re)definition is not a normal technique, but is useful in programmatically generated and managed UI.
*/
Validator.prototype.set_rules = function(v) {
	this.$clearRules();
	this.$buildRulesFromData(v);
	this.$sortRules();
	
}.Description("The rules can be set in different formats. Currently we support: 1) string containing \"{classname parameters}\" elements, 2) Array of objects { className: string, parameters: string|object} ")
	.Param("v","Rule definitions or ready rules as an array or a single rule definition. Each can be a string {...} an object { className: string, parameters: string|object} see JBUtil.parametrize for more info.");
Validator.prototype.registerValidationEvents = function (b) {
    if (BaseObject.is(this.events, "string")) {
        var j, arr = this.events.split(",");
        var evntData = { validator: this };
        if (b != null && b.get_target() != null) {
            var bt = $(b.get_target());
            var ac = bt.activeclass();
            for (j = 0; j < arr.length; j++) {
                if (arr[j].charAt(0) == "$") {
                    if (ac != null) {
                        var pureAction = arr[j].slice(1).trim();
                        if (BaseObject.is(ac[pureAction], "EventDispatcher")) {
                            ac[pureAction].add(new Delegate(this, this.OmniValidationEventHandler));
                        } else if (BaseObject.is(ac["set_" + pureAction], "function")) {
                            ac["set_" + pureAction].call(ac, new Delegate(this, this.OmniValidationEventHandler));
                        } else {
                            ac[pureAction] = new Delegate(this, this.OmniValidationEventHandler);
                        }
                    } else {
                        jbTrace.log("CVallidator is configured to handle an event over active class which does not exist");
                    }
                } else {
                    bt.bind(arr[j], evntData, Validator.OmniValidationEventHandler);
                }
            }
        }
    }
};
Validator.OmniValidationEventHandler = function (evnt) {
    if (BaseObject.is(evnt.data.validator, "Validator")) {
        evnt.data.validator.validate(true);
    }
};
Validator.prototype.OmniValidationEventHandler = function (sender, dc) {
    this.validate(true);
};
Validator.prototype.add_binding = function (binding) {
    if (this.multiple) {
        for (var i = 0; i < arguments.length; i++) {
            if (BaseObject.is(arguments[i], "Binding")) {
                this.validateBindings.addElement(arguments[i]);
                this.registerValidationEvents(arguments[i]);
            }
        }
    } else {
        if (BaseObject.is(binding, "Binding")) {
            this.validateBindings = [binding];
            this.registerValidationEvents(binding);
        }
    }
};
Validator.prototype.set_binding = function (bindings) {
    this.validateBindings = [];
    if (this.multiple) {
        for (var i = 0; i < arguments.length; i++) {
            if (BaseObject.is(arguments[i], "Binding")) {
                this.validateBindings.addElement(arguments[i]);
                this.registerValidationEvents(arguments[i]);
            }
        }
    } else {
        if (BaseObject.is(bindings, "Binding")) {
            this.validateBindings = [bindings];
            this.registerValidationEvents(bindings);
        }
    }
} .Description("Sets the binding over which the validator fetches the value to validate");
Validator.prototype.remove_binding = function (binding) {
    for (var i = 0; i < arguments.length; i++) {
        if (BaseObject.is(arguments[i], "Binding")) {
            if (BaseObject.is(this.validateBindings, "Array")) {
                this.validateBindings.removeElement(arguments[i]);
            }
            // todo: free the event handlers some day (this is probably done by the obliterate anyway)
        }
    }
};
Validator.prototype.$disabled = false;
Validator.prototype.get_disabled = function () {
    return this.$disabled;
};
Validator.prototype.set_disabled = function (v) {
    if (v && !this.$disabled) {
        this.closeValidator();
    } else if (!v && this.$disabled) {
        this.$disabled = v;
        this.validate(true);
    }
    this.$disabled = v;
};
Validator.prototype.result = ValidationResultEnum.uninitialized;
Validator.prototype.$validate = function (bIndicate) {
    //this.$createAutoValidators();
    var result = ValidationResultEnum.correct;
    this.$messages = null;
    if (!BaseObject.is(this.$rules, "Array")) return result;
    if (this.validateBindings == null || this.validateBindings.length == 0) return result;
    var i, j, r, curRule;
    if (this.multiple) {
        var arrValues = [];
        for (i = 0; i < this.$rules.length; i++) {
            curRule = this.$rules[i];
            if (!curRule.get_disabled()) {
                arrValues = [];
                for (j = 0; j < this.validateBindings.length; j++) {
                    arrValues.push(this.validateBindings[j].$get_targetValue(curRule.raw));
                }
                r = curRule.validateValues(this, arrValues, this.validateBindings);
                if (r > result) result = r;
                if (r == ValidationResultEnum.pending) this.waitReport++;
                if (bIndicate && (r > ValidationResultEnum.correct || curRule.indicate)) {
                    if (this.$messages == null) this.$messages = [];
                    this.$messages.push(curRule.get_message(arrValues));
                }
                if (this.stoponfailure && result > 0) return result;
            }
        }
    } else {
        var binding = this.validateBindings[0];
        var cval;
        for (i = 0; i < this.$rules.length; i++) {
            curRule = this.$rules[i];
            if (!curRule.get_disabled()) {
                cval = binding.$get_targetValue(curRule.raw);
                r = curRule.validateValue(this, cval, binding);
                if (r > result) result = r;
                if (r == ValidationResultEnum.pending) this.waitReport++;
                if (bIndicate && (r > ValidationResultEnum.correct || curRule.indicate)) {
                    if (this.$messages == null) this.$messages = [];
                    this.$messages.push(curRule.get_message(cval));
                }
                if (this.stoponfailure && result > 0) return result;
            }
        }
    }
    return result;
};
Validator.prototype.$waitingReports = 0;
Validator.prototype.waitReport = 0;
Validator.prototype.get_waitingasynch = function () {
    return (this.waitReport > 0) ? true : false;
};
Validator.prototype.reportResult = function (curRule, r) { // Callback for validation rules (asynch rules only!!!) proto: reportResult(this, result);
	if (this.waitReport <= 0) return;
    this.waitReport--;
    if (this.waitReport < 0) this.waitReport = 0;
    if (this.get_disabled()) {
        this.result = ValidationResultEnum.correct;
    } else {
        if (this.result < r) this.result = r;
    }

    if (r > ValidationResultEnum.correct || curRule.indicate) {
        if (this.validateBindings != null && this.validateBindings.length > 0) {
            this.$messages = [];
            var binding = this.validateBindings[0];
            var cval = binding.$get_targetValue(curRule.raw);
            if (this.$messages == null) this.$messages = [];
            this.$messages.push(curRule.get_message(cval));
            this.onValidityChanged();
        }
    }
    if (this.waitReport <= 0) {
        if (this.$asyncCallBack != null) {
            BaseObject.callCallback(this.$asyncCallBack, this.result);
            this.$asyncCallBack = null;
        }
    }
};
Validator.prototype.$asyncCallBack = null;
Validator.prototype.$readyForValidation = function() {
    if (!this.get_waitreadiness()) return Operation.From(null);
    if (this.validateBindings == null || this.validateBindings.length == 0) return Operation.From(null);
    if (this.multiple) { 
        this.LASTERROR("waitreadiness cannot be used with validators working with multiple bindings");
        // TODO Make this work too (some day)
        return Operation.From(null);
    }
    var binding = this.validateBindings[0];
    var dom = binding.get_target();
    if (dom == null) return Operation.From(null);
    var ac = dom.activeClass;
    if (!BaseObject.is(ac, "IUIControlReadiness")) return Operation.From(null);
    var op = ac.get_waitcontrolreadystate();
    return op;
}
Validator.prototype.validate = function (bIndicate, fCallBack) { // fCallBack proto: function(result, isAsynch);
    if (this.get_disabled()) return ValidationResultEnum.correct;
    this.validating.invoke(this, null);
    var opready = this.$readyForValidation()
    opready.onsuccess(this.thisCall(function(_) {
        this.waitReport = 0;
        if (fCallBack != null) {
            this.$asyncCallBack = fCallBack;
        }
        this.result = this.$validate(bIndicate);
        this.onValidityChanged();
    }))
    .onfailure(this.thisCall(function(e) {
        this.result = ValidationResultEnum.fail;
        this.$messages = [];
        this.$messages.push(this.get_notreadymessage());
        this.onValidityChanged();
    }));
    
    if (this.waitReport <= 0 && opready.isOperationComplete()) {
        this.waitReport = 0;
        return this.result;
    } else {
        return ValidationResultEnum.pending;
    }
};
Validator.prototype.validateHandler = function(event_or_sender, dc, bind) {
	this.validate(true);
}
Validator.prototype.closeValidator = function () {
    this.$closeHint();
};
Validator.prototype.close = Validator.prototype.closeValidator; // temporary
Validator.prototype.uninit = function () {
    //this.$closeHint();
    this.result = ValidationResultEnum.uninitialized;
    this.onValidityChanged();

}
Validator.prototype.$showHint = function (msg, capt) {
    // $(this.root).data("qtip") == null || $(this.root).qtip("destroy");
    /*
    if (this.result > ValidationResultEnum.incorrect) {
        $(this.root).qtip({
            content: { text: msg, prerender: true, title: { text: '', button: 'x'} }, hide: false, position: { corner: { target: this.$positiontarget, tooltip: this.$positiontip} },
            style: { name: "red", tip: true, title: { 'padding': '0px' }, button: { padding: '3px 5px'} }
        });
    } else {
        $(this.root).qtip({
            content: {
                text: msg,
                prerender: true
            },
            position: { corner: { target: this.$positiontarget, tooltip: this.$positiontip} },
            style: { name: "light", tip: true }
        });
    }
    $(this.root).qtip("show");
    var localthis = this;
    if (this.autohidehint) {
        setTimeout(function () { $(localthis.root).data("qtip") == null || $(localthis.root).qtip("hide"); }, 3000);
    }
    */
};
Validator.prototype.$closeHint = function () {
    /*
    if (this.root != null) {
        $(this.root).qtip("destroy");
    }
    */
};
Validator.prototype.showMessagesHint = function () {
    /*
    if (this.showhint) {
        if (this.result == ValidationResultEnum.uninitialized) {
            if (this.instructions != null) this.$showHint(this.instructions);
        }
        else {
            if (this.result == ValidationResultEnum.correct) {
                $(this.root).qtip("destroy");
            }
            else {
                if (this.$messages != null && this.$messages.length > 0) {
                    var t = "";
                    for (var i = 0; i < this.$messages.length; i++) {
                        t += this.$messages[i] + "<br>";
                    }
                    this.$showHint(t);
                }
            }
        }
    }*/
};
Validator.prototype.updateVisualState = function () {
    var tmls = this.get_template();
    var tml;
    if (tmls != null) {
        switch (this.result) {
            case 1: // incorrect
                tml = this.getTemplateByKey("incorrect");
                break;
            case 2: // fail
                tml = this.getTemplateByKey("fail");
                break;
            case -1:
                tml = this.getTemplateByKey("uninitialized");
                break;
            default: // correct
                tml = this.getTemplateByKey("correct");
        }
        if (tml != null) {
            var el = this.$().Empty();
            Materialize.cloneTemplate(el, tml,this);
            this.rebind();
            this.updateTargets();
        }
    } else {
        if (this.result > ValidationResultEnum.correct) {
            // TODO: Show
        }
    }
};

Validator.prototype.updateVisualState_old = function () {
	/* Deprecated
    if ($(this.root).is("img")) {
        switch (this.result) {
            case 1: // incorrect
                if (this.incorrectImage != null && this.incorrectImage.length > 0) {
                    $(this.root).show().attr("src", mapPath(this.incorrectImage));
                } else {
                    $(this.root).show();
                }
                this.showMessagesHint();
                break;
            case 2: // fail
                if (this.failImage != null && this.failImage.length > 0) {
                    $(this.root).show().attr("src", mapPath(this.failImage));
                } else {
                    $(this.root).show();
                }
                this.showMessagesHint();
                break;
            case -1:
                if (this.uninitializedImage != null && this.uninitializedImage.length > 0) {
                    $(this.root).show().attr("src", mapPath(this.uninitializedImage));
                } else {
                    $(this.root).show();
                }
                this.showMessagesHint();
                break;
            default: // correct
                if (this.correctImage != null && this.correctImage.length > 0) {
                    $(this.root).show().attr("src", mapPath(this.correctImage));
                    this.showMessagesHint();
                } else {
                    $(this.root).hide();
                }
        }
    } else {
		*/
        var tmls = this.get_template();
        var tml;
        if (tmls != null && tmls.length > 0) {
            switch (this.result) {
                case 1: // incorrect
                    tml = this.getTemplateByKey("incorrect");
                    break;
                case 2: // fail
                    tml = this.getTemplateByKey("fail");
                    break;
                case -1:
                    tml = this.getTemplateByKey("uninitialized");
                    break;
                default: // correct
                    tml = this.getTemplateByKey("correct");
            }
            if (tml != null && tml.length > 0) {
                var el = $(this.root);
                el.Empty();
                var o = ViewBase.cloneTemplate(el, tml, this);
				this.rebind();
				this.updateTargets();
                el.show();
                //this.showMessagesHint();
            }
        } else {
            if (this.result > ValidationResultEnum.correct) {
                $(this.root).show();
                //this.showMessagesHint();
            }
        }
    // } Deprecated
};
Validator.prototype.onValidityChanged = function () {
    // place to change the state - the default implementation changes its visibility.
	this.callAsync(this.updateVisualState); // Not strictly necessary, but having this async is never a bad thing.
	// TODO: Should we take care this to reach the template after it is materialized?
	this.validitychanged.invoke(this,this.result);
	if (typeof this.get_throwqueryonvaliditychanged() == "string" && this.get_throwqueryonvaliditychanged().length > 0) {
		this.throwDownStructuralQuery(new ValidityChangedQuery(this));
	}
	
};