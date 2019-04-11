// ShortDate (reversible)
function FormatShortDate() {
	FormatDateTime.apply(this, arguments);
	this.set_pattern("d");
}
FormatShortDate.Inherit(FormatDateTime,"FormatShortDate");
// Long date with weekday (non-reversible)
function FormatLongDate() {
	FormatDateTime.apply(this, arguments);
	this.set_pattern("D");
}
FormatLongDate.Inherit(FormatDateTime,"FormatLongDate");
// Short time (reversible)
function FormatShortTime() {
	FormatDateTime.apply(this, arguments);
	this.set_pattern("t");
}
FormatShortTime.Inherit(FormatDateTime,"FormatShortTime");
// Long time with seconds (reversible)
function FormatLongTime() {
	FormatDateTime.apply(this, arguments);
	this.set_pattern("T");
}
FormatLongTime.Inherit(FormatDateTime, "FormatLongTime");

// Short date time (reversible)
function FormatShortDateTime() {
	FormatDateTime.apply(this, arguments);
	this.set_pattern("n");
}
FormatShortDateTime.Inherit(FormatDateTime,"FormatShortDateTime");

// Long date time (non-reversible)
function FormatLongDateTime() {
	FormatDateTime.apply(this, arguments);
	this.set_pattern("W");
}
FormatLongDateTime.Inherit(FormatDateTime,"FormatLongDateTime");