(function() {
/*CLASS*/
function HintBubbleEx() {
    Panel.apply(this, arguments);
    this.$isopen = false;
};
HintBubbleEx.Inherit(Base, "HintBubbleEx")
    .Implement(ITemplateSourceImpl,Defaults("templateName"),"autofill")
    .Implement(IItemTemplateSourceImpl,true)
.Defaults({
    templateName: "bindkraft/hint-bubble-ex"
})

HintBubbleEx.ImplementProperty("headerslot", new Initialize("holds ref to header slot."))
        .ImplementProperty("bodyslot", new Initialize("holds ref to body slot."))
HintBubbleEx.prototype.statechangedevent = new InitializeEvent("Fired when the expander opens or closes. The data is true/false meaning open/close");
HintBubbleEx.prototype.openedevent = new InitializeEvent("Fired when the hint body show/pops up.");
HintBubbleEx.prototype.closedevent = new InitializeEvent("Fired when the hint bidy hides/closes.");

HintBubbleEx.prototype.init = function () {

    this.shiftLeft = parseFloat(this.shiftLeft);
    if (IsNull(this.delay)) {
        this.delay = 1000;
    } else {
        this.delay = parseFloat(this.delay);
    }
    this.shiftTop = parseFloat(this.shiftTop);
    this.on(this.inactiveHeader, "mouseleave", this.Collapse);
    this.on(this.inactiveHeader, "mouseover", this.Expand);
    this.on(this.activeHeader, "mouseleave", this.Collapse);
    this.on(this.activeHeader, "mouseover", this.Expand);
    this.$activeHeader = this.getRelatedElements(this.activeHeader);
    this.$inactiveHeader = this.getRelatedElements(this.inactiveHeader);
    this.$bodyElement = this.getRelatedElements(this.bodyElement);
    this.Dimentions_new();
    this.$animation = (this.animation == "none") ? null : this.animation;
    if (this.initialState == "collapsed") { this.Collapse(); } else { this.Expand(); }
    var p = $(this.root).css("position");
    if (p == null || p == "static" || p == "" || p == "Inherit") {
        $(this.root).css("position", "relative");
    }
    if (this.$bodyElement != null) {
        this.$bodyElement.css("position", "absolute");
    }
};
HintBubbleEx.prototype.finalInit = function() {
    var t;
    //if (String.isNullOrWhiteSpace(this.get_itemTemplate("normal-header")) ||
    //String.isNullOrWhiteSpace(this.get_itemTemplate("hint")) )
}
HintBubbleEx.prototype.$showHideHeader = function (bExpanded) {
    var b = ((this.$activeHeader.length == 0) ? 0 : 1) + ((this.$inactiveHeader.length == 0) ? 0 : 1);
    if (b == 1) {
        this.$activeHeader.show();
        this.$inactiveHeader.show();
    } else if (b > 1) {
        if (bExpanded) {
            this.$activeHeader.show();
            this.$inactiveHeader.hide();
        } else {
            this.$activeHeader.hide();
            this.$inactiveHeader.show();
        }
    }

};

HintBubbleEx.prototype.Dimentions_old = function () {
    var th = this.$bodyElement;
    var w = th.width();
    var h = -th.height() - 30;
    this.$bodyElement.css("background-color", "#fff");
    this.$bodyElement.css("border", "2px solid gray");
    this.$bodyElement.css("border-radius", "5px");
    this.$bodyElement.css("width", 200);
    this.$bodyElement.css("bottom", h);
    this.$bodyElement.css("padding", "10px");
    this.$bodyElement.css("z-index", "9999");

    this.$bodyElement.css("text-align", "left");
}; 
HintBubbleEx.$getHostViewContainer = new ProtoCaller("IViewHostQuery", "get_viewcontainerelement");
HintBubbleEx.prototype.Dimentions_new = function () {

    var th = this.$bodyElement;
    if (th != null && th.length > 0) {
        var query = new HostCallQuery(HostCallCommandEnum.gethost);
        this.throwStructuralQuery(query);
        if (query.host != null) {
            var viewcontainer = HintBubbleEx.$getHostViewContainer.invokeOn(query.host);
            var containerRect = Rect.fromDOMElementInner(viewcontainer);
            var expanderRect = Rect.fromDOMElementOffset(this.root);
            var pt = new Point(expanderRect.x + (this.shiftLeft ? this.shiftLeft : 0), expanderRect.y + (this.shiftTop ? this.shiftTop : 0));
            var ballonRect = Rect.fromDOMElementOffset(th);
            ballonRect.w = 250;
            if (ballonRect.h < 0) {
                ballonRect.h = 20;
            }
            var placementRect = containerRect.adjustPopUp(pt, ballonRect, "all", 5);
            placementRect.x = placementRect.x - expanderRect.x;
            placementRect.y = placementRect.y - expanderRect.y;

            //            this.$bodyElement.css("background-color", "#fff");
            //            this.$bodyElement.css("border", "2px solid gray");
            //            this.$bodyElement.css("border-radius", "5px");
            //            this.$bodyElement.css("width", 250);
            //            this.$bodyElement.css("padding", "10px");
            this.$bodyElement.css("z-index", "9999");
            this.$bodyElement.css("left", placementRect.x);
            this.$bodyElement.css("top", placementRect.y);
            //            this.$bodyElement.css("text-align", "left");
            this.on(this.$bodyElement, "mouseleave", this.Collapse);
        }
    }

};

HintBubbleEx.prototype.Expand = function () {
    var that = this;
    var callMethod = function() {
        that.Show();
    };
    if (this.delay != null && this.delay > 0) {
        this.myTimeout = window.setTimeout(callMethod, this.delay);
    } else {
        this.Show();
    }
    if (!IsNull(window.g_ie8)) {
        if (window.g_ie8) {
            System.Default().hideIFrames();
        }
    }
};
HintBubbleEx.prototype.Show = function () {
    if (this.myTimeout != null) {
        clearTimeout(this.myTimeout);
    }
    
    this.$isopen = true;
    this.$showHideHeader(true);
    this.$bodyElement.show(this.$animation);
    this.Dimentions_new();
    this.statechangedevent.invoke(this, true);
    this.openedevent.invoke(this, true);
    if (!IsNull(window.g_ie8)) {
        if (window.g_ie8) {
            System.Default().showIFrames();
        }
    }
};
HintBubbleEx.prototype.Collapse = function () {
    if (this.myTimeout != null) {
        clearTimeout(this.myTimeout);
    }
    this.$isopen = false;
    this.$showHideHeader(false);
    this.$bodyElement.hide(this.$animation);
    this.statechangedevent.invoke(this, false);
    this.openedevent.invoke(this, false);
    if (!IsNull(window.g_ie8)) {
        if (window.g_ie8) {
            System.Default().showIFrames();
        }
    }
};
HintBubbleEx.prototype.get_expanded = function () { return this.$isopen; };
HintBubbleEx.prototype.set_expanded = function (v) {
    if (v) { this.Expand(); } else { this.Collapse(); }
};
HintBubbleEx.prototype.get_collapsed = function () { return !this.$isopen; };
HintBubbleEx.prototype.set_collapsed = function (v) { if (v) { this.Collapse(); } else { this.Expand(); } };

})()