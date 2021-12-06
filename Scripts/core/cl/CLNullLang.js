(function() {

    var Terms = {
        none: 0,
        // Space is found - usually ignored
        space: 1,
        // special literals for specific values - true, false, null, value
        specialliteral: 2,
        // Operator from the langlet
        keyword: 3,
        // identifier - function name or parameter name to fetch (the actual fetching depends on the usage)
        // Addresses 0 - just found, 1 - end of first arg, last - 1 - last arg, last - after final element
        identifier: 4,
        // Open normal bracket (function call arguments, grouping is not supported intentionally - see the docs for more details)
        openbracket: 5,
        // close normal bracket - end of function call argument list.
        closebracket: 6,
        // string literal 'something'
        stringliteral: 7,
        // numeric literal like: 124, +234, -324, 123.45, -2.43, +0.23423 etc.
        numliteral: 8,
        // comma separator of arguments. can be used at top level also, in this case this will produce multiple results (usable only with the corresponding evaluation routines)
        comma: 9,
        // end of the expression
        end: 10,
        // Virtual tokens ===
        compound: 101
    }
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
        Jump: 10 // (jumpaddress), 0 arg
    }
    function _Instruction(operation, operand, argcount) {
        return {
            operation: operation,
            operand: operand,
            argCount: argcount || 0
        }
    }
    function _EmptyInstruction() {
        return {
            operation: Instructions.NoOp,
            operand: null,
            argCount: 0
        }
    }

    function _ReportError(message, index, source) {
        var s = "error at " + index + ": " + message;
        if (source != null) s+= "\n" + source.slice(0, index) + "[ERR]";
        return s;
    }
    function OpEntry(val, term, pos) {
        return {
            value: val,
            term: term,
            pos: pos || -1,
            arguments: 0,
            address0: null,
            address1: null,
            address2: null,
            incArgs: function() {this.arguments ++;}
        }
    }




    var _regex = /(\s+)|(true|false|null)|(while|if)|([a-zA-Z_][a-zA-Z0-9_\.\-]*)|(\()|(\))|(?:\'((?:\\'|[^\'])*)\')|([\+\-]?\d+(?:\.\d*)?)|(\,|(?:\r|\n)+)|($)/g;

    //#region Compiler

    function CLNullLang() {
        BaseObject.apply(this, arguments);
    }
    CLNullLang.Inherit(BaseObject, "CLNullLang");

    

    CLNullLang.prototype.compile = function(query) {
        var opstack = []; // Opentry
        opstack.incArgs = function() {
            if (this.length > 0) this[this.length - 1].incArgs();
        }
        var runner = new CLNullLangRunner();
        var undecided = null; // Opentry
        var entry;
        var pos = 0, level = 0, curval = null, t;

        

        _regex.lastIndex = 0;
        var match;
        while (match = _regex.exec(query)) {
            if (pos != match.index) runner.complete(_ReportError("Syntax error", match.index,query));
            pos = match.index + match.length;

            for (var i = 1; i < match.length; i++) {
                if (match[i] != null) {
                    curval = match[i];
                    switch (i) {
                        case Terms.keyword:
                            if (undecided != null) runner.complete(_ReportError("Syntax error", match.index, query));
                            undecided = OpEntry(curval, Terms.keyword, match.index);
                            continue;
                        case Term.identifier:
                            if (undecided != null) runner.complete(_ReportError("Syntax error", match.index, query));
                            undecided = OpEntry(curval, Terms.keyword, match.index);
                            continue;
                        case Terms.openbracket:
                            if (undecided != null && undecided.term == Term.identifier) {
                                opstack.push(undecided);
                                undecided = null;
                            } else if (undecided != null && undecided.term == Terms.keyword) {
                                undecided.address0 = runner.address();
                                opstack.push(undecided);
                                undecided = null;
                            } else if (undecided == null) {
                                opstack.push(OpEntry(null, Terms.compound, match.index));
                            }
                            continue;
                        case Terms.closebracket:
                            if (undecided != null && undecided.term == Terms.identifier) {
                                undecided.incArgs();
                                runner.add(_Instruction(Instructions.PushParam, undecided.value));
                                undecided = null;
                            }
                            // Function call
                            if (opstack.length == 0) return runner.complete(_ReportError("Function call has no name", match.index, query));
                            entry = opstack.pop();
                            if (entry.term == Terms.identifier) {
                                opstack.incArgs();
                                runner.add(_Instruction(Instructions.Call, entry.value, entry.arguments));
                            } else if (entry.term == Terms.keyword) {
                                opstack.incArgs();
                                if (entry.value == "if") {
                                    if (entry.arguments == 2) {
                                        runner.add(_Instruction(Instructions.Jump, runner.address() + 2));
                                        runner.update(entry.address1,runner.address());
                                        runner.add(_Instruction(Instructions.PushNull));
                                    } else if (entry.arguments == 3) {
                                        runner.update(entry.address2, runner.address());
                                    } else {
                                        return runner.complete(_ReportError("if must have 2 or 3 arguments", match.index, query));
                                    }
                                } else if (entry.value == "while") {
                                    if (entry.arguments == 2) {
                                        runner.add(_Instruction(Instructions.Dump, null, 1));
                                        runner.add(_Instruction(Instructions.Jump, entry.address0)); // Jump to the initial condition
                                        runner.update(entry.address1, runner.address()); // Update initial JumpIfNot to go after the end
                                        runner.add(_Instruction(Instructions.PushNull)); // Push something to keep the illusion that something is returned.
                                    } else {
                                        return runner.complete(_ReportError("while must have 2 arguments", match.index, query));
                                    }
                                } else {
                                    return runner.complete(_ReportError("Unexpected end of control operator", match.index, query));
                                }
                            } else if (entry.term == Terms.compound) {
                                opstack.incArgs();
                            } else {
                                return runner.complete(_ReportError("Syntax error", match.index, query));
                            }
                            continue;
                        case Terms.comma:
                            if (undecided != null && undecided.term == Terms.identifier) {
                                opstack.incArgs();
                                runner.add(_Instruction(Instructions.PushParam, undecided.value));
                                undecided = null;
                            } else if (undecided != null) {
                                return runner.complete(_ReportError("Syntax error", match.index, query));
                            }

                            if (opstack.length == 0 || opstack[opstack.length-1].term == Terms.compound) {
                                // dump all values except the last one.
                                runner.add(_Instruction(Instructions.Dump, null, 1));
                            } else if (opstack[opstack.length - 1].term == Terms.keyword) {
                                // In the middle of an operator
                                entry = opstack[opstack.length - 1];
                                if (entry.arguments == 1) {
                                    entry.address1 = runner.address();
                                    runner.add(_Instruction(Instructions.JumpIfNot, -1, 1));
                                } else if (entry.arguments == 2) {
                                    if (entry.address1 >= 0) {
                                        if (entry.value == "if") {
                                            entry.address2 = runner.address();
                                            runner.add(_Instruction(Instructions.Jump, -1));
                                            runner.update(entry.address1, runner.address());
                                        } else if (entry.value == "while") {
                                            return runner.complete(_ReportError("while has more than 2 arguments", match.index, query));
                                        } else {
                                            return runner.complete(_ReportError("Syntax error", match.index,query));
                                        }
                                    }
                                } else {
                                    return runner.complete(_ReportError("while or if operator composition error", match.index, query));
                                }
                            }
                            continue;
                        case Terms.numliteral:
                            if (undecided != null) return runner.complete(_ReportError("Syntax error",undecided.pos, query));
                            if (curval.indexOf('.') >= 0) { // double
                                t = parseFloat(curval);
                                if (!isNaN(t)) {
                                    runner.add(_Instruction(Instructions.PushDouble, t));
                                    opstack.incArgs();
                                } else {
                                    return runner.complete(_ReportError("Invalid double literal", match.index, query));
                                }
                            } else {
                                t = parseInt(curval, 10);
                                if (!isNaN(t)) {
                                    runner.add(_Instruction(Instructions.PushInt, t));
                                    opstack.incArgs();
                                } else {
                                    return runner.complete(_ReportError("Invalid integer literal",match.index, query));
                                }
                            }
                            continue;
                        case Terms.specialliteral:
                            if (undecided != null) return runner.complete(_ReportError("Syntax error",undecided.pos,query));
                            if (curval == "null") {
                                runner.add(_Instruction(Instructions.PushNull, null));
                            } else if (curval == "true") {
                                runner.add(_Instruction(Instructions.PushBool, true));
                            } else if (curval == "false") {
                                runner.add(_Instruction(Instructions.PushBool, false));
                            } else {
                                return runner.complete(_ReportError("Syntax error - unknown literal",match.index, query));
                            }
                            opstack.incArgs();
                            continue;
                        case Terms.stringliteral:
                            if (undecided != null) return runner.complete(_ReportError("Syntax error",undecided.pos,query));
                            runner.add(_Instruction(Instructions.PushString,curval));
                            opstack.incArgs();
                            continue;
                        case Terms.space:
                            continue;
                        case Terms.end:
                            if (undecided != null && undecided.term == Terms.identifier) {
                                opstack.incArgs();
                                runner.add(_Instruction(Instructions.PushParam, undecided.value));
                                undecided = null;
                            }
                            if (opstack.length == 0) {
                                return runner.complete();
                            } else {
                                return runner.complete(_ReportError("Syntax error - unexpected end of script",match.index));
                            }
                            break;
                        default:
                            return runner.complete(_ReportError("Syntax error", match.index, query));
                            
                    }
                }
            }
        }
        return runner.complete(_ReportError("Parsing the script failed"));
    }

    //#endregion Compiler

    //#region Runner

    function CLNullLangRunner() {
        BaseObject.apply(this, arguments);
    }
    CLNullLangRunner.Inherit(BaseObject,"CLNullLangRunner");

    CLNullLangRunner.prototype.$program = new InitializeArray("The program");
    CLNullLangRunner.prototype.$buildError = null;


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
    //#endregion

    //#endregion Runner

})();