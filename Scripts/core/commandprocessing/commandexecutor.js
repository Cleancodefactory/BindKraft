function CommandExecutor(ctxoptional,cmdline, advancedcmdline) {
	BaseObject.apply(this,arguments);
	if (ctxoptional == "global") {
		this.set_rootcontext(CommandContext.createGlobal());
	} else if (BaseObject.is(ctxoptional,"CommandContext")) {
		this.set_rootcontext(ctxoptional);
	}
	if (BaseObject.is(cmdline, "CommandLine")) {
		this.$cmdline = cmdline;
	} else if (typeof cmdline == "string") {
		this.$cmdline = new CommandLine(cmdline, advancedcmdline);
	}
	this.$results = new ResultsStack();
}
CommandExecutor.Inherit(BaseObject, "CommandExecutor");
// Output wrappers
//~~~~~~~~~~~~~~~~
// Temporary situation
CommandExecutor.prototype.log_output = function(s) {
	console.log(s);
}
CommandExecutor.prototype.log_error = function(s) {
	console.log(s);
}
// END Output wrappers
CommandExecutor.ImplementProperty("interfaceType", new InitializeStringParameter("String or class definition of the execution interface", "CommandExecutorInterface"));
CommandExecutor.ImplementProperty("lessexceptions", new InitializeBooleanParameter("When true some exception are not thrown and only message is logged to the error output",true));

CommandExecutor.prototype.$cmdline = null;
CommandExecutor.prototype.get_cmdline = function() { return this.$cmdline; }
/**
	Each executore requires separate command line, when clonning is needed it is responsibility of the party that sets it.
*/
CommandExecutor.prototype.set_cmdline = function(cmdline) { 
	if (BaseObject.is(this.$cmdline,"CommandLine")) {
		throw "The command line cannot be replaced";
	}
	if (BaseObject.is(cmdline, "string")) {
		this.$cmdline = new CommandLine(cmdline,false);
	} else if (BaseObject.is(cmdline,"CommandLine")) {
		this.$cmdline = cmdline;
	}
}	
/**
	A stack of execution contexts it maintained. Its exact usage may differ in different executor implementations and/or configurations, but itspurpose is to enableExternalCapture
	the execution to enter and later exit different states and modes.
*/
CommandExecutor.prototype.$commandContexts = new InitializeArray("Stack of the attached command contexts (CommandContext) - containing the command register, env etc.");
CommandExecutor.prototype.$rootContext = null; // TODO: Put a global one here
/**
	The root context cannot be removed - it is outside the stack to make this unlikely
*/
CommandExecutor.prototype.get_rootcontext = function() { return this.$rootContext;}
CommandExecutor.prototype.set_rootcontext = function(v) { 
	if (BaseObject.is(v, "CommandContext")) {
		this.$rootContext = v;
	} else if ( BaseObject.is(this.$rootContext, "CommandContext")){
		throw "Once set the root context cannot be changed";
	} else {
		throw "The root context has to be valid context";
	}
}
CommandExecutor.prototype.$contextCheck = function(ctx) {
	if (BaseObject.is(ctx,"CommandContext")) {
		return ctx;
	} else if (BaseObject.is(ctx,"IAppBase")) {
		// TODO: App context (I was thinking of testing and I took wome simple pieces instead of really extracting a context from the app)
		return new CommandContext(this.get_currentcontext().get_commands(),ctx,this.get_currentcontext().get_environment(),this.get_currentcontext().get_custom());
	} else if (ctx == "global") {
		return CommandContext.createGlobal();
	} else {
		return null;
	}
}
CommandExecutor.prototype.isFunctional = function() {
	if (BaseObject.is(this.$rootContext,"CommandContext")) {
		return this.$rootContext.isFunctional();
	}
	return false;
}
/**
	Pushes a new execution context on the $commandContext - contexts may repeat, no checking is done
	@param ctx {CommandContext} - another command context
*/
CommandExecutor.prototype.pushContext = function(_ctx) {
	var ctx = this.$contextCheck(_ctx);
	if (ctx != null) {
		if (!BaseObject.is(this.$commandContexts,"Array")) {
			this.$commandContexts = [];
		}
		this.$commandContexts.push(ctx);
		return true;
	}
	return false;
}
/**
	Pulls the top context. If none are left returns the root context always.
*/
CommandExecutor.prototype.pullContext = function() {
	if (BaseObject.is(this.$commandContexts, "Array") && this.$commandContexts.length > 0) {
		return this.$commandContexts.pop();
	} else {
		return this.get_rootcontext();
	}
}
/** Returns the top context or the root if the stack is empty. Throws an err if the root context is missing.
	
*/
CommandExecutor.prototype.get_currentcontext = function() {
	if (BaseObject.is(this.$commandContexts, "Array") && this.$commandContexts.length > 0) {
		return this.$commandContexts[this.$commandContexts.length - 1];
	} else {
		if (this.$rootContext != null) {
			return this.$rootContext;
		} else {
			throw "No root context!";
		}
	}
}
/**
	Returns the number of the contexts in the stack or 0 if it is empty. If the root context is not valid or missing returns -1
*/
CommandExecutor.prototype.get_contextscount = function() {
	if (BaseObject.is(this.$commandContexts, "Array") && this.$commandContexts.length > 0) {
		return this.$commandContexts.length;
	}
	if (BaseObject.is(this.$rootContext,"CommandContext")) {
		return 0;
	} else {
		return -1;
	}
}
CommandExecutor.prototype.get_currentpos = function() {
	return this.$cmdline.get_position();
}
// Results are execution bound and thus are not part of the command context
CommandExecutor.prototype.$results = null;
// EXECUTION 
/**
	Finds the command
	Called with already extracted current token and its meta info
*/
CommandExecutor.prototype.findCommand = function(token,meta) {
	var _ctx = this.get_currentcontext();
	var rctx = this.get_rootcontext();
	var ctxses;
	if (!_ctx.get_prioritycommands()){
		ctxses = [rctx,_ctx];
	} else {
		ctxses = [_ctx, rctx];
	}
	var cmd = null;	
	for (var i = 0; i < ctxses.length && cmd == null; i++) {
		cmd = ctxses[i].get_commands().find(token, meta);
	}
	return cmd;
}
// RUNNING THE THING
CommandExecutor.prototype.$commandExecInterface = null;
/** Retirns and InterfaceObject to this instance. It is supplied to the commands when they execute.
	For them moment the interface is just one - the default one, but we are going to add an option to specify another.
*/
CommandExecutor.prototype.commandExecInterface = function() {
	if (this.$commandExecInterface == null) {
		this.$commandExecInterface = new InterfaceObject(this, this.get_interfaceType());
		//this.$commandExecInterface = new CommandExecutorInterface(this);
	}
	return this.$commandExecInterface;
}
CommandExecutor.prototype.completedOperation = function(success, data_or_error) {
	var op = new Operation();
	op.CompleteOperation(success, data_or_error);
	return op;
}
/*	How the execution work - concept without implmentation details
    ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
	
	1) We have a step routine(?) which executes a single command (the next command of course)
		a) Obviously some commands may need the execution to continue before they complete, others will complete synchronously or asynchronously
			Thus the basic behaviour of a step execution is to call a command with all the stuff it needs and wait it to complete before running the next one
			This is simple waiting if neccessary, but there are the other commands that need (or are forcibly given? - is this possible with relatively simple impl.?)
			something done/calculated from other commands (usually happens when these are command(s) following them)
		b) Commands that need something done by further code will need different procedure:
			They will need the execution to continue and any case that requires code elsewhere to be executed will be covered by calls or call-like implementation, so the case is
			reduced to only execution the following code on the command line. So they need to permit continuation without being complete.
	2) All the deviations from streightforward execution are returned to the step routine
	
	Implementation mehanics
	
	The step routine expects to be called periodically from another code - treated as external - may be call it "stepdriver"
	The "stepdriver" should receve back from each step very simple info:
	- can I do the next step
	- is the whole executon finished.
	
	Extra info may be present, but is not a requirement and depending on the stepdriver it may be completely ignored. For all intents and purposes the extra info serves only tracing and not the execution and its result.
	
	Requirements now defined
	The command:
		- executes synchronously until it knows how the execution will continue.
		- returns synchronously if the work is small and does not depend on something else on the command line - something that must be executed before continuing.
		- If need of async work is identified (a network request needed for example) - returns a FiishOperation that has to be completed upon completion of said work
		- If for completion the command needs results/work that is done by something else in the command line it uses the ICommandExecutorInterface given to it to request the appropriate action
			(if available, if the action is not in the interface returns completed with failure FinishOperation). The interface action method returns an Operation (depending on the task this can
			be some other class inheriting from Operation) and waits on it - it is completed when the request done through the call of the action method is complete. The command returns ContinueOperation
			to the caller (the step routine) and completes this operation as soon as possible. Althoug this is usually synchronous part of the work it is not impossible that async wor is needed to determine 
			what action needs to be requested through the execution interface, so it is possible that sometimes ContinueOperation operations are completed not synchonously as one may be tempted to assume.
		When the action is done the command utilizes whatever it waited for and completes the operation received as a result from the completion of the opration returne by the action interfacemethod
		
		Step (1) -> Cmd (1)
				 result <=
					Cmd (2)
		FinishOperation <-
					Cmd (3)
	ContinueOperation <- (3.1)
							-> action(...)
							Operation(finish
		..................
*/
/**
	@param token {object raw token} - optional, if specified this is considered internal call from methods
				that anlyse the token and route it here under certain circumstances with the token alread read and
				command line already positioned over it.
	
	@returns {Operation} when the current command execution status permits step to be called further. When all is done returns null;
*/
CommandExecutor.prototype.$step = function(intoken /*optional, ony internally used*/) {
	// For short hand temp var for operation
	var op;
	var token = null; 
	var cl = this.get_cmdline(); // Want to have it at hand
	// TODO: Should we clear all traps if intoken is not null?
	if (this.$queuedTrapsExist()) {
		// If there are any traps waiting for processing we are here after the command is executed.
		// The traps waiting are queued for processing the first time
		var trap = this.$unqueueTrap();
		if (trap == null) {
			// Clear trap queueStepTraps
			this.$currentTrap = null;
			return this.completedOperation(true, null);
		}
		op = this.$processTrap(trap); // proces one trap
		if (op === false) {
			// This means no further trap processing needed and none has been processed
			// TODO: We can probably pass through but it will require a little duplication - so better way would be call the step function again
			//		Still we immediately return for now - a little improvement would be good idea to consider.
			return this.completedOperation(true, null);
		} else if (BaseObject.is(op,"Operation")) {
			// Just like a normal command execution
			return op;
		} else {
			var err = "CommandExecutor: trap processing returned unexpected result type.";
			this.log_error("err");
			return this.completedOperation(false, err);
		}
	} else {
		if (intoken != null) {
			token = intoken;
		} else {
			token = cl.next(); // First time here - get the command (if it is not a command we will error or do the default action (planned only at this moment)
		}
		this.$queueStepTraps(); // Queue if there are any traps registered
		// Deal with the token - see if it is a command
		if (token == CommandLine.End) { // End of the command line
			op = new FinishOperation()
			op.CompleteOperation(true, this.$results); // TODO: Pass here current errorlevel (needs to be implemented)
			if (this.$queuedTrapsExist()) {
				this.log_error("There are some traps registered beyound the command line's end.")
			}
			return op; // Cmd line complete, if any traps are queued - this is a non-fatal error
			// TODO: Temporary - we must await remaining tasks to resolve this and not immediately mark it complete like it is now.
		}
		// Only identifiers can be commands
		if (token.meta.type == "string" && token.meta.subtype == "identifier") {
			// We keep this here because it is more readable this way
		} else {
			// What are we going to do with these?
			// Error info is returned in case it needs to be displayed somewhere
			return this.completedOperation(false, "Not an identifier (while looking up the next command)");
		}
		var cmd = this.findCommand(token.token, token.meta);
		var act = null;
		if (cmd != null) {
			// Execute the command
			act = cmd.get_action();
			if (BaseObject.isCallback(act)) {
				var cmdreturn = BaseObject.callCallback(act, this.get_currentcontext(), this.commandExecInterface());
				if (BaseObject.is(cmdreturn, "ContinueOperation")) {
					return cmdreturn; // Command not complete but we should continue execution when this resolves.
					// Support for this behavior is required by command execution runners when traps are supported.
					// Indeed treating this as regular operation will most likely work, but future plans for extending this process will depend on ability to distinguish ContinueOperation ffrom others.
				} else if (BaseObject.is(cmdreturn, "Operation")) {
					return cmdreturn; // Command should be awaited to finish then we can continue
				} else {
					return this.completedOperation(true, cmdreturn); // Already completed - execution can continue immediately
				}
			} else {
				return this.completedOperation(false, "The command does not have an executable action.");
			}
		} else {
			return this.completedOperation(false, "Token is not recognized as a command.");
		}
	}

}
CommandExecutor.prototype.isCommand = function(token) {
	if (token.meta.type == "string" && token.meta.subtype == "identifier") {
		var cmd = this.findCommand(token.token, token.meta);
		if (cmd != null) return true;
	}
	return false;
}
CommandExecutor.prototype.$inspectResults = function(arg) { // arg is either result value or operation
	var me = this;
	if (BaseObject.is(arg,"ContinueOperation")) return arg;
	if (BaseObject.is(arg, "Operation")) {
		arg.whencomplete().tell(
			function (op) {
				var r;
				if (op.isOperationSuccessful()) {
					//this.log_output("");
					r = op.getOperationResult();
					me.$results.push(r);
				} else {
					me.log_error("inspectResults - failed operation completed.");
					// TODO what exactly we will do with errors
					
				}
			}
		);
		return arg; // Operation
	}
	// arg is not Operation
	this.log_error("A non-Operation result from step");
	// TODO: We should pudh these results on the stack too!
	return this.completedOperation(true, arg);
}
CommandExecutor.prototype.step = function(token /*optional, only for internal use*/) {
	var r = this.$step(token);
	return this.$inspectResults(r);
}

/*
	Comments on execution:
	
	Step executes the next command which may consume any number of tokens (depends on the command)
	There are 3 cases in 2 categories
	1) Sync command - returns the result and that's all
	2.a) Async command returning Operation that has te result when complete - you call step for the next one after that
	2.b) Async command, that needs execution of further commands and something from their results - it returns a completion operation (like 2.a), but includes a Demand
*/
/** 
	The "traps" are kept in an array. AS JS actually presents an object as an array - only some positions are filled.
	If commandline is changed or any other rest-like situation occurs the traps must be cleaned up.
	The trap: another array used in stack mode with push and pop. The trap is filled through the execution interface action routines (more about that - see 
	ICommandExecutorInterface and its implementations)
	
	Important - there is a discussion about support of two-way operations on the basic level (i.e. on any Operation or at least on very close derivate). 
	E.g. ability of the task to receive back something when it completes the operation. It will probably be rejected as a solution to problems like the "traps" here, becuase it
	is not easilly defined as abehavior - multiple listeners for the operation may have different things to return and what to return and what to ignore is hard to decide. The same goes for
	mulitple results from each handler - sorting through this will requie a whole new level of comlexity which is extremely undesirable. One more problem is that even if these are all solved
	the task will have to track the time (processing slot) it gives to the listeners which may or may not request own time by scheduling AsyncResult, which additionally complicates the problem.
	So, solutions to problems like this one with the traps:
		Situation in which the task completes the operation and wants to wait for another operation (or operations) to get signaled when the other side(s) completed their work after receiving the first signal.
	will be registering beforehand both operations - the one that needs to be completed and the one that we need to wait on so the other side (the listener) completes what remains to be done after the first 
	operation completed (the one we completed first). When the listeners are many - many operations should be registered and listened on using an aggregator operation (like OperationAll or similar - as appropriate for the scenario)
	
	The above means that the executor interface action methods need a required argument (or arguments in some cases) that will be registered along the generated Operation for the work the action method does.
	Example Action: 
		// From command's POV
		var doneOp = new SomeOperation();
		var requestop = eiface.actionx(doneOp,action specific args);
		requestop.then(function(requestop) {
			... rest of the work with the supplied data/stuff as result of the actionx ...
			doneOp.CompleteOperation(....);
		});
		// From execution interfacce POV
		registerx // Some abstract register
		// Time1:
		function actionx(doneOp, ... specific args ...) {
			var requestop = new Operation(); // This will be signaled when the request is fulfilled
			registerx.register(requestop,doneOp);
		}
		// Time2: //when the fulfillment actually happens
		function doactionx() {
			var registration = egisterx.getMyREgistration() // how this happens is implementation's decision
			registration.requestop.CompleteOperation(true, ...); // signal the caller of the actionx that its request is fulfilled
			registration.doneOp.then( .... wait for the caller of actionx to use whatever it got from the request and finish... then do something else or the same again if the caller cals an action to request something again...)
		}
		Time1 and Time2 can be combined together in some cases, but this does not change the procedure.
*/
// Data structs for traps
CommandExecutor.prototype.$executiontraps = new InitializeArray("Various traps inpected on step");
/**
	When a step is about to be made any traps registered on that position are moved here.
	The next time a step is done traps are processed instead one by one until they are done - then the next step is actually done.
*/
CommandExecutor.prototype.$currentTrap = null;
/**
	Check if there are any traps collected for execution after the current command completes.
*/
CommandExecutor.prototype.$queuedTrapsExist = function () {
	if (this.$currentTrap != null) { // This will stop executio of further commands (except the xurrent one) until there is current trap
		return true;
	}
	return false;
}
/** Moves the traps to the processing slot  -queues them for execution after the current step (command)
*/
CommandExecutor.prototype.$queueStepTraps = function() {
	var pos = this.get_currentpos();
	var slot = this.$executiontraps[pos];
	if (BaseObject.is(slot,"Array")) { // real slot (could be empty, but is real)
		if (slot.length > 0) {
			this.$currentTrap = {
				pos: this.get_currentpos(),
				traps: slot
			}
		}
		// Clear the slot in the trap register
		this.$executiontraps[pos] = null;
	} else { // no slot
		this.$currentTrap = null; // make sure we will not wait here for nothing
	}
}
/**
	A ligher proc mainly for application over steps that are not commands. Adds any traps registered on that position to the current traps (the queued for processing traps)
	This way traps registered on positions read as parameters (for instance) will go the already queued from the command's position.
*/
CommandExecutor.prototype.$addToQueuedTraps = function() {
	var pos = this.get_currentpos();
	var slot = this.$executiontraps[pos];
	if (BaseObject.is(slot,"Array")) { // there is what to do
		this.$executiontraps[pos] = null;
		if (this.$currentTrap == null) {
			this.$currentTrap = {
				pos: this.get_currentpos(),
				traps: slot
			}
		} else if (BaseObject.is(this.$currentTrap.slot,"Array")) {
			this.$currentTrap.slot.concat(slot);
		} else {
			this.log_error("Internal error: Wrong state of the $currentTrap - slot is not an Array.");
		}
	}
}
/**
	Takes the first (earliest) trap queued for processing or returns null (if none exist or exhausted)
*/
CommandExecutor.prototype.$unqueueTrap = function() {
	if (this.$currentTrap != null) {
		if (BaseObject.is(this.$currentTrap.traps,"Array")) {
			var trap = null, maxtries = 0;
			if (this.$currentTrap.traps.length > 0) {
				do {
					// POP???
					trap = this.$currentTrap.traps.shift(); // Processing is in the order of registering
					maxtries ++;
				} while (trap == null && this.$currentTrap.traps.length > 0 && maxtries <10);
			}
			if (this.$currentTrap.traps.length <= 0 || maxtries >= 10) {
				// Remove everything (not only when empty but also when filled with too much incorrect entries
				this.$currentTrap = null;
			}
			return trap;
		}
	} else {
		this.$currentTrap = null;
	}
	return null; // Nothing to get
}
/**
	This is low level method, the pos has to be found/calculated before calling it. E.g. an interface method may be designed to lay a trap after execution of the next grop of commands - it will have to check if group exists, find where it ends (it is in the meta)
	and call the $registerTrap for that position. The traps are inspected after the postion is processed from the command line. 
	@pos {integer} - The pos in the command line where to place the trap. This is calculated in the particular function exposed to the commands through executioninterface
	@requestOperation
	@doneOperation
	@fulfilldelegate {callback} - A callback implementing the actual work - determined by the specific interface function
									// backup idea: prototype: callback(trapdata) returns the doneOp, can fail it directly in some cases
									// current impl: prototype: callback(pos, requestOp, requestData, doneOp) returns the doneOp, can fail it directly in some cases
	@requestData {any} - Optional data needed by the callback
*/
CommandExecutor.prototype.$registerTrap = function(pos, requestOperation, doneOperation, fulfilldelegate, requestData) {
	// TODO: Establish connection between action request receiving and fullfillment entry points so that we can put in the trap easy way to call the fufillment proc automatically
	//			Perhaps a delegate will be just fine?!? (see down what is currently done
	
	// Check args
	if (typeof pos != "number") throw "The traps need to put on positions and the pos argument is not a number";
	if (!BaseObject.is(requestOperation, "Operation")) throw "$registerTrap requires requestOperation argument of type Operation ot derived";
	if (!BaseObject.is(doneOperation, "Operation")) throw "$registerTrap requires doneOperation argument of type Operation ot derived. Typically this should be ContinueOperation or FinishOperation.";
	if (!BaseObject.isCallback(fulfilldelegate)) throw "$registerTrap requires fulfilldelegate argument callback that does the actual work.";
	var trap = { // This structure is given as arg to the fulfilldelegate
		position: pos,
		fulfill: fulfilldelegate,
		requestOp: requestOperation,
		doneOp: doneOperation,
		data: requestData
	};
	var slot = this.$executiontraps[pos];
	if (!BaseObject.is(slot,"Array")) {
		slot = [];
		this.$executiontraps[pos] = slot;
	}
	slot.push(trap);
}


// ???? Called on each step, pops and processesa single trap and if any trap is processed signals the step to return immediatelly
// Trap processed - return doneOp (step must return it)
// Nothing to process - return false (step should continue)
CommandExecutor.prototype.$processTrap = function(trap) {
	if (trap != null) {
		// Do the trap
		if (BaseObject.isCallback(trap.fulfill)) {
			return BaseObject.callCallback(trap.fulfill,trap.pos, trap.requestOp,trap.requestData);
		} else {
			throw "No fulfill callback in the trap";
		}
	}

	return false; // nothing to process
}
/* Execution interface support methods) */
/* EXECUTOR INTERFACE SUPPORT */
// These are to be called through the ICommandExecutorInterface (sometimes with added logic)
// - executor interface - called by the command
// TODO: These should be hidden from direct access to the executor and called only from the interface object
// Sync interface

CommandExecutor.prototype.$isEndToken = function(token) {
	if (token == CommandLine.End) return true;
	return false;
}
CommandExecutor.prototype.cmdNextCommand = function() {
	
}
/**
	If you want the metacall as:
	var meta;
	var v = API.pullNextToken(function (m) {meta = m;});
*/
CommandExecutor.prototype.pullNextToken = function(outmetacallback) {
	var token = this.get_cmdline().next();
	if (this.$isEndToken(token)) return null;
	if (BaseObject.isCallback(outmetacallback)) {
		BaseObject.callCallback(outmetacallback, token.meta);
	}
	this.$addToQueuedTraps();
	return token.token;
}
CommandExecutor.prototype.pullNextTokenRaw = function() {
	var token = this.get_cmdline().next();
	if (this.$isEndToken(token)) return null;
	this.$addToQueuedTraps();
	return token;
}
CommandExecutor.prototype.asyncPullNextParamOrValue = function() {
	throw "not implemented yet";
	// TODO: Register a trap and handle it, should return operation
}
CommandExecutor.prototype.pushResult = function(r) {
	this.$results.push(r);
}
CommandExecutor.prototype.pullResult = function() {
	return this.$results.pull();
}


/* STATIC PART DEDICATED TO THE GLOBAL CONTEXT */
CommandExecutor.$Global = null;
CommandExecutor.Global = function() {
	if (this.$Global == null) {
		this.$Global = new CommandExecutor();
	}
}

/*
	The execution requires these components:
	1.The command line (compiled) - contains the code for execution, tracks the execution pos etc.
	2. Command context
		2.1 Environment
		2.2 Command register
		2.3 App ref
	
*/
//CommandExecutor.executeCommand