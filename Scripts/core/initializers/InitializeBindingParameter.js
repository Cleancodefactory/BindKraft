


/*CLASS*/
function InitializeBindingParameter(desc, defval) {
    InitializeParameter.apply(this, arguments);
    this.type = "Parameter";
    this.paramType = "binding";
};
InitializeBindingParameter.Inherit(InitializeParameter, "InitializeBindingParameter");