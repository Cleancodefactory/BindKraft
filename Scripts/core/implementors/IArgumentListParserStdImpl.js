/*
	IArgumentListParserStdImpl - argument parsing from string automatization for classes that need it (in various ways)
	Usage:
	MyClass.Implement(IArgumentListParserStdImpl[, parseType[, nochange]]);
	
		- parseType - currently supported none, spaced, named, trim
			none: 		parameter string "as is" (returned as string)
			spaced: 	spaced parameters of type string, 'string' and numeric (returned as an array)
			named:		named key=value pairs where the value can be like in spaced (returned as object)
			trim:		parameter string trimmed (returned as string)
			Default is none - any unsupported types will revert to none.
		- nochange - if true the get/set_argumentlistparsetype property is ignored and only the parseType specified in Implement is used.
	
	The implementing class uses 
	
	v = parseArgumentList(paramstring)
	
	where parameters/arguments need parsing.
	The class may or may not need dynamic parsingType changes, this is possible through the get/set_argumentlistparsetype property. However if dynamic changes to the parsing type
	are undesirable this can be blocked by implementing the implementor with nochange set to true. Then only the compile time specified parseType will be used, no matter the value
	of the aforementioned property.
	
	
*/
function IArgumentListParserStdImpl() {}
IArgumentListParserStdImpl.InterfaceImpl("IArgumentListParser");
// This one is reserved for future use
IArgumentListParserStdImpl.$reParamsChainWithBindings = /(?:(?:^|\s)([\+\-]?[0-9]+(?:\.[0-9]+)?)(?=$|\s))|(?:(?:^|\s)([0-9a-zA-Z\_\-\$\[\]\.]+(?=$|\s)))|(?:(?:^|\s)\'((?:\\\'|[^\'])*)\')|(?:(?:^|\s)\{((?:\\\}|[^\}])*)\})/gm;
// Numeric and string parameters array separated with spaces (num str 'str')
IArgumentListParserStdImpl.$reParamsChain = /(?:(?:^|\s)([\+\-]?[0-9]+(?:\.[0-9]+)?)(?=$|\s))|(?:(?:^|\s)([0-9a-zA-Z\_\-\$\[\]\.]+(?=$|\s)))|(?:(?:^|\s)\'((?:\\\'|[^\'])*)\')/gm;
// key:value pairs value can be numeric or string.
IArgumentListParserStdImpl.$reParamsKeyPairs = /(?:(?:^|\s)([a-zA-Z_][a-zA-Z0-9_\-]*):([\+\-]?[0-9]+(?:\.[0-9]+)?)(?=$|\s))|(?:(?:^|\s)([a-zA-Z_][a-zA-Z0-9_\-]*):([0-9a-zA-Z\_\-\$]+(?=$|\s)))|(?:(?:^|\s)([a-zA-Z_][a-zA-Z0-9_\-]*):\'((?:\\\'|[^\'])*)\')/gm;
IArgumentListParserStdImpl.ReadSpacedParams = function(str) {
	var r = [];
	var t;
	if (typeof str == "string") {
		var m = String.reGroups2(str, IArgumentListParserStdImpl.$reParamsChain,"num","ident","str");
		for (var i = 0; i < m.hasmatches; i ++) {
			var e = m[i];
			if (e.num != null) {
				if (e.num.indexOf(".") >=0) {
					t = parseFloat(e.num);
				} else {
					t = parseInt(e.num);
				}
				r.push(isNaN(t)?null:t);
			} else if (e.ident != null) {
				r.push(e.ident);
			} else if (e.str != null) {
				r.push(e.str.replace("\\\'","\'"));
			} 
		}
	}
	return r;
}
IArgumentListParserStdImpl.ReadNamedParams = function(str) {
	var r = {};
	var t;
	if (typeof str == "string") {
		var m = String.reGroups2(str, IArgumentListParserStdImpl.$reParamsKeyPairs,"key","num","key","ident","key","str");
		for (var i = 0; i < m.hasmatches; i ++) {
			var e = m[i];
			var key = e.key;
			if (key != null) {
				if (e.num != null) {
					if (e.num.indexOf(".") >=0) {
						t = parseFloat(e.num);
					} else {
						t = parseInt(e.num);
					}
					r[key] = (isNaN(t)?null:t);
				} else if (e.ident != null) {
					r[key] = e.ident;
				} else if (e.str != null) {
					r[key] = e.str.replace("\\\'","\'");
				} 
			}
		}
	}
	return r;
}
IArgumentListParserStdImpl.classInitialize = function(cls, parseType, bnochange) {
	cls.ImplementProperty("argumentlistparsetype", new InitializeStringParameter("Dynamic parse type, overrides the one specified at declaration time!", null));
	
	cls.prototype.parseArgumentList = function(stringargs) {
		var pt = parseType;
		if (!bnochange) {
			pt = this.get_argumentlistparsetype() || parseType;
		}
		switch (pt) {
			 case "spaced":
				return IArgumentListParserStdImpl.ReadSpacedParams(stringargs); // array
			 break;
			 case "named":
				return IArgumentListParserStdImpl.ReadNamedParams(stringargs); // object
			 break;
			 case "trim":
			 case "trimmed":
				if (typeof stringargs == "string") {
					return stringargs.trim();
				} else {
					return stringargs; // It should be impossibru
				}
			 break;
			 case "none":
			 default:
				return stringargs;
			 break;
		}
		return [];
	}
}
