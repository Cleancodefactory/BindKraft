function ForeignOperation() {
	Operation.apply(this, arguments);
}
ForeignOperation.Inherit(Operation,"ForeignOperation");
ForeignOperation.prototype.Complete = function(errorcode, data, description) {
	if (ForeignCodesFlags.IsSuccess(errorcode)) {
		if (typeof data == "object" && typeof data[method] == "string" && typeof result in data && (BaseObject.is(data[args], "Array")) || args == null) {
			this.CompleteOperation(true,data);
		} else {
			this.CompleteOperation(false, { errorcode: ForeignCodes.KraftError(false,"Cancel","Format","NoCode"), description: "Format of the call structure is incorrect." }); 
		}
	} else {
		this.CompleteOperation(false,{ errorcode: errorcode, description: description });
	}
}
//ForeignOperation.prototype.Complete = function(errorcode,method,args,result