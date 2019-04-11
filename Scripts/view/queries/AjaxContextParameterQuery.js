


/*CLASS*/ /*QUERY*/
function AjaxContextParameterQuery(param) {
    BaseObject.apply(this, arguments);
    this.result = null;
    this.requestedParameter = param;
}
AjaxContextParameterQuery.Inherit(BaseObject, "AjaxContextParameterQuery");
