(function() {
    var SysRouter = Class("SysRouter");


    function BrowserHistoryTracker2() {
        BaseObject.apply(this, arguments);
    }
    BrowserHistoryTracker2.Inherit(BaseObject, "BrowserHistoryTracker2");
    BrowserHistoryTracker2.Implement(IHistoryTracker2);
    BrowserHistoryTracker2.prototype.$lastRoute = null;
    BrowserHistoryTracker2.prototype.$noactivate = false; // When true forbids reaction to activate window
    BrowserHistoryTracker2.prototype.$launching = true;
    BrowserHistoryTracker2.prototype.routeStateChanged = function(_app) {
        if (this.$noactivate) return;
        var app = _app;
        if (DummyInterfaceProxyBuilder.isProxy(_app)) {
            app = _app.Dereference(); // Get the non-proxied ref
        }
        var route = SysRouter.Default().getAppRoute(app);
        if (route == null || route == this.$lastRoute) return;
        // TODO see the situatuion with empty and null routes 
        this.$lastRoute = route;
        console.log("routechanged:" + route);
        // This title is picked as caption for the prev entry when the new one (pushState is create)
        //document.title = route;//app.get_caption();
        if (this.$launching) {
            this.$launching = false;
            window.history.replaceState({type: "approute"}, null,route);
        } else {
            window.history.pushState({type: "approute"}, null,route);
        }
        
        document.title = System.Default().get_workspaceName() + " - " + route;//app.get_caption();

    }
    // TODO review me
    BrowserHistoryTracker2.prototype.onPopstateHandler = function(event) {
        var state = event.state
        var me = this;
        var bkurl = new BKUrl(window.location.href);
        //this.$lastRoute 
        var route = SysRouter.Default().getRouteFromURL(bkurl);
        this.$lastRoute = route;
        this.$noactivate = true;
        SysRouter.Default().applyRoute(bkurl).then( function() {
            me.$noactivate = false;
            return;
            if (state != null) {
                if (state.type == "guard_entry") {
                    if (window.confirm("Do you want to leave?")) {
                        window.history.back();
                    } else {
                        document.title = "guard entry replaced";    
                        window.history.replaceState(state,null,route); // TODO normalize URL    
                    }
                }
                if (typeof state.title == "string") {
                    //document.title = state.title;
                }
            }    
        });
    }
    //#region Window activation tracking
    BrowserHistoryTracker2.prototype.onWindowActivated = function (sender, wnd) {
        return;
        if (this.$noactivate) return;
        var app = Shell.getAppFromWindow(wnd);
        console.log(app);
        if (BaseObject.is(app,"IAppRouter")) {
            this.routeStateChanged(app);
        }
    };
    //#endregion

    //#region Singleton
    BrowserHistoryTracker2.Default = (function() {
        var enabled = false,instance = null;
        return function(enable) {
            if (enable) enabled = true;
            if (enabled) {
                if (instance == null) {
                    instance = new BrowserHistoryTracker2();
                    window.onpopstate = Delegate.createWrapper(instance, instance.onPopstateHandler);
                    var history_state = {
                        type: "guard_entry"
                        //title: System.Default().get_workspaceName(),
                    }
                    //document.title = System.Default().get_workspaceName();
                    //history.replaceState(history_state,null,"/"); // TODO normalize url
                    //history.pushState({type: "approute"},null,"nav"); // TODO normalize url
                }
                WindowManagement.Default().activateevent.add(new Delegate(instance, instance.onWindowActivated));
                return instance;
            } else {
                return {
                    routeStateChanged: function() {}
                }
            }
            
        } 
    })();
    //#endregion

    

})();