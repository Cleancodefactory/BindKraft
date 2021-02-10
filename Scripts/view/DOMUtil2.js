/**
 * Continues DOMUtil, but is included a bit later to allow access more view classes in the functions defined here
 * 
 */

/// Global tools
DOMUtil.browserViewPortSize = function() {
	// Code taken from utilities.js
	var viewportwidth;
    var viewportheight;
	var GSize = Class("GSize");

    // the more standards compliant browsers (mozilla/netscape/opera/IE7) use window.innerWidth and window.innerHeight
    if (typeof window.innerWidth != 'undefined') {
        viewportwidth = parseFloat(window.innerWidth);
        viewportheight = parseFloat(window.innerHeight);
    }

    // IE6 in standards compliant mode (i.e. with a valid doctype as the first line in the document)
    else if (typeof document.documentElement != 'undefined'
     && typeof document.documentElement.clientWidth !=
     'undefined' && document.documentElement.clientWidth != 0) {
        viewportwidth = parseFloat(document.documentElement.clientWidth);
        viewportheight = parseFloat(document.documentElement.clientHeight);
    }
    // older versions of IE
    else {
        viewportwidth = parseFloat(document.getElementsByTagName('body')[0].clientWidth);
        viewportheight = parseFloat(document.getElementsByTagName('body')[0].clientHeight);
	}
	return new GSize(viewportwidth, viewportheight);
}