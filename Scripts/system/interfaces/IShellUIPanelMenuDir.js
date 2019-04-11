/**
	Representes a shell panel showing a directory in the shellfs:
*/
function IShellUIPanelMenuDir() {}
IShellUIPanelMenuDir.Interface("IShellUIPanelMenuDir", "IShellUIPanel");
IShellUIPanelMenuDir.prototype.ShGetDir = function() { throw "not implemented"; }
IShellUIPanelMenuDir.prototype.ShSetDir = function(v) { throw "not implemented"; }
/**
	Called without arguments returns the current state
	@param level 	{integer}	starts from 0 (no subdirs). May be supported or not up to any level.
*/
IShellUIPanelMenuDir.prototype.ShShowSubDirs = function(level) { throw "not implemented"; }