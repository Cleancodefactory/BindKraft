//include this file after binding.js
////#using "Binding.js"

//this = current element
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
            return n[name].apply(n, Array.createCopyOf(arguments,2));
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
            return n[name].apply(n, Array.createCopyOf(arguments,2));
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
            return n[name].apply(n, Array.createCopyOf(arguments,2));
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
            return n[name].apply(n, Array.createCopyOf(arguments,2));
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
				this.textContent = v;
			}

		},
		elementdisabled: {
			indexed: false,
			read: function(){
				return $$(this).first().properties('disabled');
			},
			write: function(v, b){
				if (v != null) {
					if (v) {
						this.disabled = true; 
						if(b == null || b != "noopacity"){
							this.styles.opacity = "0.5"; 
						}
					} else {
						this.properties("disabled",false);
						el.styles("opacity","1.0"); 
					}
					if (el.getNative() != null && BaseObject.is(el.getNative().activeClass,"IDisablable")) {
						el.getNative().activeClass.set_disabled(v ? true: false);
					}
				}
			}
		},
		datacontext: {
			read: function(){
				var el = this;
				if (el.dataContext != null) {
					return el.dataContext;
				}
			},
			write:function(v){
				if (this.length == 0) {
					return null;
				}
				var el = this;
				if (el != null) {
					if (arguments.length > 0) el.dataContext = v;
				}
			}
		},
		elementtitle:{
			read: function(){
				var el = this;
				if (el == null) return null;
				if (el != null && el.title != null) return el.title;
			},
			write: function (v) {
				var el = this;
				if (el != null && v != null) el.title = v;
			}
		}
	}
};