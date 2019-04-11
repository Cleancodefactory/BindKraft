// This is actually an example


/*CLASS*/
function CustomBehavior(node, phase) {
    ElementBehaviorBase.apply(this, arguments);
}
CustomBehavior.Inherit(ElementBehaviorBase, "CustomBehavior");
CustomBehavior.bindBehavior = function (node, behParams, phase) {
    if (phase == BehaviorPhaseEnum.postbind) {
        var beh = new CustomBehavior(node, phase);
        JBUtil.parametrize.call(beh, node, null, behParams); // JBUtil.parametrize.call(beh, behParams);
        beh.init();
		return beh;
    }
	return null;
};
CustomBehavior.ImplementProperty("event", new InitializeStringParameter("The name of the event to handle. Defaults to click (just for reference)", "click"));
CustomBehavior.prototype.init = function () {
    this.on(this.get_event(), this.HandleEvent);
};
CustomBehavior.prototype.HandleEvent = function (e, dc) {
    alert("Hello world!");
}