/*
	Startup synchronous tasks, excuted immediately after sysconfig.js
	This file execs after the bare minimum of configuration is initialized in case it is needed
	
*/
// Deal with the workspace base URL and path
/*
	This is executed early
*/
(function(w) {
	CompileTime.info("(sysstartup.js) determining on load time the base path of the page.");
	var loc = new BKUrl();
	var locBase = null;
	var locStart = null;
	// The initial URL is remembered as string for further use later.
	w.g_ApplicationStartFullUrl = location.href;
	if (!loc.readAsString(location.href)) {
		CompileTime.err("(sysstartup.js) cannot read startup location.");
	} else {
		locBase = loc.get_baseUrl();
		locStart = loc.get_pathUrl();
	}
	// Set the global g_ApplicationStartUrl variable
	if (locStart != null) {
		//var enc = locBase.get_encode();
		//locStart.set_encode(false);
		w.g_ApplicationStartUrl = locStart.composeAsString(); // Unencoded start URL - up to the path
		CompileTime.info("(sysstartup.js) g_ApplicationStartUrl has been set to " + w.g_ApplicationStartUrl);
		//locStart.set_encode(enc);
	}
	
	if (typeof w.g_ApplicationBasePath == "string" && w.g_ApplicationBasePath.length > 0) {
		//apppath = w.g_ApplicationBasePath;
		CompileTime.info("(sysstartup.js) g_ApplicationBasePath exists with value of '" + w.g_ApplicationBasePath + "'.");
		if (window.JBCoreConstants.AlwaysCalcBasePath) {
			if (locBase != null) {
				w.g_ApplicationBasePath = locBase.get_path().composeAsString();
				CompileTime.info("(sysstartup.js) g_ApplicationBasePath is now set to '" + w.g_ApplicationBasePath + "'.");
				
			} else {
				CompileTime.warn("(sysstartup.js) g_ApplicationBasePath cannot be set from the initial location " + location.href);
			}
		}
	} else {
		if (locBase != null) {
			w.g_ApplicationBasePath = locBase.get_path().composeAsString();
			CompileTime.info("(sysstartup.js) g_ApplicationBasePath was missing and is now set to '" + w.g_ApplicationBasePath + "'.");
		} else {
			CompileTime.err("(sysstartup.js) g_ApplicationBasePath is missing and cannot be set from the initial location " + location.href);
		}
	}
	// Update page base unless turned off
	if (!window.JBCoreConstants.DontSetPageBase) {
		if (locBase != null) {
			var bases = document.getElementsByTagName("base");
			var base = null;
			if (bases.length > 0) {
				base = bases[0]; // Specs say first matters
			}
			if (base == null) {
				// None is available - create one and put in the head
				base = document.createElement("base");
				document.head.appendChild(base);
			}
			base.href = w.g_ApplicationBasePath; // locBase.composeAsString();
			CompileTime.info("(sysstartup.js) base element updated with href=" + base.href);
		}
	}	
	if (window.JBCoreConstants.LastErrorConsoleLog) {
		console.log("Enabling logging to console of the LASTERROR");
		BaseObject.LASTERROR().subscribe(function(le) {
			if (le.code() != 0) {
				console.warn("LastError set to:" + le.code() + ", " + le.text());
			} else {
				console.log("LastError set to:" + le.code() + ", " + le.text());
			}
		});
	}
})(window);