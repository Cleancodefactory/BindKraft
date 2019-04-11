/**
 * This defines a new way to create custom formatters (as of version 2.8.0). The new feature here is that the formatters defined that way can be reused and "attached" to classes.
 * The semantics are a little different, but the general princpile is the same.
 *
 *	Implementation
 *  Inherit from the CustomFormatterBase and override the Read and/or Write methods. As always the formatter does not need to be bidirectional, still
 *  it is considered appropriate to implement Read always, but skip implementation og Write if not needed and not the other way around. In the rare case
 *  when a formatter is write only this can be ignored.
 *
 *	Useful advises for implementers
 *
 *  Argument parsing in implementations
 *	By default the formatter arguments are passed to Read and Write as a single string "as is", but one can get more specific parsing by implementing an implementor of IArgumentListParser
 *  like IArgumentListParserStdImpl for instance. Depending on the implementor the Read and Write methods may receive the formatter arguments as trailing argument (4-th in this class, 
 *	3-d in the system formatters which start from SystemFormatterBase that inherits this one). It is up to the IArgumentListParser to form the time of that argument. For example the 
 *	IArgumentListParserStdImpl depending on mode will produce object, array or string.
 *  
 *	Parameter accumulation through IParametersAccumulator:
 *	Implement IParametersAccumulatorImpl - Only default accumulator should be enough, arguments are set as strings - the same as in the markup.
 *	It is passively used by default. If it happens to contain something it will be used instead of the arguments comming during formatting (from the binding). This enables the very base class
 *	of all (and all kinds) of formatters to keep them prepared for aggregation and other interesting packing. In other words any existing formatter will react as expected to accumulated arguments if they
 *	happen to be set. If you are not familiar with the matter check the documentation for explanation and example. If certain formatter needs often to be created with "conserved" parameters it can be implemented
 *  with this implementor and the constructor (or other convenient method) created to allow easy setting of accumulated parameters. Then when used it will work with them instead of expecting them from the specific binding.
 */
 
function CustomFormatterBase() {
	 BaseObject.apply(this, arguments);
	 var me = this;
	 this.ToTarget = function(val, bind, args) {
		return me.$ToTarget(this,val, bind, args);
	 }
	 this.FromTarget = function(val, bind, args) {
		return me.$FromTarget(this,val, bind, args);
	 }
}
CustomFormatterBase.Inherit(BaseObject, "CustomFormatterBase");
CustomFormatterBase.Implement(IFormatter);

// Error and context detection functions
CustomFormatterBase.prototype.errorIfNeeded = function(bind, text) {
	if (bind != null) {
		throw "Critical error while formatting: " + text;
	}
}
 // Autodetects if there is IArgumentListParser implemented and if so asks it to do the job. Otherwise returns the original string as a single argument.
CustomFormatterBase.prototype.$parseArguments = function(_args) {
	 var args;
	 if (this.is(IParametersAccumulator)) {
		args = this.getAccumulatedParameters(null) || _args; // Accumulated parameters take precedence
	 } else {
		args = _args;
	 }
	 if (this.is("IArgumentListParser")) {
		 return this.parseArgumentList(args);
	 } else {
		 return args;
	 }
}
 //Foreigncall - the this is of the object on which the formatter is attached
 //CustomFormatterBase.prototype.ToTarget = function(val, bind, args) - see constructor
 CustomFormatterBase.prototype.$ToTarget = function(host, val, bind, args) {
	 var arr = Array.createCopyOf(arguments,0,3);
	 var farg = this.$parseArguments(args); // Receive parsed arguments - can be string, array, object and potentially others
	 arr.push(farg);
	 return this.Read.apply(this,arr);
 }
 //Foreigncall - the this is of the object on which the formatter is attached
 // CustomFormatterBase.prototype.FromTarget = function(val, bind, args) - see constructor
 
 CustomFormatterBase.prototype.$FromTarget = function(host, val, bind, args) {
	 var arr = Array.createCopyOf(arguments,0,3);
	 var farg = this.$parseArguments(args); // Receive parsed arguments - can be string, array, object and potentially others
	 arr.push(farg);
	 return this.Write.apply(this,arr);
 }
 CustomFormatterBase.prototype.Read = function(host, val, bind, params) {
	 throw "Read not implemented in formatter " + this.fullClassType();
 }.Description("Implements conversion while reading to target")
	.Param("host", "The host object to which this is attached. Can be considered as a second this - the one of the exposing instance")
	.Param("val", "The raw source value")
	.Param("bind", "The reference to the binding in which this is defined. If it isn't called through binding this argument will be null")
	.Param("params", "Depending on the argument list parser, without one it is string or null. For other choices implement IArgumentListParserStdImpl")
	.Returns("The converted/collected/formatted value");
 CustomFormatterBase.prototype.Write = function(host, val, bind, params) {
	 throw "Write not implemented in formatter " + this.fullClassType();
 }.Description("Implements conversion while writting to source")
	.Param("host", "The host object to which this is attached. Can be considered as a second this - the one of the exposing instance")
	.Param("val", "The raw value read from the target or passed directly (if not used in binding)")
	.Param("bind", "The reference to the binding in which this is defined. If it isn't called through binding this argument will be null")
	.Param("params", "Depending on the argument list parser, without one it is string or null. For other choices implement IArgumentListParserStdImpl")
	.Returns("The converted/collected/parsed value");