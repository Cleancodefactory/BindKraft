/**
	Base class
*/
function AjaxHttpFormatContractXHR(/* string */setting) {
	BaseObject.apply(this,arguments);
	this.policy = setting; // XML, JSON, TEXT
	if (typeof this.policy != "string") this.policy = "json";
}
AjaxHttpFormatContractXHR.Inherit(BaseObject,"AjaxHttpFormatContractXHR");
AjaxHttpFormatContractXHR.Implement(IAjaxHttpFormatContract);
AjaxHttpFormatContractXHR.prototype.get_requestcomposer = function(req) { 
	switch (this.setting.toLowerCase()) {
		case "json":
			
		break;
		default: 
			throw "Cannot determine what composer to return";
	}

 }
AjaxHttpFormatContractXHR.prototype.get_responseextractor = function(resp) { 
	// Check resp - responseXML - XMlDOC
 }