

/*CLASS*/
function InitializeNumericParameter(desc, defval) {
    InitializeParameter.apply(this, arguments);
    this.type = "Parameter";
    this.paramType = "numeric";
};
InitializeNumericParameter.Inherit(InitializeParameter, "InitializeNumericParameter");