

(function () {

    var ViewUtil = Class("ViewUtil");

    // Imports
    var Panel = Class("Panel"),
        IDisablable = Interface("IDisablable"),
        InitializeStringParameter = Class("InitializeStringParameter"),
        InitializeNumericParameter = Class("InitializeNumericParameter"),
        InitializeEvent = Class("InitializeEvent");

    /*CLASS*/
    function Expander() {
        Panel.apply(this, arguments);
        this.$isopen = false;
    }

    Expander.Inherit(Panel, "Expander");
    Expander.Implement(IDisablable);
    Expander.$rootParameters = ["activeHeader", "disabled", "inactiveHeader", "bodyElement", "initialState", "animation", "radioSet", "disabled", "updateMode", "liveParts", "noClick", "allowCollapse"];
    Expander.prototype.setObjectParameter = function (name, value) {
        if (name.inSet(Expander.$rootParameters)) {
            return true;
            // Returning true we tell the parameterizer to do exactly the same on its own.
            // if (name.inSet(Expander.$rootParametersSet)) {
            // this["set_" + name](value);
            // } else {
            // this[name] = value;
            // }
        } else {
            this.$parameters[name] = value;
        }
    };
    Expander.ImplementProperty("activeHeader", new InitializeStringParameter("parent[/child] key of the active header element", "./ActiveHeader"), "activeHeader")
        .ImplementProperty("inactiveHeader", new InitializeStringParameter("parent[/child] key of the inactive header element", "./InactiveHeader"), "inactiveHeader")
        .ImplementProperty("bodyElement", new InitializeStringParameter("parent[/child] key of the body element", "./Body"), "bodyElement")
        .ImplementProperty("initialState", new InitializeStringParameter("Initial state of the expander, can be 'collapsed' (default) or 'expanded'", "collapsed"), "initialState")
        .ImplementProperty("animation", new InitializeStringParameter("(currently unused) Body animation: slow, fast, none", "none"), "animation")
        .ImplementProperty("radioSet", new InitializeStringParameter("parent[/child*] set of expanders to collapse automatically, collapse is diabled, use allowCollapse=true if needed.", null), "radioSet")
        .ImplementProperty("allowCollapse", new InitializeBooleanParameter("Allows collapse when it is disabled by default", false), "allowCollapse")
        .ImplementProperty("updateMode", new InitializeNumericParameter("If set to non-zero value will cause the expander to perform updateTargets only when opened.", 0), "updateMode")
        .ImplementProperty("liveParts", new InitializeNumericParameter("If set to non-zero value will cause the parts of the expander to be determined anew each time something happens", 0), "liveParts")
        .ImplementProperty("noClick", new InitializeBooleanParameter("Does not listen for clicks, can turn only programmatically.", false), "noClick")
        .ImplementProperty("displayType", new InitializeStringParameter("Defines the display value to assign when showing. Use empty string to let the CSS determine it.", ""), "displayType");

    //Example for disabled: #disabled='1'
    // events
    Expander.prototype.statechangedevent = new InitializeEvent("Fired when the expander opens or closes. The data is true/false meaning open/close");
    Expander.prototype.expandeddevent = new InitializeEvent("Fired when the expander opens. The data is true meaning open");
    Expander.prototype.collapseddevent = new InitializeEvent("Fired when the expander closes. The data is false meaning open");


    Expander.prototype.obliterate = function () {
        delete this.$activeHeader;
        delete this.$inactiveHeader;
        delete this.$bodyElement;
        Panel.prototype.obliterate.call(this);
    };
    Expander.prototype.init = function () {
        if (!this.noClick) {
            this.on(this.activeHeader, "click", this.Collapse);
            this.on(this.inactiveHeader, "click", this.Expand);
        }
    /*Array<HTMLElements>*/ this.$activeHeader = ViewUtil.getRelatedElements(this.root, this.activeHeader);
        this.$inactiveHeader = ViewUtil.getRelatedElements(this.root, this.inactiveHeader);
        this.$bodyElement = ViewUtil.getRelatedElements(this.root, this.bodyElement);
        this.freezeEvents(this, function () {
            if (this.get_initialState() == "collapsed") {
                this.Collapse();
            } else {
                this.Expand();
            }
        });
    };
    Expander.prototype.updateTargets = function () {
        if (this.updateMode) {
            if (this.get_expanded()) {
                Panel.prototype.updateTargets.apply(this, arguments);
            }
        } else {
            Panel.prototype.updateTargets.apply(this, arguments);
        }
    };
    Expander.prototype.get_body = function () {
        if (this.liveParts) {
            this.$bodyElement = ViewUtil.getRelatedElements(this.root, this.bodyElement);
        }
        return this.$bodyElement;
    };
    Expander.prototype.get_inactiveHeader = function () {
        if (this.liveParts) {
            this.$inactiveHeader = ViewUtil.getRelatedElements(this.root, this.inactiveHeader);
        }
        return this.$inactiveHeader;
    };
    Expander.prototype.get_activeHeader = function () {
        if (this.liveParts) {
            this.$activeHeader = ViewUtil.getRelatedElements(this.root, this.activeHeader);
        }
        return this.$activeHeader;
    };
    Expander.prototype.Expand = function (e, dc) {
        if (e != null) {
            if (this.$disabledUI) return;
        }

        this.$isopen = true;
        if (this.updateMode) this.updateTargets();
        DOMUtil.setStyle(this.get_inactiveHeader(), "display", "none");//.hide();
        DOMUtil.setStyle(this.get_activeHeader(), "display", this.displayType); // show
        DOMUtil.setStyle(this.get_body(), "display", this.displayType);
        if (this.radioSet != null) this.$updateRadioSet();

        this.expandeddevent.invoke(this, true);
        this.statechangedevent.invoke(this, true);
    };
    Expander.prototype.Collapse = function (e, dc) {
        if (e != null) {
            if (!this.allowCollapse) {
                if (this.radioSet != null || this.$disabledUI) return;
            }
        }
        this.$isopen = false;
        if (this.updateMode) this.updateSources();
        DOMUtil.setStyle(this.get_inactiveHeader(), "display", this.displayType);//.hide();
        DOMUtil.setStyle(this.get_activeHeader(), "display", "none"); // show
        DOMUtil.setStyle(this.get_body(), "display", "none");

        this.statechangedevent.invoke(this, false);
        this.collapseddevent.invoke(this, false);
    };
    Expander.prototype.Toggle = function () {
        if (this.$isopen) {
            this.Collapse();
        } else {
            this.Expand();
        }
    }
    Expander.prototype.$updateRadioSet = function () {
        var others = ViewUtil.getRelatedElements(this.root, this.radioSet);
        var lt = this;
        others.Each(function (idx, el) {
            if (BaseObject.is(el.activeClass, "Expander") && el.activeClass != lt) {
                el.activeClass.Collapse();
            }
        });
    };
    Expander.prototype.get_expanded = function () { return this.$isopen; };
    Expander.prototype.set_expanded = function (v) {
        if (v) {
            this.Expand();
        } else {
            this.Collapse();
        }
    };
    Expander.prototype.get_collapsed = function () { return !this.$isopen; };
    Expander.prototype.set_collapsed = function (v) {
        if (v) {
            this.Collapse();
        } else {
            this.Expand();
        }
    };

})();