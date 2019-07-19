/**
	Interfaces that must be implemented by "app indicators". App indicators are small components that should have their own templates 
	carefuly designed to easilly to fit into small spaces (see docs for design guidelines). Their purpose is to communicate with another 
	app/apps and show some extract of information inside slots residing in different apps (most often the shell, but not exclusively).
*/
function IAppIndicator() {}
IAppIndicator.Interface("IAppIndicator");
// Implementation can be empty, but it is recommended to explicitly disconnect from any apps/api and not count on the
// obliteration to do so
IAppIndicator.prototype.unPlug = function() { throw "not impl.";}
/** 
	Optional, but de facto required in any AppIndicator that wants to fit almost anywhere.
	sizetype is from the AppIndicatorSizeTypeEnum
	
	@param sizetype {AppIndicatorSizeTypeEnum}  unit sizeToContent
	@param rect 	{Rect} 						Actual size of the unit
	@param maxunits {Integer}					Max units that the host is willing to give
	
	@returns {Integer}	The number of units the indicator wants. Non-numeric values will resolve to 1, lesser than 1 and greater than maxunits will
						be adjusted to 1 and maxunits respectively
*/
IAppIndicator.prototype.setSize = function(sizetype, rect, maxunits) { }
// Optional methods
IAppIndicator.prototype.plug = function() { }
IAppIndicator.prototype.pause = function() { }
IAppIndicator.prototype.unPause = function() { }
