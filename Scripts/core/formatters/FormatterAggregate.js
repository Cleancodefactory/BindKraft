/*
	Class for creation of custom aggregates
*/
function FormatterAggregate() {
	CustomFormatterBase.apply(this, arguments);
	
	this.$initialize.apply(this, arguments);
}
FormatterAggregate.Inherit(CustomFormatterBase,"FormatterAggregate");
FormatterAggregate.Implement(IFormatterAggregateImpl);
