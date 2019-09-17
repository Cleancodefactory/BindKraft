// Pieces of code re backuped here temporarilly - disregard please

CLEngine.reTokens = [
	{ type: "space",		re: /^(\s+)/gm, skip: true },
	{ type: "string",   	re: /^\'((?:\\'|[^'])*)\'/gm, proc: CLEngine.unescapeFullString, priority: 10  }, // Lacks new line support
	{ type: "number",   	re: /^([+-]?[0-9]+(?:\.[0-9]+))/g, proc: CLEngine.parseNumber, priority: 10 },
	{ type: "hex",   		re: /^(?:0x([0-9a-fA-F]+))/g, proc: CLEngine.parseHexNumber, priority: 10  },
	{ type: "brnopen",    	re: /^(\()/g },
	{ type: "brsopen",		re: /^(\[)/g },
	{ type: "brcopen", 		re: /^(\{)/g },
	{ type: "brnclose",    	re: /^(\))/g, priority: 5 },
	{ type: "brsclose",		re: /^(\])/g, priority: 10 },
	{ type: "brcclose",		re: /^(\})/g, priority: 10 },
	
	{ type: "ident",   re: /^([a-zA-Z\_\$][a-zA-Z0-9\_\$]+)/g, priority: 15 },
	{ type: "endop",   re: /^(;)/g, priority: 100 },
	{ type: "commaop",   re: /^(\,)/g, priority: 90 },
	{ type: "dualop",   re: /^(or|and|xor)/g, priority: 60 },
	{ type: "dualop",   re: /^(\=\>|\>\=|\<\=|\=\=)/g, priority: 50 },
	{ type: "dualop",   re: /^(\<|\>)/g, priority: 50 },
	{ type: "dualop",   re: /^(\*|\/)/g, priority: 20 },
	{ type: "dualop",   re: /^(\+|\-|)/g, priority: 30 },
	{ type: "assign",   re: /^(\=)(?!\=)/g, priority: 80 }
];