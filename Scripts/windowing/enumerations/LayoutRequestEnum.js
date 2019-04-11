


// For use with LayoutRequestEnum message. Other specific constants can be supported in the range 0x10000 - 0xFFFF0000
/*ENUM*/
var LayoutRequestEnum = {
    normal: 0x0001, // Normal size for the view with current (remembered) pos/size
    nominal: 0x0002, // Nominal or initial size and state

    collapse: 0x0004, // Collapsed view - can be combined with some directional constants
    maximize: 0x0008, // Maximized view - occupy all the allowed space, combination with directional constants is allowed but rarely makes sense.
    minimal: 0x000C, // as small as possible but normal
    maximal: 0x000A, // as big as possible but still normal

    first: 0x0010, // If there is an order change the position to first (can be top or left in a splitter for example)
    last: 0x0020, // If there is an order change the position to last (can be bottom or right in a splitter for example)
    left: 0x0040, // Left direction, or left side, can be combined with move/rotate to declare preference
    right: 0x0080, // Right direction, or right side, can be combined with move/rotate to declare preference
    top: 0x0100, // Like previous but Top
    bottom: 0x0200, // Like previous but Bottom

    move: 0x0400, swap: 0x0400, // When placement change is requested a move/swap is declared as prefered method
    rotate: 0x0800, slide: 0x0800, // When placement change is requested a rotation/slide of all items is declared as prefered method

    show: 0x1000,
    hide: 0x2000,
    reconfirm: 0x4000 // Optionaly supported. Should perform actions to ensure the size and state of the client(s) is set. Usually related to walk arounds.

    // getstate: 0x4000, setstate: 0x8000,

};