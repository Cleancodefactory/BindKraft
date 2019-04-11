/**
	Represents a panel of the Shell UI
	See the extending interfaces for the panel types.
*/
function IShellUIPanel() { }
IShellUIPanel.Interface("IShellUIPanel");

IShellUIPanel.prototype.ShGetPanelName = function() { throw "not implemented"; }
/**
	Remove this panel from its container (depending on the implementation some may be non-removable)
*/
IShellUIPanel.prototype.ShRemove = function() { throw "not implemented"; }
IShellUIPanel.prototype.ShShowPanel = function(bshowhide) { throw "not implemented"; }
/**
	Collapses the panel if supported and possible. Can be implemented to duplicate ShShowPanel
*/
IShellUIPanel.prototype.ShCollapsePanel = function(bcollapse) { throw "not implemented"; }