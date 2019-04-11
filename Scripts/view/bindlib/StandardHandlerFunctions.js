


var StandardHandlerFunctions = {
	stoppropagation: function(e, dc) {
		if (e != null && e.stopPropagation) e.stopPropagation();
	}
};

Handler.bindingLibrary.std = StandardHandlerFunctions;