(function(){


    /**
     * Various tools for the memfs
     */
    function MemFSTools() {
        BaseObject.apply(this, arguments);
    }
    MemFSTools.Inherit(BaseObject, "MemFSTools");


    MemFSTools.prototype.$splitDir = function(dir) {
        var arr = /^(?:([^:]+):)?([^:.]*)?$/.exec(dir);
        if (Array.isArray(arr)) {
            return { fs: arr[1] || null, path: arr[2] || null };
        }
        return null;
    }

    //#region Path analysis
    MemFSTools.prototype.fsnameOf = function(path) {
        var info = this.$splitDir(path);
        if (info != null && info.fs.length > 0) {
            return info.fs;
        }
        return null;
    }
    MemFSTools.prototype.nameOf = function(path) {
        var info = this.$splitDir(path);
        var MemoryFSDirectory = Class("MemoryFSDirectory");
        if (info != null) {
            if (info.path != null) return MemoryFSDirectory.prototype.nameof(info.path);
        }
        return null;
    }
    MemFSTools.prototype.pathOf = function(path) {
        var info = this.$splitDir(path);
        var MemoryFSDirectory = Class("MemoryFSDirectory");
        if (info != null) {
            if (info.path != null) return MemoryFSDirectory.prototype.pathof(info.path);
        }
        return null;
    }
    MemFSTools.prototype.pathInfo = function(path) {
        var info = {
            fs: this.fsnameOf(path),
            path: this.pathOf(path),
            name: this.nameOf(path),
            fullpath: null,
            update: function() {
                if (this.fs != null && this.path != null) {
                    this.fullpath = this.fs + ":" + this.path;
                } else {
                    this.fullpath = null;
                }
            }
        }
        
        return info;
    }
    //#endregion

    //#region Open/access directories
    MemFSTools.prototype.getFS = function(fs) { 
        return Registers.Default().getRegister(fs);
    }
    /**
     * Opens a directory from a full path (containing fs and path). Honours the name part and opens only the path part
     * Examples:
     *   d1 = mft.openDir("appfs:/myapp/file1") // will open appfs:/myapp directory
     */
    MemFSTools.prototype.openDir = function(dir) {
        var info = this.$splitDir(dir);
        if (info != null) {
            var dir = null;
            if (info.fs != null) {
                dir = this.getFS(info.fs);
            }
            if (info.path != null) {
                var p = this.pathOf(info.path);
                if (p != null) dir = dir.cd(p);
            }
            return dir;
        }
        return null;
    }
    MemFSTools.prototype.openFile = function(path) {
        var info = this.$splitDir(path);
        if (info != null) {
            var dir = null;
            if (info.fs != null) {
                dir = this.getFS(info.fs);
            }
            if (info.path != null) {
                var p = this.pathOf(info.path);
                if (p != null) dir = dir.cd(p);
            }
            if (dir != null) {
                return dir.item(this.nameOf(info.path));
            }
            return null;
        }
        return null;
    }

    MemFSTools.prototype.executeInContext = function(path, context, constants ) {
        var info = this.pathInfo(path);
        if (info.fs == null) {
            info.fs = "bootfs";
            info.update();
        }
        var path = this.openDir(info.fullpath);
        if (path == null) return Opration.Failed("Cannot find the directory");
        if (info.name != null) {
            var item = path.item(info.name);
            if (BaseObject.is(item, "CLScript")) {

            }
        } else {
            return Operation.From(path); // execution results in open directory
        }
    }

    /**
     * See execute in context.
     */
    MemFSTools.prototype.executeInContext = function(path, context, constants ) {
        var d = this.$splitDir(dir);
        if (d.fs == null) {
            d.fs = "bootfs";
        }
        var fs = this.getFS(d.fs);
        if (fs == null) { 
            return Operation.Failed("Filesystem not found");
        }
        var dir = null;
        if (d.path == null || d.path.length == 0) {
            dir = fs;
        } else {
            // has path
            var _path = fs.pathof(d.path);
            if (_path.length > 0)
            dir = fs.cd(_path);
            var _name = fs.nameof(d.path);

        }
////////////////////////////////

        if (d.fs != null && d.path != null && d.path.length > 0) {
            var fs = this.getFS(d.fs);
            if (fs != null) {
                var name = fs.nameof(d.path);
                var path = fs.pathof(d.path);
                path
            }
        }
    }

    /**
     * Executes a file (if and as possible) in the context of its location 
     * and name with the specified command context.
     * 
     * @param {MemorySFDirectory} dir - the directory containing the file
     * @param {String} filename - the name of the file
     * @param {ICommandContext} - the execution context
     * @param {object} constants - Any additional constants
     * 
     * Reserved constants (replaced by the method if provided):
     * executed {string} - the name of the file being executed
     * path {string} - the path of the dir (if known or null otherwise)
     */
    MemFSTools.prototype.executeInContext = function(dir, filename, context, constants) {

    }
    /**
     * Executes a file (if and as possible) in the context of its location and name
     * 
     * @param {MemorySFDirectory} dir - the directory containing the file
     * @param {String} filename - the name of the file
     * @param {object} constants - Any additional constants
     * 
     * Reserved constants (replaced by the method if provided):
     * executed {string} - the name of the file being executed
     * path {string} - the path of the dir (if known or null otherwise)
     */
     MemFSTools.prototype.execute = function(dir, filename, constants) {

    }
    


})();