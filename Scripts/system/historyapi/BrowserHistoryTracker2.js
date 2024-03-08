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
        window.history.pushState({type: "approute", title: app.get_caption()}, null,route);
        document.title = route;//app.get_caption();

    }
    // TODO review me
    BrowserHistoryTracker2.prototype.onPopstateHandler = function(event) {
        var state = event.state
        var me = this;
        if (state != null) {
            if (state.type == "guard_entry") {
                if (window.confirm("Do you want to leave?")) {
                    window.history.back();
                }
                window.history.replaceState(state,null); // TODO normalize URL
                return;// TODO may be not return when url is normalized?
            }
            if (typeof state.title == "string") {
                document.title = state.title;
            }
        }
        var bkurl = new BKUrl(window.location.href);
        //this.$lastRoute 
        var route = SysRouter.Default().getRouteFromURL(bkurl);
        this.$lastRoute = route;
        SysRouter.Default().applyRoute(bkurl);
    }

    //#region Singleton
    BrowserHistoryTracker2.Default = (function() {
        var instance = null;
        return function() {
            if (instance == null) {
                instance = new BrowserHistoryTracker2();
                window.onpopstate = Delegate.createWrapper(instance, instance.onPopstateHandler);
                var history_state = {
                    type: "guard_entry",
                    title: System.Default().get_workspaceName(),
                }
                history.replaceState(history_state,null,""); // TODO normalize url
            }
            return instance;
        }
    })();
    //#endregion

    

})();