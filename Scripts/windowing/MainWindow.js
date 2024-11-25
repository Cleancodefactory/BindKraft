function MainWindow(){BaseWindow.apply(this,arguments);}MainWindow.Inherit(BaseWindow,"MainWindow");MainWindow.Defaults({templateName:new StringConnector('\
	<div style="background-color: #A0A0A0; border: 1px solid #606060; border-radius: 5px;text-align:left;" data-key="_window" >\
	  <div data-sys-height="true" data-sys-draghandle="true" style="font-size:12pt; font-weight: bold;background-color: #FFFFFF;color: #000000;margin:0px;border-radius: 5px 5px 0px 0px;" data-on-dblclick="{bind source=_window path=toggleMaximize}">\
	    <span data-on-click="{bind source=_window path=closeWindow}">close</span>|<span data-bind-text="{bind source=_window path=$caption}"></span>\
	  </div>\
	  <div data-key="_client" style="position: relative;overflow: auto;"></div>\
	</div>')});