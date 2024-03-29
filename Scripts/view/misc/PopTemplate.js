


/*CLASS*/
function PopTemplate() {
    Panel.apply(this, arguments);
    this.$isopen = false;
    this.$bodyElement = null;
};
PopTemplate.Inherit(Panel, "PopTemplate");
PopTemplate.Implement(IMessageSink);
PopTemplate.prototype.obliterate = function(bFull) {
	Messenger.Instance().unsubscribe("PageEvent",this);
	Panel.prototype.obliterate.call(this, bFull);
}
PopTemplate.$rootParameters = ["activeHeader", "inactiveHeader", "bodyTemplate", "connectorType", "animation", "shiftTop", "shiftLeft", "delay", "bindhost","explicit"];
PopTemplate.prototype.setObjectParameter = function (name, value) {
    if (name.inSet(PopTemplate.$rootParameters)) {
        return true;
        //this[name] = value;
    } else {
        this.$parameters[name] = value;
    }
};
PopTemplate.prototype.activeHeader = new InitializeStringParameter("parent[/child] key of the active header element", "./ActiveHeader");
PopTemplate.prototype.inactiveHeader = new InitializeStringParameter("parent[/child] key of the inactive header element", "./InactiveHeader");
PopTemplate.prototype.bodyTemplate = new InitializeStringParameter("bodyTemplate address", null);
PopTemplate.prototype.connectorType = new InitializeStringParameter("connectorType - the type of connector to use", "DOMConnector");
PopTemplate.prototype.animation = new InitializeStringParameter("Body animation: slow, fast, none", "none");

PopTemplate.ImplementProperty("bindhost", new Initialize("Binding host for the connector. ", null));
PopTemplate.ImplementProperty("explicit", new InitializeBooleanParameter("Lazy open close - by click only", false))

PopTemplate.prototype.statechangedevent = new InitializeEvent("Fired when the expander opens or closes. The data is true/false meaning open/close");
PopTemplate.prototype.openedevent = new InitializeEvent("Fired when the expander opens or closes. The data is true/false meaning open/close");
PopTemplate.prototype.closedevent = new InitializeEvent("Fired when the expander opens or closes. The data is true/false meaning open/close");

PopTemplate.prototype.init = function () {
    this.shiftLeft = parseFloat(this.shiftLeft);
    if (IsNull(this.delay)) {
        this.delay = 1000;
    } else {
        this.delay = parseFloat(this.delay);
    }
    this.shiftTop = parseFloat(this.shiftTop);
    if (!this.get_explicit()) {
        this.on(this.inactiveHeader, "mouseleave", this.Collapse);
        this.on(this.inactiveHeader, "mouseover", this.Expand);
    }
    this.on(this.inactiveHeader, "click", this.Expand);
    if (!this.get_explicit()) {
        this.on(this.activeHeader, "mouseleave", this.Collapse);
        this.on(this.activeHeader, "mouseover", this.Expand);
    }
    this.on(this.activeHeader, "click", this.Collapse);
    this.$activeHeader = this.getRelatedElements(this.activeHeader);
    this.$inactiveHeader = this.getRelatedElements(this.inactiveHeader);
    this.$animation = (this.animation == "none") ? null : this.animation;

    //if (this.initialState == "collapsed") { this.Collapse(); } else { this.Expand(); }
    var p = $(this.root).css("position");
    if (p == null || p == "static" || p == "" || p == "Inherit") {
        $(this.root).css("position", "relative");
    }
    this.$showHideHeader(false);

    //    if (this.$bodyElement != null) {
    //        this.$bodyElement.css("position", "absolute");
    //    }
};
PopTemplate.prototype.$showHideHeader = function (bExpanded) {
    var b = ((this.$activeHeader.length != 0) ? 1 : 0) + ((this.$inactiveHeader.length != 0) ? 1 : 0);
    if (b == 1) {
        if (this.$activeHeader != null) this.$activeHeader.show();
        if (this.$inactiveHeader != null) this.$inactiveHeader.show();
    } else if (b > 1) {
        if (bExpanded) {
            if (this.$activeHeader != null) this.$activeHeader.show();
            if (this.$inactiveHeader != null) this.$inactiveHeader.hide();
        } else {
            if (this.$activeHeader != null) this.$activeHeader.hide();
            if (this.$inactiveHeader != null)  this.$inactiveHeader.show();
        }
    }
};
PopTemplate.$getHostViewContainer = new ProtoCaller("IViewHostQuery", "get_viewcontainerelement");
//PopTemplate.prototype
PopTemplate.prototype.loadBodyElement = function () {
    if (this.get_item() != null && this.connectorType != null && Function.classes[this.connectorType] != null) {
        var host = this.get_bindhost();
        var opts = {};
        var connector = null;
        if (host == null) {
            connector = new Function.classes[this.connectorType](this.bodyTemplate, null, opts);
        } else {
            connector = new Function.classes[this.connectorType](this.bodyTemplate, host, opts);
        }
        connector.bind(new Delegate(this, this.$loadBodyElement));
    }
}
PopTemplate.prototype.$loadBodyElement = function (body) {
    var _body = null;
	
    this.clearBody();
    if (BaseObject.is(body, "string")) {
        _body = $('<div/>').html(body).children().clone();
    } else if (BaseObject.isDOM(body)) {
        _body = $(body).clone();
    } else if (BaseObject.isJQuery(body)) {
        _body = body.clone();
    } else {
        jbTrace.log("Unknown or unsupported body template type. Use DOM element, string, or JQuery wrapped DOM element.");
    }
    if (_body != null) {
        this.$bodyElementObject = ViewBase.materialize($(this.root), _body, "append");
        if (this.$bodyElementObject != null) {
			this.$bodyElementObject.rebind();
            this.$bodyElement = _body;
			if (!this.get_explicit()) {
				this.on(this.$bodyElement, "mouseleave", this.Collapse);
				this.on(this.$bodyElement, "mouseover", this.Expand);
			}
            this.on(this.$bodyElement, "click", this.Expand);
            this.$bodyElementObject.set_data(this.$item);
            this.Dimentions();
            this.$isopen = true;
            this.$showHideHeader(true);
            this.statechangedevent.invoke(this, true);
            this.openedevent.invoke(this, true);
        } else {
			throw "PopTemplate requires a Base derived class on the root element of the body template.";
		}
    }
}
PopTemplate.prototype.clearBody = function () {
    if (BaseObject.is(this.$bodyElementObject, "BaseObject")) this.$bodyElementObject.obliterate();
    this.$bodyElementObject = null;
    if (this.$bodyElement != null) this.$bodyElement.Remove();
    this.$bodyElement = null;
}
PopTemplate.prototype.$item = null;
PopTemplate.prototype.get_item = function () {
    return this.$item;
}
PopTemplate.prototype.set_item = function (v) {
    this.$item = v;
    if (this.$isopen && BaseObject.is(this.$bodyElementObject, "Base")) {
        this.$bodyElementObject.set_data(this.$item);
    }
}

PopTemplate.prototype.Dimentions = function () {

    var th = this.$bodyElement;
    if (th != null && th.length > 0) {
        var query = new HostCallQuery(HostCallCommandEnum.gethost);
        this.throwStructuralQuery(query);
        if (query.host != null) {
            var viewcontainer = HintBubble.$getHostViewContainer.invokeOn(query.host);
            var containerRect = Rect.fromDOMElementOffset(viewcontainer);
            var expanderRect = Rect.fromDOMElementOffset(this.root);
            //var pt = new Point(expanderRect.x + (this.shiftLeft ? this.shiftLeft : 0), expanderRect.y + (this.shiftTop ? this.shiftTop : 0));
            var ballonRect = Rect.fromDOMElementOffset(th);
            if (ballonRect.w <= 0) {
                ballonRect.w = 250;
            }
            if (ballonRect.h <= 0) {
                ballonRect.h = 20;
            }
            var placementRect = containerRect.adjustPopUp(expanderRect, ballonRect, "aboveunder", 0);
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
            //this.on(this.$bodyElement, "mouseleave", this.Collapse);
        }
    }

};
PopTemplate.prototype.$pendingState = null;
PopTemplate.prototype.$updateState = function () {
    if (this.$pendingState == "open") {
        this.Show();
    } else if (this.$pendingState == "close" || this.$pendingState == "forceclose") {
        this.Hide();
    }
    this.$pendingState = null;
}
PopTemplate.prototype.$scheduleState = function(state) {
    if (state == "open" && this.$pendingState != "forceclose") this.$pendingState = "open";
    if (state == "close") this.$pendingState = "close";
    if (state == "forceclose") this.$pendingState = "forceclose";
    this.updateTrigger.windup();
}
PopTemplate.prototype.updateTrigger = new InitializeMethodTrigger("Calls back for state update", PopTemplate.prototype.$updateState, 300);

PopTemplate.prototype.Expand = function (e) {
	if (e != null) {
		e.stopPropagation();
	}
    this.Show();
    this.$scheduleState("open");
};
PopTemplate.prototype.Show = function () {
    if (!this.$isopen) {
        this.loadBodyElement();
		//Messenger.Instance().subscribe("PageEvent",this, true);
    }
};
PopTemplate.prototype.Hide = function () {
	Messenger.Instance().unsubscribe("PageEvent",this);
    this.$isopen = false;
    this.$showHideHeader(false);
    if (this.$bodyElement != null) this.$bodyElement.hide(this.$animation);
    this.statechangedevent.invoke(this, false);
    this.openedevent.invoke(this, false);
    this.clearBody();
};
PopTemplate.prototype.HandleMessage = function(msg) {
	if (BaseObject.is(msg, "PageEvent")) {
		if (msg.eventType == "closepopup") {
			this.Collapse();
		}
	}
}
PopTemplate.prototype.Collapse = function () {
	if (this.get_explicit()) {
		this.Hide();
	}
    this.$scheduleState("close");
};
PopTemplate.prototype.ForceCollapse = function () {
	if (this.get_explicit()) {
		this.Hide();
	}
    this.$scheduleState("forceclose");
};
PopTemplate.prototype.get_expanded = function () { return this.$isopen; };
PopTemplate.prototype.set_expanded = function (v) {
    if (v) { this.Expand(); } else { this.Collapse(); }
};
PopTemplate.prototype.get_collapsed = function () { return !this.$isopen; };
PopTemplate.prototype.set_collapsed = function (v) { if (v) { this.Collapse(); } else { this.Expand(); } };
