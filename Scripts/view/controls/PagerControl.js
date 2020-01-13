/*Pager - for DataArea paging support */
function PagerControl() {
    Base.apply(this, arguments);
}
PagerControl.Inherit(Base, "PagerControl");
PagerControl.Implement(IUIControl);
//PagerControl.Implement(ITemplateSourceImpl, "bindkraftstyles/control-pager");
PagerControl.Implement(ICustomParameterization);
PagerControl.Implement(ITemplateSourceImpl, new Defaults("templateName", "bindkraft/control-pager"));
PagerControl.$defaults = {
	templateName: "bindkraft/control-pager" // id="bindkraft_control-pager"
};

PagerControl.parameterNames = ["dataarea","normalize","maxpageitems","templateName","templateSource","autolink"];
PagerControl.prototype.setObjectParameter = function(name, value, type) {
	if (name.inSet(PagerControl.parameterNames)) return true;
	return false;
}
// Events
PagerControl.prototype.pagerupdateevent = new InitializeEvent("Fired whenever the pager needs to update itself internally. Can be used externally if needed.");
PagerControl.prototype.pagerupdate2event = new InitializeEvent("Fired whenever the pager needs to update itself internally after the other one. Can be used externally if needed.");
PagerControl.prototype.applypageevent = new InitializeEvent("Fired when page is selected/entered but not applied to the dataarea");
// Parameters
PagerControl.ImplementProperty("dataarea", new InitializeObject("Must be bound to a data area like this: @dataarea={read source=<parent>[/<child>]}"));
// Deprecated
// PagerControl.ImplementProperty("template", new InitializeStringParameter("Choose which template to load.", "default"));
PagerControl.ImplementProperty("normalize", new InitializeBooleanParameter("Normalize the position of the data area.", true));
PagerControl.ImplementProperty("maxpageitems", new InitializeNumericParameter("The number of the page items to return from the get_pages - null - all, >0 hpages before and after the current"));
PagerControl.ImplementProperty("autolink", new InitializeBooleanParameter("Subscribe to the dataarea events without need of explicit binding", false));

PagerControl.prototype.init = function() {
	var el = $(this.root);
	var tml = this.get_template();
	el.empty();
    el.append(tml);
}
PagerControl.prototype.finalinit = function() {
	if (this.get_autolink() && BaseObject.is(this.get_dataarea(), "DataArea")) {
		var da = this.get_dataarea();
		da.countsetevent.add(new Delegate(this, this.updatePager));
	}
}
// Deprecated due to usage of ItemplateSourceImpl
// PagerControl.prototype.$init = function () {
    // var el = $(this.root);
    // var tml;
    // if (this.get_template() == "short") {
        // tml = $(".j_framework_control_short_pager");
    // } else { tml = $(".j_framework_control_pager"); } 
    // el.empty();
    // el.append(tml.children().clone());
    // Base.prototype.$init.apply(this, arguments);
// };
PagerControl.prototype.get_totalpages = function() {
	var area = this.get_dataarea();
	if (area != null) {
		return area.get_totalpages();
	}
	return null;
}
PagerControl.prototype.get_pages = function () {
	// TODO: Add mode(s) in which not all pages are returned
    var area = this.get_dataarea();
    if (area != null) {
		var result = [];
		var cnt = area.get_totalpages();
		for (var i = 1; i <= cnt; i++) {
			result.push({ key: i, value: "Page " + i + " of " + cnt });
		}
		return result;
    }
    return null;
};
PagerControl.prototype.get_currentpage = function() {
	var area = this.get_dataarea();
    if (area != null) {
        return area.get_page();
    }
	return null;
}
PagerControl.prototype.set_currentpage = function(v) {
	var area = this.get_dataarea();
    if (area != null) {
        return area.set_page(v);
    }
	return null;
}
PagerControl.prototype.gotoNextPage = function() {
	var area = this.get_dataarea();
    if (area != null) {
		area.gotoNextPage();
	}
}
PagerControl.prototype.gotoPrevPage = function() {
	var area = this.get_dataarea();
    if (area != null) {
		area.gotoPrevPage();
	}
}
PagerControl.prototype.gotoLastPage = function() {
	var area = this.get_dataarea();
    if (area != null) {
		area.gotoLastPage();
	}
}
PagerControl.prototype.gotoFirstPage = function(){
	var area = this.get_dataarea();
    if (area != null) {
		area.gotoFirstPage();
	}
}

PagerControl.prototype.updatePager = function () {
    this.pagerupdateevent.invoke(this, null);
    this.pagerupdate2event.invoke(this, null);
	this.normalizePage();
};
PagerControl.prototype.get_haspages = function () {
    var area = this.get_dataarea();
    if (area != null) {
        var tp = area.get_totalpages();
        return (tp != null && tp > 0);
    }
    return false;
};
PagerControl.prototype.get_hasprevpage = function () {
    var area = this.get_dataarea();
    if (area != null) {
        return area.get_hasprevpage();
    }
    return false;
};
PagerControl.prototype.get_hasnextpage = function () {
    var area = this.get_dataarea();
    if (area != null) {
        return area.get_hasnextpage();
    }
    return false;
};
PagerControl.prototype.get_haslastpage = function () {
    var area = this.get_dataarea();
    if (area != null) {
        return area.get_haslastpage();
    }
    return false;
};

PagerControl.prototype.get_visible = function () {
    if (this.get_haspages()) {
        var area = this.get_dataarea();
        if (area != null) {
            var limit = area.get_limit();
            var count = area.get_count();
            if (count > limit) {
                return true;
            }
        }
    }
    return false;
};
// optional ref[page] - sends it as dc, if not available resends its own dc
PagerControl.prototype.OnTriggerApplyPage = function(e_s,dc,binding) {
		var page = binding.getRef("page");
		if (BaseObject.is(page,"Binding")) {
			var page = page.get_targetValue();
		}	
		if (page == null) {
			this.applypageevent.invoke(this, dc);
		} else {
			this.applypageevent.invoke(this, page);
		}
}
PagerControl.prototype.OnCurrentPageChange = function (e, dc, binding, param) {
    var area = this.get_dataarea();
    if (param == "short") {
        var page = parseInt(this.child("currentpage").val(), 10);
        if (!isNaN(page)) {
            area.set_page(page);
        }
    } else { // if you used get_pages - consume an item from that collection
        if (!IsNull(dc) && !IsNull(dc.key)) {
            area.set_page(dc.key);
        }
    }
};
// requires ref[page]= the selected page
PagerControl.prototype.OnKeyPress = function (e, dc, binding, param) {
    if (e.keyCode == 13) {
		var page = binding.getRef("page");
		if (BaseObject.is(page,"Binding")) {
			var page = page.get_targetValue();
		}
		this.applypageevent.invoke(this, page);
    }
};
PagerControl.prototype.ChangePage = function(page) {
	this.set_page(page);
}
// requires ref[page] = value of the page to change to
PagerControl.prototype.OnChangePage = function(event_or_sender,dc,binding) {
	var page = binding.getRef("page");
	if (BaseObject.is(page,"Binding")) {
		var page = page.get_targetValue();
	}
	this.ChangePage(page);
}
// PagerControl.prototype.OnKeyPress_old = function (e, dc, binding, param) {
    // if (e.keyCode == 13) {
        // var txt = this.child("currentpage");
        // var page = parseInt(this.child("currentpage").val(), 10);
        // if (!isNaN(page)) {
			// // These things are CSS job
            // // txt.attr({ width: "auto", size: txt.val().length });
            // this.OnCurrentPageChange(e, dc, binding, param);
        // } 
    // }
// };
PagerControl.prototype.normalizePage = function() { // Checks the current page and item count and initiates move if we are at an empty page.
	if (!this.get_normalize()) return;
    var page;
    var area = this.get_dataarea();
    var cnt = area.get_totalpages();
    if (area != null) {
        page = area.get_page();
        if (!isNaN(page) && !IsNull(cnt)) {
            if (page == null) {
                area.gotoPrevPage();
            } else {
                if (page > cnt) {
                    if (cnt == 0 && page > 1) {
                        area.gotoPrevPage();
                    } else {
                        page = cnt;
                        if (page < 1) page = 1;
                        area.set_page(page);
                    }
                }
            }
        }
    }
}
