(function() {

    var MainWindow  = Class("MainWindow"),
        GRect       = Class("GRect"),
        GPoint      = Class("GPoint"),
        GSize      = Class("GSize"),
        WindowStyleFlags = Enumeration("WindowStyleFlags");

    function PanesMainWindow() {
        MainWindow.apply(this,arguments);
    }
    PanesMainWindow.Inherit(MainWindow, "PanesMainWindow")
    .Defaults({
        templateName: "bindkraft/window-mainwithpanes"
    });

    //#region declaration and settings

    PanesMainWindow.ImplementReadProperty("paneNames", new InitializeCloneObject("Name translation of the panes", {
        toppane: ["toppane","top"],
        leftpane: ["leftpane", "left"],
        rightpane: ["rightpane", "right"],
        bottompane: ["bottompane", "bottom"]
    }))
    .ImplementProperty("mode", new InitializeBooleanParameter("wide / narrow mode, see also the properties holding settings for them", "wide"),false,"OnPositionPanes")
    .ImplementProperty("panewidthwide", new InitializeNumericParameter("Percent of the open pane state (left and right)", 30),false,"OnPositionPanes")
    .ImplementProperty("panewidthnarrow", new InitializeNumericParameter("Percent of the open pane state (left and right)", 70),false,"OnPositionPanes")
    .ImplementProperty("paneheightwide", new InitializeNumericParameter("Percent of the open pane state (top and bottom)", 50),false,"OnPositionPanes")
    .ImplementProperty("paneheightnarrow", new InitializeNumericParameter("Percent of the open pane state (top and bottom)", 60),false,"OnPositionPanes");

    PanesMainWindow.prototype.get_panewidth = function() { 
        if (this.get_mode() == "narrow") {
            return this.get_panewidthnarrow();
        } else {
            return this.get_panewidthwide();
        }
    }
    PanesMainWindow.prototype.get_paneheight = function() { 
        if (this.get_mode() == "narrow") {
            return this.get_paneheightnarrow();
        } else {
            return this.get_paneheightwide();
        }
    }
    //#endregion declaration and settings


    //#region Events
    PanesMainWindow.prototype.paneschangedevent = new InitializeEvent("Fired when pane is added or removed");
    PanesMainWindow.prototype.panestateevent = new InitializeEvent("Fired when pane is opened / closed");
    //#endregion

    //#region  Pane control
    PanesMainWindow.prototype.on_SizeChanged = function(msg) {
        this.positionPanes();
    }
    PanesMainWindow.prototype.$getPaneSlotName = function(name) {
        var slotNames = this.get_paneNames();
        for (var k in slotNames) {
            if (slotNames.hasOwnProperty(k) && Array.isArray(slotNames[k])) {
                if (slotNames[k].indexOf(name) >= 0) return k;
            }
        }
        return null;
    }
    
    // // Perhaps we will ditch this
    // PanesMainWindow.prototype.$getPaneContainer = function(name) {
    //     var name = this.$getPaneSlotName(name);
    //     if (name != null) {
    //         return this.get_clientcontainer(name);


    //     }
    //     return null;
    // }
    PanesMainWindow.prototype.calcPanePos = function(pane) {
        var container = this.get_clientcontainer();
        if (container != null) {
            var rect = GRect.fromDOMElementClient(container);
            if (rect != null && rect.isValid() && !rect.isEmpty()) {
                var paneName = this.$getPaneSlotName(pane);
                var paneRect = new GRect(rect);
                if (paneName != null) {
                    switch (paneName) {
                        case "toppane":
                            paneRect.h = rect.h * this.get_paneheight() / 100;
                            break;
                        case "leftpane":
                            paneRect.w = rect.w * this.get_panewidth() / 100;
                            break;
                        case "rightpane":
                            paneRect.x = rect.x + rect.w - (rect.w * this.get_panewidth() / 100);
                            paneRect.w = rect.w * this.get_panewidth() / 100;
                            break;
                        case "bottompane":
                            paneRect.y = rect.y + rect.h - (rect.h * this.get_paneheight() / 100);
                            paneRect.h = rect.h * this.get_paneheight() / 100;
                            break;
                        default:
                            return null;
                    }
                    return paneRect;
                }
            }
        }
        return null;
    }
    PanesMainWindow.prototype.OnPositionPanes = function() {
        this.positionPanes();
    }
    PanesMainWindow.prototype.positionPanes = function() {
        var names = this.get_paneNames();
        for (var name in names) {
            var wnd = this.$paneWindows[name];
            if (wnd != null && wnd.isWindowVisible()) {
                var rect = this.calcPanePos(name);
                if (rect != null) {
                    wnd.set_windowrect(rect);
                }
            }
        }
    }
    PanesMainWindow.prototype.togglePane = function(pane) {
        if (this.isPaneOpened(pane)) {
            this.closePane(pane);
        } else {
            this.openPane(pane);
        }
    }
    PanesMainWindow.prototype.openPane = function(pane) {
        var paneName = this.$getPaneSlotName(pane);
        if (paneName == null) return;
        var names = this.get_paneNames();
        for (var name in names) {
            var wnd = this.$paneWindows[name];
            if (wnd != null) {
                if (paneName == name) {
                    wnd.setWindowStyles(WindowStyleFlags.visible, "set");
                    wnd.activateWindow();
                } else {
                    wnd.setWindowStyles(WindowStyleFlags.visible, "reset");
                }
            }
        }
        this.positionPanes();
    }
    PanesMainWindow.prototype.isPaneOpened = function(pane) {
        var paneName = this.$getPaneSlotName(pane);
        var wnd = this.$paneWindows[paneName];
        if (wnd != null && wnd.isWindowVisible()) return true;
        return false;
    }
    PanesMainWindow.prototype.closePane = function(pane) {
        var paneName = this.$getPaneSlotName(pane);
        var wnd = this.$paneWindows[paneName];
        if (wnd != null) {
            wnd.setWindowStyles(WindowStyleFlags.visible, "reset");
            this.positionPanes();
        }
    }
    PanesMainWindow.prototype.closeAllPanes = function() {
        var names = this.get_paneNames();
        for (var name in names) {
            var wnd = this.$paneWindows[name];
            if (wnd != null) {
                wnd.setWindowStyles(WindowStyleFlags.visible, "reset");
            }
            this.positionPanes();
        }
    }
    //#endregion Pane control

    //#region State
    PanesMainWindow.prototype.get_haspanes = function() {
        var names = this.get_paneNames();
        for (var name in names) {
            var wnd = this.$paneWindows[name];
            if (wnd != null) {
                return true;
            }
        }
        return false;
    }
    PanesMainWindow.prototype.hasPane = function(pane) { 
        var paneName = this.$getPaneSlotName(pane);
        var wnd = this.$paneWindows[paneName];
        if (wnd != null) {
            return true;
        }
        return false;
    }
    PanesMainWindow.prototype.get_hasleftpane = function() { 
        return this.hasPane("leftpane");
    }
    PanesMainWindow.prototype.get_hastoppane = function() { 
        return this.hasPane("toppane");
    }
    PanesMainWindow.prototype.get_hasrightpane = function() { 
        return this.hasPane("rightpane");
    }
    PanesMainWindow.prototype.get_hasbottompane = function() { 
        return this.hasPane("bottompane");
    }

    PanesMainWindow.prototype.get_leftpaneopened = function() { 
        return this.isPaneOpened("leftpane");
    }
    PanesMainWindow.prototype.set_leftpaneopened = function() { 
        return this.openPane("leftpane");
    }
    PanesMainWindow.prototype.get_toppaneopened = function() { 
        return this.isPaneOpened("toppane");
    }
    PanesMainWindow.prototype.set_toppaneopened = function() { 
        return this.openPane("toppane");
    }
    PanesMainWindow.prototype.get_rightpaneopened = function() { 
        return this.isPaneOpened("rightpane");
    }
    PanesMainWindow.prototype.set_rightpaneopened = function() { 
        return this.openPane("rightpane");
    }
    PanesMainWindow.prototype.get_bottompaneopened = function() { 
        return this.isPaneOpened("bottompane");
    }
    PanesMainWindow.prototype.set_bottompaneopened = function() { 
        return this.openPane("bottompane");
    }
    PanesMainWindow.prototype.toggleLeftPane = function() { this.togglePane("left"); }
    PanesMainWindow.prototype.toggleTopPane = function() { this.togglePane("top"); }
    PanesMainWindow.prototype.toggleRightPane = function() { this.togglePane("right"); }
    PanesMainWindow.prototype.toggleBottomPane = function() { this.togglePane("bottom"); }

    //#endregion


    //#region Pane load
    PanesMainWindow.prototype.$paneWindows = new InitializeObject("References to the pane windows");
    PanesMainWindow.prototype.setPane = function(pane, wnd) {
        var name = this.$getPaneSlotName(pane);
        var oldWnd = null;
        if (name != null) {
            if (wnd == null || BaseObject.is(wnd, "BaseWindow")) {
                var w = this.$paneWindows[name];
                if (w == wnd) return w;
                if (w != null) {
                    oldWnd = w;
                    // Remove the old one
                    this.removeChild(w);
                    this.$paneWindows[name] = null;
                }
                if (wnd != null) {
                    this.addChild(wnd);
                    this.$paneWindows[name] = wnd;
                    wnd.setWindowStyles(WindowStyleFlags.visible, "reset");
                    wnd.setWindowStyles(WindowStyleFlags.topmost, "set");

                }
                this.positionPanes();
                this.paneschangedevent.invoke(this,null);
            }
        }
        return oldWnd;
    }
    PanesMainWindow.prototype.getPane = function(pane) {
        var name = this.$getPaneSlotName(pane);
        if (name != null) {
            return this.$paneWindows[name];
        }
        return null;
    }
    PanesMainWindow.prototype.emptyPanes = function() {
        var names = this.get_paneNames();
        for (var name in names) {
            var wnd = this.$paneWindows[name];
            if (wnd != null) {
                this.removeChild(wnd);
            }
        }
        this.positionPanes();
        this.paneschangedevent.invoke(this,null);
    }
    //#endregion Pane load

    
})();