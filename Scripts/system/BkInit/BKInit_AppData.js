function BkInit_AppData(appdir) {
	BkInit_FSBase.call(this, "appfs", appdir);
}
BkInit_AppData.Inherit(BkInit_FSBase, "BkInit_AppData");
BkInit_AppData.prototype.folder = function(dir) {
	var x = this.$dir.mkdir(dir);
	if (x == null) {
		throw "Cannot create/check for existence the directory " + dir;
	}
}
BkInit_AppData.prototype.content = function(filename, contentType, content) {
	var f = this.$dir.item(filename);
	if (BaseObject.is(f, "ContentMemoryFile")) {
		// Update
		f.set_content(content);
		f.set_contenttype(contentType);
	} else {
		// Add/replace
		f = new ContentMemoryFile(contentType, content);
		this.$dir.register(filename, f);
	}
}
BkInit_AppData.prototype.newContent = function(filename, contentType, content) {
		// Add/replace
		var f = new ContentMemoryFile(contentType, content);
		this.$dir.register(filename, f);
}
BkInit_AppData.prototype.object = function(filename, content) {
		if (!BaseObject.is(content, "object")) throw "The content is not an object";
		// Add/replace
		var f = new ContentMemoryFile("memory/object", content);
		this.$dir.register(filename, f);
}
