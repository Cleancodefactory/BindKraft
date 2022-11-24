(function() {
    var CommandContextHelper = Class("CommandContextHelper");

    /**
     *  {
     *       operation: operation, (Instructions)
     *       operand: operand,     (Depending on the instruction)
     *       argCount: argcount || 0 (number of variables to consume from the stack)
     *   }
     */
    var Instructions = { 
        NoOp: 0, // () - does nothing
        PushParam: 1, // (Variable Name) - pushes environment parameter's value in the stack
        Call: 2, // (methodName) - Calls a routine (provided by the host)
        PushDouble: 3, // (double) - Pushes a double on the stack
        PushInt: 4, // (int) - Pushes an int on the stack
        PushNull: 5, // () - Pushes null on the stack
        PushBool: 6, // (bool) - Pushes a boolean on the stack
        PushString: 7, // (string) - pushes a string on the stack
        Dump: 8, // () - Pulls and dumps (forgets) one entry from the stack
        JumpIfNot: 9, // (jumpaddress), 1 arg
        Jump: 10, // (jumpaddress), 0 arg

        GetVar: 11, // (varname)
        PushVar: 11,

        SetVar: 12, // (varname) - Sets a variable
        PullVar: 12,

        Halt: 13, // Exit program
        CallRoot: 14, // Calls a routine from the host's root context (otherwise like Call)
        CallParent: 15 // Calls a routine from the host's parent context (otherwise like Call)
    }
    function _DumpInstruction(instr) {
        var s = "!!!";
        for (var k in Instructions) {
            if (Instructions.hasOwnProperty(k)) {
                if (instr.operation == Instructions[k]) {
                    s = k;
                }
            }
        }
        s += "            ";
        s = s.slice(0,12);
        s += "(" + instr.argCount + ")";
        s += "[" + instr.operand + "]";
        return s;

    }
    function _DumpValue(value) {
        var s = "";
        if (value == null) {
            s = "null";
        } else if (typeof value === "string") {
            if (value.length > 30) {
                s = "'" + value.slice(0,30) + "...'";
            } else {
                s = "'" + value + "'";
            }
        } else if (typeof value == "number" || typeof value == "boolean") {
            s = value;
        } else if (typeof value == "function") {
            s = "(function)";
        } else if (typeof value == "object") {
            if (Array.isArray(value)) {
                s = "(array[" + value.length + "])";
            } else if (BaseObject.is(value, "BaseObject")) {
                s = "(" + value.classType() + ")";
            }
        } else {
            s = "unrecognized";
        }
        return s;
    }
    
    function _DumpStack(stack) {
        if (Array.isArray(stack)) {
            var s = "",j = 0;
            for (var i = stack.length - 1; i >= 0; i--) {
                s += j + ":\t" + _DumpValue(stack[i]) + "\n";
            }
            return s;
        } else {
            return "no stack";
        }
    }
    function _DumpArray(ar) {
        if (Array.isArray(arr)) {
            var s = "";
            for (var i = 0; i < arr.length; i++) {
                s += i + ":\t" + _DumpValue(arr[i]) + "\n";
            }
            return s;
        } else {
            return "no arguments";
        }
    }
    function _DumpState(state) {
        try {
            var s = "pc=" + state.pc + "\n";
            s += "stack depth=" + state.stack.length + "]\n";
            s += _DumpStack(state.stack);


        } catch (e) {
            return "(cannot fetch state)\n";
        }
    }


    //#region Runner

    function CLNullLangRunner() {
        BaseObject.apply(this, arguments);
    }
    CLNullLangRunner.Inherit(BaseObject,"CLNullLangRunner");
    CLNullLangRunner.Instructions = Instructions;

    CLNullLangRunner.prototype.$program = new InitializeArray("The program");
    CLNullLangRunner.prototype.$buildError = null;

    CLNullLangRunner.ImplementProperty("asyncRun", new InitializeBooleanParameter("Run calls asynchronously", true));
    CLNullLangRunner.ImplementProperty("instructionTimeout", new InitializeNumericParameter("Timeout for an async instruction", 60000));
    

    //#region Execution

    /**
     * The context here carries the command definitions and the environment variables. Further extensions may be added as well.
     * The execution is complicated because it is async and the cycle through the program involves a lot of waiting.
     * 
     * NoOp: 0, // () - does nothing
        PushParam: 1, // (Variable Name) - pushes environment parameter's value in the stack
        Call: 2, // (methodName) - Calls a routine (provided by the host)
        PushDouble: 3, // (double) - Pushes a double on the stack
        PushInt: 4, // (int) - Pushes an int on the stack
        PushNull: 5, // () - Pushes null on the stack
        PushBool: 6, // (bool) - Pushes a boolean on the stack
        PushString: 7, // (string) - pushes a string on the stack
        Dump: 8, // () - Pulls and dumps (forgets) one entry from the stack
        JumpIfNot: 9, // (jumpaddress), 1 arg
        Jump: 10, // (jumpaddress), 0 arg
        GetVar: 11, // (varname)
        PushVar: 11,
        SetVar: 12, // (varname) - Sets a variable
        PullVar: 12,
        Halt: 13 // Exit program
     */


    CLNullLangRunner.prototype.$checkContext = function(ctx) {
        if (BaseObject.is(ctx,"ICommandContext")) {
            return ctx;
        } else if (BaseObject.is(ctx,"IAppBase")) {
            throw "not implemented";
            // TODO: App context (I was thinking of testing and I took wome simple pieces instead of really extracting a context from the app)
            return new CommandContext(this.get_currentcontext().get_commands(),ctx,this.get_currentcontext().get_environment(),this.get_currentcontext().get_custom());
        } else if (ctx == "global") {
            return CommandContext.createGlobal();
        } else {
            return null;
        }

    }
    //CLNullLangRunner.prototype.
    /**
     * @param {ICommandContext} commandContext
     */
    CLNullLangRunner.prototype.execute = function(commandContext, constants) {
        var ctx = this.$checkContext(commandContext);
        if (ctx == null) return Operation.Failed("Invalid command context");
        var me = this;
        var execOp = new Operation("CLNullLang execution");
        // Local vars in an object to make it possible to pass it to objects
        var state = {
            constants: constants,
            contextStack: [commandContext],
            pc: 0,
            stack: [],
            helper: null, // set below
            args: [], // The arguments for the next function
            commandContext: null // Set during execution of external command - holds the context in which it was found
        };
        
        // The helper used mostly internally and somewhat internally in the API implementation.
        state.helper = new CommandContextHelper(state.contextStack);
        // API passed to the commands (2-nd argument)
        var api = new $CLNullLangAPI(state);

        function processInstruction(lastOp) {
            if (BaseObject.is(lastOp,"Operation")) {
                if (!lastOp.isOperationSuccessful()) {
                    me.LASTERROR("CLNullLang runtime error:" + lastOp.getOperationErrorInfo(), "execute");
                    if (!lastOp.isOperationComplete()) { // Emergency completion (should not happen actually)
                        execOp.CompleteOperation(false, lastOp.getOperationErrorInfo());
                    }
                    return;
                } else {
                    // Push the last result
                    state.stack.push(lastOp.getOperationResult());
                }
            }

            var i, instruction;

            while (true) {
                state.commandContext = null; // clear the context
                instruction = me.$program[state.pc];
                // Preprocess instruction
                state.pc ++;
                if (state.pc >= me.$program.length) { // End of program
                    execOp.CompleteOperation(true, state.stack);
                    return;
                }
                // prepare arguments for the instruction
                state.args.splice(0);
                if (instruction.argCount > 0) {
                    for (i = 0; i < instruction.argCount; i++) {
                        if (state.stack.length == 0) {
                            me.LASTERROR("Stack underflow at pc=" + (state.pc-1));
                            execOp.CompleteOperation(false,"Stack underflow at pc=" + (state.pc-1), "execute");
                            return;
                        } else {
                            state.args.push(state.stack.pop());
                        }
                    }
                    state.args.reverse();
                }
                // Special cases
                if (instruction.operation == Instructions.NoOp) continue;
                if (instruction.operation == Instructions.Halt) {
                    // Program completion
                    execOp.CompleteOperation(true, state.stack);
                    return;
                }
                // Call - async instruction (potentially)
                if (instruction.operation == Instructions.Call ||
                    instruction.operation == Instructions.CallRoot ||
                    instruction.operation == Instructions.CallParent) {
                    var op = new Operation("CLNullLangRunner instruction execution " + _DumpInstruction(instruction), me.$instructionTimeout); // TODO instruction timeout
                    op.then(processInstruction);
                    me.callAsyncIf(me.$asyncRun, execAsyncInstruction, instruction, state.args, op);
                    // Exit the executor and wait the operation
                    // TODO: Needs some protection !!!
                    return;
                }
                // Sync instructions
                // They MUST push their results themselves!!!
                // The return result is FALSE if critical and the execOp is completed with the appropriate error
                if (execSyncInstruction(instruction) === false) {
                    // Critical error
                    if (!execOp.isOperationComplete()) { // Just in case - finish the op if forgotten
                        execOp.CompleteOperation(false, "Unidentified error occurred");
                    }
                    return;
                } else {
                    continue;
                }
            }
        }
        function execSyncInstruction(instruction) {
            var n;
            switch(instruction.operation) {
                case Instructions.PushParam:
                    if (state.constants != null) {
                        n = state.constants[instruction.operand];
                        state.stack.push(n);
                    } else {
                        state.stack.push(null);
                    }
                break;
                case Instructions.PushDouble:
                    n = parseFloat(instruction.operand);
                    if (!isNaN(n)) {
                        state.stack.push(n);
                    } else {
                        state.stack.push(null);
                    }
                break;
                case Instructions.PushInt:
                    n = parseInt(instruction.operand, 10);
                    if (!isNaN(n)) {
                        state.stack.push(n);
                    } else {
                        state.stack.push(null);
                    }
                break;
                case Instructions.PushNull:
                    state.stack.push(null);
                break;
                case Instructions.PushBool:
                    state.stack.push(instruction.operand?true:false);
                break;
                case Instructions.PushString:
                    if (instruction.operand == null) {
                        state.stack.push(null);
                    } else {
                        state.stack.push(instruction.operand + "");
                    }
                break;
                case Instructions.Dump:
                    state.stack.pop();
                break;
                case Instructions.JumpIfNot:
                    if (instruction.argCount > 0) {
                        n = state.args[0];
                        if (!n) state.pc = instruction.operand; // Jump to the operand address
                        // TODO: Add check for the address
                    } else {
                        execOp.CompleteOperation(false, "JumpIfNot instruction has no argument");
                        return false;
                    }
                break;
                case Instructions.Jump:
                    state.pc = instruction.operand;
                    // TODO: Add check for the address
                break;
                case Instructions.GetVar:
                    n = state.helper.getEnv(instruction.operand,null);
                    //TODO: handle type carefully to exclude NaN
                    state.stack.push(n);
                break;
                case Instructions.SetVar:
                    if (state.args.length > 0) {
                        //TODO: handle type carefully to exclude NaN
                        n = state.args[0];
                        state.helper.setEnv(instruction.operand, n);
                        state.stack.push(n);
                    } else {
                        execOp.CompleteOperation(false, "SetVar not enough arguments.");
                        return false;
                    }
                break;
                default:
                    execOp.CompleteOperation(false, "Unrecognized instruction.");
                    return false;
            }
        }
        function execAsyncInstruction(instruction, args, op) {
            var cmd, operand, opaction, ctxFrom = null;
            switch (instruction.operation) {
                case Instructions.Call:
                case Instructions.CallRoot:
                case Instructions.CallParent:
                    if (instruction.operation == Instructions.CallRoot) ctxFrom = "root";
                    if (instruction.operation == Instructions.CallParent) ctxFrom = "parent";
                    var result = state.helper.findEx(instruction.operand, null, ctxFrom);
                    if (result != null) {
                        cmd = result.command;
                        state.commandContext = result.context;
                        if (BaseObject.isCallback(cmd.get_action())) {
                            opaction = BaseObject.applyCallback(cmd.get_action(), [args, api]);
                            if (BaseObject.is(opaction, "Operation")) {
                                opaction.transfer(op);
                            } else {
                                // opaction is the result value if it is not an operation.
                                op.CompleteOperation(true, opaction);
                            }
                        }
                        // TODO: Invalid actions???
                    } else {
                        execOp.CompleteOperation(false, "Call cannot find the command specified in the operand: " + instruction.operand);
                    }
                break;
            }
        }

        processInstruction(null);
        return execOp;    
    }
    //#endregion Execution

    //#region Build
    /**
     * Clears the entire program
     */
    CLNullLangRunner.prototype.clear = function() {
        this.$buildError = null;
        this.$program.splice(0);
    }
    /**
     * Adds new instruction to the program.
     */
    CLNullLangRunner.prototype.add = function(instruction) {
        this.$program.push(instruction);
        return this;
    }
    /**
     * Updates the operand of the instruction at address
     */
    CLNullLangRunner.prototype.update = function(address, operand) {
        if (address >= 0 && address < this.$program.length) {
            var instruction = this.$program[address];
            instruction.operand = operand;
            return true;
        }
        return false;
    }
    /**
     * Returns the next address to be occupied
     */
    CLNullLangRunner.prototype.address = function() {
        return this.$program.length;
    }
    CLNullLangRunner.prototype.complete = function(err) {
        if (err != null) {
            this.$buildError = err + "";
        }
        return this;
    }
    //#endregion Build

    //#region

    CLNullLangRunner.prototype.dumpProgram = function() {
        var s = "";
        if (this.$buildError != null) {
            s+= "Compile error: " + this.$buildError + "\n";
        }
        for (var i = 0; i < this.$program.length; i++) {
            s += (i + ":            ").slice(0,8) + _DumpInstruction(this.$program[i]) + "\n";
        }
        return s;
    }

    //#endregion



    //#endregion Runner


    //#region API
    /**
     * This is a separate class and not combined with the CommandContextHelper because it is passed to each command as API for
     * communication with the runtime.
     * 
     * @param {object} state - the internal execution state object.
     */
    function $CLNullLangAPI(state) {
        BaseObject.apply(this,arguments);
        this.state = state;
    }
    $CLNullLangAPI.Inherit(BaseObject,"$CLNullLangAPI");

    //#region Arguments (new)

    /**
     * Provides access to the arguments of the Call instruction.
     * @param {integer|null} idx - optional index, if present returns the indexed argument or null if index is out of range. If missing returns all the arguments as array 
     */
    $CLNullLangAPI.prototype.arguments = function(idx) { 
        if (arguments.length == 0 || idx == null) {
            return this.state.args;
        } else {
            if (typeof idx == 'number' && idx >= 0 && idx < arguments.length) {
                return this.state.args[idx];
            }
            return null;
        }
    }

    //#endregion

    //#region Environment

    /**
     * Gets the environment variable specified by key from teh first env context containing it.
     * @param {String} key
     * @param {any} defVal
     */
    $CLNullLangAPI.prototype.getEnv = function(key, defVal) {
        return this.state.helper.getEnv(key, defVal);
    }
    /**
     * Sets the variable in the environment of the top command context.
     * @param {string} key 
     * @param {any} val 
     * @returns {boolean} Success/failure
     */
    $CLNullLangAPI.prototype.setEnv = function(key, val) {
        return this.state.helper.setEnv(key, val);
    }
    $CLNullLangAPI.prototype.unsetEnv = function(key) {
        this.state.helper.unsetEnv(key);
    }
    /**
     * Exports the specified variables from the top environment context into the next one from the command context stack.
     * This is useful when data created inside a sub-context must become available in the outside.
     * @param {string*} arguments - the names of the variables to export.
     */
    $CLNullLangAPI.prototype.exportEnv = function(/* varnames */) {
        var top = this.state.helper.topEnvContext();
        if (top == null) return;
        var next = this.state.helper.topEnvContext(1);
        if (next == null) return;
        var x, y;
        for (var i = 0; i < arguments.length; i++) {
            x = arguments[i];
            y = top.getEnv(key);
            next.setEnv(x, y); // This will replace the var in the +1 context even if it does not exist in the top environment
            // TODO: Consider "exists" check for environments
        }
    }
    /**
     * Returns all the names of variable (from environment) from all levels of contexts 
     */
    $CLNullLangAPI.prototype.getAllEnvNames = function() {
        return this.state.helper.getEnvVarnames();
    }

    //#endregion Environment

    //#region Source context
    // Deals with the command context sourcing the currently executed command. 
    // Available only during the command execution!
    $CLNullLangAPI.prototype.get_application = function() {
        if (this.state != null && this.state.commandContext != null) {
            return this.state.commandContext.get_application();
        }
        return null;
    }
    $CLNullLangAPI.prototype.get_customContextData = function() {
        if (this.state != null && this.state.commandContext != null) {
            return this.state.commandContext.get_custom();
        }
        return null;
    }
    $CLNullLangAPI.prototype.get_commandContext = function() {
        if (this.state != null && this.state.commandContext != null) {
            return this.state.commandContext;
        }
        return null;
    }

    //#endregion

    $CLNullLangAPI.prototype.pushContext = function(ctx) {
        if (BaseObject.is(ctx, "ICommandContext")) {
            this.state.helper.pushContext(ctx);
        }
    }
    $CLNullLangAPI.prototype.pullContext = function() {
        return this.pullContext();
    }
    $CLNullLangAPI.prototype.get_currentcontext = function() {
        return this.state.helper.topContext();
    }
    /**
        Intended for extracting a new context from apps or other sources. Usually done 
        in order to call pushContext and change the current context for the next command(s)
    */
    $CLNullLangAPI.prototype.getContextFrom = function(source) {
        if (BaseObject.is(source,"ISupportsCommandContext")) {
            var ctx = source.get_commandcontext();
            if ( BaseObject.is(ctx,"ICommandContext") ) return ctx;
        }
        return null;
    }

    //#region Legacy compatibility

    // Obsolete - backward compatibility
    $CLNullLangAPI.prototype.pullNextToken = function() {
        return this.pullNextArgument();
    }
    // Obsolete - backward compatibility
    $CLNullLangAPI.prototype.pullNextTokenRaw = function() {
        return this.pullNextArgument();
    }
    $CLNullLangAPI.prototype.pullNextArgument = function() {
        if (this.state.args != null && this.state.args.length > 0) {
            return this.state.args.shift();
        }
        return null;
    }
    $CLNullLangAPI.prototype.peekNextArgument = function(n) {
        if (this.state.args != null && this.state.args.length > 0) {
            return this.state.args[0];
        }
        return null;
    }
    //#endregion Legacy compatibility
    
    //#region Runtime stack direct access
    // These methods are not recommended


    /**
     * Peeks at the stack beyond the arguments (they are already pulled). n counts from top
     */
    $CLNullLangAPI.prototype.stackPeekAt = function(n) {
        n = n || 0;
        if (typeof n != 'number') return null;
        if (Array.isArray(this.state.stack) && this.state.stack.length > 0) {
            var pos = this.state.stack.length - 1 - n;
            if (pos >= 0 && pos < this.state.stack.length) {
                return this.state.stack[pos];
            }
        }
        return null;
    }
    $CLNullLangAPI.prototype.stackDepth = function(n) {
        if (Array.isArray(this.state.stack)) {
            return this.state.stack.length;
        }
        return null;
    }
    //#endregion Runtime stack access

    //#endregion

})();