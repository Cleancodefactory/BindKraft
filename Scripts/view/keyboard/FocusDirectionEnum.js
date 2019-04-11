/*ENUM*/
var FocusDirectionEnum = {
	// These two bits are considered mandatory and must have meaning always
	begin: 0x0001, // Focus enters/leaves from the beginning of the container
	end: 0x0002,	// Focus enters/leaves from the end of the container
	middle: 0x0003, // Focus enters exists somewhere in the middle or from/to indeterminate direction
	indeterminate: 0x0003,
	// Directions
	left: 0x0004,
	top: 0x0008,
	right: 0x0010,
	bottom: 0x0020,
	front: 0x0040,
	back: 0x00080,
	reverseOf: function(d) {
		switch (d) {
			case this.begin: 
				return this.end;
			case this.end:
				return this.begin;
			case this.middle:
				return this.middle;
			case this.left:
				return this.right;
			case this.right:
				return this.left;
			case this.top:
				return this.bottom;
			case this.bottom:
				return this.top;
			case this.front:
				return this.back;
			case this.back:
				return this.front;
			default:
				return d;
		}
	},
	navigationFromSubordinateSurrender: function(d) {
		switch(d) {
			case this.begin: 
				return FocusNavigationEnum.prev;
			case this.end:
				return FocusNavigationEnum.next;
			case this.middle:
				return FocusNavigationEnum.unknown;
			case this.left:
				return FocusNavigationEnum.left;
			case this.right:
				return FocusNavigationEnum.right;
			case this.top:
				return FocusNavigationEnum.up;
			case this.bottom:
				return FocusNavigationEnum.down;
			case this.front:
				return FocusNavigationEnum.closer;
			case this.back:
				return FocusNavigationEnum.farther;
			default:
				return FocusNavigationEnum.unknown;;
		}
	}
};