
/**
 * Use these in bindings like this data-on-XXX={bind source=builtin path=focus}
 */

var StandardHandlerFunctions = {
	stoppropagation: function(e, dc) {
		if (e != null && e.stopPropagation) e.stopPropagation();
	},
	focus: function(e, dc, bind) {
		if (bind != null && typeof bind.bindingParameter == "string") {
			var els = bind.getRelatedElements(bind.bindingParameter);
			if (els.length > 0) {
				var el = els.get(0);
				if (el.focus) el.focus();
			}
		}
	}
};

Handler.bindingLibrary.std = StandardHandlerFunctions;