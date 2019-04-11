/*
	Interface for memory files with content that can be set or obtained with a single call.
	These kind of "files" can be loaded from original source fully (through other interfaces).
	
	The members of this interface must not change the date/time or flags of the file if restore mode is on.
*/
function IMemoryFileContent() {}
IMemoryFileContent.Interface("IMemoryFileContent");
IMemoryFileContent.RequiredTypes("IMemoryFile");

// When this property is true thr $content and $contenttype must not change the times and flags of the file!
IMemoryFileContent.prototype.set_restoremode = function(v) { throw "not implemented"; }
IMemoryFileContent.prototype.get_restoremode = function() { throw "not implemented"; }

IMemoryFileContent.prototype.get_content = function() { throw "not implemented"; }
IMemoryFileContent.prototype.set_content = function(v) { throw "not implemented"; }

IMemoryFileContent.prototype.get_contenttype = function() { throw "not implemented"; }
IMemoryFileContent.prototype.set_contenttype = function(v) { throw "not implemented"; }

/*
	Ideas - mode encapsulator wrapper may be a good thing!
*/