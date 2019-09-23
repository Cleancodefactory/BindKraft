/**
	include this file after binding.js
	This file contains all the DOM level target binding actions. These were previously directed to jquery simple extensions, 
	which are still supported as fall-back for a time (will be completely removed in Aug-Oct 2019).
	
	To implement target action/operation:
	
	1) add entry in Binding.TargetOperations.ops:
	1.a) non-indexed
	 myaction: {
		 read: function(binding) {
			 // Return the value from the target element
		 },
		 write: function(value, binding) {
			 //Set the value to the target
		 }
	 }
	1.b) indexed
	 myaction: {
		 indexed: true,
		 read: function(index, binding) {
			 // Return the n-the (index determined) value from the target element
		 },
		 write: function(index, value, binding) {
			 // Set the value determined by the index to the target
		 }
	 } 
	
	-> Target index is denoted as data-bind-[<theindex>]="{.... the binding ....}"
	-> The binding argument gives the binding that calls the method and can be used if access to 
		binding details is necessary (usually this is the bindingParameter, but other details can
		be used as well)
	-> All read/write routines are called with this set to the raw DOM element (HTMLElement)


*/
Binding.TargetOperations = {
    $getread: function(name){
        if (this[name]) {
            return this[name].read;
        }   
    },
    $getwrite: function(name){
        if (this[name]) {
            return this[name].write;
        }   
    },
    $callread: function(name, rawnode, arg1) { // binding
        var f,idxed;
		if (this.ops[name]) {
			f = this.ops[name].read;
			idxed = this.ops[name].indexed;
		}
        if (f) {
			if (idxed) {
				return f.call(rawnode, null, arg1); // Pass null index
				// TODO: May be exception?
			} else {
				return f.call(rawnode, arg1);
			}
        } else if (JBCoreConstants.JQFallBack) {
            var n = $(rawnode);
			var p = BaseObject.getProperty(arg1,"bindingParameter");
			if (p != null) {
				return n[name].call(n, p);
			} else {
				return n[name].call(n);
			}
        }
    },
	$callreadindexed: function(name, rawnode, arg1, arg2) { // index, binding
        var f,idxed;
		if (this.ops[name]) {
			f = this.ops[name].read;
			idxed = this.ops[name].indexed;
		}
        if (f) {
			if (idxed) {
				return f.call(rawnode, arg1, arg2);
			} else {
				return f.call(rawnode, arg2); // Skip the index
				// TODO: May be exception?
			}
        } else if (JBCoreConstants.JQFallBack) {
            var n = $(rawnode);
            return n[name].call(n, arg1);
        }
    },
    $callwrite: function(name, rawnode, arg1, arg2) { // value, binding
		var f,idxed;
		if (this.ops[name]) {
			f = this.ops[name].write;
			idxed = this.ops[name].indexed;
		}
		
        if (f) {
			if (idxed) {
				return f.call(rawnode, null, arg1, arg2); // Pass null index
				// TODO: May be exception?
			} else {
				return f.call(rawnode, arg1, arg2);
			}
        } else if (JBCoreConstants.JQFallBack) {
            var n = $(rawnode);
			var p = BaseObject.getProperty(arg1,"bindingParameter");
            return n[name].call(n, arg1,p);
        }
    },
	$callwriteindexed: function(name, rawnode, arg1, arg2,arg3) { // index, value, binding
		var f,idxed;
		if (this.ops[name]) {
			f = this.ops[name].write;
			idxed = this.ops[name].indexed;
		}
		
        if (f) {
			if (idxed) {
				return f.call(rawnode, arg1, arg2, arg3); // Pass null index
				// TODO: May be exception?
			} else {
				return f.call(rawnode, arg2, arg3); // Skip the index - leave it unused
			}
        } else if (JBCoreConstants.JQFallBack) {
            var n = $(rawnode);
            return n[name].call(n, arg1,arg2);
        }
    },

//////////////////////////////////
	ops: { // The target opration functions
		text: {
			indexed: false,
			read: function(){
				return this.textContent;
			},
			write: function(v){
				this.textContent = (v != null)?v:null;
			}

		},
		val: {
			indexed: false,
			read: function(){
				return this.value;
			},
			write: function(v){
				this.value = (v == null)?null:v;
			}
		},
		html: {
			indexed: false,
			read: function(){
				return this.innerHTML;
			},
			write: function(v){
				this.innerHTML = v;
			}
		},
		textcolor: {
			indexed: false,
			read: function(){
				var styles = window.getComputedStyle(this);
				return styles.getPropertyValue("color");
			},
			write: function(v){
				this.style.setProperty("color",v);
			}
		},
		backcolor: {
			indexed: false,
			read: function(){
				var styles = window.getComputedStyle(this);
				return styles.getPropertyValue("background-color");
			},
			write: function(v){
				this.style.setProperty("background-color",v);
			}
		},
		backimage: {
			indexed: false,
			read: function(){
				var styles = window.getComputedStyle(this);
				return styles.getPropertyValue("background-image");
			},
			write: function(v){
				this.style.setProperty("background-image",v);
			}
		},
		backposition: {
			indexed: false,
			read: function(){
				var styles = window.getComputedStyle(this);
				return styles.getPropertyValue("background-position");
			},
			write: function(v){
				this.style.setProperty("background-position",v);
			}
		},
		backgrnd: {
			indexed: false,
			read: function(){
				var styles = window.getComputedStyle(this);
				return styles.getPropertyValue("background");
			},
			write: function(v){
				this.style.setProperty("background",v);
			}
		},
		imgheight: {
			indexed: false,
			read: function(){
				var styles = window.getComputedStyle(this);
				return styles.getPropertyValue("height");
			},
			write: function(v){
				this.style.setProperty("height",v);
			}
		},
		imgwidth: {
			indexed: false,
			read: function(){
				var styles = window.getComputedStyle(this);
				return styles.getPropertyValue("width");
			},
			write: function(v){
				this.style.setProperty("width",v);
			}
		},
		src: {
			indexed: false,
			read: function(bind){
				return this.src;
			},
			write: function(v, bind){
				if (v == null) {
					this.src = null;
					return;
				}
				if (typeof v != "string") v = v.toString();
				if (!(v.indexOf('http://') === 0 || v.indexOf('https://') === 0)) {
					v = mapPath(v);
				}
				if (this.is('script') || this.is('input') || this.is('frame') || this.is('iframe') || this.is('img')) {
					this.src = v;
				}
			}
		},
		checked: {
			read: function(bind) {
				return this.checked?true:false;
			},
			write: function(v, bind) {
				this.checked = (v?true:false);
			}
		},
		elementreadonly: {
			read: function(bind) {
				return this.readonly?true:false;
			},
			write: function(v, bind) {
				this.readonly = v?true:false;
			}
		},
		elementdisabled: {
			indexed: false,
			read: function() {
				if (BaseObject.is(this.activeClass,"IDisablable")) {
					return this.activeClass.get_disabled();
				} else {
					return this.disabled;
				}
			},
			write: function(v, b) {
				if (BaseObject.is(this.activeClass,"IDisablable")) {
					this.activeClass.set_disabled(v?true:false);
				} else {
					if (v) {
						this.disabled = true; 
						if (b == null || b.bindingParameter != "noopacity"){
							this.style.opacity = 0.5; 
						}
					} else {
						this.disabled = false; 
						this.style.opacity = 1.0; 
					}
				}
			}
		},
		datacontext: {
			read: function() {
				if (this.dataContext != null || this.hasDataContext) {
					return this.dataContext;
				}
			},
			write: function(v) {
				this.dataContext = v;
			}
		},
		elementtitle:{
			read: function() {
				return this.title;
			},
			write: function (v) {
				this.title = v;
			}
		},
		textalign:{
			read: function() {
				var styles = window.getComputedStyle(this);
				return styles.getPropertyValue('text-align');
			},
			write: function (v) {
				if (v == null) {
					this.style.removeProperty("text-align");
				} else {
					this.style.setProperty("text-align", v);
				}
			}
		},
		cssclass: {
			read: function(bind) {
				return this.className;
			},
			write: function(v,bind) {
				this.className = v;
			}
		},
		addcssclass: {
			indexed: true,
			read: function(idx, bind) {
				return (DOMUtil.countClass(this,idx) > 0);
			},
			write: function(idx, v, bind) {
				if (v) {
					DOMUtil.addClass(this, idx);
				} else {
					DOMUtil.removeClass(this, idx);
				}
			}
		},
		fontweight: {
			read: function(bind) {
				var styles = window.getComputedStyle(this);
				return styles.getPropertyValue('font-weight');
			},
			write: function(v,bind) {
				this.style.setProperty('font-weight', v);
			}
		},
		elementid: {
			read: function(bind) {
				return this.id;
			},
			write: function(v,bind) {
				this.id = v;
			}
		},
		elementvisible: {
			read: function(bind) {
				var styles = window.getComputedStyle(this);
				var d = styles.getPropertyValue("display");
				if (d != "none") return true;
				return false;
			}, 
			write: function(v, bind) {
				if (v) {
					if (typeof this.__olddisplayStyle == "string") {
						this.style.setProperty('display', this.__olddisplayStyle);
						delete this.__olddisplayStyle;
					} else {
						this.style.setProperty('display', "");
					}
				} else {
					var styles = window.getComputedStyle(this);
					var curval = styles.getPropertyValue("display");
					if (curval != "none") {
						this.__olddisplayStyle = curval;
					}
					this.style.setProperty('display', 'none');
				}
			}
		},
		elementvisibility: {
			read: function(bind) {
				var styles = window.getComputedStyle(this);
				var d = styles.getPropertyValue("visibility");
				if (d == "hidden" || d == "collapse") return false;
				return true;
			},
			write: function(v, bind) {
				if (v) {
					this.style.setProperty('visibility', "visible");
				} else {
					this.style.setProperty('visibility', "hidden");
				}
			}
		},
		elementcollapsed: {
			read: function(bind) {
				var styles = window.getComputedStyle(this);
				var d = styles.getPropertyValue("visibility");
				if (d == "hidden" || d == "collapse") return true;
				return false;
			},
			write: function(v, bind) {
				if (v) {
					this.style.setProperty('visibility', "collapse");
				} else {
					this.style.setProperty('visibility', "visible");
				}
			}
		},
		indentination: {
			read: function(bind) {
				var styles = window.getComputedStyle(this);
				var d = styles.getPropertyValue("margin-left");
				return d;
			},
			write: function(v, bind) { 
				this.style.setProperty('margin-left', v + "px");
			}
		},
		attributebyparameter: {
			indexed: false,
			read: function(bind) {
				if (bind != null && typeof bind.bindingParameter == "string") {
					return DOMUtil.attr(this, bind.bindingParameter);
				}
				return null;
			},
			write: function(v, bind) { 
				if (bind != null && typeof bind.bindingParameter == "string") {
					DOMUtil.attr(this, bind.bindingParameter, v);
				}
			}
		},
		elementattribute: {
			indexed: true,
			read: function(idx, bind) {
				if (typeof idx == "string" && idx.length > 0) {
					return DOMUtil.attr(this, idx);
				}
				return null;
			},
			write: function(idx, v, bind) { 
				if (typeof idx == "string" && idx.length > 0) {
					DOMUtil.attr(this, idx, v);
				}
			}
		}
	}
};