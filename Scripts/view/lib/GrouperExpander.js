


/*CLASS*/

function GrouperExpander() {
    Base.apply(this, arguments);
};

GrouperExpander.Inherit(Base, "GrouperExpander");
GrouperExpander.Implement(IUIControl);
GrouperExpander.Implement(IDisablable);
GrouperExpander.Implement(ITemplateSourceImpl, ".j_framework_control_grouperexpander", { legacy: true} );
GrouperExpander.ImplementActiveProperty("state", new InitializeBooleanParameter("State of the grouper expander",false)); //false --> all collapsed, true --> all expanded
GrouperExpander.ImplementActiveProperty("activebtncaption", new InitializeStringParameter("Default value of active status on the controll.", "Collapse all"));
GrouperExpander.ImplementActiveProperty("inactivebtncaption", new InitializeStringParameter("Default value of active status on the controll.", "Expand all"));
GrouperExpander.ImplementProperty("expandseparately", new InitializeBooleanParameter("", false));
GrouperExpander.ImplementProperty("contentSlotName", new InitializeStringParameter("Items container data-key","contentSlot"));
GrouperExpander.prototype.defaultState = new InitializeStringParameter("Parameter for setting the default state of the control.", "collapsed");

// GrouperExpander.prototype.$Btn = {};
// GrouperExpander.prototype.$FrameContainer = {};
// GrouperExpander.prototype.$Children = [];

// This is not fully used. For now we pass through everything inside, but we may need to be more careful
// and do this only over the contentSlot. So, please do not refactor this.
GrouperExpander.prototype.$contentSlot = null;
GrouperExpander.prototype.$init = function () {    
    var self = this;
    var $tmpl, tmpl = this.get_template();
    var $children, $el, $contentSlot;
    if (tmpl != null) {
        // Reconstruct the content
        $tmpl = $(tmpl);
        $children = $(this.root).children();
        $el = $(this.root);
        $el.empty();
        $el.append($tmpl);
        this.$contentSlot = this.child(this.get_contentSlotName());
        if (this.$contentSlot == null || this.$contentSlot.length == 0) {
            throw "Content slot not found in the control template see contentSlot property and name a data-key accordingly."
        }
        this.$contentSlot.append($children); 
    } else {
        // We assume there is a control mechanism inside
        this.$contentSlot = this.child(this.get_contentSlot());
        if (this.$contentSlot == null || this.$contentSlot.length == 0) {
            this.$contentSlot = $(this.root);
        }
    }
        
    Base.prototype.$init.apply(this, arguments);
};
GrouperExpander.prototype.postinit = function() {
    var defaultstate = (this.defaultState == "expanded") ? true : false;
    this.set_state(defaultstate);
}
GrouperExpander.prototype.get_buttoncaption = function () {
    if (this.get_state()) {
        return this.get_activebtncaption();
    } else {
        return this.get_inactivebtncaption();
    }
};
GrouperExpander.prototype.$stoptypes = []
GrouperExpander.prototype.get_stoptypes = function() {
    return this.$stoptypes;
}
GrouperExpander.prototype.set_stoptypes = function(v) {
    if (BaseObject.is(v,"Array")) {
        this.$stoptypes = v;
    } else if (BaseObject.is(v,"string")) {
        this.$stoptypes = v.split(",");
    } else {
        this.$stoptypes = [];
    }
}
GrouperExpander.prototype.$stopdatakeys = []
GrouperExpander.prototype.get_stopdatakeys = function() {
    return this.$stopdatakeys;
}
GrouperExpander.prototype.set_stopdatakeys = function(v) {
    if (BaseObject.is(v,"Array")) {
        this.$stopdatakeys = v;
    } else if (BaseObject.is(v,"string")) {
        this.$stopdatakeys = v.split(",");
    } else {
        this.$stopdatakeys = [];
    }
}
// Two possible condition routines (usually one and the same)
GrouperExpander.prototype.$expandcondition = null;
GrouperExpander.prototype.$collapsecondition = null;
GrouperExpander.prototype.get_expandcondition = function() { return this.$expandcondition; }
GrouperExpander.prototype.set_expandcondition = function(v) { this.$expandcondition = v; }
GrouperExpander.prototype.get_collapsecondition = function() { return this.$collapsecondition; }
GrouperExpander.prototype.set_collapsecondition = function(v) { this.$expandcondition = v; }
GrouperExpander.prototype.get_condition = function() { if (this.$expandcondition == this.$collapsecondition) return this.$expandcondition; throw "Get cannot be called"; }
GrouperExpander.prototype.set_condition = function(v) { this.$expandcondition = v; this.$collapsecondition = v; }
GrouperExpander.prototype.$defaultCondition = function(ac) {
    var stoptypes = this.get_stoptypes();
    if (stoptypes.FirstOrDefault(function(idx,item){
        if (ac.is(item)) return true;
        return null;
    })) return Base.EachClassConditionFlags.Stop;
    var stopkeys = this.get_stopdatakeys();
    if (stopkeys.FirstOrDefault(function(idx,item){
        if (ac.get_datakey() == item) return true;
        return null;
    })) return Base.EachClassConditionFlags.Stop;
    if (GrouperExpander.$expanderTypes.FirstOrDefault(function(idx, item) {
        if (ac.is(item)) return true;
        return null;
    })) return Base.EachClassConditionFlags.Ok;
    return Base.EachClassConditionFlags.Skip;
}
GrouperExpander.$expanderTypes = ["Expander", "GrouperExpander"]; 
GrouperExpander.prototype.Expand = function (bExpandAll) {
    this.set_state(true);
    var tel = $(this.root);
    var cs = tel.children();
    var i;
    if (this.get_expandcondition() != null) {
        for (i = 0; i < cs.length; i++) {
            Base.eachClass(cs[i], this.get_expandcondition(), GrouperExpander.expandIt, 0, bExpandAll === true);
        }
    } else {
        for (i = 0; i < cs.length; i++) {
            Base.eachClass(cs[i],  new Delegate(this,this.$defaultCondition), GrouperExpander.expandIt, 0, bExpandAll === true);
        }
    }
}
GrouperExpander.prototype.Collapse = function (bExpandAll) {
    this.set_state(false);
    var tel = $(this.root);
    var cs = tel.children();
    if (this.get_collapsecondition() != null) {
        for (var i = 0; i < cs.length; i++) {
            Base.eachClass(cs[i], this.get_collapsecondition(), GrouperExpander.collapseIt, 0, bExpandAll === true);
        }
    } else {
        for (var i = 0; i < cs.length; i++) {
            Base.eachClass(cs[i], new Delegate(this,this.$defaultCondition), GrouperExpander.collapseIt, 0, bExpandAll === true);
        }
    }
}
GrouperExpander.prototype.StateChange = function () {
    if (this.get_state()) {
        this.Collapse();
    } else {
        this.Expand();
    }
}
GrouperExpander.prototype.$ApplyState = function(pname, oldVal, newVal) {
    if (newVal) {
        this.Expand();
    } else {
        this.Collapse();
    }
}
GrouperExpander.prototype.Toggle = function() { 
    this.StateChange(); 
}
GrouperExpander.expandIt = function (exp, depth, bExpandAll) {
    if (BaseObject.is(exp, "Expander")) {
        if (!exp.get_expanded()) {
            exp.set_expanded(true);
        }
    } else if (BaseObject.is(exp, "GrouperExpander")) {
        
        if (depth > 0 && exp.get_expandseparately()) return false;
        exp.Expand(bExpandAll);
        return false;
    }
}
GrouperExpander.collapseIt = function (exp, depth, bExpandAll) {
    if (BaseObject.is(exp, "Expander")) {
        if (exp.get_expanded()) {
            exp.set_expanded(false);
        }
    } else if (BaseObject.is(exp, "GrouperExpander")) {
        
        if (depth > 0 && exp.get_expandseparately()) return false;
        exp.Collapse(bExpandAll);
        return false;
    }
}