function BkInit_AppData(appdir) {
	BkInit_FSBase.apply(this, "appfs", appdir);
}
BkInit_AppData.Inherit(BkInit_FSBase, "BkInit_AppData");
BkInit_AppData.prototype.content = function(filename, contentType, content) {
	var f = this.$fs.item(filename);
	if (BaseObject.is(f, "ContentMemoryFile")) {
		// Update
		f.set_content(content);
		f.set_contenttype(contentType);
	} else {
		// Add/replace
		f = new ContentMemoryFile(contentType, content);
		this.$fs.register(filename, f);
	}
}
BkInit_AppData.prototype.newContent = function(filename, contentType, content) {
		// Add/replace
		f = new ContentMemoryFile(contentType, content);
		this.$fs.register(filename, f);
}
BkInit_AppData.prototype.object = function(filename, content) {
		if (!BaseObject.is(content, "object")) throw "The content is not an object";
		// Add/replace
		f = new ContentMemoryFile("memory/object", content);
		this.$fs.register(filename, f);
}
