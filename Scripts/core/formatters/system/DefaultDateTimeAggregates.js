function DefaultDateTimeFormat() {
	SystemFormatterAggregateBase.apply(this,arguments);
	this.$initialize("ConvertDateTime","FormatShortDateTime");
	// this.Arguments(null, "somearguments for the secondone", ...);
}
DefaultDateTimeFormat.Inherit(SystemFormatterAggregateBase,"DefaultDateTimeFormat");

function DefaultDateFormat() {
	SystemFormatterAggregateBase.apply(this,arguments);
	this.$initialize("ConvertDateTime","FormatShortDate");
	// this.Arguments(null, "somearguments for the secondone", ...);
}
DefaultDateFormat.Inherit(SystemFormatterAggregateBase,"DefaultDateFormat");

function DefaultTimeFormat() {
	SystemFormatterAggregateBase.apply(this,arguments);
	this.$initialize("ConvertDateTime","FormatLongTime");
	// this.Arguments(null, "somearguments for the secondone", ...);
}
DefaultTimeFormat.Inherit(SystemFormatterAggregateBase,"DefaultTimeFormat");