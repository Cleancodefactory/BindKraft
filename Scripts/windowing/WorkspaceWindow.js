


// Singleton top level window
/*CLASS*/
function WorkspaceWindow() {
    BaseWindow.apply(this, arguments);
}
WorkspaceWindow.Inherit(BaseWindow, "WorkspaceWindow");
WorkspaceWindow.Implement(IWorkspaceWindow);
// WorkspaceWindow.interfaces = { IWorkspaceWindow: true }; // Marker - if alternate implementations of root (ultimate parent) windows are devised they should declare this Interface to enable recognition
WorkspaceWindow.useTemplateConnector = null;

// Special slots (may or may not exist in the template)
// These are additional slots for special windows.
// Usually only one window per slot should be attached
WorkspaceWindow.ImplementProperty("topClientSlot",new Initialize("Taskbar/start - usually always visible band/notch etc.", null));
WorkspaceWindow.ImplementProperty("indexClientSlot",new Initialize("Typically a side slot for the main shell start/operation menu", null));
WorkspaceWindow.ImplementProperty("sideClientSlot",new Initialize("Like index slot but additional one - e.g. on the right if the other is on the left.", null));

WorkspaceWindow.prototype.OnDOMAttached = function () {
    // Explicitly call the parent - we may need to extend this method - please keep it no matter that it looks like a waste!
    BaseWindow.prototype.OnDOMAttached.apply(this, arguments);
	// The slots can be set using pluginto binding or found undet these data-keys
	this.$topClientSlot = this.root.querySelector('[data-key="_topclientslot"]');
	this.$indexClientSlot = this.root.querySelector('[data-key="_indexclientslot"]');
	this.$sideClientSlot = this.root.querySelector('[data-key="_sideclientslot"]');
}
WorkspaceWindow.prototype.get_clientcontainer = function (zone) {
    if (zone != null && zone.inSet(["main","top","start"])) return this.get_topClientSlot();
    if (zone != null && zone.inSet(["left","index","menu"])) return this.get_indexClientSlot();
	if (zone != null && zone.inSet(["right","side","notes"])) return this.get_sideClientSlot();
    return BaseWindow.prototype.get_clientcontainer.apply(this, arguments);
};

WorkspaceWindow.prototype.on_AdjustClient = function (msg) { // Emited by the SizeChanged default processing when the window has the adjustclient style flag
	BaseWindow.prototype.on_AdjustClient.call(this, msg);
	var mainclient = this.get_windowelement();
	var mainclientRect = Rect.fromBoundingClientRectangle(mainclient);
	var wndcontainer = this.get_windowelement();
	if (mainclientRect.w <= 0) return;
    var left = this.get_clientcontainer("left");
	var rect, r;
	if (left != null) {
		rect = Rect.fromBoundingClientRectangle(left);
		if (rect.w > 0) {
			rect.h = mainclientRect.h;
			r = rect.mapFromToElements(null,wndcontainer);
			r.toDOMElement(left);
		}
	}
	var right = this.get_clientcontainer("right");
	if (right != null) {
		rect = Rect.fromBoundingClientRectangle(right);
		if (rect.w > 0) {
			rect.h = mainclientRect.h;
			r = rect.mapFromToElements(null,wndcontainer);
			r.toDOMElement(right);
		}
	}
};
WorkspaceWindow.prototype.$transitionIndex = 0;
WorkspaceWindow.prototype.indexClientTransition = function(_dir) {
	var left = this.get_clientcontainer("left");
	var mainclient = this.get_clientcontainer();
	var wndcontainer = this.get_windowelement();
	if (left == null) return;
	var rect = Rect.fromBoundingClientRectangle(left);
	if (rect.w <= 0) return;
	var rect = rect.mapFromToElements(null,wndcontainer);
	var dir = _dir;
	if (dir == "toggle") {
		if (rect.x >= 0) dir = -1;
		else dir = 1;
	}
	if (dir != null) this.$transitionIndex = dir;
	var step = (rect.w * JBCoreConstants.SystemSchedulerFreq * 4) / 1000;
	if (this.$transitionIndex != null && this.$transitionIndex > 0) {
		if (rect.x < 0) {
			rect.x += step;
			if (rect.x > 0) rect.x = 0;
			left.style.left = rect.x + "px";
			// rect.toDOMElement(left);
			if (rect.x < 0) this.callAsync("indexClientTransition");
			else this.$transitionIndex = null;
		}
	} else if (this.$transitionIndex != null && this.$transitionIndex < 0) {
		if (rect.x > (- rect.w)) {
			rect.x -= step;
			if (rect.x <  (- rect.w)) rect.x = (- rect.w);
			left.style.left = rect.x + "px";
			// rect.toDOMElement(left);
			if (rect.x > (- rect.w)) this.callAsync("indexClientTransition");
			else this.$transitionIndex = null;
		}
	}
}
WorkspaceWindow.prototype.$defaultWindowStyles = WindowStyleFlags.fillparent | WindowStyleFlags.visible | WindowStyleFlags.adjustclient;
// WorkspaceWindow.styles = WindowStyleFlags.adjustclient;
WorkspaceWindow.Default = function (callback, callbackArgs) {
    if (WorkspaceWindow.$Default == null) {
        WorkspaceWindow.$Default = new WorkspaceWindow(function (w) {
            w.attachInDOM(System.Default().getWorkspaceElement());
            BaseObject.callCallback(callback, w, callbackArgs);
            w.fireInitialResize();
        },
		BaseObject.is(WorkspaceWindow.useTemplateConnector, "Connector")?WorkspaceWindow.useTemplateConnector:null
		);
    }
    else {
        BaseObject.callCallback(callback, WorkspaceWindow.$Default, callbackArgs);
    }
    return WorkspaceWindow.$Default;
};
WorkspaceWindow.DefaultDoNotCreate = function () { // Mostly for internal use in the framework - does not create the singleton if it is not created yet. Needed for non-obtrusive actions.
    return WorkspaceWindow.$Default;
};
WorkspaceWindow.prototype.$activateWindowFromDOMEvent = function (e) {
    //e.stopPropagation();
};
WorkspaceWindow.prototype.on_ActivateWindow = function (msg) {
    //e.stopPropagation();
	this.updateTargets();
	msg.handled = true;
};
WorkspaceWindow.prototype.onBrowserResize = function () {
    var viewportSizeTemp = GetViewportSize();
    WindowingMessage.fireOn(this, WindowEventEnum.SizeChanged, {});
};
WorkspaceWindow.prototype.springTrigger = null;
WorkspaceWindow.prototype.windUp = function () {
    if (!IsNull(this.springTrigger)) {
        this.springTrigger.windup();
    }
};
WorkspaceWindow.prototype.$testKeyBindings = function (e) {
    this.onBrowserResize();
};
WorkspaceWindow.prototype.on_Create = function () {
    this.springTrigger = new SpringTrigger(new Delegate(this, this.onBrowserResize), 100);
    $(window).resize(Delegate.createWrapper(this, this.windUp));

    //    $(window).resize(function (e) {
    //        if (e.target == window) {
    //            
    //        }
    //    });
};

WorkspaceWindow.prototype.fireInitialResize = function () {
    var viewportSizeTemp = GetViewportSize();
    WindowingMessage.fireOn(this, WindowEventEnum.SizeChanged, {});
};

WorkspaceWindow.prototype.$activeApp = null;
WorkspaceWindow.prototype.get_activeApp = function () {
    return this.$activeApp;
};
WorkspaceWindow.prototype.set_activeApp = function (app) {
    this.$activeApp = app;
};
WorkspaceWindow.prototype.get_children = function() {
	if (this.children != null) {
		return this.children.sort(function(a,b) {
			if (a.$__instanceId < b.$__instanceId) return -1;
            if (b.$__instanceId < a.$__instanceId) return 1;
            return 0;
		});
	}
	return null;
}
WorkspaceWindow.prototype.updateWindows = function(sender, dc) {
	if (BaseObject.is(dc, "BaseWindow")) {
		WindowManagement.Default().set_activewindow(dc);
		this.updateTargets();
	}
}
WorkspaceWindow.prototype.on_ChildAdded = function(msg) {
	this.updateTargets();
}
WorkspaceWindow.prototype.on_ChildRemoved = function(msg) {
	this.updateTargets();
}
WorkspaceWindow.prototype.on_ActivateChild = function(msg) {
	this.$activeChild = msg.data.child;
}
WorkspaceWindow.prototype.OpenLauncher = function(e, dc) {
	CommandProccessor.Default.executeCommand("sh");
}
WorkspaceWindow.prototype.get_currentindex = function() {
	var self = this;
	if (this.children != null && this.children.length > 0 ) {
		return this.get_children().FirstOrDefault(function(idx, item) {
			if (item == self.$activeChild) return idx;
			return null;
		});
	}
	return -1;
}

