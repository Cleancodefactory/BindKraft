/* 
	A project for direct interpreter/executor practically compatible with the CommandLine and the related.
	
	This class works in two phases:
	- preparsing - produces tokens that have partially determined nature
	- execution - stack machine execution of the preparsed data
*/
function CLEngine() {
	BaseObject.apply(this,arguments);
}
CLEngine.Inherit(BaseObject, "CLEngine");
// Constants
CLEngine.End = { end: "CommandLine exhausted!"};
// Utils
CLEngine.repString = /\\(n)|\\(r)|\\(t)|\\(\')|\\(\S)/g;
CLEngine.unescapeFullString = function (s) { // TODO: Needs change for better syntax
	if (typeof s == "string") {
		return s.replace(CLEngine.repString,function(match, g1) {
			switch (g1) {
				case "n":
					return "\n";
				case "r":
					return "\r";
				case "'":
					return "'";
				default:
					return g1;
			}
		});
	} else {
		return s;
	}
}
CLEngine.parseNumber = function(s) {
	if (s.indexOf(".") >= 0) {
		return parseFloat(s);
	} else {
		return parseInt(s,10);
	}
}
CLEngine.parseHexNumber = function(s) {
	return parseInt(s,16);
	
}

// Pre-parsed assets - used by the executor
//CLEngine.prototype.$commandLine = new InitializeArray("The pre-parsed command line"); 
//CLEngine.prototype.$labelIndex = new InitializeObject("The command line's label index");




////////////////////////////////////////////////////////
// Parser
////////////////////////////////////////////////////////
CLEngine.reTokens = [
	{ type: "space",		re: /(\s+)/g, skip: true },
	{ type: "string",   	re: /\'((?:\\'|[^'])*)\'/g, proc: CLEngine.unescapeFullString, priority: 0, rtype: "literal"  }, // Lacks new line support
	{ type: "number",   	re: /([+\-]?[0-9]+(?:\.[0-9]+)?)/g, proc: CLEngine.parseNumber, priority: 0, rtype: "literal" },
	{ type: "hex",   		re: /(?:0x([0-9a-fA-F]+))/g, proc: CLEngine.parseHexNumber, priority: 0, rtype: "literal"  },
	{ type: "null",   		re: /(null)(?=\b)/g, proc: CLEngine.parseHexNumber, priority: 0, rtype: "literal"  },
	{ type: "bool",   		re: /(true|false)(?=\b)/g, proc: CLEngine.parseHexNumber, priority: 0, rtype: "literal"  },
	{ type: "brnopen",    	re: /(\()/g, 	priority: 3 },
	{ type: "brsopen",		re: /(\[)/g,	priority: 4, alternate: "not supported in this version" },
	{ type: "brcopen", 		re: /(\{)/g, 	priority: 4, alternate: "not supported in this version" },
	{ type: "brnclose",    	re: /(\))/g, 	priority: 3 },
	{ type: "brsclose",		re: /(\])/g, 	priority: 4, alternate: "not supported in this version" },
	{ type: "brcclose",		re: /(\})/g, 	priority: 4, alternate: "not supported in this version" },
	
	{ type: "dualop",   re: /(or|and|xor)/g, priority: 60 },
	{ type: "dualop",   re: /(\=\>|\>\=|\<\=|\=\=)/g, priority: 50 },
	{ type: "dualop",   re: /(\<|\>)/g, priority: 50 },
	{ type: "dualop",   re: /(\*|\/)/g, priority: 20 },
	{ type: "dualop",   re: /(\+|\-)/g, priority: 30 },
	{ type: "assign",   re: /(\=)(?!\=)/g, priority: 80 },
	{ type: "assign",   re: /(\:)(?!\:)/g, priority: 80, alternate: "not supported in this version" },

	{ type: "ident",   	re: /([a-zA-Z\_\$][a-zA-Z0-9\_\$]*)/g, priority: 15 },
	{ type: "endop",   	re: /(;)/g, priority: 100 },
	{ type: "commaop",  re: /(\,)/g, priority: 90 }
	
];
CLEngine.instruction = function(instr, operand, args, pos) {
	return [instr, operand, nargs, pos];
}
CLEngine.instructions = { 
	"exec": 0x01,
	"pushvar": 0x02,
	"pushval": 0x03,

	// Duals
	"or": 0x10,
	"and":0x11,
	"xor":0x12,
	"geq":0x13, // >=
	"leq":0x14, // <=
	"equ":0x15, // ==
	"arw":0x16, // =>
	"les":0x17, // <
	"gtr":0x18, // >
	"mul":0x19, // *
	"div":0x1A, // /
	"add":0x1B, // +
	"sub":0x1C, // -
	"asn":0x1F, // =
}
/*
	// mode - parse what: statement, object literal, array literal.
	pos - the position at which to attempt recognition
*/
CLEngine.prototype.$eatToken = function(obj_tokenizer, strLine, pos, /*[]*/ tknLine) {
	var match, v;
	var tokenizer = obj.tokenizer;
	// for (var i = 0; i < CLEngine.reTokens.length; i++) {
	for (var i = 0; i < tokenizer.length; i++) {
		var retkn = tokenizer[i];
		retkn.re.lastIndex = pos;
		match = retkn.re.exec(strLine);
		if (match != null && match.index == pos) {
			v = match[1];
			if (typeof retkn.proc == "function") {
				v = retkn.proc(v);
			}
			if (retkn.skip != true) {
				tknLine.push({ 
						type: retkn.type, 
						value: v, 
						pos: pos, 
						priority: retkn.priority, 
						rtype: retkn.rtype});
			}
			if (retkn.alternate != null) obj_tokenizer.tokenizer = retkn.alternate;
			return match[0].length; // caller must add to the pos
		}
	}
	return -1;
}
CLEngine.prototype.tokenizeLine = function(strLine) {
	var tknLine = [];
	var pos = 0;
	var str = strLine;
	var obj_tokenizer = { tokenizer: CLEngine.reTokens };
	//var mode = { stack: []}; // Mode stack if empty parsing statements otherwise object {} or array []
	// Prio
	do {
		var n = this.$eatToken(tokenizer, str, pos, tknLine);
		if (typeof obj_tokenizer.tokenizer == "string") {
			return obj_tokenizer.tokenizer + " at " + pos + " (" + str.slice(pos,50) + "...)";
		}
		if (n > 0) {
			pos += n;
			if (pos >= str.length) break;
			continue;
		} else {
			return "cannot tokenize at " + pos + " (" + str.slice(pos,50) + "...)";
		}
		
	} while (true);
	return tknLine;
}
CLEngine.prototype.processLine = function(arr) {
	var instruction = null;
	var _next = null;
	var undecided = null;
	var opstack = [];
	var item; // Current token

	var _vstack = [];
	var _item;
	var program = [];

	function _findItemTypeInOpStack(itemType) {
		var i;
		for (i = opstack.length - 1;i >= 0; i--) {
			var item = opstack[i];
			if (item.type == itemType) return i;
		}
		return -1;
	}
	function _getItemByTypeFromOpstack(itemType) {
		var i = _findItemTypeInOpStack(itemType);
		if (i >= 0) return opstack[i];
		return null;
	}
	function _processOpStackOnCloseBracket() {
		var bracket = _getItemByTypeFromOpstack(brnopen);
	}
	function _processOpStackToPriority(topriority) {
		var top = _peekStack(opstack);
		if (top != null) {

		}

	}
	function _peekStack(stack, _n) {
		var n = _n || 0;
		var l = stack.length - n - 1;
		if (l < 0) return null;
		return stack[l];
	}

	for (var i = 0; i < arr.length; i++) {
		_next = null;
		if (i < arr.length - 1) _next = arr[i+1];
		var item = arr[i];

		if (item.rype == "literal") {
			// put literal instruction into program
			program.push(CLEngine.instruction(CLEngine.instructions.pushval, item.value, 0, item.pos));
			continue;
		} else if (item.type == "ident") {
			if (_next.type == "brnopen") { // function call
				instruction = CLEngine.instruction(CLEngine.instructions.exec, item.value, -1, item.pos);
				program.push(instruction);
				// Record the exec instruction ref with the bracket
				_next.exec = instruction; // args will be incremented on each coma and on close bracket
				continue;
			} else { // grouping
				opstack.push(item); // Maybe we need to recognize this exact open bracket
				continue;
			}
		} else if (item.type == "dualop") {

		}

		
		// TODO: Continue
	}
}

// Old code for reference

// Constants
/**
	First pass
	1 - { }
	2 - '' full string
	3 - [] array
	4 - 00 - number
	5 - hex - positive hexdecimal number
	6 - idn - identifier string
*/
CLEngine.reExpressionLevel1 = /(?:(?:\s|;)*(?:(?:\{((?:\\\S|[^\}])*)\})|(?:\'((?:\'\'|\\\S|[^\'])*)\')|(?:\[([^\]]*)\])|([+-]?[0-9]+(?:\.[0-9]+)?(?=\s|,|;|$))|(?:0x([0-9a-fA-F]+)(?=\s|,|;|$))|([^;\}\{\"\[\'\]\s]+)))/g;
/**
	Object parse
	names:
	1 - name string - full string
	2 - name ident - name as identifier string
	values:
	3 - Number
	4 - full string
	5 - hex - positive hexdecimal
	6 - identifier
	
*/
CLEngine.reExpressionLevel2 = /(?:(?:^|\s|,|;)*(?:(?:\'((?:\\\S|[^\'])+)\')|([a-zA-Z_][a-zA-Z0-9_\-]*)):(?:([+-]?[0-9]+(?:\.[0-9]+)?(?=\}|\s|,|;|$))|(?:0x([0-9a-fA-F]+)(?=\}|\s|,|;|$))|(?:\'((?:[^\']|\\\S|\'\')*)\')|([^\,;\}\{\"\[\'\]\s]+))(?:,|$|;|\s))/g;



/**
	There is no need to keep the labels in the parsed command line, so the callback can return true if it wants them removed after recording the position
	stdLabelCallback does that
*/
CLEngine.stdLabelCallback = function(labels, current, pos) {
	if (typeof current == "string" && current.indexOf(":") == 0 && current.length > 1) {
		labels[current.slice(1)] = pos;
		return true;
	}
	return false;
}
/*
	Pre-parsed entry
	{
		scope: 0|1|-1, // 0 no scope change, 1 - open scope, -1 - close scope
		token: string|float|int|bool|object,
		type:	primary type of the token
		subtype: scondary type of the token
	}

*/

/**
	Parses a string command line (can be multiline)
	if index is an object also strips down the labels with the labelcallback (if supplied or stdLabelCallback if it is not)
	Normally labels are :labelname tokens, but with custom callback they can be different, but theey have to be identifier strings
	@param exrstring  	string 		- the code
	@param index 		{object} 	- label index
	@param labelcallback{callback}	- if you want custom label syntax
	@param meta 		{Array}		- optional parallel array for meta data for each resulting token/element (more info about this - see the general class description)
*/
CLEngine.parseExpression = function(exrstring,index,labelcallback,meta) {
	var callback = function() {};
	if (typeof index == "object" && index != null) {
		callback = labelcallback || CLEngine.stdLabelCallback;
	}
	var arr = []; // The pre-parsed command line
	var scope,scopes_stack = [];
	var newscope = false;
	
	if (typeof exrstring == "string") {
		var r = CommandLine.reExpressionLevel1;
		var _scope; // var for temporary scope ref
		r.lastIndex = 0;
		var earr = null, pos = 0;
		while (earr = r.exec(exrstring)) { // Level 1
			if (earr[6] != null) { // Check if this is a label (labels are not recoreded in the pre-parsed CL - they are parallel
				if (BaseObject.callCallback(callback,index, earr[6], pos)) {
					continue;
				} else if (earr[6] == "(") {
					arr.push({ scope: 1 }); // open scope
					continue;
				} else if (earr[6] == ")") {
					_scope = scopes_stack.pop();
					_scope.end = pos;
					continue;
				}
			}
			
			pos++;
			var topscope = (scopes_stack.length > 0)?scopes_stack[scopes_stack.length -1]:null;
			
			if (earr[1] != null) { // Object
				arr.push(this.parseExpressionObject(earr[1]));
				if (BaseObject.is(meta,"Array")) {
					meta.push({scope: topscope, scopestart: newscope, type: "object"});
				}
			} else if (earr[2] != null) { // full string
				arr.push(this.unescapeFullString(earr[2]));
				if (BaseObject.is(meta,"Array")) {
					meta.push({scope: topscope, scopestart: newscope, type: "string"});
				}
			} else if (earr[3] != null) { // Array
				throw "Array on comand line is not supported yet";
				if (BaseObject.is(meta,"Array")) {
					meta.push({scope: topscope, scopestart: newscope, type: "array"});
				}
			} else if (earr[4] != null) { // Number
				if (earr[4].indexOf(".") >= 0) {
					arr.push(parseFloat(earr[4]));
					if (BaseObject.is(meta,"Array")) {
						meta.push({scope: topscope, scopestart: newscope, type: "number", subtype: "double", notation: "dec"});
					}
				} else {
					arr.push(parseInt(earr[4], 10));
					if (BaseObject.is(meta,"Array")) {
						meta.push({scope: topscope, scopestart: newscope, type: "number", subtype: "integer", notation: "dec"});
					}
				}
			} else if (earr[6] != null) { // Identifier string
				arr.push(earr[6]);
				if (BaseObject.is(meta,"Array")) {
					meta.push({scope: topscope, scopestart: newscope, type: "string", subtype: "identifier"});
				}
			} else if (earr[5] != null) { // Number
				arr.push(parseInt(earr[5], 16));
				if (BaseObject.is(meta,"Array")) {
					meta.push({scope: topscope, scopestart: newscope, type: "number", subtype: "integer", notation: "hex"});
				}
				
			}
			newscope = false;
			// Additional metadata
			
		}
	}
	return arr;
}

