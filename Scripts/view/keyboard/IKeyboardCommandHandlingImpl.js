

/** Interface Impl **/

function IKeyboardCommandHandlingImpl() {}
IKeyboardCommandHandlingImpl.InterfaceImpl ( IKeyboardCommandHandling, "IKeyboardCommandHandlingImpl" );
IKeyboardCommandHandlingImpl.RequiredTypes ( "Base", "AppBase" );
IKeyboardCommandHandlingImpl.prototype.keyboardCommandExecutor = function ( e ) {
	var self = this.activeClass;
	var isChar = true;
		
	if ( typeof e.which !== 'number' )
	{
		e.which = e.keyCode;
	}
	if ( IKeyboardCommandHandling.$map[ e.which ] )
	{
		character = IKeyboardCommandHandling.$map[ e.which ];
		isChar = false;
	}
	else
	{
		var character = String.fromCharCode ( e.which );
		if ( !e.shiftKey ) {
			character = character.toLowerCase();
		}
	}
	this.activeClass.commandbuffer += character + ( isChar ? "" : "+" );
	
	//console.log ( "commandbuffer: " + this.activeClass.commandbuffer);
	
	this.activeClass.processCommandHandling (
		{
			start			: function() { /* e.preventDefault(); */ }
			,"keyName"		: this.activeClass.commandbuffer
			,finish			: function() { /* e.stopPropagation(); */ self.commandbuffer = ""; }
		}
	);
};

IKeyboardCommandHandlingImpl.classInitialize = function ( cls, routingTypeName, getParentProc ) {
	var answerFromCallback;
	var processAccCaller = new ProtoCaller("IKeyboardCommandHandling", "processCommandHandling");
	
	// App ( has no visual representation )
	if ( Class.is ( cls,  "AppBase" ) )
	{
		cls.prototype.processCommandHandling = function ( keyinfo ) {
			this.checkCommandBuffer();
			if ( this.$keyboardcommandregister[keyinfo.keyName] != null ) {
				keyinfo.start();
				answerFromCallback = BaseObject.callCallback ( this.$keyboardcommandregister[keyinfo.keyName].callback, this, this.$keyboardcommandregister[keyinfo.keyName] /*,interesen_vapros*/ );
				keyinfo.finish();
			}
		};
	}
	// Window ( it is a child of the App ) 
	else if ( Class.is ( cls, "BaseWindow" ) ) 
	{
		cls.ExtendMethod("init", function() {
			this.root.addEventListener ( "keydown", this.keyboardCommandExecutor, true );
		});
		cls.prototype.processCommandHandling = function ( keyinfo ) {
			this.checkCommandBuffer();
			if (this.get_approot() == null || !processAccCaller.invokeOn(this.get_approot(), keyinfo ) ) {
				if ( this.$keyboardcommandregister[keyinfo.keyName] != null ) {
					keyinfo.start();
					answerFromCallback = BaseObject.callCallback ( this.$keyboardcommandregister[keyinfo.keyName].callback, this, this.$keyboardcommandregister[keyinfo.keyName] /*,interesen_vapros*/ );
					keyinfo.finish();
				}
			}
		};
	}
	// View
	else if ( Class.is ( cls,  "ViewBase" ) )
	{
		cls.ExtendMethod("init", function() {
			this.root.addEventListener ( "keydown", this.keyboardCommandExecutor, true );
		});
		cls.prototype.processCommandHandling = function ( keyinfo ) {
			this.checkCommandBuffer();
			if ( this.$keyboardcommandregister[keyinfo.keyName] != null ) {
				keyinfo.start();
				answerFromCallback = BaseObject.callCallback ( this.$keyboardcommandregister[keyinfo.keyName].callback, this, this.$keyboardcommandregister[keyinfo.keyName] /*,interesen_vapros*/ );
				keyinfo.finish();
			}
		};
	}
	// Control
	else if ( Class.is ( cls, "Base" ) )
	{
		cls.ExtendMethod("init", function() {
			this.root.addEventListener ( "keydown", this.keyboardCommandExecutor, true );
		});
		cls.prototype.processCommandHandling = function ( keyinfo ) {
			this.checkCommandBuffer();
			if ( this.$keyboardcommandregister[keyinfo.keyName] != null ) {
				keyinfo.start();
				answerFromCallback = BaseObject.callCallback ( this.$keyboardcommandregister[keyinfo.keyName].callback, this, this.$keyboardcommandregister[keyinfo.keyName] /*,interesen_vapros*/ );
				keyinfo.finish();
			}
		};
	}
};