


/*CLASS*/
function AutoResizeTextArea() {
    Base.apply(this, arguments);
}
AutoResizeTextArea.Inherit(Base, "AutoResizeTextArea");
AutoResizeTextArea.prototype.isExpanded = new InitializeBooleanParameter("A flag which will trigger the textarea to be expanded initially. It should be set only initially. Should not be changed dynamiclly after that.", false);
AutoResizeTextArea.prototype.init = function () {
    this.on("cut", this.resize);
    this.on("change", this.resize);
    this.on("keydown", this.resize);
    this.on("drop", this.resize);
    this.on("paste", this.resize);

    if (this.isExpanded === false) {
        this.on("focus", this.resizeFirst);
        this.on("focusout", this.resizeoriginal);
    }
};
AutoResizeTextArea.prototype.origheight = 100;
AutoResizeTextArea.prototype.resize = function () {
    $(this.root).css({ 'height': 'auto', 'overflow-y': 'hidden' }).height(this.root.scrollHeight);

    //var test = $(this.root)[0].scrollHeight;
    //if (test > this.origheight) {
    //    $(this.root).css("height", test);
    //}
};

AutoResizeTextArea.prototype.resizeFirst = function () {
    var height = $(this.root).css("height");
    height = parseInt(height.slice(0, height.indexOf("p")));
    this.origheight = height;
    this.resize();
};
AutoResizeTextArea.prototype.resizeoriginal = function () {
    $(this.root).css("height", this.origheight);
};
// NOTE: This is just a temporary formatter used as a workaround to ONLY resize the textarea after the data is already bound. Do not modify it.
AutoResizeTextArea.prototype.CallResizeTempFormatter = {
    FromTarget: function (v, binding) {
        return v;
    },
    ToTarget: function (v, binding) {
        if (this.isExpanded === true) {
            this.callAsync(function () {
                this.resize();
            });
        }       

        return v;
    }
};