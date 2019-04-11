//Default XHR request-response chainware
function XHRExecutorChainware(){}
XHRExecutorChainware.Implement(IProcessingChainWare);

//encoder wares
//queryparam assoc array -> urlstring with encodeURIComponent



XHRExecutorChainware.prototype.execute= function(work, context, success, failure){
	//check if everything is ok with the constructed xhr, does it exist in the context
	//send with no regrets and after the long wait pass to the next in line
	//TO THINK ABOUT: If the thing can report progress should it be chained to a reporting stuff, and the reporting stuff to be chained in the end of all the action?
	
	//take in {method, urlstring, headersassoc}
	
	//send body from: {text, textjson, textxml, texthtml} | xdocument | htmlfrag | object -> stringiffy | formdata (later)
	
	//attach for: ontimeout, onreadystatechange
	
	/*
		onloadstart - the request starts
		onprogress - transmitting data
		onabort - request has been aborted
		onerror - the request has failed
		onload - the request has successfully completed
		ontimeout - the timeout has passed before the request completed
		onloadend - the request has completed
	*/
	
	//set headers
	//XMLHttpRequest.setRequestHeader(header, value)
	
	var xhr= new XMLHttpRequest();
	xhr.open('GET', 'http://localhost:8090/neapol/index.php');
	xhr.setRequestHeader("Origin", "http://localhost:8090/neapol/");
	
	xhr.onload = function() {
				
		//add response data to the context		
		if(xhr.status < 400)
		{
			op.CompleteOperation(true);
			context.addDescribedData({responseText: xhr.responseText, status: xhr.status}, testVocb.getAspect("json/vladko1"));
		}
		else {
			op.CompleteOperation(false, "Ajax request returned a error status code: "+xhr.status+"!");
		}
		//op.$invokeHandling();
	};
	
	//send an http ajax request
	xhr.send();
	return op;
};