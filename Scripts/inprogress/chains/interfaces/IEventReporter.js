//error reporters and stuff
function IEventReporter(){
	//initialize events property
	this.$eventsLog= {};
	this.$eventsLog[ReportingEventTypeEnum.CRITERR]= [];
	this.$eventsLog[ReportingEventTypeEnum.ERR]= [];
	this.$eventsLog[ReportingEventTypeEnum.WARN]= [];
	this.$eventsLog[ReportingEventTypeEnum.INFO]= [];
	this.$eventsLog[ReportingEventTypeEnum.SUCCESS]= [];
};

IEventReporter.Interface("IEventReporter");
IEventReporter.DeclarationBlock({
	//chain reference
    eventsLog: "r object * Events log by type",
	
	//events
	urgenteventlogged: "event void * This event is triggered whenever an urgent event is added to the events log",
	eventread: "event void * This event is triggered whenever an event is read out of the events log",
	
	//methods
	read: function(messagetype, skipurgent){ throw "An IEventReporter instance has no read() implementation.";},
	report: function(message, messagetype){ throw "An IEventReporter instance has no report() implementation.";} 
});

//event report message interface (default implementation)
//two overloads: (message, type, props) | (message)
/*IEventReportMessage= function(message, type, props){
	this.$message= "An event has occured!";
	this.$type= type || ReportingEventTypeEnum.INFO;
	if(BaseObject.is(message, "object"))
	{
		this.$message= message.message + "" || this.$message;
		this.$type= message.type || this.$type;
		if(BaseObject.is(message.props, "object")){
			props= message.props;
		}
	}
	this.$urgent= props.urgent || false;
};

IEventReportMessage.DeclarationBlock({
	//chain reference
    message: "r string * The event message string",
	type: "r string * The event message type (one of the ReportingEventTypeEnum values)",
	urgent: "r boolean * Whether or not the message is to be reported immediately"//this might dissapear
});
*/