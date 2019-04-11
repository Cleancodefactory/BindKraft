/**
	The standard implementation all file-like acting stuff has to implement
	
	TODO: Work with memory files will require handle and closing in order to track changes!
			Delete this when this is done (involves additional API)
*/
function IMemoryFileImpl() {
	this.set_filedatemodified();
}
IMemoryFileImpl.InterfaceImpl(IMemoryFile);
IMemoryFileImpl.Initialize();
// Last time canged or saved to the memory location
IMemoryFileImpl.prototype.$filedatemodified = null;
IMemoryFileImpl.prototype.get_filedatemodified = function() { 
	return this.$filedatemodified;
}
IMemoryFileImpl.prototype.set_filedatemodified = function(v) { 
	if (v == null) {
		this.$filedatemodified = new Date();
	} else {
		var d = null;
		if (typeof dt == "number") {
			d = new Date(dt);
		} else if (typeof dt == "string") {
			d = new Date(dt);
		} else if (dt instanceof Date) {
			d = new Date(dt.getYear(), dt.getMonth(), dt.getDate(),dt.getHours(),dt.getMinutes(),dt.getSeconds());
		}
		if (dt != null) {
			this.$filedatemodified = dt;
		}
	}
}
// The original content creation date (optional)
IMemoryFileImpl.prototype.$filedatecreated = null;
IMemoryFileImpl.prototype.get_filedatecreated = function() { 
	return this.$filedatecreated;
}
IMemoryFileImpl.prototype.set_filedatecreated = function(dt) { 
	var d = null;
	if (typeof dt == "number") {
		d = new Date(dt);
	} else if (typeof dt == "string") {
		d = new Date(dt);
	} else if (dt instanceof Date) {
		d = new Date(dt.getYear(), dt.getMonth(), dt.getDate(),dt.getHours(),dt.getMinutes(),dt.getSeconds());
	}
	this.$filedatecreated = dt;
}
IMemoryFileImpl.prototype.touch = function() {
	this.set_filedatemodified(null);
}
IMemoryFileImpl.prototype.$memfileflags = 0;
IMemoryFileImpl.prototype.setMemFileFlags = function(fs) { 
	var flags = (typeof this.$memfileflags == "number")?this.$memfileflags:0;
	if (typeof fs == "number") {
		this.$memfileflags = flags | fs;
	}
}
IMemoryFileImpl.prototype.resetMemFileFlags = function(fs) { 
	var flags = (typeof this.$memfileflags == "number")?this.$memfileflags:0;
	if (typeof fs == "number") {
		this.$memfileflags = flags & (fs ^ 0xFFFFFFFF);
	}
}
IMemoryFileImpl.prototype.getMemFileFlags = function() { 
	var flags = (typeof this.$memfileflags == "number")?this.$memfileflags:0;
	return flags;
}
IMemoryFileImpl.prototype.checkMemFileFlags = function(fs) { 
	var flags = (typeof this.$memfileflags == "number")?this.$memfileflags:0;
	if (typeof fs == "number") {
		return (flags & fs);
	}
	return 0;
}



