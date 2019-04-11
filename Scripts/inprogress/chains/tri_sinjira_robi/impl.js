//#using "../enumerations/ReportingEventTypeEnum.js"
//#using "../interfaces/IEventReporter.js"
//#using "../implementors/IEventReporterImpl.js"

//#using "./vocabularies.js"
//some chainwares
//#using "../wares/ProcessingChainWareBase.js"

//values taken from _conf.js


/*
* The request content type says what body is sent to the server - contentType: multipart/form-data | text/json | ...
* The request content type can contain directives. The directives are as follows:
	+ media-type;
	+ charset;
	+ boundary (used for multipart stuff for example);
*/

//The response content-type header contains informaion, about how the body response from the server is formatted!

//The accept header: Specifies what MIME Type the client expects in the format: <MIME_type>/<MYME_subtype> | <MIME_type>/* | */* + the q factor which is some weight???

//resolver idea#1
//"xxx/xxx" -> IA, IB, IC

//helper- NOT GOOD!!!!!
//{"xxx/xxx"}->(+meta)->obj
//call(chain, helper1, helper2)
	
/*
	OLD	NOTES (OBSOLETE):
	==========
	* You can register a thing (reporter) to the context, to the error chainware to get the stuff out of it;	
	* The chunked operation should be incorporated in the thing;
	* I can directly use the ChunkedOperation class;
	
	* Chunked operation:
		- When you call chunk (callback, callbackfail) you set the chunk routine and you invoke the chunk handling;
			Note: The chunk (callback, callbackfail) method is defined on the ChunkedOperation class, and it calls set_chunkroutine(), if the callback and callbackfail are callbacks (Delegate or function);
		- The $invokeChunkHandling() method can be called either by the chunk(), or by the onOperationChunk() methods;
		- The onOperationChunk() method is called by the ReportOperationChunk(success, errorinfo_or_data) method;
		- The ReportOperationChunk(success, errorinfo_or_data) method takes two arguments:
			+ success: Whether the state is successfull;
			+ data (on successfull) | error_info (on not successfull);

	SIMPLE NOTES:
	=============
	* A ProcessingChainContext has a collection of IDescribedDataHolder objects;
	* A IDescribedDataHolder object has a data ref and a DataAspect object;
	* A DataAspect is defined by two parts: + a vocabulary reference; + a aspect string (a key in the vocabulary);
	* A Vocabulary contains a collection of DataAspect descriptors;
	
	
	NEW NOTES (16.01)
	=================
	* A ProcessingContext has become a reporter, because we've decided that reporting is a separate task, and it should be done through the described datas;
	* The processing context will contain a reference to an on-demand reporter;
	
	TASKS
	=====	
	[x] Make the ProcessingChainContext allows for multiple instances with the same data-aspect;
	[x] Make a base processing chain ware, to have an Operation created, as the chain ware is constructed;
	[x] Redesign the DefaultProcessingChainExecutor, to work with objects from the new ProcessingChainWareBase;
	[x] Add event logging and reporting features to the processsing context;
	[x] Construct operations internally in the chain wares, and do the chunk reporting from there!	
*/

//default communication chain definition
var communicationChain= new ProcessingChain();
communicationChain.$wares= [
	//chainware to populate request prefix datas, from settings object	
	
	//put request modifing chainwares here
	
	//put request body encoding chainwares here
	
	//xhr construction- expects body and headers as text to send them directly
	//new XHRConstructorChainWare(),
	
	//put xhr pre-execute chainwares here
	
	//xhr executor
	XHRExecutorChainWare,
	
	//response chainwares
	
	//put decoders for different response body types here!!!	
];



//exec communication chain
var execAJAX= function (sett, responseCallback, responseFormatters){
	//set object => described data holders to datas
	//DefaultProcessingChainExecutor
	//execute communication chain
	var exect= new DefaultProcessingChainExecutor(communicationChain);
	
	var initialProcessingContextData=[];
	
	//get request essentials from settings object
	if(!sett.url || !BaseObject.is(sett.url, "string")) throw "The settings object must contain a string url property.";
	if(!sett.method || !BaseObject.is(sett.method, "string")) throw "The settings object must contain a string method property.";
	
	//url could be matched with a regex
	
	var xhrFields={
		async: sett.async || true,
		timeout: sett.timeout || 0,//0 =infinity
		
		//cache-control: cache control - later,
		
	};
	
	initialProcessingContextData.push(new DescribedDataHolder(sett.url, httpVoc.getAspect(DataAspectBasicTypeEnum.TEXT+"/request-url")));
	
	exect.execute();
};

/*
	* The request content type is assigned, once the request body is set;
	
*/

/*
var sett= {
	contentType: ?//"application/json; charset=utf-8",//format: media-type; [charset; boundary (for multipart data)]
	
	xhr: null,//passing a ref to an existing xhr object - not sure about this one,
	xhrFields: {},//passing additional configs for the xhr object
	
	async: ?,//should the query be asynchronous
	timeout: //0// The number of milliseconds a request can take before automatically being terminated.
	cache: ?,//cache flag or full configuration object
	
	url: ?,//the requested resource url
	method: ?//"POST",//an alias of types
	
	accept: ["xml"]?//"xml",// at the last possible moment, before the xhr implode the array and pass this as a header to the xhr. In the _conf settings, this is called contentType
	
	
	body: ?,//the body data
	
	headers: {},//associate array- not sure, if this should be an assoc array		
	queryParams: ?,//the query params assoc array - this should be a flat array, no sub objects (for now at least)	
};
*/