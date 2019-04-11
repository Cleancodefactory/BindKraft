


// For use with LayoutChangeEnum message. Instructs the child to accomodate itself to the state to which its visual position and placement are changed.
// It is not necessary to support this, but it allows the child to display itself in different forms according to the state in which it is placed by its container.
/*ENUM*/
var LayoutChangeEnum = {
    normal: 0x0001,
    collapsed: 0x0002, minimized: 0x0002,
    maximized: 0x0003,
    maximal: 0x0004, // Indicates that a normal size child is given as much estate as possible
    minimal: 0x0008, // Indicates that a normal size child is given the minimal possible screen estate.

    // Directional affinity flags enabling the child to accomodate itself better
    horizontal: 0x0010,
    vertical: 0x0020,
    iconic: 0x0030,

    show: 0x1000,
    hide: 0x2000

};