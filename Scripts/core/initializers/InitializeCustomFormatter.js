

/*CLASS*/
function InitializeCustomFormatter(desc, stype /*arg0, arg1,...,arg9*/) {
    Initialize.call(this, desc, null);
    this.type = "Formatter";
    this.stype = stype;
    this.fmtargs = Array.createCopyOf(arguments,2);
}
InitializeCustomFormatter.Inherit(Initialize, "InitializeCustomFormatter");
InitializeCustomFormatter.prototype.produceDefaultValue = function (obj) {
    if (this.stype == null) {
        return null;
    } else {
        var fmtClass = Class.getClassDef(this.stype);
        var a = this.fmtargs;
        var a0 = a[0],a1 = a[1],a2 = a[2],a3 = a[3],a4 = a[4],a5 = a[5],a6 = a[6],a7 = a[7],a8 = a[8],a9 = a[9];
		var fmt = new fmtClass(a0,a1,a2,a3,a4,a5,a6,a7,a8,a9);
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