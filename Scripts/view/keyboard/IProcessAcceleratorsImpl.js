/*
	For the sake of performance some handlers are attached directly to the DOM element without
	Delegate. Although they are defined as regular classmembers they have to use this.activeClass to reach their instance.
	
	They are marked with DOMThis

*/


/** Interface Impl **/

function IProcessAcceleratorsImpl() {}

IProcessAcceleratorsImpl.InterfaceImpl ( IProcessAccelerators, "IProcessAcceleratorsImpl" );

IProcessAcceleratorsImpl.RequiredTypes ( "Base", "AppBase" );

/*
	intercept the keyboard event
	
	The characters will go to the buffer. Continue addng them, until
	an accelerator responds or a mismatch appear in the longest serie
	of characters in an accelerator. Then destroy the data in the
	buffer and start again.
	How to check if a mismatch appears ?
*/
/*DOMThis*/
IProcessAcceleratorsImpl.prototype.acceleratorExecutor = function ( e ) {
	var self = this.activeClass;
	var isChar = true;
	
	var modifiers = {
		ctrl	: e.ctrlKey,
		alt		: e.altKey,
		shift	: e.shiftKey,
		meta	: false
	};
	
	if ( typeof e.which !== 'number' ) {
		e.which = e.keyCode;
	}
	
	// there are several possibilities:
	// - the key is special:
	//     - f1...,
	//     - arrows,
	//     - numpad keys as numbers ( depending on the numlock they may also apper as arrows )
	// - the key is from alphabet, etc - it can be casted directly
	if ( IProcessAccelerators.$accMap[ e.which ] )
	{
		character = IProcessAccelerators.$accMap[ e.which ];
		isChar = false;
	}
	else
	{
		var character = String.fromCharCode ( e.which );
		// the only side effect that might not be desired is if you
		// bind something like 'A' cause you want to trigger an
		// event when capital A is pressed caps lock will no longer
		// trigger the event.  shift+a will though.
		if ( !e.shiftKey ) {
			character = character.toLowerCase();
		}
	}
	
	// add the character to the buffer
	// the longest sequence must be captured and the corresponding accelerator must be executed
	
	// add modifiers with "+" in order to match the accelerator registration
	if ( isChar )
	{
		this.activeClass.acceleratorbuffer += character;
		// console.log ( "acceleratorbuffer: " + this.activeClass.acceleratorbuffer );
	}
	else
	{
		// console.log ( modifiers );
		var tmp = "";
		for ( var prop in modifiers )
		{
			if ( modifiers[prop] == true )
			{
				tmp += prop + "+";
			}
			// console.log ( "\t" + prop + " : " +	modifiers[prop] );
		}
		this.activeClass.acceleratorbuffer += tmp + character;
		// console.log ( "acceleratorbuffer: " + this.activeClass.acceleratorbuffer );
	}
	
	//var keyName = this.activeClass.$generateKeyName ( character, modifiers.ctrl, modifiers.alt, modifiers.shift );
	var keyName = this.activeClass.$generateKeyName ( this.activeClass.acceleratorbuffer, modifiers.ctrl, modifiers.alt, modifiers.shift );
	
	this.activeClass.processAccelerator (
		{
			start			: function() { e.preventDefault(); }
			,"keyName"		: keyName
			,"character"	: character
			,"modifiers"	: modifiers
			,finish			: function() { e.stopPropagation(); self.acceleratorbuffer = ""; }
		}
	);
};

IProcessAcceleratorsImpl.classInitialize = function ( cls, routingTypeName, getParentProc ) {
	var answerFromCallback;
	var processAccCaller = new ProtoCaller("IProcessAccelerators", "processAccelerator");
	
	// App ( has no visual representation )
	if ( Class.is ( cls,  "AppBase" ) )
	{
		cls.prototype.processAccelerator = function ( keyinfo ) {
			// Search local accel table and call a callback if accel is found
			
			this.checkAccelBuffer();
			if ( this.$accelerators[keyinfo.keyName] != null ) {
				keyinfo.start();
				answerFromCallback = BaseObject.callCallback ( this.$accelerators[keyinfo.keyName].callback, this, this.$accelerators[keyinfo.keyName] /*,interesen_vapros*/ );
				keyinfo.finish();
				alert("Accelerator has been processed by an App. Accel:" + keyinfo.keyName + ", " + keyinfo.character);
				jbTrace.log("Accelerator has been processed by an App. Accel:" + keyinfo.keyName + ", " + keyinfo.character);
			}
		};
	}
	// Window ( it is a child of the App ) 
	else if ( Class.is ( cls, "BaseWindow" ) ) 
	{
		cls.ExtendMethod("init", function() {
			this.root.addEventListener ( "keydown", this.acceleratorExecutor, true );
		});
		cls.prototype.processAccelerator = function ( keyinfo ) {
			
			if (this.get_approot() == null || !processAccCaller.invokeOn(this.get_approot(), keyinfo ) ) {
				// Search local accel table and call a callback if accel is found
				this.checkAccelBuffer();
				if ( this.$accelerators[keyinfo.keyName] != null ) {
					keyinfo.start();
					answerFromCallback = BaseObject.callCallback ( this.$accelerators[keyinfo.keyName].callback, this, this.$accelerators[keyinfo.keyName] /*,interesen_vapros*/ );
					keyinfo.finish();
					jbTrace.log("Accelerator has been processed by an Window. Accel:" + keyinfo.keyName + ", " + keyinfo.character);
				}
			}
		};
	}
	// View
	else if ( Class.is ( cls,  "ViewBase" ) )
	{
		cls.ExtendMethod("init", function() {
			this.root.addEventListener ( "keydown", this.acceleratorExecutor, true );
		});
		cls.prototype.processAccelerator = function ( keyinfo ) {
			this.checkAccelBuffer();
			if ( this.$accelerators[keyinfo.keyName] != null ) {
				keyinfo.start();				
				// in order to have access to the elements from the current class
				answerFromCallback = BaseObject.callCallback ( this.$accelerators[keyinfo.keyName].callback, this, this.$accelerators[keyinfo.keyName] /*,interesen_vapros*/ );
				keyinfo.finish();
				jbTrace.log("Accelerator has been processed by a View. Accel:" + keyinfo.keyName + ", " + keyinfo.character);
			}
		};
	}
	// Control
	else if ( Class.is ( cls, "Base" ) )
	{
		cls.ExtendMethod("init", function() {
			this.root.addEventListener ( "keydown", this.acceleratorExecutor, true );
		});
		cls.prototype.processAccelerator = function ( keyinfo ) {
			this.checkAccelBuffer();
			if ( this.$accelerators[keyinfo.keyName] != null ) {
				keyinfo.start();
				// in order to have access to the elements from the current class
				answerFromCallback = BaseObject.callCallback ( this.$accelerators[keyinfo.keyName].callback, this, this.$accelerators[keyinfo.keyName] /*,interesen_vapros*/ );
				keyinfo.finish();
				jbTrace.log("Accelerator has been processed by an element. Accel:" + keyinfo.keyName + ", " + keyinfo.character);
			}
		};
	}
};