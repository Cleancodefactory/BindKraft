/*
	This class performs the system boot sequence, enabling various adjustments and controllers
	over the process.
	
	Because of the way this works, only one instance of the class is needed and is immediately created.
	Thus the file should be loaded before any module is loaded. All the registrations for boot time operations from modules must be done in
	parse (also known as compile phase) time, but their actual invocation will happen during the start() method execution.
	
	There is no guarantee that start will return synchronously, but this is recommended beehaviour (in case you change something)
	
	Boot operations from the framework itself are registered in a global array which is translated into registrations when $SysBoot is instantiated
	
	# USAGE
	
	##Registration
	###in-framework (do not use in other modules)
	
	JBCoreBoot.push("<phasename>", function(context, finish(success) {
		...
		// End it in one (only one of these forms
		// A:
		finish(<true | false>);
		return null; // or no return at all;
		// B:
		return <true | false> // although the check is non-strict (==) it is recommended to return true or false to indicate success or failure.
	})
	
	###in modules (other than framework core)
	SysBoot.action("<phasename>", "<modulename>", function (context) {
		... use context to access boot parameters
		// context.get_parameters() -> Will return the ones for your module only.
		... report if needed
		// context.report("some report" [, true | false]); // ORder of arguments can be any, a true indicates error report - can be colored in some output - depends on the reportcallback
		// End it in one of two ways
		// A: Asynchronous or just precise
		var op = new Operation();
			// Can be in another function that has reference to the op
			op.CompleteOperation(<true | false>, data_or_error);
		return op;
		// B: Simplified synch action only
		return <true | false>; // success or error
		
	}, [{... some options ...}]);


*/

function $SysBoot(bootmethod) {
	BaseObject.apply(this, arguments);
	this.$readFrameworkRegistrations();
	if (bootmethod != null && $SysBoot.autoboot[bootmethod] != null) {
		$SysBoot.autoboot[bootmethod]();
	} else {
		$SysBoot.autoboot["default"]();
	}
}
$SysBoot.Inherit(BaseObject, "$SysBoot");
// Autoboot methods
$SysBoot.autoboot = {
	"default": function() {
		document.addEventListener("DOMContentLoaded", function (event) {
			$SysBoot.Default().start();
		});
	},
	"withparameters": function() {
		document.addEventListener("DOMContentLoaded", function(event) {
			$SysBoot.Default().askparamsAndStart()
		});
	}
};

$SysBoot.ImplementIndexedProperty("bootparameters", new InitializeObject("These parameters are mixed with the parameters passed to start (see comments in the sample SysBoot.js)"));
$SysBoot.ImplementProperty("reportcallback", new Initialize("A callback set in the context at runtime", null));
$SysBoot.prototype.$readFrameworkRegistrations = function() {
	if (BaseObject.is(JBCoreBoot, "Array")) {
		JBCoreBoot.Each(this.thisCall(function(idx, item) {
			this.actions.push(new $SysBoot_SysAction(item.phase, item.callback));
		}));
        JBCoreBoot.Terminate(); // We want this to cause exceptions to registrations done too late.
	}
}
// These are all the supported phases at this time.
// If ne phases are needed they should be listed here in their proper chronological place to avoid problems with missing documentation.
//	Also they should contain the BindKraft version from which they are available (see JBFrameworkVersion in core/configuration.js)
$SysBoot.prototype.phase = {
	core: "core", // v: 2.7.2 - core framework init
	network: "network", // v: 2.7.2 - communication init (system provided chains and other networking facilities/definitions)
	runtime: "runtime", // v: 2.7.2 - runtime enviroment initialization - load system resources, localization facilities etc. 
	resources: "resources", // v: 2.7.2 - Load globally available resources, fill registers as needed (if some resources depend on chosen localization, now this can be done). Shell is started after this phase.
	environment: "environment", // v: 2.7.2 - Shell is ready, but not really started - initialize the global working environemnt with facilities that will be available in the session - e.g. if there is shell UI this is the place for it, alternatively - start shell application.
	services: "services", // v: 2.7.2 - Everything ready - start all services
	applications: "applications" // v: 2.7.2 - start all initial applications
}
$SysBoot.prototype.report = function(_message) {
	this.sysboot.report.apply(arguments);
	var err = false;
	var message = _message;
	for (var i =0;i<arguments.length;i++) {
		if (typeof arguments[i] == "boolean") {
			err = arguments[i];
		} else if (typeof arguments[i] == "string") {
			message = arguments[i];
		}
	}
	var cb = this.get_reportcallback();
	if (BaseObject.isCallback(cb)) {
		BaseObject.callCallback(cb,{ phase: this.get_phase(), message: message, iserror: err});
	}
}
$SysBoot.prototype.action = function(phase, module, action, options) {
	var act = new $SysBoot_Action(phase, module, action, options);
	this.actions.push(act);
}
$SysBoot.prototype.actions = new InitializeArray("Array of the actions list");
$SysBoot.prototype.$getActionsForPhase = function(phase) {
	return this.actions.Select(function( idx, item) {
		return (item.get_phase() == phase)?item:null;
	});
	// Everything is returned in the order in which it is registersd (should be enough for now)
}
/* parameters are like this
{	
	$system: {
		param1: "value1",
		param*: value*
	},
	module* = {
		param*: value*
	}
}
Before calling start you may want to set_reportcallback( ... );
*/
$SysBoot.prototype.start = function (parameters) {
	var op = new Operation(); // The whole thing
	var errors = 0;
	var phases = [this.phase.core, this.phase.network, this.phase.runtime, this.phase.resources, this.phase.enviroment, this.phase.services, this.phase.applications];
	var me = this;
	// TODO: See if we will support parameters passed not as object
	var context = new $SysBootContext(this, parameters);
	var list; // Actions for current phase
	var pidx = 0;
	var me = this;
		function newPhaseList() {
			if (pidx < phases.length) {
				list = me.$getActionsForPhase(phases[pidx]);
				// Call starter
				fetchAction();
			} else {
				if (errors > 0) {
					op.CompleteOperation(false, IOperation.errorname(OperationStandardErrorsEnum.unspecified));
				} else {
					op.CompleteOperation(true, null);
				}
				// exit
			}
		}
		function fetchAction() {
			var op;
			if (list.length > 0) {
				var act = list.shift();
				act.execute(context).then(endAction);
			} else {
				newPhaseList();
			}
		}
		function endAction(operation) { // We may want to do read something from the operation, so we will keep this method and not directly call next fetch.
			if (!operation.isOperationSuccessful()) {
				// TODO: Report etc.
				errors ++;
			}
			
			fetchAction();
		}
		
	newPhaseList();	
	return op;
}.Description("Starts the boot process. Should be called after all the javascript is parsed and the DOM ready.");
$SysBoot.prototype.askparamsAndStart = function() {
	var askdiv = document.createElement("div");
	askdiv.id = "BindKraftBootParams";
	askdiv.style.backgroundColor="#FFFFFF";
	askdiv.style.color="#000000";
	askdiv.innerHTML = 'Boot parameters: <input type="text" style="width:100%" onkeypress="$SysBoot.Default().startFromManualParams(this,arguments[0])"/>';
	document.body.appendChild(askdiv);
};
$SysBoot.prototype.startFromManualParams = function(el, e) {
	if (e.which == 13) {
		var params = el.value;
		alert(params);
		var x = document.getElementById("BindKraftBootParams");
		if (x != null) {
			document.body.removeChild(x);
		}
		this.start(params);
	}
}
$SysBoot.$default = null;
$SysBoot.Default = function(bootmethod) {
	if ($SysBoot.$default == null) {
		$SysBoot.$default = new $SysBoot(bootmethod);
	}
	return $SysBoot.$default;
};
// TODO: $SysBoot.Default("withparameters");

// $SysBootContext
/*CLASS*/
function $SysBootContext(booter, parameters) {
	BaseObject.apply(this,arguments);
	this.sysboot = booter;
	this.bootparameters = parameters;
}
$SysBootContext.Implement(BaseObject, "$SysBootContext");
$SysBootContext.ImplementProperty("phase", new InitializeStringParameter("Phase name", null));
$SysBootContext.ImplementProperty("options", new Initialize("Dynamically set by action's execute", null));
$SysBootContext.ImplementProperty("module", new Initialize("Dynamically set by action's execute", null));

$SysBootContext.prototype.get_reportcallback = function() {
	return this.sysboot.get_reportcallback();
}
// Called by the boot actions to get parameters for the module to which they belong.
$SysBootContext.prototype.get_parameters = function() {
	if (this.bootparameters != null) {
		if (this.get_module() != null) {
			if (this.bootparameters[this.get_module()] != null) return this.bootparameters[this.get_module()];
		}
	}
	return {};
}
$SysBootContext.prototype.report = function(_message) {
	this.sysboot.report.apply(arguments);
}


// $SysBoot.Actions
/*CLASS*/
function $SysBoot_Action(phase, module, opcallback, options) {
	BaseObject.apply(this, arguments);
	this.set_phase(phase);
	this.set_module(module);
	this.$operation = opcallback;
	this.$options = options;
};
$SysBoot_Action.Description("Holds a registered action")
	.Param("phase","The name of the phase in which to execute the operation")
	.Param("module", "module name to which this belongs. System operations use name '$system', the other names SHOULD match the module names.")
	.Param("opcallback","A callback (delegate or function) called with func($SysBootContext context), returning Operation compatible object.");
$SysBoot_Action.Inherit(BaseObject,"$SysBoot_Action");
$SysBoot_Action.ImplementProperty("name", new InitializeStringParameter("The name of the action", null));
$SysBoot_Action.ImplementProperty("phase", new InitializeStringParameter("The phase for which this list applies", null));
$SysBoot_Action.ImplementProperty("module", new InitializeStringParameter("The module to which this belongs", null));
$SysBoot_Action.ImplementProperty("executed", new InitializeBooleanParameter("Set to true after execution", false));
$SysBoot_Action.ImplementProperty("failed", new InitializeBooleanParameter("Set to true on failed actions", false));
$SysBoot_Action.prototype.get_fullname = function() {
	return this.get_module() + "->" + this.get_name();
}
$SysBoot_Action.prototype.$operation = null; // Treated as standard callback returning Operation compatible object.
$SysBoot_Action.prototype.execute = function(context) {
	var op;
	if (this.get_executed()) {
		op = new Operation();
		context.report(this.get_fullname() + " attmpted second execution. Perhaps the action is registered more than once.");
		op.CompleteOperation(false, IOperation.errorname(OperationStandardErrorsEnum.duplication));
		return op;
	}
	var cb = this.$operation;
	if (!BaseObject.isCallback(cb)) {
		op = new Operation();
		context.report(this.get_fullname() + " The action callback is missing.");
		op.CompleteOperation(false, IOperation.errorname(OperationStandardErrorsEnum.notimpl));
		return op;
	}
	// Ready to execute
	op = null;
	// Patch the context - this can be done safely, because the boot process is and will ever be linear - i.e. each action must fully complete before next one is started.
	context.set_options(this.$options);
	context.set_module(this.get_module());
	op = BaseOject.callCallback(cb, context);
	if (BaseObject.is(op, "Operation")) return op;
	// Fake and completed operation
	var result = new Operation();
	if (op === false) {
		result.CompleteOperation(false, IOperation.errorname(OperationStandardErrorsEnum.unspecified));
	} else {
		result.CompleteOperation(true, null);
	}
	return result;	
}

// Packs the system actions in manner compatible with the rest.
/*CLASS*/
function $SysBoot_SysAction(phase,syscallback) {
	$SysBoot_Action.call(this, phase, "$system", BaseObject.isCallback(syscallback)?function(context) {
		var op = new Operation();
		// TODO:
		var result = BaseObject.callCallback(syscallback, context, function(result) {
			if (result) {
				op.CompleteOperation(true, null);
			} else {
				op.CompleteOperation(false, IOperation.errorname(OperationStandardErrorsEnum.unspecified));
			}
		});
		if (result != null && !op.isOperationComplete()) {
			// Assume this is synchronous and callback will not be called
			if (result) {
				op.CompleteOperation(true, null);
			} else if (!result) {
				op.CompleteOperation(false, IOperation.errorname(OperationStandardErrorsEnum.unspecified));
			}
		}
		return op;
	}:null);
}
$SysBoot_SysAction.Inherit($SysBoot_Action,"$SysBoot_SysAction");

//SysBoot = new $SysBoot();