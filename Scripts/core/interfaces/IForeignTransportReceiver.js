
/*
	Base interface for transport encapsulation on the receiving side. Unlike the trnsmitter, there is more to do on this end
	and more of it is up to the developer. Typically none of the methods here need to be called from outside, but we still
	enforce the pattern of call request processing so that we can supply at least some prepacked functionality.
	
*/

/*CLASS*/
function IForeignTransportReceiver() {}
IForeignTransportReceiver.Interface("IForeignTransportReceiver");
// This method must be called internally or from some transparent coordinator that tracks when call decoding is done
// The method simply transfers to the proxy the supplied (already decoded) data and waits for it to finish (if necessary)
// then it updates the datas (as and if necessary) and calls the ReturnResult to invoke encoding for the returning path.
IForeignTransportReceiver.prototype.$CallProxy = function(foreignOperation) {
}
/*
	The internal implementation may differ, but we put all the relevant data back. Many things here are the way the are
		for reasons related to future expansion paths.
	1. The method is supplied and for now it should be the same as the call requested (so the same name is repeated.
		It is here to support method fall-backs in future. Currently this argument does not affect a thing.
		
	2.The params should contain an array corresponding to the original parameters array, but all elements except any output 
		ones should be null;
		Althoug output parameters are not currently supported this is reserved for this purpose only. When no output parameters exist null can
		be passed and on the invoker's side this should mean "no changes" if no array is passed while some of the parameters are actually output ones.
	3. The r
*/
IForeignTransportReceiver.prototype.ReturnResult = function(foreignOperation) { }
