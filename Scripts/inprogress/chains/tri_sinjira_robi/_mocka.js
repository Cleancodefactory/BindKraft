//Mock vocabulary
var testVocb= new Vocabulary("vladko");

testVocb.addAspect("json/vladko1");
testVocb.addAspect("json/vladko2");
testVocb.addAspect("json/vladko3");

//Mock chainware
function MockChainware(){}
MockChainware.Implement(IProcessingChainWare);

MockChainware.prototype.execute= function(work, context, success, failure){
	var op= new Operation();
	var xhr= new XMLHttpRequest();
	xhr.open('GET', 'http://localhost:8090/neapol/index.php');
	xhr.setRequestHeader("Origin", "http://localhost:8090/neapol/");
	 
	xhr.onload = function() {
				
		//add response data to the context		
		if((xhr.status < 400))
		{
			op.CompleteOperation(true);
			context.addDescribedData({responseText: xhr.responseText, status: xhr.status}, testVocb.getAspect("json/vladko1"));
		}
		else{
			op.CompleteOperation(false, "Ajax request returned a error status code: "+xhr.status+"!");
		}
		//op.$invokeHandling();
	};
	
	//send an http ajax request
	xhr.send();
	return op;
};


function MockChainware2(){}
MockChainware2.Implement(IProcessingChainWare);

MockChainware2.prototype.execute= function(work, context, success, failure){
	var op= new Operation();
	//debugger;
	//var neededCntx= context.getDescribedData(testVocb.getAspect("json/vladko1"));
	console.log(context);
	//.$datas[0].$data.responseText);//neededCntx.get_data()));
	op.CompleteOperation(true);
	return op;
};

//Test chain
var testChain= new ProcessingChain();
testChain.$wares= [
	new MockChainware(),
	new MockChainware2(),
	new MockChainware(),
	new MockChainware2(),
	new MockChainware(),
	new MockChainware2(),
	new MockChainware(),
	new MockChainware2()
];


//chainware mock test
DefaultProcessingChainExecutor.execute(testChain);

debugger;