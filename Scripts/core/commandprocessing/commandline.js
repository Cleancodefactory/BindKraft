/**
	This class parses and holds the result of a command line parsing. The primary pattern of intended usage 
	id to create a new CommandLine instance for each command line. Thus the usuall procedure cnsists of 
	creating a new command line object passing the raw command line to the constructor.
	
	Omce parsed the tokens are element of an array kept intenally(*) and each token can be collected in the
	following form:
	{ token: <string>|<number>|<object>|<array>
		meta: { type: one of the above types,
				subtype: double | integer | identifier,
				........
				}
				See the details in the docs of the cmdline's next method.
		
	The array of tokens and the parallel meta are kept inside the CommandLine object and additionally there is the $commandIndex
	object that contains labels and their pos in the array (for jumps, calls and similar techniques)


	@desc When a subtype is not necessary it remains undefined, but for the sake of future development
	token recognition that needs subtype sometimes should check if it is what it expets allways. Depending 
	on the subtype only is considered a mistake and may cause problems in future even if it isn't with the
	current version of the framework.


*/
function CommandLine(cmdline, advancedmode) {
	BaseObject.apply(this,arguments);
	if (typeof cmdline == "string") {
		
		var arr = CommandLine.parseExpression(cmdline, this.$programIndex,null,this.$meta);
		this.$commandLine = arr;
		this.$advancedmode = (advancedmode === true); // This must be set explicitly
	} else if (BaseObject.is(cmdline, "CommandLine")) { // Clone construction
		// in this case the advancedmode argument is the pos to move to (if it is a number)
		this.$meta = cmdline.$meta;
		this.$commandLine = cmdline.$commandLine;
		this.$programIndex = cmdline.$programIndex;
		this.$position = cmdline.$position;
		this.$stack = cmdline.$stack;
		this.$advancedmode = true;
		if (typeof advancedmode == "number") { // clear exec data and jump to a position
			this.reset();
			this.set_position(advancedmode);
		} else if (typeof advancedmode == "string") { // clear exec data and jump to a label
			this.reset();
			this.set_position(this.label(advancedmode));
		}
		this.$advancedmode = cmdline.$advancedmode;
	}
	
}
CommandLine.Inherit(BaseObject,"CommandLine");
CommandLine.prototype.clone = function(pos_or_label) {
	return new CommandLine(this,pos_or_label);
}
CommandLine.prototype.$advancedmode = false;
CommandLine.prototype.$meta = new InitializeArray("Parallel to $commandLine - metainfo for each element there.");
CommandLine.prototype.$commandLine = new InitializeArray("The command line");
/**
	Gets the command line in compacted form
*/
CommandLine.prototype.get_commandline = function() {
	var cl = [];
	
	for(var i = 0; i < this.$commandLine.length;i++) {
		cl.push({
			pos: i,
			label: this.labelAt(i),
			token: this.$commandLine[i],
			meta: this.$meta[i],
			scopeborder: this.isScopeBorder(i)
		});
	}
	return cl;
}
CommandLine.prototype.labelAt = function(pos) {
	for (var k in this.$programIndex) {
		if (this.$programIndex[k] == pos) return k;
	}
	return null;
}
CommandLine.prototype.$programIndex = new InitializeObject("The command line's label index");
CommandLine.prototype.get_commandIndex = function() {
	return BaseObject.DeepClone(this.$programIndex);
}
CommandLine.prototype.$scopes = new InitializeArray("");
CommandLine.prototype.$position = 0;
CommandLine.prototype.get_position = function() { return this.$position; }
CommandLine.prototype.set_position = function(v) {
	if (!this.$advancedmode) throw "set_position is allowed in advanced mode only";
	if (v >= 0 && v < this.$commandLine.length) {
		this.$position = v;
	}
}
CommandLine.prototype.$stack = new InitializeArray("optional stack for advanced execution");
CommandLine.prototype.pushpos = function() {
	if (!this.$advancedmode) throw "pushpos is allowed in advanced mode only";
	this.$stack.push(this.get_position());
}
CommandLine.prototype.poppos = function() {
	if (!this.$advancedmode) throw "poppos is allowed in advanced mode only";
	var p = this.$stack.pop();
	this.set_position(p);
}
CommandLine.prototype.reset = function() {
	if (!this.$advancedmode) throw "reset is allowed in advanced mode only";
	this.set_position(0);
	this.$stack = [];
}
CommandLine.prototype.call = function(pos) {
	if (!this.$advancedmode) throw "call is allowed in advanced mode only";
	this.pushpos();
	this.set_position(pos);
}
CommandLine.prototype.ret = function() {
	if (!this.$advancedmode) throw "ret is allowed in advanced mode only";
	this.poppos();
}
CommandLine.prototype.label = function(label) {
	var pos = this.$programIndex[label];
	if (typeof pos == "number" && !isNaN(pos)) {
		return pos;
	}
	return null;
}
CommandLine.prototype.jump = function (pos) { // unconditional jump
	if (!this.$advancedmode) throw "call is allowed in advanced mode only";
	this.set_position(pos);
}
CommandLine.prototype.totalTokens = function() {
	return this.$commandLine.length;
}
CommandLine.prototype.getScope = function(pos /*optional = current*/) {
	var i = [(pos != null)?pos:this.get_position()];
	if (i >=0 && i < this.totalTokens()) {
		var m = this.$meta[i];
		if (m != null) return m.scope;
	}
	return null;
}
CommandLine.prototype.areScopesEqual = function(s1,s2) {
	if (s1 == null && s2 == null) return true;
	if (s1 == s2) return true;
	if ((s1 != null && s2 == null) || (s1 == null && s2 != null)) return false;
	if (s1.start == s2.start && s1.end == s2.end) return true;
	return false;
}
CommandLine.prototype.isScopeBorder = function(pos /*optional = current */) { // part of the argument border calculation
	var p = pos || this.get_position();
	if (p < this.totalTokens() - 1) {
		return !this.areScopesEqual(this.getScope(p), this.getScope(p + 1));
	} else {
		return true;
	}
	return false;
}
/**
	To avoid the need to reserve a value for indicating end of the command line, this is provided as an object reference for comparisons.
	Use it this way for example:
	do (cmd = commandline.next()) {
		if (cmd == CommandLine.End) break;
		... some code ...
	}
*/
CommandLine.End = { end: "CommandLine exhausted!"};
/**
	returns the next element from the command line and advances the position one step
	returned element is combined with the meta data:
	{ token: <string>|<number>|<object>|<array>
		meta: { type: one of the above types,
				subtype: double | integer | identifier,
				scope: { start: <integer, end: <integer>, // The last element of the scope (incluive)
						 newscope: <bool>
						}
				}
	
	
*/
CommandLine.prototype.next = function() {
	if (this.get_position() >= 0 && this.get_position() < this.$commandLine.length) {
		var r = { token: this.$commandLine[this.get_position()], meta: this.$meta[this.get_position()]};
		this.$position ++;
		return r;
	} else {
		return CommandLine.End;
	}
}
/** Peeks the n pos ahead/behind (when negative) of the current position
	returns the same kind of result like next.
*/
CommandLine.prototype.peekrel = function(n) {
	var pos = this.get_position() + n;
	if (pos >= 0 && pos < this.$commandLine.length) {
		var r = { token: this.$commandLine[pos], meta: this.$meta[pos]};
		return r;
	} else {
		return CommandLine.End;
	}
}
/**
	Like peekrel, but absolute pos is given
*/
CommandLine.prototype.peekabs = function(n) {
	var pos = n;
	if (pos >= 0 && pos < this.$commandLine.length) {
		var r = { token: this.$commandLine[pos], meta: this.$meta[pos]};
		return r;
	} else {
		return CommandLine.End;
	}
}



// Old one for reminder
// CommandLine.reExpressionLevel1_ = /(?:\s*(?:(?:\{((?:\\\{|\\\}|[^\}])*)\})|(?:\'((?:\'\'|[^\'])*)\')|(\S+)))/g;
/**
	First pass
	1 - { }
	2 - '' full string
	3 - [] array
	4 - 00 - number
	5 - hex - positive hexdecimal number
	6 - idn - identifier string
*/
CommandLine.reExpressionLevel1 = /(?:(?:\s|;)*(?:(?:\{((?:\\\S|[^\}])*)\})|(?:\'((?:\'\'|\\\S|[^\'])*)\')|(?:\[([^\]]*)\])|([+-]?[0-9]+(?:\.[0-9]+)?(?=\s|,|;|$))|(?:0x([0-9a-fA-F]+)(?=\s|,|;|$))|([^;\}\{\"\[\'\]\s]+)))/g;
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
CommandLine.reExpressionLevel2 = /(?:(?:^|\s|,|;)*(?:(?:\'((?:\\\S|[^\'])+)\')|([a-zA-Z_][a-zA-Z0-9_\-]*)):(?:([+-]?[0-9]+(?:\.[0-9]+)?(?=\}|\s|,|;|$))|(?:0x([0-9a-fA-F]+)(?=\}|\s|,|;|$))|(?:\'((?:[^\']|\\\S|\'\')*)\')|([^\,;\}\{\"\[\'\]\s]+))(?:,|$|;|\s))/g;
CommandLine.repString = /\\(\S)|\'(\')/g;
CommandLine.unescapeFullString = function (s) {
	if (typeof s == "string") {
		return s.replace(CommandLine.repString,"$1$2");
	} else {
		return s;
	}
}
CommandLine.parseExpressionObject = function(ostr) {
	var o = {};
	if (typeof ostr == "string" && ostr.length > 0) {
		var r = CommandLine.reExpressionLevel2;
		r.lastIndex = 0;
		var earr = null;
		while (earr = r.exec(ostr)) {
			var name = null;
			var value = null;
			if (earr[1]!=null) {
				name = this.unescapeFullString(earr[1]);
			} else if (earr[2] != null) {
				name = earr[2];
			}
			if (typeof name != "string") {
				// TODO: May be exception?
				continue;
			}
			if (earr[3] != null) {
				if (earr[3].indexOf(".") >= 0) {
					value = parseFloat(earr[3]);
				} else {
					value = parseInt(earr[3], 10);
				}
			} else if (earr[4] !=null) {
				value = this.unescapeFullString(earr[4]);
			} else if (earr[6] != null) {
				value = earr[6];
			} else if (earr[5] != null) {
				value = parseInt(earr[5],16);
			}
			o[name] = value;
		}
	}
	return o;
}
/**
	There is no need to keep the labels in the parsed command line, so the callback can return true if it wants them removed after recording the position
	stdLabelCallback does that
*/
CommandLine.stdLabelCallback = function(labels, current, pos) {
	if (typeof current == "string" && current.indexOf(":") == 0 && current.length > 1) {
		labels[current.slice(1)] = pos;
		return true;
	}
	return false;
}
// CommandLine.prototype.parseExpression = function(exrstring, labelcallback) {
	// this.$commandLine = this.$parseExpression(exrstring, this.$programIndex, labelcallback, this.$meta);
	// if (BaseObject.is(this.$commandLine,"Array")) return true;
	// return false;
// }
/**
	Parses a string command line (can be multiline)
	if index is an object also strips down the labels with the labelcallback (if supplied or stdLabelCallback if it is not)
	Normally labels are :labelname tokens, but with custom callback they can be different, but theey have to be identifier strings
	@param exrstring  	string 		- the code
	@param index 		{object} 	- label index
	@param labelcallback{callback}	- if you want custom label syntax
	@param meta 		{Array}		- optional parallel array for meta data for each resulting token/element (more info about this - see the general class description)
*/
CommandLine.parseExpression = function(exrstring,index,labelcallback,meta) {
	var callback = function() {};
	if (typeof index == "object" && index != null) {
		callback = labelcallback || CommandLine.stdLabelCallback;
	}
	var arr = [];
	var scope,scopes_stack = [];
	var newscope = false;
	
	if (typeof exrstring == "string") {
		var r = CommandLine.reExpressionLevel1;
		var _scope; // var for temporary scope ref
		r.lastIndex = 0;
		var earr = null, pos = 0;
		while (earr = r.exec(exrstring)) {
			if (earr[6] != null) {
				if (BaseObject.callCallback(callback,index, earr[6], pos)) {
					continue;
				} else if (earr[6] == "(") {
					scope = {start: pos, end: null};
					scopes_stack.push(scope);
					newscope = true;
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
// Static tools references to which are attached in the appropriate meta
CommandLine.isScopeStart = function(pos) { // Attached to the scope
	if (typeof pos == "number") {
	}
}