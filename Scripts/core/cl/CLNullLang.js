(function() {

    var CLNullLangRunner = Class("CLNullLangRunner");

    var Terms = {
        none: 0,
        // Space is found - usually ignored
        space: 1,
        // special literals for specific values - true, false, null, value
        specialliteral: 2,
        // Operator from the langlet
        keyword: 3,
        varidentifier: 4,
        // identifier - function name or parameter name to fetch (the actual fetching depends on the usage)
        // Addresses 0 - just found, 1 - end of first arg, last - 1 - last arg, last - after final element
        identifier: 5,
        // Open normal bracket (function call arguments, grouping is not supported intentionally - see the docs for more details)
        openbracket: 6,
        // close normal bracket - end of function call argument list.
        closebracket: 7,
        // string literal 'something'
        stringliteral: 8,
        // numeric literal like: 124, +234, -324, 123.45, -2.43, +0.23423 etc.
        numliteral: 9,
        // comma separator of arguments. can be used at top level also, in this case this will produce multiple results (usable only with the corresponding evaluation routines)
        comma: 10,
        // end of the expression
        end: 11,
        comment: 12,
        // Virtual tokens ===
        compound: 101
    }
    var Instructions = CLNullLangRunner.Instructions;
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
            pos: pos,
            arguments: 0,
            address0: null,
            address1: null,
            address2: null,
            _incArgs: function() {this.arguments ++;}
        }
    }




    var _regex = /(\s+)|(true|false|null)|(while|if|halt|noerrmode|normalmode)|(?:\$([a-zA-Z0-9_\.\-]+))|([/.]?[a-zA-Z_][a-zA-Z0-9_\.\-]*)|(\()|(\))|(?:\'((?:\\'|[^\'])*)\')|([\+\-]?\d+(?:\.\d*)?)|(,)|($)|(#.*?(?:\n|\r|$)+)/g;

    //#region Compiler

    function CLNullLang() {
        BaseObject.apply(this, arguments);
    }
    CLNullLang.Inherit(BaseObject, "CLNullLang");

    

    CLNullLang.prototype.compile = function(query) {
        var opstack = []; // Opentry
        opstack.incArgs = function() {
            if (this.length > 0) this[this.length - 1]._incArgs();
        }
        var runner = new CLNullLangRunner();
        var undecided = null; // Opentry
        var entry;
        var pos = 0, level = 0, curval = null, t;

        

        _regex.lastIndex = 0;
        var match;
        while (match = _regex.exec(query)) {
            if (pos != match.index) return runner.complete(_ReportError("Syntax error", match.index,query));
            pos = match.index + match[0].length;

            for (var i = 1; i < match.length; i++) {
                if (match[i] != null) {
                    curval = match[i];
                    switch (i) {
                        case Terms.keyword:
                            if (undecided != null) return runner.complete(_ReportError("Syntax error", match.index, query));
                            if (curval == "halt") {
                                runner.add(_Instruction(Instructions.Halt));
                                opstack.incArgs();
                            } else if (curval == "noerrmode") {
                                runner.add(_Instruction(Instructions.IgnoreErrors));
                                opstack.incArgs();
                            } else if (curval == "normalmode") {
                                runner.add(_Instruction(Instructions.NormalErrors));
                                opstack.incArgs();
                            } else {
                                undecided = OpEntry(curval, Terms.keyword, match.index);
                            }
                            break;
                        case Terms.varidentifier:
                            if (undecided != null) return runner.complete(_ReportError("Syntax error", match.index, query));
                            undecided = OpEntry(curval, Terms.varidentifier, match.index);
                            break;
                        case Terms.identifier:
                            if (undecided != null) return runner.complete(_ReportError("Syntax error", match.index, query));
                            undecided = OpEntry(curval, Terms.identifier, match.index);
                            break;
                        case Terms.openbracket:
                            if (undecided != null && undecided.term == Terms.varidentifier) {
                                opstack.push(undecided);
                                undecided = null;
                            } else if (undecided != null && undecided.term == Terms.identifier) {
                                opstack.push(undecided);
                                undecided = null;
                            } else if (undecided != null && undecided.term == Terms.keyword) {
                                undecided.address0 = runner.address();
                                opstack.push(undecided);
                                undecided = null;
                            } else if (undecided == null) {
                                opstack.push(OpEntry(null, Terms.compound, match.index));
                            }
                            break;
                        case Terms.closebracket:
                            if (undecided != null && undecided.term == Terms.varidentifier) {
                                opstack.incArgs();
                                runner.add(_Instruction(Instructions.PushVar, undecided.value)) // todo - count the args and identify errors (args count)
                                undecided = null;
                            } else if (undecided != null && undecided.term == Terms.identifier) {
                                opstack.incArgs();
                                runner.add(_Instruction(Instructions.PushParam, undecided.value));
                                undecided = null;
                            }
                            // Function call
                            if (opstack.length == 0) return runner.complete(_ReportError("Function call has no name", match.index, query));
                            entry = opstack.pop();

                            if (entry.term == Terms.varidentifier) {
                                opstack.incArgs();
                                runner.add(_Instruction(Instructions.PullVar, entry.value, entry.arguments));
                            } else if (entry.term == Terms.identifier) {
                                opstack.incArgs();
                                if (entry.value.charAt(0) == "/") {
                                    runner.add(_Instruction(Instructions.CallRoot, entry.value.slice(1), entry.arguments));
                                } else if (entry.value.charAt(0) == ".") {
                                    runner.add(_Instruction(Instructions.CallParent, entry.value.slice(1), entry.arguments));
                                } else {
                                    runner.add(_Instruction(Instructions.Call, entry.value, entry.arguments));
                                }
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
                            break;
                        case Terms.comma:
                            if (undecided != null && undecided.term == Terms.varidentifier) {
                                opstack.incArgs();
                                runner.add(_Instruction(Instructions.PushVar, undecided.value));
                                undecided = null;
                            } else if (undecided != null && undecided.term == Terms.identifier) {
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
                            break;
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
                            break;
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
                            break;
                        case Terms.stringliteral:
                            if (undecided != null) return runner.complete(_ReportError("Syntax error",undecided.pos,query));
                            runner.add(_Instruction(Instructions.PushString,curval));
                            opstack.incArgs();
                            break;
                        case Terms.space:
                        case Terms.comment:
                            break;
                        case Terms.end:
                            if (undecided != null && undecided.term == Terms.varidentifier) {
                                opstack.incArgs();
                                runner.add(_Instruction(Instructions.PushVar, undecided.value));
                                undecided = null;
                            } else if (undecided != null && undecided.term == Terms.identifier) {
                                opstack.incArgs();
                                runner.add(_Instruction(Instructions.PushParam, undecided.value));
                                undecided = null;
                            }
                            if (opstack.length == 0) {
                                runner.add(_Instruction(Instructions.NoOp));
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

    

})();