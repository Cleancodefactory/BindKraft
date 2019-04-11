

/*CLASS*/
function InitializeCustomFormatter(desc, stype) {
    Initialize.call(this, desc, null);
    this.type = "Formatter";
    this.stype = stype;
}
InitializeCustomFormatter.Inherit(Initialize, "InitializeCustomFormatter");
InitializeCustomFormatter.prototype.produceDefaultValue = function (obj) {
    if (this.stype == null) {
        return null;
    } else {
		var fmt = new Function.classes[this.stype]();
		if (fmt.is("CustomFormatterBase")) {
			return fmt;
		} else {
			throw "Not a custom formatter";
		}
        
    }
};
InitializeCustomFormatter.prototype.defValueDescription = function () {
    if (this.dontInitialize()) return null;
    var r = {
        value: ""
    };
    if (this.stype != null) {
        r.type = this.stype;
    } else {
        r.type = "unknown";
    }
    return r;
};