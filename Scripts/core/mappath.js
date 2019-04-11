


// Call with: /Content/Images/myimage.png
function mapPath(sIn) {
    var s = sIn;
    if (s != null) {
        s = (s.charAt(0) == "/") ? s : "/" + s;
    } else {
        return s;
    }
    if (g_ApplicationBasePath != null && g_ApplicationBasePath.length > 0) {
        if (g_ApplicationBasePath == "/") return s;
        if (s.indexOf(g_ApplicationBasePath) == 0) return s;
		if (g_ApplicationBasePath.charAt(g_ApplicationBasePath.length - 1) == "/") {
			return g_ApplicationBasePath.slice(0,g_ApplicationBasePath.length - 1) + s;
		}
        return g_ApplicationBasePath + s;
    } else {
        return s;
    }
};