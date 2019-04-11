// A little polifilling just in case - very few things are deeply used, most just avoid crashes.

// +These should never happen
if (!window.HTMLCollection) {
	window.HTMLCollection = {};
}
if (!window.NodeList) {
	window.NodeList = {};
}
// -These should never happen

// +Element.matches
/*
	!In Edge (with EdgeHTML - not the blink) closest will return null for unattached just created element
	
	// Checks if the element matches the selector
	Element.prototype.matches(<CSSselector>)
	// Applies matches on self and parents recursively until success or returns null if no match is found ever.
	Element.prototype.closest(<CSSselector>)
	
*/
(function(w) {
	if (!w.Element.prototype.matches) {
	  w.Element.prototype.matches = Element.prototype.msMatchesSelector || 
								  Element.prototype.webkitMatchesSelector ||
								  Element.prototype.mozMatchesSelector ||
								  Element.prototype.oMatchesSelector;
	  if (!w.Element.prototype.matches) {
		  if (window.console) {
			window.console.log("Fatal browser support problem");
		  }
	  }
	}

	if (!w.Element.prototype.closest) {
	  w.Element.prototype.closest = function(s) {
		var el = this;

		do {
		  if (el.matches(s)) return el;
		  el = el.parentElement || el.parentNode;
		} while (el !== null && el.nodeType === 1);
		return null;
	  };
	}
})(window);
// -Element.matches