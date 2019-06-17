function TabbedSurrogateApp() {
	AppBaseEx.apply(this, arguments);
	this.setFinalAuthority(true);
}
TabbedSurrogateApp.Inherit(AppBaseEx,"TabbedSurrogateApp");
TabbedSurrogateApp.Implement(ISupportsEnvironmentContextImpl);
TabbedSurrogateApp.Implement(ISupportsCommandRegisterExDefImpl,[
	{ name: "view",alias: null,
		regexp: null,
		action: function(context, api) {
			var arg = api.pullNextToken();
			if (typeof arg == "string") {
				var rurl = IPlatformUrlMapper.mapResourceUrl(arg.slice(arg.indexOf("/") + 1),arg.slice(0,arg.indexOf("/")));
				throw "Under construction";
			} else {
				throw "The parameter to the TabbedSurrogateApp's view command needs to be a string";
			}
			return null;
		},
		help: "loads a view"
	},
	{ name: "loadview", alias: "lv",
		regexp: null,
		action: function(context, api) {
			var arg = api.pullNextToken();
			if (typeof arg == "string") {
				return this.loadView(arg);
			} else {
				throw "loadview needs a string argument";
			}
		},
		help: "Loads a view through nodeset request - the url should point a correct node in a nodeset"
	}
]);
TabbedSurrogateApp.Implement(ISupportsCommandContextImpl,"single");
TabbedSurrogateApp.prototype.get_caption = function() {
	return "Tabbed surrogate app";
};
TabbedSurrogateApp.prototype.provideAsServices = new InitializeArray("Internal services", ["IAppletStorage","TabbedSurrogateApp"]);

TabbedSurrogateApp.prototype.root = null; // The root app window goes here
TabbedSurrogateApp.prototype.tabs = null; // The tabset goes here

TabbedSurrogateApp.prototype.initialize = function ( args) {
	var op = new Operation(null, 10000);
	this.root = Shell.createStdAppWindow();
	this.placeWindow(this.root);
	this.root.updateTargets();
	this.root.set_windowrect(new Rect(50,50,600,500));
	
	// Add a tabset 
	this.tabs = new TabSetWindow(WindowStyleFlags.fillparent | WindowStyleFlags.adjustclient | WindowStyleFlags.visible | WindowStyleFlags.parentnotify,
		{
			on_Create: function(msg) {
				op.CompleteOperation(true,null);
			}
		}
	);
	this.root.addChild(this.tabs);
	this.$homeView();
	return op;
}
TabbedSurrogateApp.prototype.run = function (apparg0) {
	
}
TabbedSurrogateApp.prototype.shutdown = function () {
    var op = new Operation();
	op.CompleteOperation(true, null); // What are we going to return here (or not)?
	return op;
};
TabbedSurrogateApp.prototype.windowDisplaced = function(w) {
	if (w == this.root) {
		this.ExitApp();
	}
}

TabbedSurrogateApp.prototype.$homeView = function() {
	var op = new Operation();
	var view = new SimpleViewWindow(
		WindowStyleFlags.fillparent | WindowStyleFlags.visible | WindowStyleFlags.adjustclient,
		{
			loadOnCreate: true,
			directData: {},
			view: '<div data-class="TrivialView caption=\'home\'">To open something in the surrogate use the CL or use the services provided.</div>',
			on_Create: function() {
				op.CompleteOperation(true, null);
			}
		}
	);
	this.tabs.addPage(view, true);
	return op;
}
TabbedSurrogateApp.prototype.loadView = function(arg) {
	var op = new Operation(null, 10000);
	var view = new SimpleViewWindow(
		WindowStyleFlags.fillparent | WindowStyleFlags.visible | WindowStyleFlags.adjustclient,
		{
			url: IPlatformUrlMapper.mapModuleUrl(arg.slice(arg.indexOf(":") + 1),arg.slice(0,arg.indexOf(":"))),
			on_ViewLoaded: function() {
				op.CompleteOperation(true, null);
			}
		}
	);
	this.tabs.addPage(view, true);
	this.root.activateWindow();
	return op;
}

