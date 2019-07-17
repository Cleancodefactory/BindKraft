/**
	include this file after binding.js
	This file contains all the DOM level target binding actions. These were previously directed to jquery simple extensions, 
	which are still supported as fall-back for a time (will be completely removed in Aug 2019).
	
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
		}
	}
};