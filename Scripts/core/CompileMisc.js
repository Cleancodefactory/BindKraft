/*
 Miscellaneous compile-time oriented features. The stuff here is intended to improve, verify, report, extend 
	the compilation phase with useful analysiss or logging features.
*/
/*
	Simple task queue called at certain phases (currently only "completion") to perform analisys over the defined types.
*/
CompileTime.Tasks = (function() {
	var $tasks = {
		completion: []
	};
	// Registers a task for a certain phase.
	return {
		add: function(phase, task) {
			if ($tasks[phase] != null) {
				$tasks[phase].push(task);
			} else {
				ComplieTime.warn("CompileTime.Tasks phase " + phase + " does not exist.");
			}
		},
		run: function(phase) {
			if ($tasks[phase] != null) {
				for(var i = 0; i < $tasks[phase].length; i++) {
					var task = $tasks[phase][i];
					if (typeof task == "function") {
						task.call(this);
					}
				}
			}
		}
	}
})();