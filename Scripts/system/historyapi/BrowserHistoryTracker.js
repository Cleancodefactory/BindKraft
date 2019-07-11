/*CLASS*/
function BrowserHistoryTracker() {
    BaseObject.apply(this, arguments);
}
BrowserHistoryTracker.Inherit(BaseObject, "BrowserHistoryTracker");
BrowserHistoryTracker.Implement(IHistoryTracker);

BrowserHistoryTracker.prototype.$allowLeave = false;
BrowserHistoryTracker.prototype.$allowPush = true;
BrowserHistoryTracker.prototype.$historyState = null;
BrowserHistoryTracker.prototype.$lastPushedId = -1;
BrowserHistoryTracker.prototype.$lastPushedState = null;

//+IHistoryTracker
BrowserHistoryTracker.prototype.pushHistoryState = function (app, appstate) {
	var app = _app.Dereference();
    //Check if appstate is string and throw exception
    if (typeof appstate !== 'string') {
        throw 'appstate should be of type string';
    }
    this.$historyState = {
        entryType: 'app_state',
        className: app.classType(),
        //title: app.get_caption(),
        title: app.classType(),
        instId: app.$__instanceId,
        url: '#' + app.classType(),
        state: appstate
    };
	if (this.$lastPushedState != this.$historyState.className + this.$historyState.state) {
        this.handleHistoryStatus(this.$historyState);
    }
};
//-IHistoryTracker

BrowserHistoryTracker.prototype.onWindowActivated = function (sender, dc) {
    if (this.$allowPush) {
        var rootAppWnd = BrowserHistoryTracker.GetAppRootWindow(dc);
        if (rootAppWnd !== null) {
            var appRoot = rootAppWnd.get_approot();
            if (!BaseObject.is(appRoot, 'IAppHistorySupport') || appRoot.get_allowhistory()) {
                this.$historyState = {
                    entryType: 'nav',
                    className: appRoot.classType(),
                    //title: appRoot.get_caption(),
                    title: appRoot.classType(),
                    instId: appRoot.$__instanceId,
                    url: '#' + appRoot.classType(),
                    state: null
                };
                this.handleHistoryStatus(this.$historyState);
            }
        }
    }
};

BrowserHistoryTracker.GetAppRootWindow = function (wnd) {
    var currentWindow = wnd;
    do {
        if (BaseObject.is(currentWindow.get_approot(), 'IApp')) {
            return currentWindow;
        } else {
            currentWindow = currentWindow.get_windowparent();
        }
    } while (currentWindow !== null);
    return null;
};

BrowserHistoryTracker.Default = (function () {
    var inst = null;
    return function () {
        if (inst === null) {
            inst = new BrowserHistoryTracker();
            //Register and regCookie as inst variable
            var regCookie = LocalAPI.Default().registerAPI('IHistoryTracker', inst);

            window.onpopstate = Delegate.createWrapper(inst, inst.onPopstateHandler);
            var previousState = window.history.state;
            if (previousState === null) {
                inst.$historyState = {
                    entryType: 'session_start',
                    className: '',
                    title: 'KraftApps', //Eventually get a general name like KraftApps
                    instId: 0,
                    url: '#',
                    state: null
                };
                inst.handleHistoryStatus(inst.$historyState);
            }
            WindowManagement.Default().activateevent.add(new Delegate(inst, inst.onWindowActivated));
        }
        return inst;
    };
})();

BrowserHistoryTracker.prototype.Navigate = function (state) {
    this.$allowPush = false;
    document.title = state.title;
    var app = Shell.getAppByClassName(state.className);
    var hasInterface = Class.is(state.className, 'IApplicationState');
    if (app != null) {
        Shell.activateApp(app);
        if (hasInterface) {
            app.setApplicationState(state.state);
        }
    } else {
        var operation = Shell.launchOne(state.className);

        operation.whencomplete().tell(function (op) {
            if (hasInterface) {
                if (op.isOperationSuccessful()) {
                    op.getOperationResult().setApplicationState(state.state);
                }
            }
        });
    }

    this.$allowPush = true;
    console.log("Navigate- entryType: " + state.entryType + ' title: ' + state.title + ' url: ' + state.url + ' className: ' + state.className);
};

BrowserHistoryTracker.prototype.onPopstateHandler = function (event) {
    if (event.state !== null) {
        if (!this.$allowLeave) {
            if (event.state.entryType === 'session_start') {
                if (window.confirm('Do you want to leave the page and loose your work?')) {
                    window.history.back();
                    return;
                } else {
                    this.handleHistoryStatus(event.state);
                }
            }
        }
        this.Navigate(event.state);
    } else {
        console.log("onPopstateHandler is null!");
    }
    this.$lastPushedId = -1;
};

BrowserHistoryTracker.prototype.handleHistoryStatus = function (state) {
    if (state !== null) {
        document.title = state.title;
        switch (state.entryType) {
            case 'session_start':
                {
                    window.history.replaceState(state, state.title, state.url);
                    break;
                }
            case 'nav':
                {
                    if (this.$lastPushedId !== state.instId) {
                        window.history.pushState(state, state.title, state.url);
                        console.log("HandleHistoryStatus- entryType: " + state.entryType + ' title: ' + state.title + ' url: ' + state.url + ' className: ' + state.className);
                    }
                    break;
                }
            case 'app_state':
                {
                    if (state.state) {
                        // will evaluate to true if value is not:
                        // null
                        // undefined
                        // NaN
                        // empty string ("")
                        // 0
                        // false
                        window.history.pushState(state, state.title, state.url + '/' + state.state);
                        this.$lastPushedState = state.className + state.state
                    }
                    console.log("HandleHistoryStatus- entryType: " + state.entryType + ' title: ' + state.title + ' url: ' + state.url + ' className: ' + state.className);
                    break;
                }
            default:
                {
                    console.log("HandleHistoryStatus-EntryType not known: " + state.entryType);
                }
        }
		this.$lastPushedId = state.instId;
    }
};