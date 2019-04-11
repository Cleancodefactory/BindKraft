


function SimpleViewWindow() {
    PanelWindow.apply(this, arguments);
};
SimpleViewWindow.Inherit(PanelWindow, "SimpleViewWindow");
SimpleViewWindow.Defaults({
	templateName: new StringConnector("<div class=\"f_windowframe\" data-key=\"_window\" style=\"position: relative;overflow: auto;\" data-wintype=\"Simple view\"></div>")
});
SimpleViewWindow.prototype.on_Create = function (msg) {
	PanelWindow.prototype.on_Create.apply(this,arguments);
};
SimpleViewWindow.prototype.on_FirstShown = function (msg) {
    if (this.createParameters != null && this.createParameters.data != null && !this.viewLoaded && !this.createParameters.data.loadOnCreate ) {
        var url = this.createParameters.data.url;
        if (url != null || (this.createParameters.data.directData != null && this.createParameters.data.view != null)) {
            this.LoadView(this.createParameters.data);
            // this.LoadView({ url: url, data: this.createParameters.data.data, clientData: this.createParameters.data.clientData });
        }
    }
};
SimpleViewWindow.prototype.on_ViewLoaded = function (msg) {
    this.currentView.IsComputed = this.isComputed;
    if (this.currentView.IsComputed) {
        this.currentView.updateTargets();
    }
    if (!IsNull(this.createParameters) && !IsNull(this.createParameters.data) && !IsNull(this.createParameters.data.loadedHandler)) {
        this.createParameters.data.loadedHandler(this.currentView);
    }
};

SimpleViewWindow.prototype.on_ViewPreLoad = function (msg) {
    if (!IsNull(this.createParameters) && !IsNull(this.createParameters.data) && !IsNull(this.createParameters.data.viewParams)) {
        for (var prop in this.createParameters.data.viewParams) {
            this.currentView[prop] = this.createParameters.data.viewParams[prop];
        }
    }
    if (!IsNull(this.viewLoadParameters) && !IsNull(this.viewLoadParameters.loadedHandler)) {
        this.viewLoadParameters.loadedHandler(this.currentView);
    }
};
// SimpleViewWindow.prototype.$get_windowHtmlTemplate = function () {
	// if (this.$customSystemTemplate != null) {
        // return this.$customSystemTemplate;
    // } else {
		// return "<div class=\"f_windowframe\" data-key=\"_window\" style=\"position: relative;overflow: auto;\" data-wintype=\"Simple view\"></div>";
	// }
// };

SimpleViewWindow.prototype.on_pageDeactivated = function () {
    if (!IsNull(this.currentView) && !IsNull(this.currentView.unfocused)) {
        this.currentView.unfocused();
    }
};

SimpleViewWindow.prototype.on_pageActivated = function () {
    if (!IsNull(this.currentView) && !IsNull(this.currentView.focused)) {
        this.currentView.focused();
    }
};

SimpleViewWindow.prototype.on_Materialize = function () {
    if (this.createParameters != null && this.createParameters.data != null && this.createParameters.data.loadOnCreate) {
        var url = this.createParameters.data.url;
        this.$url = url;
        if (url != null || (this.createParameters.data.directData != null && this.createParameters.data.view != null)) {
			if (true) {
				if (!this.createParameters.data.inactive) {
					this.setWindowStyles(WindowStyleFlags.visible, "set");
				} else {
					this.setWindowStyles(WindowStyleFlags.visible, "reset");
				}
			} else {
				this.inactive = this.createParameters.data.inactive;
				if (!this.inactive) {
					$(this.root).show();
				}
			}
			this.LoadView(this.createParameters.data);
        } 
    }
};

SimpleViewWindow.prototype.activate = function () {
    this.inactive = false;
    $(this.root).show();
    if (!IsNull(this.currentView) && !IsNull(this.currentView.focused)) {
        this.currentView.focused();
    }
};

SimpleViewWindow.prototype.deactivate = function () {
    this.inactive = true;
    $(this.root).hide();
    if (!IsNull(this.currentView) && !IsNull(this.currentView.unfocused)) {
        this.currentView.unfocused();
    }
};