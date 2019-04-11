


// Accessory class for togglers, can be used for open/collapse all
/*CLASS*/

function CollapseTogglers(el) {
    Base.apply(this, arguments);
    this.on("click", this.onClick);
    this.toggledevent = new EventDispatcher(this);
}

CollapseTogglers.Inherit(Base, "CollapseTogglers");
CollapseTogglers.prototype.operation = "open";
CollapseTogglers.prototype.togglers = null;
CollapseTogglers.prototype.onClick = function(e, dc) {
    var deps = this.getRelatedElements(this.togglers);
    if (this.operation == "open") {
        deps.callActiveObjects("Toggler", "setState", this.speed, true, true);
    } else if (this.operation == "close") {
        deps.callActiveObjects("Toggler", "setState", this.speed, true, false);
    }
};
