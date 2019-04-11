


// Base class for top level windows
/*CLASS*/
function MainWindow() {
    BaseWindow.apply(this, arguments);
}
MainWindow.Inherit(BaseWindow, "MainWindow");
MainWindow.Defaults({
	templateName: new StringConnector('<div data-key="_window"><div><span data-on-click="{bind source=_window path=closeWindow}">close</span>|<span data-bind-text="{bind source=_window path=$caption}"></span></div><div data-key="_client" style="position: relative;overflow: auto;></div></div>')
});


