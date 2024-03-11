(function() {
    var SysRouter = Class("SysRouter");


    function BrowserHistoryTracker2() {
        BaseObject.apply(this, arguments);
    }
    BrowserHistoryTracker2.Inherit(BaseObject, "BrowserHistoryTracker2");
    BrowserHistoryTracker2.Implement(IHistoryTracker2);
    BrowserHistoryTracker2.prototype.$locked = false;
    BrowserHistoryTracker2.prototype.$lastRoute = null;
    BrowserHistoryTracker2.prototype.routeStateChanged = function(_app) {
        var app = _app;
        if (DummyInterfaceProxyBuilder.isProxy(_app)) {
            app = _app.Dereference(); // Get the non-proxied ref
        }
        var route = SysRouter.Default().getAppRoute(app);
        if (route == this.$lastRoute) return;
        this.$lastRoute = route;
        console.log("routechanged:" + route);
        //document.title = route;//app.get_caption();
        window.history.pushState({type: "approute", title: app.get_caption()}, null,route);
        document.title = route;//app.get_caption();

    }
    // TODO review me
    BrowserHistoryTracker2.prototype.onPopstateHandler = function(event) {
        var state = event.state
        var me = this;
        var bkurl = new BKUrl(window.location.href);
        //this.$lastRoute 
        var route = SysRouter.Default().getRouteFromURL(bkurl);
        this.$lastRoute = route;
        SysRouter.Default().applyRoute(bkurl).then( function() {
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
                        type: "guard_entry",
                        title: "guard_entry"
                        //title: System.Default().get_workspaceName(),
                    }
                    //history.replaceState(history_state,null,"/"); // TODO normalize url
                    //history.pushState({type: "approute"},null,"nav"); // TODO normalize url
                }
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