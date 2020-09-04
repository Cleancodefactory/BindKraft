/**
	CompileTime is a non-class object used by BindKraft core and can be used in implementation of advanced constructs executed in compile time- e.g. implementers
	It supports logging, scope tracking and others
	
	Using the CompileTime may be difficult in some edge cases:
	it is loaded early and cannot be configured effectively in scripts loaded later. One may need to temporarily change configuration.js while tracking some
	problem that needs CompileTime to be put globally in a non-default mode.
*/
(function(glbl) {
	var _log = [];
	var _maxEntries = 1000;
	var _cycleStep = 10;
	var _logId = 0;
	var _subscriberCookie = 0;
	var _subscribersNotify = 1; // numentries
	
	
	function pad(number) {
        if (number < 10) {
		  return '0' + number;
		}
		return number;
    };
	function timeMark() {
		var d = new Date();
		return d.getUTCFullYear() +
		'-' + pad(d.getUTCMonth() + 1) +
		'-' + pad(d.getUTCDate()) +
		'T' + pad(d.getUTCHours()) +
		':' + pad(d.getUTCMinutes()) +
		':' + pad(d.getUTCSeconds()) +
		'.' + (d.getUTCMilliseconds() / 1000).toFixed(3).slice(2, 5) +
		'Z';
    
	};
	var ltypes = ["log","warn","err","info","notice","trace"];
	var ltypesnmap = {
		"w": 1,
		"l": 0,
		"":0,
		"e":2,
		"i":3,
		"n":4,
		"t":5,
		"r":5
	};
	function tcode(_nc) {
		var nc;
		if (typeof _nc == "number") {
			if (_nc < 0) nc = 0;
			if (_nc > 5) nc = 5;
			nc = Math.floor(nc);
		} else if (typeof _nc == "string") {
			var x = _nc.charAt(0);
			if (x.length > 0) {
				x = ltypesnmap[x];
				if (x == null) {
					nc = 0;
				} else {
					nc = x;
				}
			} else {
				nc = 0;
			}
		}
		return nc;
	};
	var __subscribersNotify = _subscribersNotify;
	function createEntry(nCode, text, data) {
		if (window.JBCoreConstants.CompileTimeLogTypes && !window.JBCoreConstants.CompileTimeLogTypes[ltypes[tcode(nCode)]]) {
			return; // Skip the nonpermitted ones
		}
		
		if (_maxEntries > 0 && _log.length > _maxEntries) {
			_log.splice(0,_cycleStep);
		}
		_log.push({
			time: timeMark(),
			id: (_logId++),
			"type": tcode(nCode),
			"typename": ltypes[nCode],
			text: text,
			data: JSON.stringify(data)
		});
		__subscribersNotify--;
		if (__subscribersNotify <= 0) {
			__subscribersNotify = _subscribersNotify;
			var slc = _log.slice(-_subscribersNotify);
			for (var k in CompileTime.subscribers) {
				var subs = CompileTime.subscribers[k];
				if (typeof subs == "function") {
					subs(slc);
				}
			}
			
		}
	};
	function argrest(cargs, args, start) {
		return cargs.concat(Array.prototype.slice.call(args,start));
	};
	var $finished = false;
	var CompileTime = {
		finish: function() {
			$finished = true;
		},
		finished: function() {
			return $finished;
		},
		subscribers: {},
		log: function(ns, s, data) {
			if (arguments.length == 1) {
				createEntry(0, ns);
			} else if (arguments.length == 2) {
				createEntry(ns, s);
			} else if (arguments.length == 3) {
				createEntry(ns, s, data);
			} else if (arguments.length > 3) {
				createEntry(ns, s, Array.prototype.slice.call(arguments,3));
			} else {
				// Empty log - not logged
			}
			return this;
		},
		err: function(s,data) {
			return this.log.apply(this,argrest(["e",s], arguments, 1));
		},
		warn: function(s,data) {
			return this.log.apply(this,argrest(["w",s], arguments, 1));
		},
		info: function(s,data) {
			return this.log.apply(this,argrest(["i",s], arguments, 1));
		},
		notice: function(s,data) {
			return this.log.apply(this,argrest(["n",s], arguments, 1));
		},
		trace: function(s,data) {
			return this.log.apply(this,argrest(["t",s], arguments, 1));
		},
		clear: function() {
			_log.splice(0);
		},
		logcount: function() {
			return _log.length;
		},
		logentries: function(offset,limit) {
			// TODO: finish this
			if (offset != null && offset >= 0) {
				if (limit != null && limit > 0) {
					return _log.slice(offset, offset+limit);
				} else {
					return _log.slice(offset);
				}
			}
		},
		subscribe: function (callback) {
			var cookie = "s" + (_subscriberCookie++);
			this.subscribers[cookie] = callback;
			return cookie;
		},
		unsubscribe: function (cookie) {
			this.subscribers[cookie] = null;
			delete this.subscribers[cookie];
			return cookie;
		}
	};
	glbl.CompileTime = CompileTime;
})(window);
// Other loggers can subscribe to the compile time log or dig into it at running phase
// This logging code is here to enable some way to view the messages at the earliest possible moment
if (JBCoreConstants.CompileTimeConsoleLog) {
	CompileTime.subscribe(function(entries) {
		//ltypes = ["log","warn","err","info","notice","trace"];
		if (window.console) {
			var _warn, _error, _info, _log
			_log = function() { console.log.apply(console, arguments); };
			if (console.warn && console.error && console.info) {
				_warn = function() { console.warn.apply(console, arguments); };
				_error = function() { console.error.apply(console, arguments); };
				_info = function() { console.info.apply(console, arguments); };
			} else {
				_warn = function() { console.log.apply(console, arguments); };
				_error = function() { console.log.apply(console, arguments); };
				_info = function() { console.log.apply(console, arguments); };
			}
			for (var i = 0; i < entries.length; i++) {
				var entry = entries[i];
				switch (entry.type) {
					case 1:
						_warn( entry.id + ": [" + entry.time + "] " + entry.text, entry.data);
					break;
					case 2:
						_error( entry.id + ": [" + entry.time + "] " + entry.text, entry.data);
					break;
					case 3:
						_info( entry.id + ": [" + entry.time + "] " + entry.text, entry.data);
					break;
					case 4:
						_info( "!" + entry.id + ": [" + entry.time + "] " + entry.text, entry.data);
					break;
					case 5:
						_info( "->" + entry.id + ": [" + entry.time + "] " + entry.text, entry.data);
					break;
					default:
						_log( entry.id + ": [" + entry.time + "] " + entry.text, entry.data);
					break;
				}
			}
		}
	});
}

