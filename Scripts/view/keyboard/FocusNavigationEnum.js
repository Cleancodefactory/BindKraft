


// Move focus instruction to a container (where needed). index > 0 is an index of focus subordinate, negative numbers have special meanings
// listed in this enum.
var FocusNavigationEnum = {
	next: -1,
	previous: -2,
	prev: -2,
	first: -3,
	last: -4,
	left: -10,
	right: -11,
	up: -12,
	down: -13,
	closer: -14,
	farther: -15,
	leftmost: -50,
	topmost: -51,
	rightmost: -52,
	bottom: -53,
	closest: -54,
	farthest: -55,
	unknown: -70
};