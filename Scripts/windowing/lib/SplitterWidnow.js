


/*CLASS*/
function TouchSplitterWindow() {
    BaseWindow.apply(this, arguments);
}
TouchSplitterWindow.Inherit(BaseWindow, "TouchSplitterWindow");
TouchSplitterWindow.Defaults({
	templateName: "BindKraft/TouchSplitWindowTemplate"
});
TouchSplitterWindow.prototype.$isinfodisplayactive = false;
// TouchSplitterWindow.prototype.templateSource = new DOMConnector("#TouchSplitWindowTemplate");
//TouchSplitterWindow.prototype.$get_windowHtmlTemplate = function () {
//    if (this.$customSystemTemplate != null) {
//        return this.$customSystemTemplate;
//    } else {
//        return $('#TouchSplitWindowTemplate').html();
//    }
//};
TouchSplitterWindow.prototype.OnDOMAttached = function () {
    // Explicitly call the parent - we may need to extend this method - please keep it no matter that it looks like a waste!
    BaseWindow.prototype.OnDOMAttached.apply(this, arguments);
    this.$containerLeft = this.child("left");
    this.$containerRight = this.child("right");
    this.$resizer = this.child("resizer");
    this.$resizer_left = this.child("resizer_left");
    this.$resizer_right = this.child("resizer_right");
    this.$collapsed = this.child("collapsed");
    this.$collapsedLeft = this.child("collapsedLeft");
    this.$collapsedRight = this.child("collapsedRight");
    //if (this.$collapsedLeft == null || this.$collapsedLeft.length == 0) this.$collapsedLeft = this.$collapsed;
    //if (this.$collapsedRight == null || this.$collapsedRight.length == 0) this.$collapsedRight = this.$collapsed;
    this.$savedResizerPos = 50;
    this.$initDOMEvents();
    this.$setCollapserCss("left");
    this.$setCollapserCss("right");
};
TouchSplitterWindow.prototype.get_clientcontainer = function (zone) {
    if (zone != null && zone.inSet([TouchSplitterWindow.leftPane, "left"])) return this.$containerLeft;
    if (zone != null && zone.inSet([TouchSplitterWindow.rightPane, "right"])) return this.$containerRight;
    return BaseWindow.prototype.get_clientcontainer.apply(this, arguments);
};
// Attach the DOM events
TouchSplitterWindow.prototype.$initDOMEvents = function () {
    if (this.$splitparameter("resizable")) {
        this.$resizer.draggable({
            disabled: false,
            appendTo: this.get_clientcontainer(),
            axis: "x",
            containment: "parent",
            cursor: "e-resize",
            distance: 0,
            iframeFix: true,
            scroll: false,
            zIndex: 10000,
            start: Delegate.createWrapper(this, this.$resizerHandlers.begin),
            drag: Delegate.createWrapper(this, this.$resizerHandlers.drag),
            stop: Delegate.createWrapper(this, this.$resizerHandlers.end)
        });
    }
    
    if (this.$resizer_left != null) this.$resizer_left.click(Delegate.createWrapper(this, this.$resizerHandlers.left));
    if (this.$resizer_right != null) this.$resizer_right.click(Delegate.createWrapper(this, this.$resizerHandlers.right));

    var _centralBound = false;
    if (this.$collapsedLeft == null || this.$collapsedLeft.length == 0) {
        this.$collapsedLeft = this.$collapsed;
        this.$collapsedLeft.click(Delegate.createWrapper(this, this.$resizerHandlers.unmaximize));
        _centralBound = true;
    } else {
        this.$collapsedLeft.click(Delegate.createWrapper(this, this.$resizerHandlers.unmaximize));
    }
    if (this.$collapsedRight == null || this.$collapsedRight.length == 0) {
        this.$collapsedRight = this.$collapsed;
        if (!_centralBound) this.$collapsedRight.click(Delegate.createWrapper(this, this.$resizerHandlers.unmaximize));
    } else {
        this.$collapsedRight.click(Delegate.createWrapper(this, this.$resizerHandlers.unmaximize));
    }
};
TouchSplitterWindow.prototype.$splitparameter = function (pname) {
    var v;
    switch (pname) {
        case "resizable":
            return BaseObject.getProperty(this.createParameters, "data.resizable", true);
        case "leftquarter":
            return BaseObject.getProperty(this.createParameters, "data.leftquarter", 25);
        case "rightquarter":
            return BaseObject.getProperty(this.createParameters, "data.rightquarter", 75);
        case "center":
            return BaseObject.getProperty(this.createParameters, "data.center", 50);
        case "initial":
            return BaseObject.getProperty(this.createParameters, "data.initial", 50);
        case "startmaximized":
            return BaseObject.getProperty(this.createParameters, "data.startmaximized", null);
        case "leftthreshold":
            return BaseObject.getProperty(this.createParameters, "data.leftthreshold", null); // In percents
        case "rightthreshold":
            return BaseObject.getProperty(this.createParameters, "data.rightthreshold", null); // In percents
        case "autocollapse":
            return BaseObject.getProperty(this.createParameters, "data.autocollapse", true);
        case "leftuncollapse":
            v = BaseObject.getProperty(this.createParameters, "data.leftuncollapse", 0);
            if (v == 0) {
                return this.$savedResizerPos;
            } else {
                return v;
            }
        case "rightuncollapse":
            v = BaseObject.getProperty(this.createParameters, "data.rightuncollapse", 0);
            if (v == 0) {
                return this.$savedResizerPos;
            } else {
                return v;
            }
        case "textlabelkey":
            return BaseObject.getProperty(this.createParameters, "data.textlabelkey", "caption");
        case "hiderightmax":
            return BaseObject.getProperty(this.createParameters, "data.hiderightmax", false);
        case "hideleftmax":
            return BaseObject.getProperty(this.createParameters, "data.hideleftmax", false);
        case "leftcollapsecss":
            return BaseObject.getProperty(this.createParameters, "data.leftcollapsecss", null);
        case "rightcollapsecss":
            return BaseObject.getProperty(this.createParameters, "data.rightcollapsecss", null);
        case "nopersist":
            return BaseObject.getProperty(this.createParameters, "data.nopersist", {});
        case "enforcesizechanged":
            return BaseObject.getProperty(this.createParameters, "data.enforcesizechanged", null);
    }
    return null;
};
TouchSplitterWindow.prototype.$hideleftmax = null;
TouchSplitterWindow.prototype.get_hideleftmax = function () {
    if (this.$hideleftmax == null) return this.$splitparameter("hideleftmax");
    return this.$hideleftmax;
};
TouchSplitterWindow.prototype.set_hideleftmax = function (v) {
    this.$hideleftmax = v;
    this.$adjustClients();
};
TouchSplitterWindow.prototype.$hiderightmax = null;
TouchSplitterWindow.prototype.get_hiderightmax = function () {
    if (this.$hiderightmax == null) return this.$splitparameter("hiderightmax");
    return this.$hiderightmax;
};
TouchSplitterWindow.prototype.set_hiderightmax = function (v) {
    this.$hiderightmax = v;
    this.$adjustClients();
};
// BEGIN Not currently used
TouchSplitterWindow.prototype.get_enforcesizechanged = function () {
    if (this.$enforcesizechanged == null) return this.$splitparameter("enforcesizechanged");
    return this.$enforcesizechanged;
} .Description("When set to true enforces DOM resize to the affected windows when shown/hidden");
TouchSplitterWindow.prototype.$enforcesizechanged = null;
TouchSplitterWindow.prototype.set_enforcesizechange = function (v) {
    this.$enforcesizechanged = v;
} .Description("When set to true enforces DOM resize to the affected windows when shown/hidden");
// End Not currently used
TouchSplitterWindow.prototype.on_FirstShown = function (msg) {
    var maximize = null, splitpos = null;
    if (this.createParameters.persister != null) {
        if (!this.$splitparameter("nopersist").maximize) {
            maximize = this.createParameters.persister.get_setting('split_maximize');
        }
        if (!this.$splitparameter("nopersist").position) {
            splitpos = this.createParameters.persister.get_setting('split_position');
        }
    }
    if (maximize == null || maximize == 0) maximize = this.$splitparameter("startmaximized");
    var left_threshold = this.$splitparameter("leftthreshold");
    if (left_threshold == null || left_threshold < 0 || left_threshold > 100) left_threshold = 0;
    var right_threshold = this.$splitparameter("rightthreshold");
    if (right_threshold == null || right_threshold < 0 || right_threshold > 100) right_threshold = 100;
    if (left_threshold > right_threshold) left_threshold = right_threshold; // not movable, but what can we do?!
    if (splitpos == null || splitpos <= left_threshold || splitpos >= right_threshold) splitpos = this.$splitparameter("initial");

    this.set_maximize(maximize);
    this.$normalizeResizer(splitpos);
    this.$savedResizerPos = splitpos;
    this.$adjustClients();
};
TouchSplitterWindow.prototype.$framesToShow = null;
TouchSplitterWindow.prototype.persistState = function () {
    if (this.createParameters.persister != null) {
        if (this.get_maximize() == null) {
            this.createParameters.persister.set_setting('split_position', this.$savedResizerPos);
        }
        this.createParameters.persister.set_setting('split_maximize', this.$maximize);
    }
}
TouchSplitterWindow.prototype.$resizerHandlers = {
    begin: function (e, ui) {
        this.$framesToShow = $("iframe:visible");
        if (this.$framesToShow != null && this.$framesToShow.length > 0) {
            this.$framesToShow.hide();
        } else {
            this.$framesToShow = null;
        }
    },
    drag: function (e, ui) {
    },
    end: function (e, ui) {
        if (this.$framesToShow != null) {
            this.$framesToShow.show();
        }
        this.$framesToShow = null;
        this.$applyAutoTransitions();
        this.$adjustClients();
        this.persistState();
    },
    left: function (e) {
        this.splitJump("left");
        this.persistState();
    },
    right: function (e) {
        this.splitJump("right");
        this.persistState();
    },
    unmaximize: function (e) {
        var p;
        if (this.$maximize == "right") {
            p = this.$splitparameter("leftuncollapse");
        } else if (this.$maximize == "left") {
            p = this.$splitparameter("rightuncollapse");
        }
        this.set_maximize(null);
		if (p != null) {
			this.$normalizeResizer(p);
			this.$adjustClients();
			this.persistState();
		}
    }
};
TouchSplitterWindow.prototype.$applyAutoTransitions = function () {
    this.$saveResizerPos();
    var pos = this.$savedResizerPos;
    var a;
    var autocollapse = this.$splitparameter("autocollapse");
    a = this.$splitparameter("leftthreshold");
    if (a != null) {
        if (pos < a) {
            if (autocollapse == true || autocollapse == "left" || autocollapse == "both") {
                this.$maximize = "right";
            } else {
                this.$normalizeResizer(a);
            }
        }
    }

    a = this.$splitparameter("rightthreshold");
    if (a != null) {
        if (pos > a) {
            if (autocollapse == true || autocollapse == "right" || autocollapse == "both") {
                this.$maximize = "left";
            } else {
                this.$normalizeResizer(a);
            }
        }
    }

};
TouchSplitterWindow.prototype.on_AdjustClient = function (msg) {
    if (this.$adjustClient()) {
        this.$adjustClients((msg != null && msg.dontFireEvents));
    }
};
TouchSplitterWindow.prototype.splitMove = function (p) {
    this.$saveResizerPos();
    var pos = this.$savedResizerPos + p;
    this.$normalizeResizer(pos);
    this.$applyAutoTransitions();
    this.$adjustClients();
};
TouchSplitterWindow.prototype.splitJump = function (p) {
    this.$saveResizerPos();
    var pos = this.$savedResizerPos;
    var gowhere;
    if (p == "left") {
        if (pos < 30) {
            gowhere = "leftmost";
        } else if (pos > 80) {
            gowhere = "rightquarter";
        } else if (pos > 55) {
            gowhere = "center";
        } else {
            gowhere = "leftquarter";
        }
    } else if (p == "right") {
        if (pos < 20) {
            gowhere = "leftquarter";
        } else if (pos > 70) {
            gowhere = "rightmost";
        } else if (pos > 45) {
            gowhere = "rightquarter";
        } else {
            gowhere = "center";
        }
    }
    this.$normalizeResizer(gowhere);
    this.$applyAutoTransitions();
    this.$adjustClients();
};
TouchSplitterWindow.prototype.$setCollapserCss = function (c) {
    if (c == "left" && this.$collapsedLeft != null && this.$splitparameter("leftcollapsecss") != null) {
        this.$collapsedLeft.find('[data-key="' + this.$splitparameter("textlabelkey") + '"]').removeClass(this.$splitparameter("leftcollapsecss")).addClass(this.$splitparameter("leftcollapsecss"));
    } else if (c == "right" && this.$collapsedRight != null && this.$splitparameter("rightcollapsecss") != null) {
        this.$collapsedRight.find('[data-key="' + this.$splitparameter("textlabelkey") + '"]').removeClass(this.$splitparameter("rightcollapsecss")).addClass(this.$splitparameter("rightcollapsecss"));
    }
};
TouchSplitterWindow.prototype.$setCollapserText = function (c) {
    if (c == "left" && this.$leftWindow != null && this.$collapsedLeft != null) {
        this.$collapsedLeft.find('[data-key="' + this.$splitparameter("textlabelkey") + '"]').text(this.$leftWindow.get_caption());
    } else if (c == "right" && this.$rightWindow != null && this.$collapsedRight != null) {
        this.$collapsedRight.find('[data-key="' + this.$splitparameter("textlabelkey") + '"]').text(this.$rightWindow.get_caption());
    }
};
TouchSplitterWindow.prototype.on_LayoutGetState = function (msg) {
    var state;
    //if (msg.data 
    if (BaseObject.is(msg.child, "BaseWindow")) { // The state for this child
        if (msg.child == this.$leftWindow) { // left side

        } else if (msg.child == this.$rightWindow) {

        }
    } else { // Full state

    }
};
TouchSplitterWindow.prototype.on_LayoutSetState = function (msg) {
    var state;
    if (BaseObject.is(msg.child, "BaseWindow")) { // The state for this child
        if (msg.child == this.$leftWindow) { // left side

        } else if (msg.child == this.$rightWindow) {

        }
    } else { // Full state

    }
};
TouchSplitterWindow.prototype.$reconfirmActive = null;
TouchSplitterWindow.prototype.on_LayoutRequest = function (msg) { // TODO: Reordering currently not supported! May be we should ...
    var req = BaseObject.getProperty(msg, "data");
    if (req != null) {
        // child: <BaseWindow>, childState: <constant>, width: <integer>, height: <integer>
        if (req.child == this.$leftWindow) { // left pane
            if ((req.childState & (LayoutRequestEnum.normal | LayoutRequestEnum.nominal)) != 0) {
                this.$maximize = null;
            } else if ((req.childState & LayoutRequestEnum.collapse) != 0) { // collapse
                this.$maximize = "right";
            } else if ((req.childState & LayoutRequestEnum.maximize) != 0) { // maximize
                this.$maximize = "left";
            }
            if ((req.childState & LayoutRequestEnum.show) != 0) {
                this.$hideleftmax = false;
            } else if ((req.childState & LayoutRequestEnum.hide) != 0) {
                this.$hideleftmax = true;
            }
            if ((req.childState & LayoutRequestEnum.reconfirm) != 0) {
                this.$reconfirmActive = "left";
            }
            this.$adjustClients();
        } else if (req.child == this.$rightWindow) { // right pane
            if ((req.childState & (LayoutRequestEnum.normal | LayoutRequestEnum.nominal)) != 0) {
                this.$maximize = null;
            } else if ((req.childState & LayoutRequestEnum.collapse) != 0) { // collapse
                this.$maximize = "left";
            } else if ((req.childState & LayoutRequestEnum.maximize) != 0) { // maximize
                this.$maximize = "right";
            }
            if ((req.childState & LayoutRequestEnum.show) != 0) {
                this.$hiderightmax = false;
            } else if ((req.childState & LayoutRequestEnum.hide) != 0) {
                this.$hiderightmax = true;
            }
            if ((req.childState & LayoutRequestEnum.reconfirm) != 0) {
                this.$reconfirmActive = "right";
            }
            this.$adjustClients();
        }
        this.$reconfirmActive = null;
    }
};
TouchSplitterWindow.prototype.$shakeIt = null;
TouchSplitterWindow.prototype.shakeIt = function () {
    var rect;
    if (this.$shakeIt == "left" && this.$containerLeft != null) {
        rect = BaseWindow.getElementPositionRect(this.$containerLeft);
        if (rect.w > 5) {
            rect.w -= 5;
            rect.toDOMElement(this.$containerLeft);
            rect.w += 5;
            rect.toDOMElement(this.$containerLeft);
        }
    } else if (this.$shakeIt == "right" && this.$containerRight != null) {
        rect = BaseWindow.getElementPositionRect(this.$containerRight);
        if (rect.w > 5) {
            rect.w -= 5;
            rect.toDOMElement(this.$containerRight);
            rect.w += 5;
            rect.toDOMElement(this.$containerRight);
        }
    }
    this.$shakeIt = null;
}
TouchSplitterWindow.prototype.shakeItTrigger = new InitializeMethodTrigger("Trigger resize shake", "shakeIt", 500);
TouchSplitterWindow.prototype.applyRect = function (rect, domel) {
    if (this.$reconfirmActive != null) {
        this.$shakeIt = this.$reconfirmActive;
        this.shakeItTrigger.windup();
    } else if (this.get_enforcesizechanged() != null) {
        this.$shakeIt = this.get_enforcesizechanged();
        this.shakeItTrigger.windup();
    }
    rect.toDOMElement(domel);
}
TouchSplitterWindow.prototype.$adjustClients = function (bDontFireEvents) {
    function _showhide(x, bshow) {
        if (x != null && x.length > 0) {
            if (bshow) { x.show(); } else { x.hide(); }
            return true;
        }
        return false;
    }
    // We assume that the client container is already adjusted.
    var rect = this.get_clientrect();
    var mx = this.get_maximize();
    this.$containerRight.css("position", "absolute");
    this.$containerLeft.css("position", "absolute");
    if (mx == "left") {
        this.$containerRight.hide();
        this.$containerLeft.show();
        _showhide(this.$collapsedLeft, false);
        if (this.get_hiderightmax()) { // Waiting programmatic unhide
            this.$resizer.hide();
            _showhide(this.$collapsedRight, false);
            var rcoll = new Rect(rect);
            rcoll.x = 0; rcoll.y = 0;
            this.applyRect(rcoll, this.$containerLeft);
            //rcoll.toDOMElement(this.$containerLeft);
            this.notifyChild(this.$rightWindow, WindowEventEnum.LayoutChange, { childState: LayoutChangeEnum.collapsed | LayoutChangeEnum.hide });
            this.notifyChild(this.$leftWindow, WindowEventEnum.LayoutChange, { childState: LayoutChangeEnum.maximized | LayoutChangeEnum.show });
        } else if (_showhide(this.$collapsedRight, true)) { // There is a right collapser
            this.$resizer.hide();
            var rcoll = Rect.fromDOMElement(this.$collapsedRight);
            rcoll.h = rect.h;
            rcoll.x = rect.w - rcoll.w; rcoll.y = 0;
            this.$setCollapserText("right");
            this.$setCollapserCss("right");
            this.applyRect(rcoll, this.$collapsedRight);
            // rcoll.toDOMElement(this.$collapsedRight);
            rcoll.x = 0;
            rcoll.w = rect.w - rcoll.w;
            this.applyRect(rcoll, this.$containerLeft);
            // rcoll.toDOMElement(this.$containerLeft);
            this.notifyChild(this.$rightWindow, WindowEventEnum.LayoutChange, { childState: LayoutChangeEnum.collapsed | LayoutChangeEnum.show });
            this.notifyChild(this.$leftWindow, WindowEventEnum.LayoutChange, { childState: LayoutChangeEnum.maximized | LayoutChangeEnum.show });
        } else {
            this.$normalizeResizer("leftmost");
            this.$resizer.show();
            var rcoll = Rect.fromDOMElement(this.$resizer);
            rcoll.x = rcoll.w;
            rcoll.y = 0;
            rcoll.h = rect.h;
            rcoll.w = rect.w - rcoll.w;
            this.applyRect(rcoll, this.$containerLeft);
            // rcoll.toDOMElement(this.$containerLeft);
            this.notifyChild(this.$rightWindow, WindowEventEnum.LayoutChange, { childState: LayoutChangeEnum.collapsed | LayoutChangeEnum.show });
            this.notifyChild(this.$leftWindow, WindowEventEnum.LayoutChange, { childState: LayoutChangeEnum.maximized | LayoutChangeEnum.show });
        }
        if (!bDontFireEvents && this.$leftWindow != null) {
            this.notifyChild(this.$leftWindow, WindowEventEnum.SizeChanged, {});
        }
    } else if (mx == "right") {
        this.$resizer.hide();
        this.$containerLeft.hide();
        this.$containerRight.show();
        _showhide(this.$collapsedRight, false);
        if (this.get_hideleftmax()) { // Waiting programmatic unhide
            this.$resizer.hide();
            _showhide(this.$collapsedLeft, false);
            var rcoll = new Rect(rect);
            rcoll.x = 0; rcoll.y = 0;
            this.applyRect(rcoll, this.$containerRight);
            // rcoll.toDOMElement(this.$containerRight);
            this.notifyChild(this.$rightWindow, WindowEventEnum.LayoutChange, { childState: LayoutChangeEnum.maximized | LayoutChangeEnum.show });
            this.notifyChild(this.$leftWindow, WindowEventEnum.LayoutChange, { childState: LayoutChangeEnum.collapsed | LayoutChangeEnum.hide });
        } else if (_showhide(this.$collapsedLeft, true)) { // There is a left collapser
            this.$resizer.hide();
            var rcoll = Rect.fromDOMElement(this.$collapsedLeft);
            rcoll.h = rect.h; rcoll.x = 0; rcoll.y = 0;
            this.$setCollapserText("left");
            this.$setCollapserCss("left");
            this.applyRect(rcoll, this.$collapsedLeft);
            //rcoll.toDOMElement(this.$collapsedLeft);
            rcoll.x = rcoll.w;
            rcoll.w = rect.w - rcoll.w;
            this.applyRect(rcoll, this.$containerRight);
            //rcoll.toDOMElement(this.$containerRight);
            this.notifyChild(this.$rightWindow, WindowEventEnum.LayoutChange, { childState: LayoutChangeEnum.maximized | LayoutChangeEnum.show });
            this.notifyChild(this.$leftWindow, WindowEventEnum.LayoutChange, { childState: LayoutChangeEnum.collapsed | LayoutChangeEnum.show });
        } else {
            this.$normalizeResizer("rightmost");
            this.$resizer.show();
            var rcoll = Rect.fromDOMElement(this.$resizer);
            rcoll.x = rcoll.w; rcoll.y = 0; rcoll.h = rect.h; rcoll.w = rect.w - rcoll.w;
            this.applyRect(rcoll, this.$containerRight);
            //rcoll.toDOMElement(this.$containerRight);
            this.notifyChild(this.$rightWindow, WindowEventEnum.LayoutChange, { childState: LayoutChangeEnum.maximized | LayoutChangeEnum.show });
            this.notifyChild(this.$leftWindow, WindowEventEnum.LayoutChange, { childState: LayoutChangeEnum.collapsed | LayoutChangeEnum.show });
        }
        if (!bDontFireEvents && this.$rightWindow != null) {
            this.notifyChild(this.$rightWindow, WindowEventEnum.SizeChanged, {});
        }
    } else {
        this.notifyChild(this.$rightWindow, WindowEventEnum.LayoutChange, { childState: LayoutChangeEnum.normal | LayoutChangeEnum.show });
        this.notifyChild(this.$leftWindow, WindowEventEnum.LayoutChange, { childState: LayoutChangeEnum.normal | LayoutChangeEnum.show });
        // Split scenario
        this.$resizer.show();
        this.$containerLeft.show();
        this.$containerRight.show();
        _showhide(this.$collapsedLeft, false);
        _showhide(this.$collapsedRight, false);
        this.$normalizeResizer(this.$savedResizerPos);
        var r_rect = BaseWindow.getElementPositionRect(this.$resizer);
        // TODO: We need to normalize the resizer in border cases - refine this minimal code when possible
        r_rect.y = 0; r_rect.h = rect.h;
        var usable_width = rect.w - r_rect.w;
        var k_pos = (r_rect.x * 100) / usable_width;
        if (k_pos < this.$splitparameter("leftthreshold")) {
            this.$normalizeResizer(this.$splitparameter("leftthreshold"));
        } else if (k_pos > this.$splitparameter("rightthreshold")) {
            this.$normalizeResizer(this.$splitparameter("rightthreshold"));
        } else {
            this.$normalizeResizer(k_pos);
        }
        r_rect = BaseWindow.getElementPositionRect(this.$resizer); // Get it again if it has been normalized
        k_pos = (r_rect.x * 100) / usable_width;
        //this.$savedResizerPos = k_pos;
        var r;
        r = BaseWindow.getElementPositionRect(this.$containerLeft);
        r.y = r.x = 0;
        r.h = rect.h;
        r.w = r_rect.x;
        this.applyRect(r, this.$containerLeft);
        //r.toDOMElement(this.$containerLeft);
        r.w = rect.w - r_rect.w - r.w;
        r.x = r_rect.x + r_rect.w;
        this.applyRect(r, this.$containerRight);
        // r.toDOMElement(this.$containerRight);
        if (!bDontFireEvents) this.notifyChildren(WindowEventEnum.SizeChanged, {});
    }
};
// This method is called whenever a child is added/removed and perhaps when the state of the splitter changes and the 
// state of the resizer is not guaranteed to be usable. Its purpose is to move the resizer somewhere, but not hide or show it!
TouchSplitterWindow.prototype.$normalizeResizer = function (how) { // How can be a number of predefined constants or a percentage.
    if (how != null) {
        var rect = this.get_clientrect();
        this.$resizer.css("zIndex", 10000);
        var r_rect = BaseWindow.getElementPositionRect(this.$resizer);
        r_rect.y = 0; r_rect.h = rect.h;
        if (BaseObject.is(how, "string")) {
            switch (how) {
                case "initial": // Initial position
                    r_rect.x = 0 + ((rect.w - r_rect.w) * this.$splitparameter("initial")) / 100;
                    r_rect.toDOMElement(this.$resizer);
                    break;
                case "center":
                    r_rect.x = 0 + (rect.w - r_rect.w) / 2;
                    r_rect.toDOMElement(this.$resizer);
                    break;
                case "leftmost":
                    r_rect.x = 0;
                    r_rect.toDOMElement(this.$resizer);
                    break;
                case "rightmost":
                    r_rect.x = 0 + rect.w - r_rect.w;
                    r_rect.toDOMElement(this.$resizer);
                    break;
                case "left":
                case "leftquarter":
                    r_rect.x = 0 + (rect.w / 4) - (r_rect.w / 2);
                    r_rect.toDOMElement(this.$resizer);
                    break;
                case "right":
                case "rightquarter":
                    r_rect.x = 0 + (rect.w * 3 / 4) - (r_rect.w / 2);
                    r_rect.toDOMElement(this.$resizer);
                    break;
            }
        } else if (typeof how == "number") { // Position in percentage
            r_rect.x = ((rect.w - r_rect.w) * ((how > 0 && how <= 100) ? how : 50)) / 100;
            r_rect.toDOMElement(this.$resizer);
        }
    }
};
TouchSplitterWindow.prototype.$savedResizerPos = null;
TouchSplitterWindow.prototype.$saveResizerPos = function () {
    var rect = this.get_clientrect();
    var r_rect = BaseWindow.getElementPositionRect(this.$resizer);
    var usable_width = rect.w - r_rect.w;
    var k_pos = (r_rect.x * 100) / usable_width;
    // Disallow very small positions
    if (r_rect.x < 50) k_pos = 0;
    if (rect.w - r_rect.x < 50) k_pos = 100;
    this.$savedResizerPos = k_pos;
};
TouchSplitterWindow.prototype.$restoreResizerPos = function (fallback) {
    if (this.$savedResizerPos != null) {
        if (this.$savedResizerPos > 0 && this.$savedResizerPos < 100) {
            this.$normalizeResizer(this.$savedResizerPos);
        } else if (this.$savedResizerPos <= 0) {
            this.$normalizeResizer("leftmost");
        } else if (this.$savedResizerPos >= 100) {
            this.$normalizeResizer("rightmost");
        }
    } else {
        // Default postion
        this.$normalizeResizer((fallback != null) ? fallback : "initial");
    }
};
TouchSplitterWindow.prototype.$maximize = null; // "left" or "right"
TouchSplitterWindow.prototype.get_maximize = function () {
    if (this.$rightWindow == null) {
        return "left";
    } else if (this.$leftWindow == null) {
        return "right";
    }
    return this.$maximize;
};
TouchSplitterWindow.prototype.set_maximize = function (v) {
    if (v != null && v.inSet(["left", "right"])) {
        this.$maximize = v;
        this.$saveResizerPos();
    } else {
        this.$maximize = null;
    }
    this.$adjustClients();
    this.persistState();
};
TouchSplitterWindow.prototype.on_AddingChild = function (msg) {
    var p = BaseObject.getProperty(msg, "data.childParam");
    if (p != null && p.inSet([TouchSplitterWindow.leftPane, TouchSplitterWindow.rightPane, "left", "right"])) {
        // correct
        return true;
    }
    return false;
};
TouchSplitterWindow.prototype.on_ChildAdded = function (msg) {
    // We need to check and remove any old children
    var p = BaseObject.getProperty(msg, "data.childParam");
    if (p != null) {
        if (p.inSet([TouchSplitterWindow.leftPane, "left"])) {
            // this.removeChild(this.$leftWindow);
            // if (BaseObject.is(this.$leftWindow, "BaseWindow")) {
                // this.$leftWindow.destroy();
            // }
            this.$leftWindow = msg.data.child;
            this.$restoreResizerPos("initial");
            this.$adjustClients();
        } else if (p.inSet([TouchSplitterWindow.rightPane, "right"])) {
            // this.removeChild(this.$rightWindow);
            // if (BaseObject.is(this.$rightWindow, "BaseWindow")) {
                // this.$rightWindow.destroy();
            // }
            this.$rightWindow = msg.data.child;
            this.$restoreResizerPos("initial");
            this.$adjustClients();
        }
    }
};
// Holders for the left and the right window
TouchSplitterWindow.prototype.$leftWindow = null;
TouchSplitterWindow.prototype.$rightWindow = null;
// Accessors for the left and right window
TouchSplitterWindow.prototype.get_leftwindow = function () { return this.$leftWindow; };
TouchSplitterWindow.prototype.get_rightwindow = function () { return this.$rightWindow; };
// The names of the containers as understood by the window (not the DOM keys)
TouchSplitterWindow.leftPane = "ZoneLeft";
TouchSplitterWindow.rightPane = "ZoneRight";
TouchSplitterWindow.prototype.setLeft = function (wnd) {
    if (BaseObject.is(this.$leftWindow, "BaseWindow")) {
		this.removeChild(this.$leftWindow);
		// this.$leftWindow.destroy();
		this.$saveResizerPos();
	}
	this.$leftWindow = null;
    if (wnd != null) {
        this.addChild(wnd, TouchSplitterWindow.leftPane);
    }
};
TouchSplitterWindow.prototype.setRight = function (wnd) {
	if (BaseObject.is(this.$rightWindow, "BaseWindow")) {
			this.removeChild(this.$rightWindow);
            // this.$rightWindow.destroy();
            this.$saveResizerPos();
    }
    this.$rightWindow = null;
		
    if (wnd != null) {
        this.addChild(wnd, TouchSplitterWindow.rightPane);
    } 
};
TouchSplitterWindow.prototype.swapWindows = function(bAsync) {
	var wl = this.get_leftwindow(), wr = this.get_rightwindow();
	if (bAsync) {
		this.callAsync(function() {
			this.setRight(null);
			this.setLeft(null);
			this.callAsync(function() {
				this.setRight(wl);
				this.setLeft(wr);
			});
		});
	} else {
		this.setRight(null);
		this.setLeft(null);
		this.setRight(wl);
		this.setLeft(wr);
	}
}
TouchSplitterWindow.prototype.on_ChildRemoved = function (msg) {
    this.$saveResizerPos();
};


