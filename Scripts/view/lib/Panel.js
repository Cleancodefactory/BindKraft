


// Panel
/*CLASS*/

function Panel() {
    Base.apply(this, arguments);
};
Panel.Inherit(Base, "Panel");
Panel.Implement(ICustomParameterization);
Panel.Implement(IFreezable);
Panel.Implement(IFreezableHelper);
Panel.$flags = "flags:";
Panel.prototype.$parameters = new InitializeObject("Parameters holder object");
Panel.prototype.setObjectParameter = function(name, value) {
    this.$parameters[name] = value;
};
Panel.prototype.parseSelectors = function(paramName) {
    if (this.$parameters[paramName] != null && this.$parameters[paramName].length > 0) {
        return this.$parameters[paramName].split(',');
    } else {
        return null;
    }
};
Panel.prototype.$doElements = function(callback, paramName) {
    var arr = this.parseSelectors(paramName);
    if (arr != null) {
        var s, l;
        for (var i = 0; i < arr.length; i++) {
            s = arr[i];
            l = null;
            if (s.indexOf(Panel.$flags) == 0) {
                l = this.getBindingTargets(s.slice(Panel.$flags.length));
            } else {
                l = this.getRelatedElements(s);
            }
            if (l != null) callback.call(this, l);
        }
    }
};
Panel.prototype.$onDoElements = function(callback, binding) {
    var paramName = (binding != null) ? binding.bindingParameter : this.$parameters["default"];
    this.$doElements(callback, paramName);
};
Panel.prototype.directDisable = function(groupName) {
    this.$doElements(function(els) { els.attr("disabled", "disabled"); }, groupName);
};
Panel.prototype.disable = function(e, dc, binding) {
    this.$onDoElements(function(els) { els.attr("disabled", "disabled"); }, binding);
    if (e != null && e.stopPropagation != null) e.stopPropagation();
};
Panel.prototype.directEnable = function(groupName) {
    this.$doElements(function(els) { els.removeAttr("disabled"); }, groupName);
};
Panel.prototype.enable = function(e, dc, binding) {
    this.$onDoElements(function(els) { els.removeAttr("disabled"); }, binding);
    if (e != null && e.stopPropagation != null) e.stopPropagation();
};
Panel.prototype.directToggleDisabled = function(groupName) {
    this.$doElements(function(els) {
        if (els.is(':disabled') == true) {
            els.removeAttr("disabled");
        } else {
            els.attr("disabled", "disabled");
        }
    }, groupName);
};

Panel.prototype.toggleDisabled = function(e, dc, binding) {
    this.$onDoElements(function(els) {
        if (els.is(':disabled') == true) {
            els.removeAttr("disabled");
        } else {
            els.attr("disabled", "disabled");
        }
    }, binding);
    if (e != null && e.stopPropagation != null) e.stopPropagation();
};
Panel.prototype.directHide = function(groupName) {
    this.$doElements(function(els) { els.hide(); }, groupName);
};
Panel.prototype.hide = function(e, dc, binding) {
    this.$onDoElements(function(els) { els.hide(); }, binding);
    if (e != null && e.stopPropagation != null) e.stopPropagation();
};
Panel.prototype.directShow = function(groupName) {
    this.$doElements(function(els) { els.show(); }, groupName);
};
Panel.prototype.show = function(e, dc, binding) {
    this.$onDoElements(function(els) { els.show(); }, binding);
    if (e != null && e.stopPropagation != null) e.stopPropagation();
};
Panel.prototype.directToggle = function(groupName) {
    this.$doElements(function(els) { els.toggle(); }, groupName);
};
Panel.prototype.toggle = function(e, dc, binding) {
    this.$onDoElements(function(els) { els.toggle(); }, binding);
    if (e != null && e.stopPropagation != null) e.stopPropagation();
};
Panel.prototype.$updateSelectedBindings = function(e, dc, selector, callback, bIgnoreUpdateTracking) {
    if (selector == null || selector.length == 0) {
        callback.call(this, null, bIgnoreUpdateTracking);
    } else {
        var arr = this.parseSelectors(selector);
        if (arr != null) {
            for (var i = 0; i < arr.length; i++) {
                var s = arr[i];
                if (s.indexOf(Panel.$flags) == 0) {
                    callback.call(this, s.slice(Panel.$flags.length), bIgnoreUpdateTracking);
                }
            }
        }
    }
    if (e != null && e.stopPropagation != null) e.stopPropagation();
};
// PUBLIC routines for event handling (directly from a view) or invocation from code
// The methods ending with Group are for code invocation, the rest are for direct event handling
Panel.prototype.updateTargetsGroup = function(groupName) {
    this.$resetUpdateTransaction();
    this.$updateSelectedBindings({ }, null, groupName, this.updateTargets, true);
    this.$resetUpdateTransaction();
};
Panel.prototype.updateSelectedTargets = function(e, dc, binding) {
    this.$resetUpdateTransaction();
    this.$updateSelectedBindings(e, dc, binding.bindingParameter, this.updateTargets, true);
    this.$resetUpdateTransaction();
    if (e != null && e.stopPropagation != null) e.stopPropagation();
};
Panel.prototype.updateSourcesGroup = function(groupName) {
    this.$updateSelectedBindings({ }, null, groupName, this.updateSources);
};
Panel.prototype.updateSelectedSources = function(e, dc, binding) {
    this.$updateSelectedBindings(e, dc, binding.bindingParameter, this.updateSources);
    // this.updateSources(this.$parameters[binding.bindingParameter]);
    if (e != null && e.stopPropagation != null) e.stopPropagation();
};
Panel.prototype.updateSelected = function(e, dc, binding) {
    this.updateSelectedSources(e, dc, binding);
    this.updateSelectedTargets(e, dc, binding);
};
Panel.prototype.updateSelectedGroup = function(groupName) {
    this.updateSourcesGroup(groupName);
    this.updateTargetsGroup(groupName);
};
Panel.prototype.markData = function(e, dc, binding) {
    if (binding != null) {
        switch (binding.bindingParameter) {
        case "deleted":
            dc[Binding.entityStatePropertyName] = DataStateEnum.Deleted;
            break;
        case "new":
            dc[Binding.entityStatePropertyName] = DataStateEnum.New;
            break;
        case "updated":
            dc[Binding.entityStatePropertyName] = DataStateEnum.Updated;
            break;
        case "unchanged":
            dc[Binding.entityStatePropertyName] = DataStateEnum.Unchanged;
            break;
        case "changed":
            var state = dc[Binding.entityStatePropertyName];
            if (typeof state == "undefined") {
                dc[Binding.entityStatePropertyName] = Binding.entityStateValues.Insert;
            } else if (state == Binding.entityStateValues.Unchanged) {
                dc[Binding.entityStatePropertyName] = Binding.entityStateValues.Update;
            }
            break;
        }
    }

};
