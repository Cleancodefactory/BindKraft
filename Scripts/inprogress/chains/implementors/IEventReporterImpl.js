//basic IEventReporter implementor
function IEventReporterImpl(){};
IEventReporterImpl.InterfaceImpl(IEventReporterImpl);
IEventReporterImpl.RequiredTypes("IEventReporter");

//implementor
IEventReporterImpl.classInitialize = function(cls) {
	//attach interfaces
	cls.Implement(IEventReporter);
	
	//read() implementation	
	//at goes 0,-1,-2,..., in time
	cls.prototype.read= function(messageType, at, skipurgent){
		if(!this.$eventsLog[messageType]) return;
		
		//fix index - stack index
		var i=  this.$eventsLog[messageType].length-1;
		i= (BaseObject.is(at, "number") && at<0)? i+at: i;
		
		var message= this.$eventsLog[messageType][i];
		if(skipurgent===true)
		{
			while(message.urgent===true && i>0){
				i--;
				message= this.$eventsLog[messageType][i];
			}
			if(message.urgent===true) message= null;
		}
		
		if(message!= null) this.eventread.invoke(this, [message, messageType, i]);
	};
	
	//report() implementation
	cls.prototype.report= function(message, messageType, urgent){
		//if we have a place for this message type
		if(!this.$eventsLog[messageType]) messageType= ReportingEventTypeEnum.INFO;//info is default		
		urgent= (urgent===true);
				
		this.$eventsLog[messageType].push({message: message+"", urgent: urgent });//new IEventReportMessage(message, messageType, {urgent: urgent}));
		//invoke urgent event
		if(urgent)
		{
			var i= this.$eventsLog[messageType].length -1;
			//this is somewhat of a garbage - too much sacrificity
			this.urgenteventlogged.invoke(this, [this.$eventsLog[messageType][i], messageType, i]);
		}
	};
}