


// ViewBase
/*CLASS*/
function ViewBase(viewRootElement) {
    Base.apply(this, arguments);
    this.commands = new Array();
}
ViewBase.Inherit(Base, "ViewBase");
ViewBase.interfaces = { PView: true };
//ViewBase.Implement(ISupportsURLHashImpl);
ViewBase.Implement ( ISupportsURLHashImpl );
ViewBase.Implement(IAjaxReportSinkImpl);
ViewBase.create = function (viewRootElement) {
    var ve = $(viewRootElement);
    var el = ve.get(0);
    if (BaseObject.is(el.activeClass, "BaseObject")) return el.activeClass;
    var clsDesc = JBUtil.parseDataClass(viewRootElement.attr("data-class"));
    if (clsDesc != null) {
        if (Function.classes[clsDesc.className] == null) {
            alert("The class " + clsDesc.className + " specified in a data-class attribute was not found.");
        }
        el.activeClass = new Function.classes[clsDesc.className](viewRootElement); //.create(viewRootElement);
        if (clsDesc.parameters != null) {
            JBUtil.parametrize.call(el.activeClass, viewRootElement, el.activeClass, clsDesc.parameters);
        }
        return el.activeClass;
    }
    // var clsName = viewRootElement.attr("data-class");
    //if (BaseObject.is(clsName, "string")) {
    // el.activeClass = Function.classes[clsName].create(viewRootElement);
    // el.activeClass = new Function.classes[clsName](viewRootElement); //.create(viewRootElement);
    // return el.activeClass;
    //}
    return null;
}.Description("...")
 .Param("viewRootElement","...")
 .Returns("object or null");

ViewBase.prototype.processStructuralQuery = function (query, processInstructions) {
    return false;
}.Description("")
 .Param("query","")
 .Param("processInstructions","")
 .Returns("false");

ViewBase.prototype.calculateState = function () {
    return { completed: true };
};

ViewBase.prototype.updateHostCommandBars = function() {
	this.throwStructuralQuery(new UpdateCommandBars());
};

ViewBase.recreate = function (viewRootElement) {
    var ve = $(viewRootElement);
    var el = ve.get(0);

    var clsDesc = JBUtil.parseDataClass(viewRootElement.attr("data-class"));
    if (clsDesc != null) {
        if (Function.classes[clsDesc.className] == null) {
            alert("The class " + clsDesc.className + " specified in a data-class attribute was not found.");
        }
        el.activeClass = new Function.classes[clsDesc.className](viewRootElement); //.create(viewRootElement);
        if (clsDesc.parameters != null) {
            JBUtil.parametrize.call(el.activeClass, viewRootElement, el.activeClass, clsDesc.parameters);
        }
        return el.activeClass;
    }
    return null;
};
// DEPRECATED: Very old version of $internal_initialize
/* This piece is kept mostly for educational purposes - easier to understand for programmers who dig this deep and shows enough of the process to explain the idea.
ViewBase.$intenal_init = function (htmlEl, bInitialCall) { // Deprecated
    var obj, a, c, cs = htmlEl.children();
    var prms;
    var isBorder;
    var clsDesc;
    for (var i = 0; i < cs.length; i++) {
        c = $(cs[i]);
        a = c.attr("data-class");
        isBorder = c.attr("data-template-root");
        if (bInitialCall) {
            if (BaseObject.is(a, "string")) {
                // Attempt to create
                obj = ViewBase.recreate(c);
                if (obj != null) {
                    obj.$parametrize(c.attr("data-parameters"));
                    obj.$init();
                }
            } else {
                ViewBase.$intenal_init(c);
            }
        } else {
            if (!isBorder) {
                clsDesc = JBUtil.parseDataClass(a);
                if (clsDesc != null) {
                    if (!Class.is(Function.classes[clsDesc.className], "ITemplateRoot")) {
                        obj = ViewBase.recreate(c);
                        if (obj != null) {
                            obj.$parametrize(c.attr("data-parameters"));
                            obj.$init();
                        }
                    }
                } else {
                    ViewBase.$intenal_init(c);
                }
            }
        }
    }
};
*/

// Materialization recursor
// els 			- starting element(s). For initial call it is recommended to start with a single element.
// bInitialCall - Omits creation of data-class, but applies parameters anew by default (see 4-th arg). Intended for call on self.
// bSkipClassCreation - Skips class creation over the first node on which the method is called, but the arg does not propagate!
// bSkipParams - omit parameterization.
// focusContainer - fc to call on each node for apprisal. the
ViewBase.$intenal_initialize = function (els, bInitialCall, bSkipClassCreation, bSkipParams, focusContainer) { // jqset, bool
    var isBorder; // is this a intertemplate border
    var htmlEls = $(els);
    var c, a, obj, cs, clsDesc;
	var grpKey = null;
    for (var i = 0; i < htmlEls.length; i++) {
		var fc = focusContainer;
        c = $(htmlEls[i]);
        // a = c.attr("data-class");
        clsDesc = JBUtil.parseDataClass(c.attr("data-class"));
        isBorder = c.attr("data-template-root");
		ElementGroup.markSiblingGroup(c);
        if (bInitialCall) {
            if (clsDesc != null) {
                // Attempt to create
                if (bSkipClassCreation) {
                    obj = ViewBase.create(c);
                } else {
                    obj = ViewBase.recreate(c);
                }
                if (!bSkipParams) obj.$parametrize(c.attr("data-parameters"));
				if (focusContainer == null && !(isBorder || obj.is("ITemplateRoot"))) { // if we start at a border - don't look back
					// Look back for one (but not on this element)
					var p = c.parent(), ac;
					while(p != null && p.length > 0) {
						ac = p.activeclass();
						if (BaseObject.is(ac, "IFocusContainer")) {
							fc = ac;
							break;
						}
						if (p.attr("data-template-root") || BaseObject.is(ac, "ITemplateRoot")) break; // border
						p = p.parent();
					}
				}

				if (obj.is("IFocusContainer")) {
					obj.$init(null, obj); // Pass itself as FC for ViewBase recursion (Base ignores the arguments)
				} else {
					obj.$init(null, fc);
				}
				if (fc != null) fc.FCInspectChildElement(c[0]);
				if (obj.is("IFocusContainer")) fc = obj;
                if (!BaseObject.is(obj, "ViewBase")) {
                    cs = c.children();
                    ViewBase.$intenal_initialize(cs, null, null, null, fc);
                }
                obj.$postinit();
            } else {
                var obj = c.activeclass();
                if (obj != null) { // Reparametrization (this is happening only if the class is attached programmatically and not with data-class
                    if (!bSkipParams) obj.$parametrize(c.attr("data-parameters"));
                }
				if (focusContainer == null && !(isBorder || BaseObject.is(obj,"ITemplateRoot"))) { // if we start at a border - don't look back
					// Look back for one (but not on this element)
					var p = c.parent(), ac;
					while(p != null && p.length > 0) {
						ac = p.activeclass();
						if (BaseObject.is(ac, "IFocusContainer")) {
							fc = ac;
							break;
						}
						if (p.attr("data-template-root") || BaseObject.is(ac, "ITemplateRoot")) break; // border
						p = p.parent();
					}
				}
				if (fc != null) fc.FCInspectChildElement(c[0]);
				if (obj != null && obj.is("IFocusContainer")) fc = obj;
                cs = c.children();
                ViewBase.$intenal_initialize(cs, null, null, null, fc);
            }
        } else {
            if (!isBorder) {
                if (clsDesc != null) {
                    if (!Class.is(Function.classes[clsDesc.className], "ITemplateRoot")) {
                        if (bSkipClassCreation) {
                            obj = ViewBase.create(c);
                        } else {
                            obj = ViewBase.recreate(c);
                        }
                        if (obj != null) {
                            if (!bSkipParams) obj.$parametrize(c.attr("data-parameters"));
                        }
						if (obj.is("IFocusContainer")) {
							obj.$init(null, obj); // Give ViewBase as chance to work with itself as FC
						} else {
							obj.$init(null, fc);
						}
						if (fc != null) fc.FCInspectChildElement(c[0]);
						if (obj.is("IFocusContainer")) fc = obj;
                        if (!BaseObject.is(obj, "ViewBase")) {
                            cs = c.children();
                            ViewBase.$intenal_initialize(cs, null,null,null,fc);
                        }
                        obj.$postinit();
                    }
                } else {
					if (fc != null) fc.FCInspectChildElement(c[0]);
                    cs = c.children();
                    ViewBase.$intenal_initialize(cs, null,null,null,fc);
                }
            }
        }
    }
};

ViewBase.prototype.$init = function (bInitialCall, focusContainer) {
	this.inspectTemplate();
    ViewBase.$intenal_initialize($(this.root).children(), bInitialCall, true, false, focusContainer);
    this.init();
    this.initializedevent.invoke(this, null);
    this.rebind();
};
ViewBase.prototype.initialize = function () { // Deprecated
	this.inspectTemplate();
    ViewBase.$intenal_initialize($(this.root), true, true);
    this.init();
    this.initializedevent.invoke(this,null);
    this.rebind(); // Default behaviour, items controls should override this. First call should ignore first level independent binding declarations
};

ViewBase.prototype.$caption = null; //"Todo: Implement get_caption please";
ViewBase.prototype.set_caption = function(v) {
	this.$caption = v;
	this.throwStructuralQuery(new UpdateCommandBars());
};

ViewBase.prototype.get_caption = function () {
    return this.$caption;
};

// TODO: Deprecate this - such a thing should not be here!
ViewBase.prototype.get_command_by_id = function (id) {
    var command = null;
    jQuery.each(this.commands, function () {
        if (this.id == id) {
            command = this;
            return false;
        }
    });
    return command;
};

ViewBase.prototype.get_cardStyle = function () {
    return new CardStyle();
};

ViewBase.materializeIn = function (htmlEl, content) {
    htmlEl.html(content);
    ViewBase.$intenal_initialize($(htmlEl).children(), true);

    var r = htmlEl.children("[data-root]");
    if (r.length > 0) return ViewBase.create(r.first());
	
    r = htmlEl.children();
	
    if (r.length > 0) {
        return $(r.first()).get(0).activeClass;
    }
    return null;
};

ViewBase.materialize = function (htmlEl_in, template, how) { // how: prepend|append|before|after
    var _how = (how == null) ? "append" : how;
	var htmlEl = $(htmlEl_in);
    var _template = $(template);
    htmlEl[_how].call(htmlEl, _template);
    ViewBase.$intenal_initialize(_template, true);

    var r = _template.children("[data-root]");
    if (r.length > 0) return ViewBase.create(r.first());
    r = _template;
    if (r.length > 0) {
        return $(r.first()).get(0).activeClass;
    }
    return null;
};

ViewBase.cloneTemplate = function (container, contentTemplate, data, bGroupElements) {
    var item = $(contentTemplate).clone(); // $($(contentTemplate).clone());
    $(container).append(item);
    if (bGroupElements && item.length > 1) {
        new ElementGroup(item);
    }
    ViewBase.$intenal_initialize(item, true);

    var o, r = item.find("[data-root]");
    if (r.length > 0) {
        o = r.first();
        o.get(0).dataContext = data;
        o.get(0).hasDataContext = true;
    } else {
        for (var i = 0; i < item.length; i++) {
            o = item.get(i);
            if (o != null) {
                o.dataContext = data;
                o.hasDataContext = true;
            }
        }
    }
    return item;
};

ViewBase.prototype.onviewcloseevent = new InitializeEvent("Fired when onClose of the ViewBase derived class is invoked and is accepting the close request. Signature: (sender)");
ViewBase.prototype.onClose = function () {
    this.closeValidators();
    if (this.onviewcloseevent != null) this.onviewcloseevent.invoke(this, null);
    for (var k in this) {
        var ed = this[k];
        if (BaseObject.is(ed, "EventDispatcher")) {
            ed.removeAll();
        }
    }
    Messenger.Default.unsubscribeAll(this);
    return true;
};
ViewBase.prototype.removeView = function () {
    if (this.root != null) {
        $(this.root).Remove();
        this.root = null;
    }
}.Description("Removes the view's DOM from the document. This is a low level function and should be called only by framework code. This also triggers obliteration - through the DOM removal with capital cased Remove method.");
ViewBase.prototype.commands = null; // Array();
ViewBase.prototype.OnContainerStateChanged = function (container) {
    // To do: if you need to do something when the card state changes override and Implement.
    //  Query the container for whatever you might wanna know about its current state.
};
ViewBase.sourceUrl = null; // The url without server and app install path. Note that.
ViewBase.prototype.hashKeyOfUrl = function (url) {
    // The this in this method is the class definition not the class instance !!! See the notes about the ISupportsURLHashImpl Interface
    if (this.sourceUrl != null && url != null) {
        if (BaseObject.is(url, "string")) {
            if (url.toUpperCase().indexOf(this.sourceUrl.toUpperCase()) >= 0) return this.sourceUrl;
        } else if (url.url != null) {
            var u = BaseObject.ajaxCleanURLForHashOperations(url.url);
            if (u != null && u.toUpperCase().indexOf(this.sourceUrl.toUpperCase()) >= 0) return this.sourceUrl;
        }
    }
    return null;
};
