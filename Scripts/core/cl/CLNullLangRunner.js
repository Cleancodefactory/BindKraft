(function() {


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
        Halt: 13 // Exit program
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


    //#region Runner

    function CLNullLangRunner() {
        BaseObject.apply(this, arguments);
    }
    CLNullLangRunner.Inherit(BaseObject,"CLNullLangRunner");
    CLNullLangRunner.Instructions = Instructions;

    CLNullLangRunner.prototype.$program = new InitializeArray("The program");
    CLNullLangRunner.prototype.$buildError = null;

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
     * 
     * 
     * @param {} context 
     */
    CLNullLangRunner.prototype.exec = function(context) {
        var op = new Operation();
        // Execution registers
        var pc = 0; // Program counter
        var stack = [];
        var me = this;
        var interrupt = null;

        function _execInstruction(callback) {
            ///
        }
        function _callback(result, err) {
            if (err != null) {
                interrupt = { type: "error", message: err + ""};
            } else {
                stack.push(result)
            }
        }

        _execInstruction(_callback);



        return op;
    }


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
    CLNullLangRunner.prototype.
    /**
     * @param {ICommandContext} commandContext
     */
    CLNullLangRunner.prototype.execute = function(commandContext, hardLimit) {
        var ctx = this.$checkContext(commandContext);
        if (ctx == null) return Operation.Failed("Invalid command context");
        var contextStack = [commandContext];
        var pc = 0;
        var stack = [];
        function _context() {
            if (contextStack.length > 0) {
                return contextStack[contextStack.length - 1];
            }
            return null;
        }

        function processInstruction() {
            var instruction = this.$program[pc];
        }
        function execInstruction(instruction, args) {
            switch (instr.operation) {
                case Instructions.NoOp:
                    // Nothing - just increase the pc
                break;
                case Instructions.PushParam:
                    return Operation.Failed("PushParam not supported");
                break;
                case Instructions.Call:

                break;
            }
        }


        var instr;
        while (pc < this.$program.length) {
            /*  operation, operand, argCount */
            instr = this.$program[pc];
            switch (instr.operation) {
                case Instructions.PushParam:

                break;
                case Instructions.Call:
                break;
                case Instructions.PushDouble:
                break;
                case Instructions.PushInt:
                break;
                case Instructions.PushNull:
                break;
                case Instructions.PushBool:
                break;
                case Instructions.PushString:
                break;
                case Instructions.Dump:
                break;
                case Instructions.JumpIfNot:
                break;
                case Instructions.Jump:
                break;
                default:
            }
        }    
    }
    //#endregion Execution

    //#region Build
    /**
     * Clears the entire program
     */
    CLNullLangRunner.prototype.clear = function() {
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

})();