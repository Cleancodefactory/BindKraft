


// Foreign calls Interface implementations
/*
	Foreign calls are only asynchronous calls, both artificialy (by using async results and task schedulers) and naturally (when ajax communication or cross-window communicaion is involved).
	The term "Foreign" is used, because these features target transparency of the call mechanism no matter where the caller and callee reside. The same Interface will be used in cross-window and local calls and this
	makes possible to Implement modules that can be moved around, but their usage kept unchanged except from the part where they are located of course.
	
	
*/

/* This is a potentially multicomponent solution where everything starts with an async result and more can be chained on it.
	The purpose of this class is to serve as prepared async operations that may include communication and other natively async elements.
	How it works:
		A method of a PROXY is called. It prepares the operation, packing it in an async RESULT and schedules it (or starts it if it is natively async)
			The 
	
*/
/*CLASS*/
function ForeignCallPerformer(obj, method) {
};
ForeignCallPerformer.Description("This class is a tool/helper for handling of async calls. It is used by the implementation of the callee and not the caller.");
ForeignCallPerformer.Inherit(BaseObject, "ForeignCallPerformer");
