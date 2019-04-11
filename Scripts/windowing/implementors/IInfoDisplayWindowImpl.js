/* ERROR VIEW HOSTING PROTOCOL IMPL */
/* Interface IErrorDisplay */
function IInfoDisplayWindowImpl() { }
IInfoDisplayWindowImpl.InterfaceImpl(IInfoDisplay);
// IInfoDisplayWindowImpl.classType = "IInfoDisplay";
IInfoDisplayWindowImpl.RequiredTypes("BaseWindow", "IStructuralQueryProcessor,IStructuralQueryEmiter");
IInfoDisplayWindowImpl.defaultInfoDisplayTemplate = "#defaultInfoDisplayTemplate";
IInfoDisplayWindowImpl.ImplementProperty("displayelement", new InitializeStringParameter("data-key of an element in the window caption area that implements the infodisplay. The element must have data class implementing IInfoDisplayPanel.",null));
IInfoDisplayWindowImpl.classInitialize = function (cls, useTemplate, area, method) {
    if (BaseObject.is(useTemplate, "string") && useTemplate.length > 0) {
        cls.prototype.$defaultInfoDisplayTemplate = useTemplate;
    }
    // cls.prototype.
    cls.prototype.$infoDisplayView = null;
    cls.prototype.$infoDisplayCreate = function () {
        var tmlPattern = BaseObject.getProperty(this, "createParameters.data.infoDisplayTemplate", BaseObject.getProperty(this, "$defaultInfoDisplayTemplate", IInfoDisplayWindowImpl.defaultInfoDisplayTemplate));
        var idisp = $(tmlPattern).children().clone();

        var cc = this.get_clientcontainer();
        if (cc != null && BaseObject.isDOM(cc)) {
            this.$infoDisplayView = ViewBase.materialize($(cc), idisp, "prepend");
			if (this.$infoDisplayView != null) this.$infoDisplayView.rebind();
            if (BaseObject.is(this.$infoDisplayView, "IInfoDisplayPanel")) {
                // Attach to the events
                this.$infoDisplayView.dataexhaustedevent.add(new Delegate(this, function () {
                    this.$infoDisplayDestroy();
                }));
            }
            //cc.prepend(idisp);
        }
        return this.$infoDisplayView;
    };
    cls.prototype.$get_infoDisplay = function (bDoNotCreate) {
        var idisp = this.$infoDisplayView;
        if (idisp != null && idisp.isLive()) return idisp;
		if (bDoNotCreate) {
			return null;
		} else {
			if (this.get_displayelement() != null) {
				idisp = this.childObject(this.get_displayelement());
				if (BaseObject.is(idisp,"Base")) {
					this.$infoDisplayView = idisp;
					return idisp;
				}
				return null;
			}
			return this.$infoDisplayCreate()
		}
    };
    cls.prototype.$infoDisplayDestroy = function () {
        var idisp = this.$infoDisplayView;
        if (idisp != null) {
            var el = idisp.get_liveelement();
            if (el != null) el.Remove();
        }
        this.$infoDisplayView = null;
    };
    cls.prototype.$infoDisplayUpdate = function () {
        this.updateTargets();
    }; // Interface implementation
    cls.prototype.infoDisplayAdd = function (info) {
        var idisp = this.$get_infoDisplay();
        if (idisp != null) {
            if (BaseObject.is(this.$infoDisplayView, "IInfoDisplayPanel")) {
                idisp.addEntry(info);
            }
        }
    };
    cls.prototype.infoDisplayClear = function (messageTypes) {
        var idisp = this.$get_infoDisplay(true);
        if (idisp != null) {
            if (messageTypes != null && typeof messageTypes == "string" && messageTypes.length > 0) {
                var dc = idisp.get_data();
                if (dc != null && BaseObject.is(dc, "Array")) {
                    var msgTypes = messageTypes.split(",");
                    dc = dc.Select(function (idx, item) {
                        if (msgTypes != null && msgTypes.length > 0) {
                            if (item.messageType != null && item.messageType.inSet(msgTypes)) return null;
                        }
                        return item;
                    });
                    idisp.set_data(dc);
                }
            } else {
                this.$infoDisplayDestroy();
            }
        }
    };
    cls.prototype.get_isinfodisplayactive = function () {
        if (!this.$isinfodisplayactive) return false;
        if (this.isWindowVisible()) return true;
        return false;
    };
    cls.$infomessageDisplayFromQuery = function (query) {
    };
    cls.onStructuralQuery("InfoMessageQuery", function (query, procInstructions) {
        var maxp = this.get_maxinfomessagepriority();
        var thisp = (query.priority != null) ? query.priority : 0;
        if (thisp > maxp && this.throwDownStructuralQuery(query)) return true;
        if (!this.get_isinfodisplayactive()) {
            if (!this.throwDownStructuralQuery(query)) {
                // The message is still not shown anywhere - skip everything and try something else
                if (BaseObject.is(window.Shell, "Shell")) {
                    if (BaseObject.is(window.Shell, "IInfoDisplay")) {
                        window.Shell.infoDisplayAdd(query);
                    } else {
                        var w = Shell.get_workspacewindow();
                        if (w != null && BaseObject.is(w, "IInfoDisplay")) {
                            w.infoDisplayAdd(query);
                        }
                    }
                }
                return true;
            }
        } else {
            this.infoDisplayAdd(query);
            return true;
        }
    });
};