/*
	Base class for creation system formatters as aggregates of other formatters, including special (dedicated) instances of custom formatters (not available as system ones).
*/
function SystemFormatterAggregateBase() {
	SystemFormatterBase.apply(this,arguments);
	
	// TODO: To implement a system aggregate do something like this in the inheriting class
	/*
		this.$initialize.apply(this, "SomeSystemFormatter", new SomeCustomFormatter(), ....);
		this.Arguments(null, "somearguments for the secondone", ...);
	*/
}
SystemFormatterAggregateBase.DoNotRegister = true; // Specific instruction IFormatterRegistrationImpl to not register a class.
SystemFormatterAggregateBase.Inherit(SystemFormatterBase, "SystemFormatterAggregateBase");
SystemFormatterAggregateBase.Implement(IFormatterAggregateImpl);

