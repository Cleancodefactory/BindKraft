CompileTime.Tasks.add("completion", function() {
	var classes = Class.implementors("BaseWindow");
	if (classes != null) {
		for (var i = 0; i < classes.length; i++) {
			var classDef = Class.getClassDef(classes[i]);
			for (var k in classDef.prototype) {
				if (typeof k == "string" && k.indexOf("on_") == 0) {
					var msgtype = k.slice(3);
					var found = false;
					for (var j = 0; j < WindowEventEnums.length; j++) {
						var e = WindowEventEnums[j];
						if (e[msgtype] == msgtype) {
							found = true;
							continue;
						}
					}
					if (!found) CompileTime.warn("The implicit window message handler " + k + " declared in " + classes[i] + " may not work because windowing event with name " + msgtype + " was not found. If this is a custom windowing event from custom enum register the enum with WindowEventEnums.push(yourenum) to remove this warning.");
				}
			}
		}
	}
});
