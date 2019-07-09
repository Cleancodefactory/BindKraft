/**
	This interface only indicates the state of the file, the persistence is external and will use the interface to reflect its actions over the file
*/
function IMemoryFilePersistable() {}
IMemoryFilePersistable.Interface("IMemoryFilePersistable");
IMemoryFilePersistable.RequiredTypes("IMemoryFile");

IMemoryFilePersistable.prototype.get_available = function() { throw "not impls"; }	
IMemoryFilePersistable.prototype.set_available = function(v) { throw "not impls"; }	

IMemoryFilePersistable.prototype.get_dirty = function() { throw "not impls"; }	
IMemoryFilePersistable.prototype.set_dirty = function(v) { throw "not impls"; }	