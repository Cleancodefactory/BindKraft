

/*CLASS*/
function InitializeParameter(desc, defval) {
    Initialize.apply(this, arguments);
    this.type = "Parameter";
};
InitializeParameter.Inherit(Initialize, "InitializeParameter");
InitializeParameter.prototype.defValueDescription = function () {
	var def = Defaults.getValue(this, this.defaultValue);
    var r = {
        value: (def != null)?def:"",
        type: this.paramType
    };
    return r;
};