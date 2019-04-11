/*
	Upgrades the operation with the concept for chunked result - multiple reports for chunk of the work done, and final completion reported the normal way/
*/

/*CLASS*/
function IChunkedOperation() {}
IChunkedOperation.Interface("IChunkedOperation");
IChunkedOperation.RequiredTypes("IOperation");

// Each chunk has a succes argument, because in the general case the chunks may denote succes/failure of some list of subactions, but it cannot be said on abstract level if
// a failed chunk will fail the entire operation or not.
// The general operation error MUST be reported by calling CompleteOperation no matter the reason - including the case when a failure in a chunk makes the entire operation a failure.
IChunkedOperation.prototype.ReportOperationChunk = function(/*bool*/ success, errorinfo_or_data) { throw "not implemented";}

