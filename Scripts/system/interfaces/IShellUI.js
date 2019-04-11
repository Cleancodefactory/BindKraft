/*
	UI Shell base interface - exposable as Local API
*/
function IShellUI() { }
IShellUI.Interface("IShellUI");

/**
	Returns an array of IShellUIPanel currently available - flattents the hierarchy.
	@param [filter] 	{callback|string|index}	callback: bool function(IShellUIPanel panel);
											string:	  the panel name (not guaranteed to be unique
											index:	  index of the panel - the index in the returned unfiltered array
	@param [bfirst]		bool				if true only the first panel (matching the filter if filter is supplied) is returned not packed in an array
*/
IShellUI.prototype.ShGetPanels = function(filter, bfirst) { throw "not implemented"; }
/**
	Get all top level panels
*/
IShellUI.prototype.ShGetTopLevelPanels = function() { throw "not implemented"; }
/**
	Can do nothing. Refreshes the UI, recommended to reload/reread shown data.
*/
IShellUI.prototype.ShRefresh = function() { throw "not implemented"; }
// The special ones - have to be supported even if some are missing
/**
	Gets a tray panel.
	@param [level]	integer  If supplied specifies the panel importance - primary, secondary etc. 0 - primary, 1 - secondary,...
							 Primary assumed if omitted. The Shell decides if some can be merged - when to return a replacement or null.
*/
IShellUI.prototype.ShGetTrayPanel = function(level) { throw "not implemented"; }