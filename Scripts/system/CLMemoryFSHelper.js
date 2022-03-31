/**
	This class provides syntax sugar and useful services over a MemoryFSDirectory and its subdirs
*/
function CLMemoryFSHelper(memfs, runner) {
	BaseObject.apply(this,arguments);
	this.$fs = memfs;
	this.$runner = runner || "Commander";
	if (!BaseObject.is(memfs, "MemoryFSDirectory")) throw "MemoryFSHelper must be initialized with a valid MemoryFSDirectory";
}
CLMemoryFSHelper.Inherit(BaseObject,"CLMemoryFSHelper");
CLMemoryFSHelper.prototype.writeMasterBoot = function(script) {
	this.$fs.register("boot", new CLScript(script,this.$runner));
}
CLMemoryFSHelper.prototype.writeScript = function(path, script) {
	
	var dir = this.$fs.mkdir(this.$fs.pathof(path));
	if (dir != null) {
		dir.register(this.$fs.nameof(path), new CLScript(script,this.$runner));
	}
}
CLMemoryFSHelper.prototype.readScript = function(path) {
	var dir = this.$fs.cd(this.$fs.pathof(path));
	if (dir != null) {
		try {
		var item = dir.item(this.$fs.nameof(path));
			if (item != null) {
				if (BaseObject.is(item, "CLScript")) {
					return item.get_script();
				}
			}
			return null;
		} catch(e) {
			return null;
		}
	}
	return null;
}