/**
	If you want to keep a memort FS as a IRegister - create with the name of the register (serves as FS name as well)
	
	TODO: This class needs refactoring - instead of inheriting DictoList it should be separated and used as a private member (the direct access to methods makes it harder to maintain the finer abstractions)
	
	Please do not use any visible DictoList members to keep your code compatible with the planned changes
*/
function MemoryFSDirectory(regname) {
	DictoList.call(this,new TypeChecker("IMemoryFile"));
	this.set_allowkeyless(false);
	this.set_keypattern("^[a-zA-Z0-9-_\\$ ]+$");
	this.$registername = regname;
}
MemoryFSDirectory.Inherit(DictoList,"MemoryFSDirectory");
MemoryFSDirectory.Implement(IMemoryDirectoryImpl);
MemoryFSDirectory.Implement(IRegister);
// MemoryFSDirectory
MemoryFSDirectory.prototype.changedevent = new InitializeEvent("Fired when directory changes: add,remove item,subdir. Changes in subdirs are not cascaded to this one");

// 	+Tasks
// callback: function(directory, eventname, data) - return explicit false to indicate failure (not tracked for now)
MemoryFSDirectory.prototype.$tasks = new InitializeObject("Place for registered tasks")
MemoryFSDirectory.prototype.registerTask = function(taskname, eventname, callback) {
	if (!PatternChecker.IdentName.checkValue(taskname)) {
		this.LASTERROR(_Errors.compose(),"task name not allowed");
		return false;
	}
	if (BaseObject.isCallback(callback)) {
		if (this.$tasks == null) this.$tasks = {};
		if (this.$tasks[taskname] == null) {
			this.$tasks[tasknane] = {
				task: callback,
				event: eventname
			}
		} else {
			this.LASTERROR(_Errors.compose(),"name in use");
		}
	}
	return false;
}
MemoryFSDirectory.prototype.removeTask = function(taskname) {
	if (this.$tasks == null) return;
	if (this.$tasks[taskname] != null) {
		this.$tasks[taskname] = null;
		delete this.$tasks[taskname];
	}
}
MemoryFSDirectory.prototype.runTask = function(taskname, eventname, data) {
	if (this.$tasks == null) return;
	if (this.$tasks[taskname] != null && BaseObject.isCallback(this.$tasks[taskname].task)) {
		BaseObject.callCallback(this.$tasks[taskname].task, eventname || this.$tasks[taskname].event, data);
	}
}.Description("Runs the task by name. If eventname and/or data are specified they are passed to the task.");
MemoryFSDirectory.prototype.triggerTasks = function(eventname, data) {
	if (this.$tasks == null) return;
	for (var k in this.$tasks) {
		if (!this.$tasks.hasOwnProperty(k)) continue;
		var task = this$tasks[k];
		if (task.event == eventname && BaseObject.isCallback(task.task)) {
			BaseObject.callCallback(this.$tasks[taskname].task, eventname, data);
		}
	}
}.Description("Triggers tasks registered for the specified eventname with the passed data")
	.Param("eventname","Event for which to trigger tasks");
// -Tasks


MemoryFSDirectory.prototype.$parentdirectory = null;
MemoryFSDirectory.prototype.get_parentdirectory = function() {
	return this.$parentdirectory;
}
MemoryFSDirectory.prototype.$set_parentdirectory = function(v) {
	if (v != null && !BaseObject.is(v, "MemoryFSDirectory")) throw "Parent directory has to be MemoryFSDirectory object";
	this.$parentdirectory = v;
}
MemoryFSDirectory.prototype.cd = function(path) {
	if (typeof path == "string") {
		if (path == ".") return this;
		if (path == "..") return this.get_parentdirectory();
		var parts = path.split("/");
		var parts = parts.Select(function(idx, item) {
			if (item != null && item.length > 0) {
				return item;
			}
			return null;
		});
		if (parts != null && parts.length > 0) {
			var newdir = this;
			for (var i = 0; i < parts.length; i++) {
				newdir = newdir.get(parts[i]);
				if (!BaseObject.is(newdir, "MemoryFSDirectory")) return null;
			}
			return newdir;
		} else {
			return null;
		}
	} else if (BaseObject.is(path, "Array")) {
		var d = this;
		for (var i = 0; i < path.length; i++) {
			d = d.get(path[i]);
			if (!BaseObject.is(d, "MemoryFSDirectory")) return null;
		}
		return d;
	}
	return null;
}
MemoryFSDirectory.prototype.mkdir = function(path, typechecker, specialclass) {
	var newdirtypename = specialclass || "MemoryFSDirectory";
	var newdirtype = Class.getClassDef(newdirtypename);
	if (typeof path == "string") {
		var parts = path.split("/");
		var parts = parts.Select(function(idx, item) {
			if (item != null && item.length > 0) {
				return item;
			}
			return null;
		});
		if (parts != null && parts.length > 0) {
			var dir,newdir = this;
			for (var i = 0; i < parts.length; i++) {
				dir = newdir.get(parts[i]);
				if (dir == null) {
					dir = new newdirtype();
					if (BaseObject.is(typechecker, "TypeChecker")) {
						dir.set_typecheck(typechecker);
					}
					newdir.add(parts[i],dir);
					dir.$set_parentdirectory(newdir);
					newdir = dir;
				} else if (BaseObject.is(newdir, "MemoryFSDirectory")) {
					newdir = dir;
					continue;
				} else {
					throw "Non directory entry with name " + parts[i] + " exist in the given path";
				}				
			}
			return newdir;
		} else {
			return null;
		}
	}
	return null;
}
MemoryFSDirectory.prototype.rmdir = function(path) {
	// TODO: Later
	/*
	if (typeof path == "string") {
		var parts = path.split("/");
		var parts = parts.Select(function(idx, item) {
			if (item != null && item.length > 0) {
				return item;
			}
			return null;
		});
		if (parts != null && parts.length > 0) {
			var nd = null;
			var cur = this;
			for (var i = 0; i < parts.length; i++) {
				nd = cur.get(parts[i]);
				
			}
		}
	}
	return 0;
	*/
}
/**
 * Implemented as instance method for easier usage, technically a static method.
 * Extracts the path without the name from the passed full path.
 * 
 * @param {String} key - full path (without fs)
 * 
 */
MemoryFSDirectory.prototype.pathof = function(key) {
	if (typeof key == "string") {
		var parts = key.split("/");
		var endSlash = false;
		parts = parts.Select(function(idx, item) {
			if (item != null && item.length > 0) {
				return item;
			} else if (idx == parts.length - 1) {
				endSlash = true;
			}
			return null;
		});
		if (!endSlash) {
			var name = parts.pop();
		}
		return parts.join("/");
	} else {
		return null;
	}
}
/**
 * Technically a static method implemented as instance one for easier usage
 * Extracts the name part pf the passed path. The name is the last part after the last slash.
 * 
 * @param {String} key - a full path starting with "/"
 * @return {String|null} - the name or null if there is no name in the path. Null is also returned when the passed parameter is not a string.
 */
MemoryFSDirectory.prototype.nameof = function(key) {
	if (typeof key == "string") {
		var parts = key.split("/");
		var endSlash = false;
		parts = parts.Select(function(idx, item) {
			if (item != null && item.length > 0) {
				return item;
			} else if (idx == parts.length - 1) {
				endSlash = true;
			}
			return null;
		});
		if (!endSlash) {
			return parts.pop();
		}
		return null;
	} else {
		return null;
	}
}
MemoryFSDirectory.prototype.put = function(path, item) {
	this.register(key,item);
}
MemoryFSDirectory.prototype.get_contents = function() {
	return this.get_keyvalues();
}
MemoryFSDirectory.prototype.$contentsstrip = function(idx, item) {
	if (item != null) {
		if (BaseObject.is(item.value,"IMemoryFile")) {
			return item.value;
		}
	}
	return null;
}
MemoryFSDirectory.prototype.contents = function(filter) {
	return this.filterItems(filter);
}.Returns(" returns array of { key: filenam, value: file_or_dir }");
MemoryFSDirectory.prototype.get_directories = function() {
	return this.contents(new TypeChecker("MemoryFSDirectory"));
}.Returns(" returns array of { key: filenam, value: dir }");
MemoryFSDirectory.prototype.get_files = function() {
	return this.contents(new TypeChecker("!MemoryFSDirectory"));
}.Returns(" returns array of { key: filenam, value: file }");
// IRegister
MemoryFSDirectory.prototype.$registername = null;
MemoryFSDirectory.prototype.get_registername = function() { 
	return this.$registername;
}
MemoryFSDirectory.prototype.register = function(key, item) {
	if (typeof key == "string") {
		var parts = key.split("/");
		parts = parts.Select(function(idx, item) {
			if (item != null && item.length > 0) {
				return item;
			}
			return null;
		});
		var newname = parts.pop();
		if (newname != null && newname.length > 0) {
			var dir = this.cd(parts);
			if (dir != null) {
				if (BaseObject.is(item,"IMemoryFile")) {
					var n = dir.set(newname,item);
					if (n < 0) throw "Cannot save the item here";
					if (BaseObject.is(item, "MemoryFSDirectory")) {
						item.set_parentdirectory(dir);
					}
					return true;
				} else {
					this.LASTERROR(_Errors.compose(false,1,GeneralCodesFlags.NotAllowed),"The item saved in memory FS has to implement IMemoryFile, but this one doesn't", "register");
					// throw "The item saved in memory FS has to implement IMemoryFile, but this one doesn't";
				}
			} else {
				this.LASTERROR(_Errors.compose(false,1,GeneralCodesFlags.NotFound),"Cannot find the specified path " + parts.join("/"), "register");
				// throw "Cannot find the specified path " + parts.join("/");
			}
		} else {
			this.LASTERROR(_Errors.compose(false,1,GeneralCodesFlags.Argument),"Cannot determine new object's name from the specified path", "register");
			// throw "Cannot determine new object's name from the specified path";
		}
	} else {
		this.LASTERROR(_Errors.compose(false,1,GeneralCodesFlags.Argument),"key has to be a string", "register");
		// throw "key has to be a string";
	}
};
MemoryFSDirectory.prototype.unregister = function(key, /*optional*/ item) { 
	this.remove(key);
 };
MemoryFSDirectory.prototype.item = function(key, /*optional*/ aspect) { 
	if (typeof key == "string") {
		var parts = key.split("/");
		parts = parts.Select(function(idx, item) {
			if (item != null && item.length > 0) {
				return item;
			}
			return null;
		});
		var name = parts.pop();
		if (name != null && name.length > 0) {
			var dir = this.cd(parts);
			if (dir != null) {
				var thingy = dir.get(name);
				if (thingy != null) {
					// TODO: Check aspect and return thingy if it matches it (file/directory may be evenmore detailed check)
					return thingy;
				} else {
					return null;
					// throw "The requested item has not been found";
				}
			} else {
				this.LASTERROR(_Errors.compose(false,1,GeneralCodesFlags.NotFound),"Cannot find the specified path " + parts.join("/"), "item");
				// throw "Cannot find the specified path " + parts.join("/");
			}
		} else {
			this.LASTERROR(_Errors.compose(false,1,GeneralCodesFlags.Argument),"Cannot determine new object's name from the specified path", "item");
			// throw "Cannot determine new object's name from the specified path";
		}
	} else {
		this.LASTERROR(_Errors.compose(false,1,GeneralCodesFlags.Argument),"key has to be a string", "item");
		// throw "key has to be a string";
	}
	return null;
};
MemoryFSDirectory.prototype.exists = function(key) { 
	// TODO: Implplement it more efficiently
	var thingy = this.item(key);
	if (thingy != null) return true;
	return false;
};
