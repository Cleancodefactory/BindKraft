


/*INTERFACE*/ /*IMPL*/
function IDOMFocusContainerImpl() {}
IDOMFocusContainerImpl.InterfaceImpl(IFocusContainer, "IDOMFocusContainerImpl");
IDOMFocusContainerImpl.RequiredTypes("Base", "IFocusContainerRegister");
IDOMFocusContainerImpl.$reParseControlAttribute = /index=((?:\+|\-)?\d+)|accel=\'([^\'$])\'|column=((?:\+|\-)?\d+)|depth=((?:\+|\-)?\d+)/gi;
IDOMFocusContainerImpl.$parseControlAttribute = function(attrVal) { // Returns an object with the parameters. 
	IDOMFocusContainerImpl.$reParseControlAttribute.lastIndex = 0;
	var obj = { index: -1, column: -1, depth: -1 };
	var arr;
	while (arr = IDOMFocusContainerImpl.$reParseControlAttribute.exec(attrVal)) {
		if (arr[1] != null && arr[1] != "") {
			obj.index = parseInt(arr[1],10);
		} else if (arr[2] != null && arr[2] != "") {
			obj.accelerator = arr[2];
		} else if (arr[3] != null && arr[3] != "") {
			obj.column = parseInt(arr[3], 10);
		} else if (arr[4] != null && arr[4] != "") {
			obj.depth = parseInt(arr[4], 10);
		}
		
	}
	return obj;
}
IDOMFocusContainerImpl.classInitialize = function(cls, explicit) {
	if (IFocusContainer.classInitialize != null) {
		IFocusContainer.classInitialize.apply(this, arguments);
	}
	cls.Implement(IDOMFocusContainer);
	cls.ImplementProperty("focusevent", new InitializeStringParameter("","keydown"));
	cls.prototype.FCEnumerate = function() { // the fuck?!?
		var root = $(this.root);
	};
	cls.prototype.$focusElement = null; // Last known focus
	cls.prototype.FCSetFocus = function(/*default=begin*/ focusDirection) {
		var el;
		if (focusDirection & (FocusDirectionMask.start)) {
			el = this.FCGetSubordinate(null, "first");
			if (el != null) this.$FCSetFocusTo(el,FocusDirectionEnum.begin);
		} else if (focusDirection & (FocusDirectionMask.end)) {
			el = this.FCGetSubordinate(null, "last");
			if (el != null) this.$FCSetFocusTo(el,FocusDirectionEnum.end);
		} else {
			el = this.$focusElement || this.FCGetSubordinate(null, "first");
			if (el != null) this.$FCSetFocusTo(el, FocusDirectionEnum.begin);
		}
		this.$focusElement = el;
	}
	cls.prototype.OnLoseFocus = function(direction) {
		if (this.$focusElement != null) {
			this.$focusElement.OnLoseFocus(FocusDirectionEnum.reverseOf(direction)); // ???
		}
	}
	cls.prototype.$FCSetFocusTo = function(target, direction) {
		if (target != null) {
			if (this.$focusElement != null) this.$focusElement.OnLoseFocus(FocusDirectionEnum.reverseOf(direction));
			target.FCSetFocus(direction);
		}
		this.$focusElement = target;
	}
	cls.prototype.FCHasFocus = function() { // Checks if the container has the focus, does not request it.
		if (this.$focusElement != null) return true;
		return false;
	}
	cls.prototype.FCMoveFocus = function(/*default=next*/focusNavigation) {
		var other;
		if (this.$focusElement != null) {
			switch (focusNavigation) {
				case FocusNavigationEnum.prev:
				case FocusNavigationEnum.closer:
					other = this.FCGetSubordinate(this.$focusElement, "prev");
					if (other != null) {
						this.$FCSetFocusTo(other,FocusDirectionEnum.end);
						return true;
					}			
				break;
				case FocusNavigationEnum.up:
					other = this.FCGetSubordinate(this.$focusElement, "up");
					if (other != null) {
						this.$FCSetFocusTo(other,FocusDirectionEnum.bottom);
						return true;
					}			
				break;
				case FocusNavigationEnum.left:
					other = this.FCGetSubordinate(this.$focusElement, "left");
					if (other != null) {
						this.$FCSetFocusTo(other,FocusDirectionEnum.right);
						return true;
					}			
				break;
				case FocusNavigationEnum.down:
					other = this.FCGetSubordinate(this.$focusElement, "down");
					if (other != null) {
						this.$FCSetFocusTo(other,FocusDirectionEnum.top);
						return true;
					}			
				break;
				case FocusNavigationEnum.right:
					other = this.FCGetSubordinate(this.$focusElement, "right");
					if (other != null) {
						this.$FCSetFocusTo(other,FocusDirectionEnum.left);
						return true;
					}			
				break;
				case FocusNavigationEnum.next:
				case FocusNavigationEnum.farther:
					other = this.FCGetSubordinate(this.$focusElement, "next");
					if (other != null) {
						this.$FCSetFocusTo(other,FocusDirectionEnum.begin);
						return true;
					}
				break;
				case FocusNavigationEnum.first:
					other = this.FCGetSubordinate(this.$focusElement, "first");
					if (other != null) {
						this.$FCSetFocusTo(other, FocusDirectionEnum.begin);
						return true;
					}
				break;
				case FocusNavigationEnum.last:
					other = this.FCGetSubordinate(this.$focusElement, "last");
					if (other != null) {
						this.$FCSetFocusTo(other,FocusDirectionEnum.end);
						return true;
					}
				break;
			}
		}
		return false;
	}
	cls.prototype.OnChildFocusNotify = function(child, notify, direction) {
		var other; // temp var for another container in code blocks.
		var nav;
		switch (notify) {
			case FocusNotifyEnum.received:
				this.$focusElement = child;
				this.FCNotifyCoordinator(FocusNotifyEnum.received, direction)
				return true;
			break;
			case FocusNotifyEnum.lost:
				if (this.$focusElement == child) {
					this.$focusElement = null;
				}
				return true;
			break;
			case FocusNotifyEnum.surrender:
				if (direction != null) {
					if (this.$focusElement == child) {
						nav = FocusDirectionEnum.navigationFromSubordinateSurrender(direction);
						if (!this.FCMoveFocus(nav)) {
							switch (nav) {
								case FocusNavigationEnum.up:
									if (!this.FCNotifyCoordinator(FocusNotifyEnum.surrender, FocusDirectionEnum.top)) {
										other = this.FCGetSubordinate(this.$focusElement, "last");
										if (other != null) {
											this.$FCSetFocusTo(other,FocusDirectionEnum.end);
											return true;
										}
									}
								break;
								case FocusNavigationEnum.left:
									if (!this.FCNotifyCoordinator(FocusNotifyEnum.surrender, FocusDirectionEnum.left)) {
										other = this.FCGetSubordinate(this.$focusElement, "last");
										if (other != null) {
											this.$FCSetFocusTo(other,FocusDirectionEnum.right);
											return true;
										}
									}
								break;
								case FocusNavigationEnum.prev:
								case FocusNavigationEnum.closer:
									if (!this.FCNotifyCoordinator(FocusNotifyEnum.surrender, FocusDirectionEnum.begin)) {
										other = this.FCGetSubordinate(this.$focusElement, "last");
										if (other != null) {
											this.$FCSetFocusTo(other,FocusDirectionEnum.end);
											return true;
										}
									}
								break;
								case FocusNavigationEnum.next:
								case FocusNavigationEnum.farther:
									if (!this.FCNotifyCoordinator(FocusNotifyEnum.surrender, FocusDirectionEnum.end)) {
										other = this.FCGetSubordinate(this.$focusElement, "first");
										if (other != null) {
											this.$FCSetFocusTo(other,FocusDirectionEnum.begin);
											return true;
										}
									}
								break;
								case FocusNavigationEnum.right:
									if (!this.FCNotifyCoordinator(FocusNotifyEnum.surrender, FocusDirectionEnum.right)) {
										other = this.FCGetSubordinate(this.$focusElement, "first");
										if (other != null) {
											this.$FCSetFocusTo(other,FocusDirectionEnum.left);
											return true;
										}
									}
								break;
								case FocusNavigationEnum.down:
									if (!this.FCNotifyCoordinator(FocusNotifyEnum.surrender, FocusDirectionEnum.bottom)) {
										other = this.FCGetSubordinate(this.$focusElement, "first");
										if (other != null) {
											this.$FCSetFocusTo(other,FocusDirectionEnum.top);
											return true;
										}
									}
								break;
							}
						} else {
							return true;
						}
					}
				}
			break;
		}
		return false;
	}
	cls.prototype.FCInspectChildElement = function(node) {
		// This implementation will be functional on views only.
		if (explicit && node != null && node.hasAttribute("data-focus-control")) {
			var fc = node.getAttribute("data-focus-control");
			if (fc != null && fc.length > 0) {
				var settings = IDOMFocusContainerImpl.$parseControlAttribute(fc);
				var beh = BehaviorBinder.$bindBehavior($(node),null,"{NakedDOMFocusContainerHelperBehavior #focusindex='" + settings.index + "' #focusdepth='" + settings.depth + "' #focuscolumn='" + settings.column + "' useevent='" + this.get_fcuseevent() + "'}",BehaviorPhaseEnum.immediate);
				if (beh != null) {
					// register it
					this.FCRegisterSubordinate(beh);
					beh.set_controller(this);
				}
			}
		} else if (node != null && BaseObject.is(node.activeClass,"IFocusContainer")) {
			this.FCRegisterSubordinate(node.activeClass);
					//beh.set_controller(this);
		}
	};
	// Specific features for DOM focus container
	cls.prototype.OnDOMFCKeyEvent = function(e, sender) {
		
		
		/*TEMP*/
		// Test temporary code
		var other;
		if (e.which == 38) { // up
			other = this.FCGetSubordinate(sender, "prev");
			if (other != null) {
				other.FCSetFocus(FocusDirectionEnum.end);
			} else {
				if (!this.FCNotifyCoordinator(FocusNotifyEnum.surrender, FocusDirectionEnum.begin)) {
					other = this.FCGetSubordinate(sender, "last");
					if (other != null) {
						other.FCSetFocus(FocusDirectionEnum.end);
					}
				}
			}			
		} else if (e.which == 40) { // down
			other = this.FCGetSubordinate(sender, "next");
			if (other != null) {
				other.FCSetFocus(FocusDirectionEnum.begin);
			} else {
				if (!this.FCNotifyCoordinator(FocusNotifyEnum.surrender, FocusDirectionEnum.end)) {
					other = this.FCGetSubordinate(sender, "first");
					if (other != null) {
						other.FCSetFocus(FocusDirectionEnum.begin);
					}
				}
			}
		}
	};
}