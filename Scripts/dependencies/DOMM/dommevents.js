
(function () {
	if (typeof window.CustomEvent === "function") return;

  	function CustomEvent (event, params) {
		params = params || { bubbles: false, cancelable: false, detail: undefined };
		var evt = document.createEvent('CustomEvent');
		evt.initCustomEvent(event, params.bubbles, params.cancelable, params.detail);
		return evt;
	};

  	CustomEvent.prototype = window.Event.prototype;

  	window.CustomEvent = CustomEvent;
})();

(function () {
	if(true){
		var stopImmProp = Event.prototype.stopImmediatePropagation;
		Event.prototype.stopImmediatePropagation = function(){
			this.isImmediatePropagationStopped = true;
			stopImmProp.call(this, arguments);
		}
	}

	DOMMNode.prototype.events = function(eventName1, eventName2, eventName3){
		if (this._node == null || this._node == undefined) throw 'Events cannot be added/removed/executed on non existing node';
		if ((this._node.nodeType != Node.ELEMENT_NODE) && (this._node.nodeType != Node.DOCUMENT_NODE)) {
			throw 'Events cannot be added/removed/executed on node with different nodeType than element.';
		};

		var registratorArgs = [];
		registratorArgs.push(this._node);

			for (var i = 0; i < arguments.length; i++) {
			var arg = arguments[i];

						if(typeof arg != 'string' || arg.length == 0) continue;

				registratorArgs.push(arg);
		}

		return new Registrator(registratorArgs);
	}

	DOMMNode.prototype._g_DomDataPropertyName = "domm_data";

	function RDomData(dom) {
		if (dom["domm_data"] == null) {
			dom["domm_data"] = {};
		}

		return dom["domm_data"];
	};

	function RDomDataEvents(dom) {
		var domNodeObject = RDomData(dom);
		if (domNodeObject.events == null) {
			domNodeObject.events = {
				capture: { },
				bubble: { }
			};
		}

		return domNodeObject.events;
	};

	var _g_cookiecounter = 0;
	function Cookie() {
		var cookie = new Date().getTime() + "" + _g_cookiecounter ++;
		if (_g_cookiecounter > 9007199254740991) _g_cookiecounter = 0;

		return cookie;
	};

	function OmniEventHandlerCapture(event) {
		var rawnode = event.currentTarget; 
		var invocator = new Invocator(rawnode);

		invocator.handleEvent(event, true);
	};

	function OmniEventHandlerBubble(event) {
		var rawnode = event.currentTarget; 
		var invocator = new Invocator(rawnode);

		invocator.handleEvent(event, false);
	};

	var Registrator = function Registrator(argsAsArray) {
		var dom = argsAsArray[0];

		this.$dom = dom;
		this.eventnames = [];

		for (var i = 1; i < argsAsArray.length; i++){
			this.eventnames.push(argsAsArray[i]);
		}

		this.events = RDomDataEvents(dom);
		var that = this;

		this.capture = {
			add: function(handler, priority) {
				return addHandler(handler, priority, true)
			},
			remove: function(cookie) {
				removeHandler(cookie, true);
			},
		}

		this.bubble = {
			add: function(handler, priority) {
				return addHandler(handler, priority, false)
			},
			remove: function(cookie) {
				removeHandler(cookie, false);
			},
		}

		this.add = function(handler, priority) {
			return addHandler(handler, priority, false);
		}

		this.remove = function(cookie) {
			removeHandler(cookie, false);
		}

		this.trigger = function(input) {
			if(input instanceof Event){
				var event = input;
				that.$dom.dispatchEvent(event);
			}else{
				var eventParams = input;
				triggerEvents(eventParams, false);
			}
		}

		var addHandler = function(handler, priority, isCapture) {
			var registrations = [];

			for (var i = 0; i < that.eventnames.length; i++) {
				var registration = that.$registerHandlerInformation(that.eventnames[i], handler, priority, isCapture);
				registrations.push(registration);
			}

			return new Registration(registrations);
		};

		var removeHandler = function(cookie, isCapture){
			for (var i = 0; i < that.eventnames.length; i++) {
				that.$removeHandlerInformation(that.eventnames[i], cookie, isCapture);
			}
		};

		var triggerEvents = function(params) {
			for (var i = 0; i < that.eventnames.length; i++) {
				const currentEvent = new CustomEvent(that.eventnames[i], params);

				that.$dom.dispatchEvent(currentEvent);
			}
		};

		return {
			capture: this.capture,
			bubble: this.bubble,
			add: this.add,
			remove: this.remove,
			trigger: this.trigger
		}
	}

	Registrator.$registerHandlerInformation = function (eventHandlersInfo, newHandlerInfo){
		for (var i = 0; i < eventHandlersInfo.length; i++) {
			if (Registrator.$compareRegs(eventHandlersInfo[i], newHandlerInfo) < 0) {
				eventHandlersInfo.splice(i, 0, newHandlerInfo);
				return;
			}
		}

		eventHandlersInfo.push(newHandlerInfo);
	};

	Registrator.prototype.$registerHandlerInformation = function(eventName, handler, priority, capture) {
		var events = (capture == true) ? this.events.capture : this.events.bubble;

		var cookie = Cookie();
		var result = {
			handler: handler,
			priority: priority,
			once: false,
			cookie: cookie,
			data: null
		};

		if (result.priority == undefined) result.priority = false;

		if (events[eventName] == null || events[eventName] == undefined) {
			events[eventName] = [];

			if (capture == true){
				this.$dom.addEventListener(eventName, OmniEventHandlerCapture, true);
			}else{
				this.$dom.addEventListener(eventName, OmniEventHandlerBubble, false);
			}
		}

		Registrator.$registerHandlerInformation(events[eventName], result);

		return result; 
	};

	Registrator.prototype.$removeHandlerInformation = function(eventName, cookie, capture) {
		var events = (capture) ? this.events.capture : this.events.bubble;

		if (cookie && typeof cookie == 'string'){
			for (var i = 0; i < events[eventName].length; i++) {
				const handlerInfo = events[eventName][i];

				if (handlerInfo.cookie == cookie){
					events[eventName].splice(i, 1);

						break;
				}
			}
		} else if(!cookie){
			events[eventName].splice(0, this.registrations.length);
		}

				if (events[eventName].length == 0){
			if (capture == true){
				this.$dom.removeEventListener(eventName, OmniEventHandlerCapture, true);
			} else {
				this.$dom.removeEventListener(eventName, OmniEventHandlerBubble, false);
			}

			delete events[eventName];
		}
	};

	Registrator.$compareRegs = function(regA, regB) {
		var regAPriority = Registrator.$parsePriority(regA.priority);
		var regBPriority = Registrator.$parsePriority(regB.priority);

				if (typeof regAPriority == 'boolean' && regAPriority == true) return 1;
		if (typeof regBPriority == 'boolean' && regBPriority == true) return -1;
		if (typeof regAPriority == 'boolean' && typeof regAPriority != 'boolean') return -1;
		if (typeof regBPriority == 'boolean' && typeof regBPriority != 'boolean') return 1;

		return regAPriority >= regBPriority ? -1 : 1;
	};

	Registrator.$parsePriority = function(priority) {
		if (priority == undefined || priority == null) return false;
		if (typeof priority == 'string'){
			if (priority == 'true' || priority == 'false') return (priority == 'true');
			if (!isNaN(Number(priority))) return Number(priority);
		} else if(typeof priority == 'boolean' || typeof priority == 'number'){
			return priority;
		}

		return false;
	};

	var Registration = function Registration (arrRegistrations) {
		this.registrations = arrRegistrations;

		if (this.registrations == null) {
			this.registrations = [];
		}
	};

	Registration.prototype.once = function(isOnce) {
		var isHandlerOnceInvokedOnly = (isOnce == "true" || isOnce == true || isOnce == undefined) ? true : false;

		for (var i = 0;i < this.registrations.length;i++) {
			this.registrations[i].once = isHandlerOnceInvokedOnly;
		}

				return this;
	};

	Registration.prototype.data = function(data) {
		for (var i = 0; i < this.registrations.length; i++) {
			this.registrations[i].data = data;
		}

		return this;
	};

	var Invocator = function Invocator(dom) {
		this.$dom = dom;
		this.events = RDomDataEvents(dom);
	};

	Invocator.prototype.handleEvent = function(event, isCapture) {
		var elementHandlers = isCapture == true ? this.events.capture : this.events.bubble;
		var eventName = event.type;
		var onceEventsCookies = [];

		for (var i = 0; i < elementHandlers[eventName].length; i++) {
			const currHandlerInfo = elementHandlers[eventName][i];
			var handler = currHandlerInfo.handler;
			var handlerData = currHandlerInfo.data != undefined ? currHandler.data : undefined;

			handler.call(this.$dom, event, handlerData);

			if(currHandlerInfo.once == true){
				onceEventsCookies.push(currHandlerInfo.cookie);
			}

			if(event.isImmediatePropagationStopped == true) break;
		}

		if(onceEventsCookies.length > 0){
			var newElementHandlers = elementHandlers[eventName].filter(function(element){
				for (let i = 0; i < onceEventsCookies.length; i++) {
					const currCookie = onceEventsCookies[i];
					if(element.cookie == currCookie) return false;
				}

								return false;
			});

				elementHandlers[eventName] = newElementHandlers;

			if(elementHandlers[eventName].length == 0){
				if(isCapture == true){
					this.$dom.removeEventListener(eventName, OmniEventHandlerCapture, true);
				}else{
					this.$dom.removeEventListener(eventName, OmniEventHandlerBubble, false);
				}

					delete elementHandlers[eventName];
			}
		}
	};
})();