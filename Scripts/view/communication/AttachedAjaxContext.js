


/*CLASS*/
// Like DetachedAjaxContext, but consumes the first BaseObject argument that supports
// IAjaxContextParameters is configured as both base(parent) context and as query target.
// However if another BaseObject derived object is passed after it - it takes the role of
// query target leaving the role of context parent for the first one
function AttachedAjaxContext() {
    var args = Array.createCopyOf(arguments);
    if (args.length > 0) {
        for (var i = 0; i < args.length; i++) {
            var p = args[i];
            if (BaseObject.is(p, "IAjaxContextParameters")) {
                this.$parentcontext = p;
				this.$queryparent = p;
				// Both are the same, if there is another BaseObject it will become a query parent, different from the parent context (usually they will be the same, but not always).
                args.splice(i, 1);
				break;
            }
        }
    }
    DetachedAjaxContext.apply(this, args);
}
AttachedAjaxContext.Inherit(DetachedAjaxContext, "AttachedAjaxContext");
AttachedAjaxContext.Create = function (a1, a2, a3, a4) {
    return new AttachedAjaxContext(a1, a2, a3, a4);
};
AttachedAjaxContext.prototype.$parentcontext = null;
AttachedAjaxContext.prototype.get_parentcontext = function() {
	return this.$parentcontext;
}
AttachedAjaxContext.prototype.get_ajaxcontextparameter = function (param) {
    var p = this.get_localajaxcontextparameter(param);
    if (p == null && this.get_parentcontext() != null) return this.get_parentcontext().get_ajaxcontextparameter(param);
    return p;
}.Description("Returns the parameter in the context or from the parent context (if any).");
