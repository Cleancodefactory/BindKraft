


function IKeyboardCommandHandling() { }
IKeyboardCommandHandling.Interface ( "IKeyboardCommandHandling" );
IKeyboardCommandHandling.prototype.kc_ProcessKey = function ( ev ) { };
IKeyboardCommandHandling.prototype.keyboardcommandevent = new InitializeEvent ( "" );
IKeyboardCommandHandling.prototype.$keyboardcommandregister = new InitializeObject ( "" );
IKeyboardCommandHandling.prototype.commandbuffer = new InitializeStringParameter ( "Buffer holding multiple characters", "" );

IKeyboardCommandHandling.$map = {
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
IKeyboardCommandHandling.$shiftMap = {
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
IKeyboardCommandHandling.$aliases = {
	'option': 'alt',
	'command': 'meta',
	'return': 'enter',
	'escape': 'esc'
};

IKeyboardCommandHandling.prototype.registerKeyboardCommand = function ( keyboardCommand ) { 
	if ( typeof keyboardCommand === "object" ) {
		if ( this.$keyboardcommandregister[ keyboardCommand.combination ] )
		{
			return false;
		}
		
		this.$keyboardcommandregister[ keyboardCommand.combination ] = {
			combination	: keyboardCommand.combination,
			callback	: keyboardCommand.callback,
			userdata	: keyboardCommand.userdata
		};
		return true;
	}
};

IKeyboardCommandHandling.prototype.removeKeyboardCommand = function ( combination ) {
	if ( this.$keyboardcommandregister [ combination ] )
	{
		delete this.$keyboardcommandregister[ combination ];
	}
};

IKeyboardCommandHandling.prototype.removeKeyboardCommand = function () {
	for ( var prop in this.$keyboardcommandregister )
	{
		delete this.$keyboardcommandregister[ prop ];
	}
};

IKeyboardCommandHandling.prototype.hasKeyboardCommand = function ( combination ) {
	return this.$keyboardcommandregister.hasOwnProperty ( combination );
};

IKeyboardCommandHandling.prototype.checkCommandBuffer = function ( ) {
	var hasAny = false;
	for ( var prop in this.$keyboardcommandregister )
	{
		if ( prop.slice ( 0, this.commandbuffer.length ) == this.commandbuffer ) { hasAny = true; }
	}
	
	if ( hasAny == false ) { this.commandbuffer = ""; }
};