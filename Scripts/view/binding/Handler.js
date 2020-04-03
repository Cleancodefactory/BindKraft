


// Handler(
//  target - a dom or extended jQuery dom element. If it is also extended with an activeClass the binding will take care on its own
//  targetAction - property to set, if it starts with $ it is an active property of the activeClass, otherwise it is a prop of the DOM element
//  expr - the binding expression
//  parentContext - if true the binding is processed over the parent data contexts and not over the data context of this element (if context exist in it).
// )
function Handler(domTarget, target, targetAction, expr, parentContext) {
    Binding.apply(this, arguments);
}
Handler.Inherit(Binding, "Handler");
Handler.interfaces = { PHandler: true };
Handler.prototype.obliterate = function (bFull) {
	if ( this.__obliterated ) { return; }
    BaseObject.obliterate(this.$currentHandler);
    if (this.$currentHandler) delete this.$currentHandler;
    Binding.prototype.obliterate.call(this, bFull);
};

Handler.$regExpSource = /(source|self)=(\S+)/i;
Handler.$regExpPath = /path=(\S+)/i;
Handler.$regExpContent = /\{(bind)\s*(.*)\}/i;

Handler.prototype.$parseExpression = function () {
	if ( this.__obliterated ) { return; }
    Binding.prototype.$parseExpression.apply(this, arguments);
};

Handler.prototype.OmniHandlerDom = function (ev) {
	if ( this.__obliterated ) { return; }
	if ((this.options.nodefault || this.options.preventdefault) && ev != null && ev.preventDefault) {
		ev.preventDefault();
	}
	if ((this.options.stoppropagation || this.options.nopropagation) && ev != null && ev.stopPropagation) {
		ev.stopPropagation();
	}
	return this.callAsyncIf(this.options.async, function () {
		var hndlr = this.$get_sourceValue();
		if (hndlr != null) {
			var dc = this.$findDataContext();
			this.$traceBinding("dc", dc);

			if (BaseObject.is(hndlr, "IInvoke")) {
				return hndlr.invoke(ev, dc, this, this.bindingParameter);
			} else if (typeof hndlr == "function") {
				if (BaseObject.is(this.$sourceNode, "BaseObject")) {
					if (this.options.freezesite && BaseObject.is(this.$sourceNode, "IFreezable")) {
						return this.$sourceNode.freezeEvents(this.$sourceNode, hndlr, ev, dc, this, this.bindingParameter);
					} else {
						return hndlr.call(this.$sourceNode, ev, dc, this, this.bindingParameter);
					}
				} else {
					return hndlr.call(this.$sourceNode, ev, dc, this, this.bindingParameter);
				}
			}
		}
	});
};
/* Plug works once and during rebing - it does not need two omnis
Handler.prototype.OmniPlugDom = function(ev) {
	if ( this.__obliterated ) { return; }
	var val = ev.target;
	return this.callAsyncIf(this.options.async, function () {
		this.$setupSource();
		if (this.$sourceNode != null) {
			val = this.$formatFromTarget(val);
			if (this.$sourceAction != null) {
				var action = this.$sourceAction.resolve(null, this);
				JBUtil.$setProperty(this.$sourceNode, null, action, val);
				var cs = this.$sourceNode, ca = action;
				this.$unbindcall = function() {	
					if (ca != null && ca != null) {
						JBUtil.$setProperty(cs, null, ca, null);
					}
				}
			}
		}
	});
}
*/

// The actual arguments are up to the implementor of the event. However, there is a convention to pass sender and data parameters only.
// Recomended: Stick to the convention, you can break it safely only for events intended for local private usage between a couple of classes entirely under your control.
Handler.prototype.OmniHandlerDisp = function (sender, dc) {
	if ( this.__obliterated ) { return; }
	var args = Array.createCopyOf(arguments);
	return this.callAsyncIf(this.options.async, function () {
		var hndlr = this.$get_sourceValue();
		if (hndlr != null) {
			args.push(this, this.bindingParameter);
			if (BaseObject.is(hndlr, "IInvocationWithArrayArgs")) {
				return hndlr.invokeWithArgsArray(args);
			} else if (typeof hndlr == "function") {
				if (this.options.freezesite && BaseObject.is(this.$sourceNode, "IFreezable")) {
					return this.$sourceNode.freezeEvents(this.$sourceNode, hndlr, sender, dc, this, this.bindingParameter);
				} else {
					return hndlr.apply(this.$sourceNode, args);
				}
			}
			/*
			if (BaseObject.is(hndlr, "IInvoke")) {
			return hndlr.invoke(sender, dc, this, this.bindingParameter);
			} else if (typeof hndlr == "function") {
			return hndlr.call(this.$sourceNode, sender, dc, this, this.bindingParameter);
			}
			*/
		}
	});
};
// It is not actually an omni handler. This method is called immediatelly during rebind and no event is handled
// The purpose of the "plug" bindings is to inject reference to their target into the refered by the bnding source
//	So they just do that during binding and do not attach to an event source.
// The handler remains registered in the handlers collection only to provide unbinding functionality during obliteration/unbinding.
Handler.prototype.OmniPlugDisp = function(target1, target2) {
	if ( this.__obliterated ) { return; }
	var args = Array.createCopyOf(arguments);
	var val = target1 || target2; // The method is called with two args containing the target and backup target - e.g. we prefer activeClass, but if not available we inject the DOM element (obvious for the view writter)
	return this.callAsyncIf(this.options.async, function () {
		this.$setupSource();
		if (this.$sourceNode != null) {
			val = this.$formatFromTarget(val);
			if (this.$sourceAction != null) {
				var action = this.$sourceAction.resolve(null, this);
				JBUtil.$setPropertyStrict(this.$sourceNode, null, action, val);
				var cs = this.$sourceNode, ca = action;
				this.$unbindcall = function() {	
					if (cs != null && ca != null) {
						JBUtil.$setPropertyStrict(cs, null, ca, null);
					}
				}
			}
		}
	});
}

Handler.prototype.OmniTriggerDom = function (ev) {
	if (this.__obliterated) { return; }
    this.callAsyncIf(this.options.async, function () {
        var dc = this.$findDataContext();
        this.$omniTrigger(ev, dc);
    });    
};

Handler.prototype.OmniTriggerDisp = function (sender, dc) {
	if ( this.__obliterated ) { return; }
	this.callAsyncIf(this.options.async, function () {
        this.$omniTrigger(sender, dc);
    });    
};
//TODO: Currently the same as DOM, but we should see if the active class can handle the query and give it a chance!
// So, up to at least 2.12.0 this is actually throwDown and not throw.
Handler.prototype.QueryThrowerDisp = function(sender, dc) {
	if ( this.__obliterated ) { return; }
	this.callAsyncIf(this.options.async, function () {
		if (this.$throwQuery != null && BaseObject.queryRegistrations[this.$throwQuery] != null) {
			var p = BaseObject.queryRegistrations[this.$throwQuery].parser.apply(this,this.bindingParameter,this.get_sourceValue());
			if (p != null) {
				if (this.$target != null) {
					JBUtil.throwStructuralQuery(this.$target, p, { routingType: "DOM"});
				}
			} else {
				throw "Creation of query failed";
			}
		} else {
			throw "Non-registered or incorrect query alias specified.";
		}
	});
};

Handler.prototype.QueryThrowerDom = function(ev) {
	if ( this.__obliterated ) { return; }
	this.callAsyncIf(this.options.async, function () {
		if (this.$throwQuery != null && BaseObject.queryRegistrations[this.$throwQuery] != null) {
			var p = BaseObject.queryRegistrations[this.$throwQuery].parser.apply(this,this.bindingParameter,this.get_sourceValue());
			if (p != null) {
				if (this.$target != null) {
					JBUtil.throwStructuralQuery(this.$target, p, { routingType: "DOM"});
				}
			} else {
				throw "Creation of query failed";
			}
		} else {
			throw "Non-registered or incorrect query alias specified.";
		}
	});
};

Handler.prototype.$omniTrigger = function (ev, dc) {
	if ( this.__obliterated ) { return; }
    if (this.$trigger != null) {
        this.$setupSource();
        var pureEventName = ((this.$trigger.charAt(0) == "$") ? this.$trigger.slice(1) : this.$trigger);
        var obj;
        if (this.$sourceObject != null) {
            var dc = this.$findDataContext();
            if (this.$trigger.charAt(0) == "$") {
                obj = null;
                if (BaseObject.is(this.$sourceObject, "BaseObject")) {
                    obj = this.$sourceObject;
                } else if (BaseObject.isDOM(this.$sourceObject) || BaseObject.isJQuery(this.$sourceObject)) {
                    obj = $(this.$sourceObject).activeclass();
                } else if (typeof this.$sourceObject == "object") {
                    // Still an object - do nothing
                    // TODO: See if it would be useful to have this call a method in this case.
                }
                if (obj != null) {
                    if (BaseObject.is(obj[pureEventName], "EventDispatcher")) {
						// The first arg was ev (the event or the sender of the original event), but it should be the natural sender, so we changed this.
						// The previous behaviour was inconsistent caused by the temptation to provide path to the original invoker.
                        obj[pureEventName].invoke(obj, dc, this, this.bindingParameter);
                    }
                }
            } else {
                // Treat it as dom element if possible
                if (BaseObject.is(this.$sourceObject, "Base")) {
                    // The bindings "save" work by resolving to Base data-class where available. This "help" is contraproductive this time
                    // and we need to resolve back to node
                    obj = $(this.$sourceObject.root);
                } else {
                    if (BaseObject.isJQuery(this.$sourceObject)) {
                        obj = this.$sourceObject;
                    } else if (BaseObject.isDOM(this.$sourceObject)) {
                        obj = $(this.$sourceObject); // wrap naked DOM elements if any gets here
                    } else {
                        // General objects are not supported without $ in the event name
                    }
                }
                if (obj != null && obj.length > 0) {
                    obj.trigger(pureEventName);
                }
            }
        }

    }
};

// For potential future needs these are separated in Disp and Dom as the rest
Handler.prototype.CommandExecutorDisp = function(sender, dc) {
	if ( this.__obliterated ) { return; }
	this.callAsyncIf(this.options.async, function () {
		this.$omniCommandExecutor(this.$source, this.bindingParameter);
	});
};

Handler.prototype.CommandExecutorDom = function(ev, dc) {
	if ( this.__obliterated ) { return; }
	this.callAsyncIf(this.options.async, function () {
		this.$omniCommandExecutor(this.$source, this.bindingParameter);
	});
};

Handler.prototype.$omniCommandExecutor = function(cmd, paramsUnparsed) {
	if ( this.__obliterated ) { return; }
	var params = null;
	if (paramsUnparsed == null) {
		params = this.$get_sourceValue();
	} else {
		params = paramsUnparsed;
		if (BaseObject.is(params,"string")) {
			params = params.replace(/\\'/g,"\'")
		}
	}

	if (params != null && params.length > 0) {
		CommandProccessor.Default.executeCommand(cmd + " " + params);
	} else {
		CommandProccessor.Default.executeCommand(cmd);
	}

};

Handler.prototype.$targetSet = false; // The target can be set only once
Handler.prototype.$currentHandler = null;

Handler.prototype.$set_targetValue = function (v) {
	if ( this.__obliterated ) { return; }
    if (this.$targetSet) { return; }
    this.$targetSet = true;
    var dlg = null;
    if (this.$targetAction != null) {
        if (this.$actualTarget != null && this.$targetAction.charAt(0) == "$") {
            var pureAction = this.$targetAction.slice(1);
			if (this.$throwQuery != null) {
				dlg = new Delegate(this, this.QueryThrowerDisp);
			} else if (this.$trigger != null) {
                dlg = new Delegate(this, this.OmniTriggerDisp);
			} else if (this.$plug === true) {
                // dlg = new Delegate(this, this.OmniPlugDisp);
				this.OmniPlugDisp(this.$actualTarget,this.$target);
			} else if (this.$sourceType == "shellcommand") {
				dlg = new Delegate(this, this.CommandExecutorDisp);
            } else {
                dlg = new Delegate(this, this.OmniHandlerDisp);
            }
			if (dlg != null) {
				if (BaseObject.is(this.$actualTarget[pureAction], "EventDispatcher")) {
					this.$actualTarget[pureAction].add(dlg);
				} else if (BaseObject.is(this.$actualTarget["set_" + pureAction], "function")) {
					this.$actualTarget["set_" + pureAction].call(this.$actualTarget, dlg);
				} else {
					this.$actualTarget[pureAction] = dlg;
				}
			}
        } else if (this.$target != null) {
            if (this.$targetAction.charAt(0) == "$") {
                var pureAction = this.$targetAction.slice(1);
				if (this.$throwQuery != null) {
					dlg = new Delegate(this, this.QueryThrowerDisp);
                } else if (this.$trigger != null) {
                    dlg = new Delegate(this, this.OmniTriggerDisp);
				} else if (this.$plug === true) {
					this.OmniPlugDisp(this.$target.activeClass,this.$target);
				} else if (this.$sourceType == "shellcommand") {
					dlg = new Delegate(this, this.CommandExecutorDisp);
                } else {
                    dlg = new Delegate(this, this.OmniHandlerDisp);
                }
                if (this.$target.activeClass != null) {
					if (dlg != null) { // Some bindings may want to shortcircuit this
						if (BaseObject.is(this.$target.activeClass[pureAction], "EventDispatcher")) {
							this.$target.activeClass[pureAction].add(dlg);
						} else if (BaseObject.is(this.$target.activeClass["set_" + pureAction], "function")) {
							this.$target.activeClass["set_" + pureAction].call(this.$target.activeClass, dlg);
						} else {
							this.$target.activeClass[pureAction] = dlg;
						}
					}
                } else {
                    // jbTrace.log("Handler: Incorrect target, no active class is attached to the element. Binding:" + this.$expression + " target action:" + pureAction);
                }
            } else {
                //$(this.$target)[this.$targetAction]({ binding: this, bindingParameter: this.bindingParameter, node: this.$sourceNode, func: v, root: this.$target, ctx: dc }, Handler.OmniHandler);
                // jQuery assigns unique id to the handler and removes it by comparison of the id, so we need to keep a ref to the bound handler in order to be able to unbind it.
				if (this.$throwQuery != null) {
					this.$currentHandler = Delegate.createWrapper(this, this.QueryThrowerDom);
				} else if (this.$trigger != null) {
                    this.$currentHandler = Delegate.createWrapper(this, this.OmniTriggerDom);
				} else if (this.$plug === true) {
					this.OmniPlugDisp(this.$target.activeClass,this.$target);
                    // this.$currentHandler = Delegate.createWrapper(this, this.OmniPlugDom);
				} else if (this.$sourceType == "shellcommand") {
					this.$currentHandler = Delegate.createWrapper(this, this.CommandExecutorDom);
                } else {
                    this.$currentHandler = Delegate.createWrapper(this, this.OmniHandlerDom);
                }
				if (this.$currentHandler) {
					$(this.$target).bind(this.$targetAction, this.$currentHandler);
				}
                // $(this.$target)[this.$targetAction](this.$currentHandler);
            }
        }
    }
};

/*
Handler.prototype.$targetSet = false; // The target can be set only once
Handler.prototype.$set_targetValue = function (v) {
    if (this.$targetSet) return;
    this.$targetSet = true;
    var d;
    if (this.$targetAction != null) {
        var dc = this.$findDataContext();
        if (this.$actualTarget != null && this.$targetAction.charAt(0) == "$") {
            var pureAction = this.$targetAction.slice(1);
            if (BaseObject.is(this.$actualTarget[pureAction], "EventDispatcher")) {
                this.$actualTarget[pureAction].add(new Delegate(this.$sourceNode, v, [this, this.bindingParameter]));
            } else if (BaseObject.is(this.$actualTarget["set_" + pureAction], "function")) {
                this.$actualTarget["set_" + pureAction].call(this.$actualTarget, new Delegate(this.$sourceNode, v, [this, this.bindingParameter]));
            } else {
                this.$actualTarget[pureAction] = new Delegate(this.$sourceNode, v, [this, this.bindingParameter]);
            }
        } else if (this.$target != null) {
            if (this.$targetAction.charAt(0) == "$") {
                var pureAction = this.$targetAction.slice(1);
                if (this.$target.activeClass != null) {
                    if (BaseObject.is(this.$target.activeClass[pureAction], "EventDispatcher")) {
                        this.$target.activeClass[pureAction].add(new Delegate(this.$sourceNode, v, [this, this.bindingParameter]));
                    } else if (BaseObject.is(this.$target.activeClass["set_" + pureAction], "function")) {
                        this.$target.activeClass["set_" + pureAction].call(this.$target.activeClass, new Delegate(this.$sourceNode, v, [this, this.bindingParameter]));
                    } else {
                        this.$target.activeClass[pureAction] = new Delegate(this.$sourceNode, v, [this, this.bindingParameter]);
                    }
                } else {
                    jbTrace.log("Handler: Incorrect target, no active class is attached to the element. Binding:" + this.$expression + " target action:" + pureAction);
                }
            } else {
                $(this.$target)[this.$targetAction]({ binding: this, bindingParameter: this.bindingParameter, node: this.$sourceNode, func: v, root: this.$target, ctx: dc }, Handler.OmniHandler);
            }
        }
    }
};

Handler.OmniHandler = function (ev) {
    var dc = null;
    if (ev.data != null && ev.data.binding != null) {
        dc = ev.data.binding.$findDataContext();
        ev.data.binding.$traceBinding("dc", dc);
    }

    if (BaseObject.is(ev.data.func, "Delegate")) {
        ev.data.func.invoke(ev, dc, ev.data.binding, ev.data.bindingParameter);
    } else {
        if (BaseObject.is(ev.data.node, "Base")) {
            if (BaseObject.is(ev.data.func, "function")) {
                ev.data.func.call(ev.data.node, ev, dc, ev.data.binding, ev.data.bindingParameter);
            }
        } else {
            if (BaseObject.is(ev.data.func, "function")) {
                ev.data.func.call(ev.data.root, ev, dc, ev.data.binding, ev.data.bindingParameter);
            }
        }
    }
};
*/
Handler.prototype.$unbindcall = null;
Handler.prototype.unBind = function () {
	if ( this.__obliterated ) { return; }
	if (typeof this.$unbindcall == "function") {
		this.$unbindcall();
		this.$unbindcall = null;
	}
    var pureAction = this.$targetAction;
    var b$ = false;
    if (pureAction != null && pureAction.charAt(0) == "$") {
        pureAction = this.$targetAction.slice(1);
        b$ = true;
    }
    if (this.$target != null && pureAction != null && pureAction.length > 0) {
        if (!b$) {
            if (this.$currentHandler != null) {
                $(this.$target).unbind(this.$targetAction, this.$currentHandler);
                this.$currentHandler = null;
            }
        } else {
            if (this.$actualTarget != null) {
                if (BaseObject.is(this.$actualTarget[pureAction], "EventDispatcher")) {
                    this.$actualTarget[pureAction].remove(new Delegate(this, this.OmniHandlerDisp));
                } else if (BaseObject.is(this.$actualTarget["set_" + pureAction], "function")) {
                    this.$actualTarget["set_" + pureAction].call(this.$actualTarget, null);
                } else {
                    this.$actualTarget[pureAction] = null;
                }
            } else {
                if (this.$target.activeClass != null) {
                    if (BaseObject.is(this.$target.activeClass[pureAction], "EventDispatcher")) {
                        this.$target.activeClass[pureAction].remove(new Delegate(this, this.OmniHandlerDisp));
                    } else if (BaseObject.is(this.$target.activeClass["set_" + pureAction], "function")) {
                        this.$target.activeClass["set_" + pureAction].call(this.$target.activeClass, null);
                    } else {
                        this.$target.activeClass[pureAction] = null;
                    }
                }
            }
        }
    }
    this.$targetSet = false;
    Binding.prototype.unBind.call(this);
};

Handler.prototype.$get_targetValue = function () {

};

// TODO: Is this used anywhere? If not we better remove the method
Handler.prototype.dont_updateTarget = function (compiledPatt) {
	if ( this.__obliterated ) { return; }
    if (compiledPatt != null && !this.matchFlags(compiledPatt)) { return; }
    this.$setupSource();
    if (this.$sourceNode != null) {
        if (this.$sourceAction != null) {
            var handler = this.$sourceAction.resolve(this.$sourceNode, this);
            this.$set_targetValue(handler);
        } else {
            this.$set_targetValue(this.$sourceNode);
        }
    } else {
        jbTrace.log("Handler: Source is null or not an object, check your binding syntax. Event bindings cannot use some binding types (such as static). Binding:" + this.$expression);
    }
};

Handler.prototype.updateSource = function () {

};
Handler.bindingLibrary = {};
