


// Specialization to support generic views (based on generic packages).
// Generic cards base class
function GenericViewBaseEx(el) {
    ViewBase.apply(this, arguments);
}
GenericViewBaseEx.Inherit(ViewBase, "GenericViewBaseEx");
GenericViewBaseEx.Implement(ITemplateRoot);
GenericViewBaseEx.Implement(IAjaxContextParameters);
GenericViewBaseEx.Implement(IViewContainerEventsSink);
GenericViewBaseEx.Implement(IOpionatedView);
GenericViewBaseEx.Implement(IStructuralQueryProcessorImpl);

GenericViewBaseEx.Implement ( ISupportsURLHashImpl );

GenericViewBaseEx.Implement(IPersistableView); // By default no implementations are needed, but any view that has something to save should examine the situation and Implement saving and possibly validation as well.
GenericViewBaseEx.prototype.onViewVisibilityChanged = function(isVisible) {
	if (!isVisible) {
		this.closeValidators();
	}
}
GenericViewBaseEx.prototype.$isDirty = false;
GenericViewBaseEx.prototype.get_isDirty = function () {
    return this.$isDirty;
};
GenericViewBaseEx.prototype.get_isdirty = function () {
    return this.$isDirty;
};
GenericViewBaseEx.prototype.set_isDirty = function (v) {
	var b = false;
	if (this.$isDirty != v) b = true;
    this.$isDirty = v;
	if (b) {
		this.viewdirtystatechanged.invoke(this,this.$isDirty);
	}
};

GenericViewBaseEx.prototype.set_isdirty = function (v) {
	this.set_isDirty(v);
}
GenericViewBaseEx.prototype.makeViewDirty = function() {
    this.set_isdirty(true);
}
GenericViewBaseEx.prototype.viewdirtystatechanged = new InitializeEvent("Fired whenever the isdirty changes state");

GenericViewBaseEx.prototype.get_roleid = function () {
    var dc = this.get_data();
    if (dc != null && dc._metaData != null) {
        return dc._metaData.roleid;
    }
    return System.Default().get_settings("Settings360.CurrentDefaultRoleId");
};
GenericViewBaseEx.prototype.get_rolename = function () {
    var dc = this.get_data();
    var roleid = null;
    if (dc != null && dc._metaData != null) {
        roleid = dc._metaData.roleid;
    }
    if (roleid == null) roleid = System.Default().get_settings("Settings360.CurrentDefaultRoleId");
    if (roleid != null) {
        return System.Default().getRoleName(roleid);
    }
    return null;
};
// Deprecated method
GenericViewBaseEx.prototype.getRuleByName = function (ruleName, usage) {
    // TODO: Implement the more precise fetching after we finish the cache manager. The current solution is just a patch work.
    var rules = this._rules;
    if (rules != null) {
        return rules[ruleName];
    }
    return null;
};
// IOpionatedView
GenericViewBaseEx.prototype.ViewDeactivating = function() {
}
GenericViewBaseEx.prototype.ViewClosing = function() {
	// TODO: Eventually this method has to fully replace onClose, but for now we redirect to onClose. 
	//	Another option is to do nothing for now.
	return this.onClose();
}
GenericViewBaseEx.prototype.onClose = function () {
    if (!ViewBase.prototype.onClose.call(this)) return false;
	this.closeValidators();
    return true;
};
GenericViewBaseEx.prototype.OnStateChecking = function() {}; // Override to do something
GenericViewBaseEx.onStructuralQuery("DataStateQuery", function (query, procInstructions) {
	if (query.state) {
		this.set_isdirty(true);
	}
	this.OnStateChecking();
    return true;
});
GenericViewBaseEx.onStructuralQuery("HostCallQuery", function (query, procInstructions) {
    if (query.command == HostCallCommandEnum.queryrole) {
        query.roleid = this.get_roleid();
        if (query.roleid != null) return true;
    }
    return false;
});
GenericViewBaseEx.onStructuralQuery("FindServiceQuery", function (query, procInstructions) {
    if (FindServiceQuery.handle(this,query)) return true;
    return false;
});
//GenericViewBaseEx.prototype.processStructuralQuery = function(query) {
//    if (BaseObject.is(query, "HostCallQuery")) {
//        if (query.command == HostCallCommandEnum.queryrole) {
//            query.roleid = this.get_roleid();
//            if (query.roleid != null) return true;
//        }
//    }
//    if (BaseObject.is(query, "DataStateQuery")) {
//        if (!this.$isDirty) {
//            this.$isDirty = true;
//            return true;
//        }
//    }
//    return false;
//};
// TODO: This method must be moved to adapters part
GenericViewBaseEx.prototype.initNewMetaData = function (packageid, roleid /*=null*/) {
    var dc = this.get_data();
    if (dc != null) {
        if (dc._metaData == null) dc._metaData = {};
        if (dc._metaData.packageid == null) dc._metaData.packageid = packageid;
        if (dc._metaData.roleid == null) {
            var query = new HostCallQuery(HostCallCommandEnum.queryrole);
            this.throwStructuralQuery(query);
            dc._metaData.roleid = query.roleid;
        }
    }
};
GenericViewBaseEx.prototype.get_metadata = function () {
    var dc = this.get_data();
    if (dc != null) {
        return dc._metaData;
    }
    return null;
};
GenericViewBaseEx.prototype.emptydc = function () {
    return { _metaData: this.get_metadata() };
};


GenericViewBaseEx.prototype.hideCommands = function () {
	if (BaseObject.is(this.commands, "Array")) {
		this.commands.Each(function(i,cmd) {
			cmd.set_visible(false);
		});
	}
};

GenericViewBaseEx.prototype.hideEditCommands = function () {
	if (BaseObject.is(this.commands,"Array")) {
		this.commands.Each(function(idx, itm) {
			if (this.edit) { // TODO: Is there anything like this anymore?
				this.set_visible(false);
			}
		});
	}
    this.throwStructuralQuery(new UpdateCommandBars());
};
// Ajax contextual parameters
GenericViewBaseEx.prototype.get_localajaxcontextparameter = function(param) {
    var md = this.get_metadata();
    if (md != null) {
        switch (param) {
        case AjaxContextParameterFlags.RoleId:
            if (md.roleid != null) return md.roleid;
            break;
        case AjaxContextParameterFlags.OnBehalfUserId:
            if (md.onbehalfuserid != null) return md.onbehalfuserid;
            break;
        }
    }
    return null;
};
GenericViewBaseEx.prototype.get_ajaxcontextparameter = function(param) {
    var result = this.get_localajaxcontextparameter(param);
    if (result != null || this.isFinalAuthority(param)) return result;
    // Call the hierarchy
    var query = new AjaxContextParameterQuery(param);
    if (this.throwDownStructuralQuery(query)) {
        return query.result;
    }
    return null;
};
GenericViewBaseEx.prototype.set_localajaxcontextparameter = function(param, v) {
    var md = this.get_metadata();
    if (md != null) {
        switch (param) {
        case AjaxContextParameterFlags.RoleId:
            md.roleid = v;
            break;
        case AjaxContextParameterFlags.OnBehalfUserId:
            md.onbehalfuserid = v;
            break;
        }
    }
};
GenericViewBaseEx.prototype.$isFinalAuthority = false;
GenericViewBaseEx.prototype.isFinalAuthority = function(param) { // Override this in Applet root classes to stop searching for parameters to the shell
    return this.$isFinalAuthority;
};
GenericViewBaseEx.onStructuralQuery("AjaxContextParameterQuery", function (query, processInstructions) {
    if (this.is("IAjaxContextParameters")) {
        var result = this.get_localajaxcontextparameter(query.requestedParameter);
        if (result != null || this.isFinalAuthority(query.requestedParameter)) {
            query.result = result;
            return true;
        }
    }
    return null;
});