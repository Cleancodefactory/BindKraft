
// DEPRECATION WARNING - will be deprecated soon without backward compatibility measures.

/*CLASS*/
function Command(obj, func,initParams, additionalArgs) {
    Delegate.call(this, obj, func, additionalArgs);
    /* this.disable = "true";*/
    this.caption = "Unnamed command";
    this.image = null;
    this.id = BaseObject.getProperty(initParams,"id", null) || this.$__instanceId;
	
    this.disabled = false;
    this.visible = false;
    if (initParams != null) {
        for (var v in initParams) {
			BaseObject.setProperty(this,v,initParams[v]);
            //this[v] = initParams[v];
        }
    }
};
Command.Inherit(Delegate, "Command");
Command.interfaces = { PCommand: true };
Command.prototype.obliterate = function(bFull) {
    Delegate.prototype.obliterate.call(this, bFull);
};
Command.prototype.get_visible = function (visible) {
    return this.visible;
};
Command.prototype.set_visible = function (visible) {
    this.visible = visible;
};
Command.prototype.get_disabled = function () {
    return this.disabled;
};
Command.prototype.set_disabled = function (disabled) {
    this.disabled = disabled;
};
Command.prototype.get_tooltip = function () {
    return this.tooltip;
};
Command.prototype.set_tooltip = function (tooltip) {
    this.tooltip = tooltip;
};
Command.prototype.get_title = function () {
    return this.title;
};
Command.prototype.set_title = function (title) {
    this.title = title;
};
Command.prototype.get_cmdline = function () {
    return this.cmdline;
};
Command.prototype.set_cmdline = function (v) {
    this.cmdline = v;
};
Command.prototype.get_modulename = function () {
    return this.modulename;
};
Command.prototype.set_modulename = function (v) {
    this.modulename = v;
};
Command.prototype.get_image = function () {
    return this.image;
};
Command.prototype.set_image = function (v) {
    this.image = v;
};

Command.prototype.caption = null;
Command.prototype.image = null;
Command.prototype.id = null;
Command.prototype.visible = false;
Command.prototype.disabled = false;
Command.prototype.cmdline = null;
Command.prototype.modulename = null;
