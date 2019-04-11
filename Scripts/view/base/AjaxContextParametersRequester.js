


// This class is a helper for ajax implicit parameters extraction. It will automatically generate methods for all the
// parameters declared by the system and request the supplied DOM element or framework class (if it supports the IStructuralQueryEmiterImpl Interface)
/*CLASS*/
function AjaxContextParametersRequester(domEl) {
    BaseObject.apply(this, arguments);
    this.root = domEl;
    for (var e in AjaxContextParameterFlags) {
        this["get_" + e] = AjaxContextParametersRequester.$createParamExtractor(AjaxContextParameterFlags[e]);
    }
};
AjaxContextParametersRequester.Inherit(BaseObject, "AjaxContextParametersRequester");
AjaxContextParametersRequester.$createParamExtractor = function (paramId) {
    return function () {
        return this.requestParameter(paramId);
    };
};
AjaxContextParametersRequester.prototype.requestParameter = function (paramId) {
    var req = new AjaxContextParameterQuery(paramId);
    if (BaseObject.is(this.root, "IStructuralQueryEmiter")) {
        if (this.root.throwStructuralQuery(req)) return req.result;
    } else if (BaseObject.isDOM(this.root)) {
        if (JBUtil.throwStructuralQuery(this.root, req)) {
            return req.result;
        }
    }
    return null;
};