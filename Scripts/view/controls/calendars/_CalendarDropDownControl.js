


function CalendarDropDownControl() {
	Base.apply(this, arguments);
}
CalendarDropDownControl.Inherit(Base, "CalendarDropDownControl");
CalendarDropDownControl.ImplementProperty ( "calendar", new InitializeObject ( "Calendar object", "CalendarElementControl" ) );
CalendarDropDownControl.prototype.get_calendar = function () {};
CalendarDropDownControl.prototype.set_calendar = function (v) {
    $(this.root).val(v);
};
CalendarDropDownControl.prototype.onFocus = function ( ev, dc, binding ) {};

