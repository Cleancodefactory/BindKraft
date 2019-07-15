/**
	Action unit is an object that can contain:
	- content
	- options for the content
	- action
	
	...
*/
function IActionUnit() {}
IActionUnit.Interface("IActionUnit");
/**
	The implementations of this interface must honor this. When called all the setters must be disabled.
	TODO: decide how (exception?)
	
	Once sealed the action unit cannot be changed anymore.
	This should be done by the executor or by the system after the executor finishes.
*/
IActionUnit.prototype.seal = function() { throw "not implemented"; }
/**
	Returns true if the actuion unit has been sealed. Should be used by any code that tries to modify the action unit in phases of its life-cycle where it can be expected it to be sealed.
	E.g. code on the side of the issuer that processes action unit with action "select" after it has been executed. These situations are not very likely to occur, if you happen to be in one
	it is a good idea to check the flow of your logic and make sure it is not wrong.
*/
IActionUnit.prototype.issealed = function() { throw "not implemented"; }
/**
	The action job requested/indended precessing kind.
	Currently these are:
		"open" - take control of the content and start working with it
		"choose" - the content is not present, the action job has to fill it somehow honoring the contentKind and the other option props. Then the action unit is returned to the issuer.
		"process" - process the content and set the result. Then the action unit is returned to the issuer.
		"store" - store the content and replace it with content describing the store location/id (something through which it can be found later).
		"load" - load the conten. The issuer passes content like the one the store produces.
*/
IActionUnit.prototype.get_action = function() { throw "not impl";}
IActionUnit.prototype.set_action = function(a) { throw "not impl";}
/**
	Flags that specify how the action should be done. These help the system to decide who can perform it.
*/
IActionUnit.prototype.get_actionFlags = function() { throw "not impl"; }
IActionUnit.prototype.set_actionFlags = function(v) { throw "not impl"; }
/**
	If set by the issuer this overrides all system decisions about who (which app) can execute the action unit. This means that the issuer can request a known (for it) specific app to perform the
	action. This, of course, requires knowledge about it. The trivial usages of this can be: passing self (own app class), or a class chosen during execution of action units like this before. In 
	the latter case the issuer app can remember the executor selected by the system and use it as default. The selection the system makes may or may not involve user decision and if the user is involved
	remembering the last user selection makes sense in most cases. More complex usages include defaults provided by the system (like the above case, but the defaults are saved not by a specific app, but by
	the system), preprocessing for some smart selection that can identify the best executor (not necessarily in all cases).
*/
IActionUnit.prototype.get_executor = function() { throw "not impl";}
IActionUnit.prototype.set_executor = function(v) { throw "not impl";}
/**
	Filled by the system or additional preprocessing invoked by the system to indicate that the selection of the executor was user decided. This enables apps that wish to remember user decisions as defaults
	to know when to do so.
*/
IActionUnit.prototype.get_userselection = function() {throw "not impl"; }
IActionUnit.prototype.set_userselection = function(v) {throw "not impl"; }
/**
	The "kind" of the content - somewhat similar to content type, but multiple content types can carry the same kind in different formats.
	So, this rather characterizes the meaning of the data (content) carried by the action job.
	There are constants for this - see ActionJobContentKindEnum.
	The constants are strings. Kinds starting with "$" are considered by the system as private and are not processed by it (i.e. they are reserved for
	internal - in-app usage). The private usage is for the moment virtually non-existent and this makes this measure more of a future proofing (considered
	intents in Android, we are trying to be cleaner here)
	
	In future private action jobs may be routed by the system back to the application (possible, but currently far from actual decision/implementation)
*/
IActionUnit.prototype.get_contentKind = function() { throw "not impl"; }
IActionUnit.prototype.set_contentKind = function(v) { throw "not impl"; }
/**
	@returns {Array<ActionUnitContentTypeEnum>} - the content types that can be requested from getContent
	
	This is always an array. Content types here MUST not be confused with MIME content types. These are a much lesser set of type names for only in-memory data. If the data
	needs to be fetched through the newtwork and through whatever communication is not a concern of this API. No matter how the supplier obtains the data it needs to provide it 
	through getContent in one or more of the ActionUnitContentTypeEnum formats in-memory.
	There is no setter here becaue this is usually derived from the IContentCrate set to setContent
*/
IActionUnit.prototype.get_contentTypes = function() { throw "not impl"; }

/**
	Returns the content or an Operation that will provide it when it is complete. The caller has to check if this is Operation or not and act accordingly.
	@param contentType {ActionUnitContentTypeEnum} - the type requested. A specific type has to be requested - no defaults are assumed.
	@returns {any|Operation} - the conent itself (when it can be obtained synchronously) or an Oparation that will provide it in its result when it completes.
*/
IActionUnit.prototype.getContent = function(contentType) { throw "not impl"; }
/**
	@param crate {IContentCrate} - the content crate that can produce the representation of the content in the requested content type (format).
		
	@remarks This method should be blocked if the action unit is sealed.
*/
IActionUnit.prototype.setContent = function(crate) { throw "not impl"; }
