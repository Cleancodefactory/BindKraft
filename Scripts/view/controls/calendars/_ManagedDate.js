

/* CLASS - helper holding the date object */
function ManagedDate() {
	BaseObject.apply ( this, arguments );
}
ManagedDate.Inherit ( BaseObject, "ManagedDate" );
ManagedDate.prototype.$date = new InitializeParameter ( "date", new Date ( ) );
ManagedDate.prototype.date_changed = new InitializeEvent();
ManagedDate.prototype.load = function ( value ) {
	this.set_date ( value );
};

ManagedDate.prototype.set_date = function(v) {
	this.$date = v;
	this.date_changed.invoke(this, v);
};
ManagedDate.prototype.get_date = function() {
	return this.$date;
};

ManagedDate.prototype.set_year = function ( value ) {
	if ( this.$date != null ) {
		this.$date.setFullYear ( value );
		this.date_changed.invoke(this, this.$date);
	}
};
ManagedDate.prototype.get_year = function () {
	return this.$date.getFullYear();
};

ManagedDate.prototype.set_month = function ( value ) {
	if ( this.$date != null ) {
		this.$date.setMonth ( value );
		this.date_changed.invoke(this, this.$date);
	}
};
ManagedDate.prototype.get_month = function () {
	return this.$date.getMonth();
};

ManagedDate.prototype.set_day = function ( value ) {
	if ( this.$date != null ) {
		this.$date.setDate ( value );
		this.date_changed.invoke(this, this.$date);
	}
};
ManagedDate.prototype.get_day = function () {
	return this.$date.getDate();
};

ManagedDate.prototype.set_hours = function ( value ) {
	if ( this.$date != null ) {
		this.$date.setHours ( value );
		this.date_changed.invoke(this, this.$date);
	}
};
ManagedDate.prototype.get_hours = function () {
	return this.$date.getHours();
};

ManagedDate.prototype.set_minutes = function ( value ) {
	if ( this.$date != null ) {
		this.$date.setMinutes ( value );
		this.date_changed.invoke(this, this.$date);
	}
};
ManagedDate.prototype.get_minutes = function () {
	return this.$date.getMinutes();
};

