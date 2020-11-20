/**
 * Advanced application state interface with options for future extensions - check the version comments
 * Version 0 changes only the behavior of the HistoryTracker's pushHistoryState. It asks back and if the app supports
 * IApplicationState2 and version is greater than 0 the url is not auto formatted
 * 
 * 
 */

function IApplicationState2() {}
IApplicationState2.Interface("IApplicationState2", "IApplicationState");
IApplicationState2.RequiredTypes('IAppBase');
// Version 0
IApplicationState2.prototype.get_appstateversion = function() { return 0;  };
// Version ?