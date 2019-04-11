/**
	Represents a shell UI panel container for other panels.
*/
function IShellUIPanelContainer() {}
IShellUIPanelContainer.Interface("IShellUIPanelContainer","IShellUIPanel");
/**
	Adds (if supported and possible at the time of calling) a new panel
*/
IShellUIPanelContainer.prototype.ShAddPanel = function(paneltype, name) { throw "not implemented"; }
/**
	Returns the contained panels.
*/
IShellUIPanelContainer.prototype.ShGetPanels = function() { throw "not implemented"; }

