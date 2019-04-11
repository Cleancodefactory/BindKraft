/*
	Base any system formatters on this class. It is virtually the same as CustomFormatterBase, but includes auto-registration
	in the SystemFormattersRegister, formatters can be obtained at run-time like this:
	
	Registers.getRegister("systemformatters").item("<the name of the formatter>");
	
	Further goodies are explained in the docs.
	
	The auto-registration will register the formatter under its class name.
	Conventions:
		
		1. System formatter classes MUST be named after this pattern
			Format<specific_name>		- those that produce textual representation from their Read/ToTarget methods (should be bidirectional)
			Convert<specific_name>		- those that convert something to something else, including parsers (should be bidirectional)
			Filter<specific_name>		- those that filter their values and return stripped down data, possibly also converted, 
											but prefer the name when filtering is the more important part of the work and they are not bidirectional (most often unidirectional: Read)
			// Less frequent kinds
			Sort<specific_name>		- those that order collection like items (usually unidirectonal: Read)
			Calc<specific_name>	- those that calculate something from data (usually unidirectional: Read)
	
	Override:
	Override and implement:
		Read (val, bind, params)
		Write (val, bind, params)
	Where:
		val - the value to convert/format/parse
		bind - the binding that invoked the 
		params - any parameters specified on the binding as text. Use IArgumentListParserStdImpl to autoparse them:
					FormatXXX.Implement(IArgumentListParserStdImpl,"paresekind");
					parsekind:
						spaced - params are array (can be empty but not null) of strings or numbers. Syntax: string 'string' #number#
						named  - params are object with keyed params. Syntax: name1=string name2='string' name3==#number#
						trim   - params are string, trimmed
						none   - params are "as is"


*/
function SystemFormatterBase() {
	CustomFormatterBase.apply(this, arguments);
}
SystemFormatterBase.Inherit(CustomFormatterBase,"SystemFormatterBase");
SystemFormatterBase.Implement(IFormatterRegistrationImpl);
SystemFormatterBase.prototype.$ToTarget = function(host, val, bind, args) {
	 var arr = Array.createCopyOf(arguments,1,3);
	 var farg = this.$parseArguments(args); // Receive parsed arguments - can be string, array, object and potentially others
	 arr.push(farg);
	 return this.Read.apply(this,arr);
 }
 //Foreigncall - the this is of the object on which the formatter is attached
 // CustomFormatterBase.prototype.FromTarget = function(val, bind, args) - see constructor
 
 SystemFormatterBase.prototype.$FromTarget = function(host, val, bind, args) {
	 var arr = Array.createCopyOf(arguments,1,3);
	 var farg = this.$parseArguments(args); // Receive parsed arguments - can be string, array, object and potentially others
	 arr.push(farg);
	 return this.Write.apply(this,arr);
 }
 SystemFormatterBase.prototype.Read = function(val, bind, params) {
	 throw "Read not implemented in formatter " + this.fullClassType();
 }.Description("Implements conversion while reading to target")
	.Param("val", "The raw source value")
	.Param("bind", "The reference to the binding in which this is defined. If it isn't called through binding this argument will be null")
	.Param("params", "Depending on the argument list parser, without one it is string or null. For other choices implement IArgumentListParserStdImpl")
	.Returns("The converted/collected/formatted value");
 SystemFormatterBase.prototype.Write = function(val, bind, params) {
	 throw "Write not implemented in formatter " + this.fullClassType();
 }.Description("Implements conversion while writting to source")
	.Param("val", "The raw value read from the target or passed directly (if not used in binding)")
	.Param("bind", "The reference to the binding in which this is defined. If it isn't called through binding this argument will be null")
	.Param("params", "Depending on the argument list parser, without one it is string or null. For other choices implement IArgumentListParserStdImpl")
	.Returns("The converted/collected/parsed value");



