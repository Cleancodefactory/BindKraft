/*CLASS*/
function RuleWrapperControl(binding) {
    BaseObject.apply(this, arguments);
    this.$binding = binding;
}
RuleWrapperControl.Inherit(BaseObject, "RuleWrapperControl");
RuleWrapperControl.prototype.binding = null; // the binding to which is this attahed

// Attachments - the rules are attached as functions on these handles
RuleWrapperControl.prototype.onEnter = null; // on enter field rule goes here
RuleWrapperControl.prototype.onLeave = null; // on leave field rule goes here
RuleWrapperControl.prototype.onLoad = null; // on view load rule goes here
RuleWrapperControl.prototype.onUnload = null; // on close view rule goes here

RuleWrapperControl.prototype.$bound = false;

// API low level
RuleWrapperControl.prototype.$setRule = function (ruletype, func) {
    switch (ruletype) {
        case "onload":
            this.onLoad = func;
            break;
        case "onenter":
            this.onEnter = func;
            break;
        case "onleave":
            this.onLeave = func;
            break;
        case "onclose":
            this.onUnload = func;
            break;
        default:
            jbTrace.log("Unsupported rule event type: " + ruletype + " in binding " + this.binding.$expression);
            return false;
    }
    return true;
}
RuleWrapperControl.$omniHandler = function (e) {
    if (e.data != null && e.data.ruletype != null && e.data.obj) {
        switch (e.data.ruletype) {
            case "onload":
                    e.data.obj.onLoad();
                break;
            case "onclose":
                    e.data.obj.onUnload();
                break;
            case "onenter":
                    e.data.obj.onEnter();
                break;
            case "onleave":
                    e.data.obj.onLeave();
                break;
        }
    }
}
RuleWrapperControl.prototype.$attach = function () {
    // internally called by the binding or the validator
    // the wrapper attaches itself to the target's events related to the rules.
    if (this.$bound) return;
    var domTarget = $(this.$binding.get_target());
    var activeClass = domTarget.activeclass();


    if (this.onLoad != null) {
        if (BaseObject.is(activeClass, "ISupportsRuleOnLoadImpl")) {
            activeClass.executeRuleOnLoad = Delegate.createWrapper(this, this.onLoad);
        }
    }
    if (this.onUnload != null) {
        if (BaseObject.is(activeClass, "ISupportsRuleOnUnloadImpl")) {
            activeClass.executeRuleOnUnload = Delegate.createWrapper(this, this.onUnload);
        }
    }
    if (this.onEnter != null) {
        if (BaseObject.is(activeClass, "ISupportsRuleOnEnterImpl")) {
            activeClass.executeRuleOnEnter = Delegate.createWrapper(this, this.onEnter);
        } else { // attach to DOM
            // domTarget.focus(Delegate.createWrapper(this, this.onEnter))
            domTarget.bind("focus", { obj: this, ruletype: "onenter" }, RuleWrapperControl.$omniHandler);
        }
    }
    if (this.onLeave != null) {
        if (BaseObject.is(activeClass, "ISupportsRuleOnLeaveImpl")) {
            activeClass.executeRuleOnLeave = Delegate.createWrapper(this, this.onLeave);
        } else {
            // domTarget.focus(Delegate.createWrapper(this, this.onLeave))
            domTarget.bind("blur", { obj: this, ruletype: "onleave" }, RuleWrapperControl.$omniHandler);
        }
    }
    this.$bound = true;
}
RuleWrapperControl.prototype.$detach = function () {
    if (!this.$bound) return;
    var domTarget = $(this.$binding.get_target());
    var activeClass = domTarget.activeclass();


    if (this.onLoad != null) {
        if (BaseObject.is(activeClass, "ISupportsRuleOnLoadImpl")) {
            activeClass.executeRuleOnLoad = null;
        }
    }
    if (this.onUnload != null) {
        if (BaseObject.is(activeClass, "ISupportsRuleOnUnloadImpl")) {
            activeClass.executeRuleOnUnload = null;
        }
    }
    if (this.onEnter != null) {
        if (BaseObject.is(activeClass, "ISupportsRuleOnEnterImpl")) {
            activeClass.executeRuleOnEnter = null;
        } else { // attach to DOM
            domTarget.unbind("focus", RuleWrapperControl.$omniHandler);
        }
    }
    if (this.onLeave != null) {
        if (BaseObject.is(activeClass, "ISupportsRuleOnLeaveImpl")) {
            activeClass.executeRuleOnLeave = Delegate.createWrapper(this, this.onLeave);
        } else {
            domTarget.unbind("blur", RuleWrapperControl.$omniHandler);
        }
    }
    this.$bound = false;
}

// API public level
RuleWrapperControl.prototype.get_value = function () {
    return this.binding.$get_targetValue();
}
RuleWrapperControl.prototype.set_value = function (v) {
    this.binding.$set_targetValue(v);
}