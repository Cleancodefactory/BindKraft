(function(){var IMediaQueryNotificator=Interface("IMediaQueryNotificator");function IMediaQueryTracker(){}IMediaQueryTracker.Interface("IMediaQueryTracker","IManagedInterface");IMediaQueryTracker.prototype.checkQuery=function(name){throw"not implemented";};IMediaQueryTracker.prototype.exists=function(name){throw"not implemented";};IMediaQueryTracker.prototype.add=function(name,query){throw"not implemented";};IMediaQueryTracker.prototype.remove=function(name){throw"not implemented";};IMediaQueryTracker.prototype.clear=function(){throw"not implemented";};IMediaQueryTracker.prototype.queryChange=function(force){throw"not implemented";};IMediaQueryTracker.prototype.addNotificator=function(name,condition,type){throw"not implemented";}.ReturnType(IMediaQueryNotificator);IMediaQueryTracker.prototype.removeNotificator=function(name){throw"not implemented";};IMediaQueryTracker.prototype.removeAllNotificators=function(){throw"not implemented";};IMediaQueryTracker.prototype.getNotifcator=function(name){throw"not implemented";}.ReturnType(IMediaQueryNotificator);IMediaQueryTracker.prototype.askNotificator=function(name){throw"not implemented";};})();