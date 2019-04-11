


/** Interface **/
/**
	We need a Interface for different handling of different shortcuts
*/
function IProcessAccelerators() { }
IProcessAccelerators.Interface ( "IProcessAccelerators" );
IProcessAccelerators.prototype.ks_ProcessKey = function ( ev ) { };
IProcessAccelerators.prototype.acceleratorevent = new InitializeEvent ( "Fires when an accelerator from the LOCAL table is used");
IProcessAccelerators.prototype.$accelerators = new InitializeObject ( "Accelerators dictionary" );
IProcessAccelerators.prototype.acceleratorbuffer = new InitializeStringParameter ( "Buffer holding multiple characters", "" );

// mappings - needed in special cases like f1 ( pressed f1 - String.fromCharCode ( e.which ) - returns q )
// take a look at IProcessAcceleratorsImpl.prototype.acceleratorExecutor
IProcessAccelerators.$accMap = {
	8: 'backspace',
	9: 'tab',
	13: 'enter',
	16: 'shift',
	17: 'ctrl',
	18: 'alt',
	20: 'capslock',
	27: 'esc',
	32: 'space',
	33: 'pageup',
	34: 'pagedown',
	35: 'end',
	36: 'home',
	37: 'left',
	38: 'up',
	39: 'right',
	40: 'down',
	45: 'ins',
	46: 'del',
	91: 'meta',
	93: 'meta',
	
	96: '0',
	97: '1',
	98: '2',
	99: '3',
	100: '4',
	101: '5',
	102: '6',
	103: '7',
	104: '8',
	105: '9',
	
	112: 'f1',
	113: 'f2',
	114: 'f3',
	115: 'f4',
	116: 'f5',
	117: 'f6',
	118: 'f7',
	119: 'f8',
	120: 'f9',
	121: 'f10',
	122: 'f11',
	123: 'f12',
	
	224: 'meta'
};
IProcessAccelerators.$shiftAccMap = {
	'~': '`',
	'!': '1',
	'@': '2',
	'#': '3',
	'$': '4',
	'%': '5',
	'^': '6',
	'&': '7',
	'*': '8',
	'(': '9',
	')': '0',
	'_': '-',
	'+': '=',
	':': ';',
	'\"': '\'',
	'<': ',',
	'>': '.',
	'?': '/',
	'|': '\\'
};
IProcessAccelerators.$aliases = {
	'option': 'alt',
	'command': 'meta',
	'return': 'enter',
	'escape': 'esc'
};

/* STATIC METHODS REQUESTED BY MICHAEL */
/* TODO: LOOK AND ADD MORE IF NEEDED, OR EDIT */
		
IProcessAccelerators.getCode = function ( character ) { return character.charCodeAt( 0 ); };
IProcessAccelerators.getChar = function ( code ) { return String.fromCharCode ( code ); };
IProcessAccelerators.getEventType = function ( e ) { return e.type; };
IProcessAccelerators.getPhase = function ( e ) { return e.eventPhase; };
IProcessAccelerators.isChar = function ( e ) { 
	if ( typeof e.which !== 'number' ) {
		e.which = e.keyCode;
	}
	return IProcessAccelerators.$accMap[ e.which ] === undefined;
};
IProcessAccelerators.getModifiers = function ( e ) {
	return {
		ctrl	: e.ctrlKey,
		alt		: e.altKey,
		shift	: e.shiftKey,
		meta	: e.metaKey
	};
};
IProcessAccelerators.contains = function ( e, strBuffer ) {
	if ( typeof e.which !== 'number' ) {
		e.which = e.keyCode;
	}
	for ( var index = 0; index < strBuffer.length; index++)
	{
		// array of strings
		if ( strBuffer.constructor === Array)
		{
			for ( var index = 0; index < strBuffer.length; index++ )
			{
				IProcessAccelerators.contains ( e, strBuffer[index] );
			}
		}
		// string
		else
		{
			if ( strBuffer.indexOf ( e.which ) )
			{
				return index;
			}
		}
	}
	return -1;
};





IProcessAccelerators.prototype.$generateKeyName = function ( key, ctrl, alt, shift ) {
	if (typeof key === "object") {
		return ( key.ctrl ? "ctrl+" : "" )	+ ( key.alt ? "alt+" : "" )	+ ( key.shift ? "shift+" : "" )	+ key.character;
	} else {
		return ( ctrl ? "ctrl+" : "" )		+ ( alt ? "alt+" : "" )		+ ( shift ? "shift+" : "" )		+ key;
	}
};

/* 
case 1 :
	object	{
		name		- string		user defined
		character	- string		character
		ctrl		- true|false
		alt			- true|false
		shift		- true|false
		callback	- fn
		userdata	- {}
	}
case 2: 
	key			- string		character
	modifier	- string		all modifiers with "+" sign
	callback	- fn
	userdata	- {}
case 3:
	accel	- string		all modifiers with "+" sign finishing with the character(s)
	callback	- fn
	userdata	- {}
*/

// returns the created accel entry
IProcessAccelerators.prototype.registerAccelerator = function ( objOrKey, modifier, callback, userdata ) { 
	// case 1
	if ( typeof objOrKey === "object" ) {
		var keyName = this.$generateKeyName ( objOrKey );
		if ( this.$accelerators[ keyName ] ){
			return "";
		}
		this.$accelerators[ keyName ] = { 
			name		: objOrKey.name,
			character	: objOrKey.character,
			
			ctrl		: objOrKey.ctrl,
			alt			: objOrKey.alt,
			shift		: objOrKey.shift,
			
			callback	: objOrKey.callback,
			userdata	: objOrKey.userdata
		};
		return keyName;
	} 
	// case 2
	else if ( typeof objOrKey === "string" ) {
		var _callback = callback, _userdata = userdata, _key = objOrKey,_modifier = modifier;
		
		if (typeof modifier != "string") {
			_modifier = objOrKey;
			_key = null;
			_userdata = callback;
			_callback = modifier;
		}
		var mods = this.parseModifierFromText ( _modifier );
		
		var keyName = this.$generateKeyName ( _key || mods.character, mods.ctrl, mods.alt, mods.shift );
		
		if ( this.$accelerators[ keyName ] ){
			return "";
		}
		this.$accelerators[ keyName ] = {
			character	: _key || mods.character,
			
			ctrl		: mods.ctrl,
			alt			: mods.alt,
			shift		: mods.shift,
			
			callback	: _callback,
			userdata	: _userdata
		};
		if (typeof this.$accelerators[ keyName ].character != "string" || this.$accelerators[ keyName ].character.length == 0) {
			delete this.$accelerators[ keyName ];
			jbTrace.log("Accelerator registration ignored due to lack of character(s) specified. Accel:" + keyName + ", in " + this.fullClassType() );
		}
		return keyName;
	}
};

// name_or_index_or_query_or_accel
IProcessAccelerators.prototype.removeAccelerator = function ( query ) {
	if ( query.idexOf ( "key:" ) == 0 )
	{
		// remove by property
		delete this.$accelerators[ query.replace( "key:", "" ) ];
	}
};

IProcessAccelerators.prototype.removeAllAccelerators = function () {
	for ( var item in this.$accelerators )
	{
		delete this.$accelerators[ item ];
	}
};

IProcessAccelerators.prototype.displayNameForAccelerator = function(item) {
	// TODO: Generate some display name (like Ctrl+C or similar).
	var tmp = this.$generateKeyName ( item );
	return tmp;
};

IProcessAccelerators.prototype.hasAccelerator = function ( acceleratorName ) {
	return this.$accelerators.hasOwnProperty ( acceleratorName );
};

IProcessAccelerators.prototype.parseModifierFromText = function ( modifier ) {
	if ( modifier ){
		modifier = modifier.toLowerCase();
		var mods = modifier.split ( "+" );
		return {
			character	: mods[ mods.length - 1 ],
			ctrl		: ( modifier.indexOf ( 'ctrl' )		> -1 ),
			alt			: ( modifier.indexOf ( 'alt' )		> -1 ),
			shift		: ( modifier.indexOf ( 'shift' )	> -1 ),
			meta		: ( modifier.indexOf ( 'meta' )		> -1 )
		};
	}
};

IProcessAccelerators.prototype.checkAccelBuffer = function ( ) {
	var hasAny = false;
	for ( var prop in this.$accelerators )
	{
		// most ( or everyone ) will be different, we need to know if any STARTS with the data from the buffer
		// if ( prop.slice ( 0, this.buffer.length ) == this.buffer ) { hasAny = true; }
		
		// remove mod and compare \w+\+ translates to ctrl+
		if ( prop.replace ( /\w+\+/gi, "" ).slice ( 0, this.acceleratorbuffer.length ) == this.acceleratorbuffer ) { hasAny = true; }
	}
	
	if ( hasAny == false ) { this.acceleratorbuffer = ""; }
};
