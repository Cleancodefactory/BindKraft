


function TimeScrollerControl() {
	/** GenericViewBaseEx.apply(this, arguments); */
	Base.apply(this, arguments);
}
/** TimeScrollerControl.Inherit(GenericViewBaseEx, "TimeScrollerControl"); */
TimeScrollerControl.Inherit(Base, "TimeScrollerControl");
TimeScrollerControl.Implement(IUIControl);
TimeScrollerControl.prototype.get_caption = function() {
	return "Time Picker";
};
TimeScrollerControl.prototype.$value = null;
TimeScrollerControl.prototype.get_value = function (){
	return this.Date;
};
TimeScrollerControl.prototype.set_value = function ( date ) {
	this.loadDate ( date );
};
TimeScrollerControl.prototype.defaultTemplateName = ".j_control_timepicker";
TimeScrollerControl.ImplementProperty ( "templateName", new InitializeStringParameter ( "Template Name for the control", null) );
TimeScrollerControl.ImplementActiveProperty ( "hours", new InitializeNumericParameter ( "hours", 0 ) );
TimeScrollerControl.ImplementActiveProperty ( "minutes", new InitializeNumericParameter ( "minutes", 0 ) );
TimeScrollerControl.prototype.changedevent = new InitializeEvent ( "Fired when the user changes the hours or/and minutes" );
TimeScrollerControl.prototype.time_changed = new InitializeEvent ( "Fired for internal use in the template of the control. Fires when update of the view is needed." );
TimeScrollerControl.prototype.Date = null;
TimeScrollerControl.prototype.UTCDate = null;
TimeScrollerControl.prototype.AMPM = true;
TimeScrollerControl.prototype.hoursObject = null;
TimeScrollerControl.prototype.minutesObject = null;
TimeScrollerControl.prototype.totalWidth = 0;
TimeScrollerControl.prototype.get_myresult = function() {
	var h = this.get_hours();
	if ( this.AMPM === true )
	{
		var timeampm = h < 12 ? "AM" : "PM";
		if ( h === 0 ) h = 12;
		if ( h > 12 ) h %= 12;
	}
	return this.$pad ( h ) + ":" + this.$pad ( this.get_minutes() ) + " " + timeampm;
};
TimeScrollerControl.prototype.$pad = function ( v ) {
	return v > 9 ? v : "0" + v;
};
TimeScrollerControl.prototype.$calculate = function ( parts, total, position ) {
	return ( ( position / ( total / parts ) ) | 0 );
};
TimeScrollerControl.prototype.$updateVars = function ( what, withwhat ) {
	this.$setVars ( what, BaseObject.getProperty ( this, what, 0 ) + withwhat );
};
TimeScrollerControl.prototype.$setVars = function ( what, v ) {
	if ( what == "minutes" && ( v < 0 || v >= 60 ) ) return;
	if ( what == "hours"   && ( v < 0 || v >= 24 ) ) return;
	BaseObject.setProperty ( this, what, v );
	
	this.UTCDate = new Date ( Date.UTC ( this.Date.getFullYear(), this.Date.getMonth(), this.Date.getDate(), this.get_hours(), this.get_minutes(), 0 ) );
	this.Date =               new Date ( this.Date.getFullYear(), this.Date.getMonth(), this.Date.getDate(), this.get_hours(), this.get_minutes(), 0 );
	
	this.$placeScrollers();
	this.changedevent.invoke ( this, null );
};
TimeScrollerControl.prototype.$placeScrollers = function(){
	this.hoursObject.css ( "left", ( ( this.totalWidth / 24 ) * this.get_hours() )  );
	this.minutesObject.css ( "left", ( ( this.totalWidth / 60 ) * this.get_minutes() )  );
	this.time_changed.invoke ( this, null );
};
TimeScrollerControl.prototype.onChangeClick = function ( ev, dc, binding, params ) {
	var elements = params.split ( ',' );
	this.$updateVars ( elements[0], parseInt ( elements[1], 10 ) );
};
TimeScrollerControl.prototype.loadTime = function ( hours, minutes ) {
	this.$setVars ( "hours", hours );
	this.$setVars ( "minutes", minutes );
};
TimeScrollerControl.prototype.loadDate = function ( date ) {
	this.Date = date;
	this.loadTime ( date.getHours(), date.getMinutes() );
};
TimeScrollerControl.prototype.onClickNow = function ( ev, dc, binding ) {
	var now = new Date();
	this.loadTime ( now.getHours(), now.getMinutes() );
};
TimeScrollerControl.prototype.onClickScroller = function ( ev, dc, binding ) {
	var element = ev.target;
	element.focus();
};
TimeScrollerControl.prototype.$init = function () {
    // Inject the predefined template
    var el = $(this.root);
    var tmlName = this.get_templateName();
    if (tmlName == null) tmlName = this.defaultTemplateName;
	var tml = $(tmlName);
	if ( tml.length > 0 )
    {
		el.empty();
		el.append(tml.children().clone());
	}
    Base.prototype.$init.apply ( this, arguments );
};
TimeScrollerControl.prototype.init = function () {
	this.hoursObject = this.child ( "hours" );
	this.minutesObject = this.child ( "minutes" );
	
	if ( this.hoursObject && this.minutesObject )
	{
		var hoursContainer = this.child ( "hoursContainer" ),
			minutesContainer = this.child ( "minutesContainer" ),
			self = this;
			
		// ! minutes and hours are teh same - thay have the same width
		this.totalWidth = 
			parseInt ( hoursContainer.css( "width" ), 10 )
			- ( 
				parseInt ( this.hoursObject.css( "width" ), 10 ) + 
				parseInt ( this.hoursObject.css( "border-top-width" ), 10 )
			);
		
		this.hoursObject.draggable({
			axis: "x"
			,containment: hoursContainer
			,scroll: false
			,start: Delegate.createWrapper( this, this.$posDragHandlers.begin )
			,drag: Delegate.createWrapper ( this, this.$posDragHandlers.drag, [24,"hours","AM"] )
			,stop: Delegate.createWrapper ( this, this.$posDragHandlers.end, [24,"hours","AM"] )
		});
		
		this.minutesObject.draggable({
			axis: "x"
			,containment: minutesContainer
			,scroll: false
			,start: Delegate.createWrapper( this, this.$posDragHandlers.begin )
			,drag: Delegate.createWrapper ( this, this.$posDragHandlers.drag, [60,"minutes"] )
			,stop: Delegate.createWrapper ( this, this.$posDragHandlers.end, [60,"minutes"] )
		});
		
		this.hoursObject.keyup ( function ( evnt )	{
			//if ( self.hoursObject.is(":focus") )
			//{
				self.onKeyPress ( evnt, "hours" );
			//}
		});
		this.minutesObject.keyup ( function ( evnt ) {
			//if ( self.minutesObject.is(":focus") )
			//{
				self.onKeyPress ( evnt, "minutes" );
			//}
		});
		
		// if ( this.settings.focusHours == true )
		// {
			// this.hoursObject.focus();
		// }
		// else if ( this.settings.focusMinutes == true )
		// {
			// this.minutesObject.focus();
		// }
	}
};
TimeScrollerControl.prototype.FocusMinutes = function() {
	if (this.minutesObject != null && this.minutesObject.length > 0) {
		this.minutesObject.focus();
	}
};
TimeScrollerControl.prototype.FocusHours = function() {
	if (this.hoursObject != null && this.hoursObject.length > 0) {
		this.hoursObject.focus();
	}
};
TimeScrollerControl.prototype.$posDragHandlers = {

    begin: function ( e, ui ) {},
	
    drag: function ( e, ui, parts, what, additional ) {
		var result = this.$calculate ( parts, this.totalWidth, ui.helper.position().left );
		this.$setVars ( what, result );
    },
	
    end: function ( e, ui, parts, what, additional ) {
		var result = this.$calculate ( parts, this.totalWidth, ui.helper.position().left );
		this.$setVars ( what, result );
    }
};
TimeScrollerControl.prototype.onKeyPress = function ( evnt, what ) {
	if ( this.processKey ( evnt, what ) ) {
		evnt.stopPropagation();
	}
	this.$placeScrollers();
};
TimeScrollerControl.prototype.processKey = function ( e, what ) {
	switch ( e.which )
	{
		case 37 : /* left  */ this.$updateVars ( what, -1  );  return true;
		case 38 : /* up    */ this.$updateVars ( what, 1  );  return true;
		case 39 : /* right */ this.$updateVars ( what, 1  );  return true;
		case 40 : /* down  */ this.$updateVars ( what, -1  );  return true;
	}
	return false;
};

