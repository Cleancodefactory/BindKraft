


// Base class for all the behaviors
/* There could be some interfaces defined to guarantee behaviors will be linked only if they support whatever events are required
*/
function ElementBehaviorBase(node, phase) {
	BaseObject.apply(this, arguments);
    if (node != null) {
        this.$target = $(node).get(0);
    } else {
        this.$target = null;
    }
    this.$phase = phase;
}
ElementBehaviorBase.Inherit(BaseObject, "ElementBehaviorBase");
ElementBehaviorBase.prototype.init = function () { };
ElementBehaviorBase.prototype.capture = function(eventname, proc) {
	this.$target.addEventListener(eventname, Delegate.createWrapper(this, proc), true);
}
ElementBehaviorBase.prototype.on = function (arg1, arg2, arg3) {
    if (arguments.length == 2) {
        $(this.$target).bind(arg1, { obj: this, handler: new Delegate(this, arg2) }, ElementBehaviorBase.$domOmniHandler);
    }
};
ElementBehaviorBase.prototype.activeClass = function() {
	return $(this.$target).activeclass();
}
ElementBehaviorBase.prototype.throwStructuralQuery = function (query, processInstructions) {
    return JBUtil.throwStructuralQuery(this.$target, query, processInstructions);
};
ElementBehaviorBase.prototype.throwDownStructuralQuery = function (query, processInstructions) {
    return JBUtil.throwDownStructuralQuery(this.$target, query, processInstructions);
};
ElementBehaviorBase.prototype.getRelatedElements = function(patt) {
    return JBUtil.getRelatedElements(this.$target, patt);
};
ElementBehaviorBase.prototype.getRelatedObjects = function(patt, types) {
    var arr = Array.createCopyOf(arguments);
	arr.unshift(this.$target);
    return JBUtil.getRelatedObjects.apply(JBUtil, arr);
}
// TODO Remove jquery from the picture!
ElementBehaviorBase.$domOmniHandler = function (evnt) {
    if (evnt.data != null && evnt.data.handler != null) {
        evnt.data.handler.invoke(evnt, Base.get_dataContext(evnt.data.obj.$target));
    }
};
// override if needed
