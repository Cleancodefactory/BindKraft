


function LedLampElement() {
    Base.apply(this, arguments);
}
LedLampElement.Inherit(Base, "LedLampElement");
LedLampElement.prototype.init = function () {
    $(this.root).css("background-color", (this.ison)?this.colorOn:this.colorOff);
};
LedLampElement.prototype.colorOn = "#FF8080";
LedLampElement.prototype.colorOff = "#00FF00";
LedLampElement.prototype.ison = false;
LedLampElement.prototype.updateRoot = "..";
LedLampElement.prototype.updateView = function() {
    var jqels = this.getRelatedElements(this.updateRoot);
    jqels.activeclass().updateSources();
    // this.updateSources();
    $(this.root).css("background-color", (this.ison) ? this.colorOn : this.colorOff);
};
LedLampElement.prototype.onSwitch = function () {
    this.ison = !this.ison;
    $(this.root).css("background-color", (this.ison) ? this.colorOn : this.colorOff);
};