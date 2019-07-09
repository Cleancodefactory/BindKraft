/**
	Marks the object as saveable it Memory FS
*/
function IMemoryFile() {}
IMemoryFile.Interface("IMemoryFile");
// Last time canged or saved to the memory location
IMemoryFile.prototype.get_filedatemodified = function() { throw "not impl";}
IMemoryFile.prototype.set_filedatemodified = function() { throw "not impl";}
// The original content creation date (optional)
IMemoryFile.prototype.get_filedatecreated = function() { throw "not impl";}
IMemoryFile.prototype.set_filedatecreated = function(dt) { throw "not impl";}
IMemoryFile.prototype.touch = function() { throw "not impl" }
IMemoryFile.prototype.setMemFileFlags = function(fs) { throw "not impl";}
IMemoryFile.prototype.resetMemFileFlags = function(fs) { throw "not impl";}
IMemoryFile.prototype.getMemFileFlags = function() { throw "not impl";}
IMemoryFile.prototype.checkMemFileFlags = function(fs) { throw "not impl";}


