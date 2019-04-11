/*


	ex: x = new AppStartStopMessage(someapp,AppStartStopEventEnum.start).arguments([a,b,c]);
*/
function AppStartStopMessage(app,startstop) {
	Message.apply(this, arguments);
	this.set_app(app);
	this.set_event(startstop);
}
AppStartStopMessage.Inherit(Message,"AppStartStopMessage");
AppStartStopMessage.ImplementProperty("app", new Initialize("The app that starts or stops",null));
AppStartStopMessage.ImplementProperty("event", new InitializeStringParameter("What is happening - event",null));
AppStartStopMessage.ImplementProperty("arguments", new InitializeArray("Array of arguments - see the enumeration AppStartStopEventEnum for more info"));
//AppStartStopMessage.ImplementChainSetters("arguments","event","app");
