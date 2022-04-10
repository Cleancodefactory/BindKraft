


/* ENUM */
/**
 * Not all flags combine painlessly with each other.
 */
var WindowStyleFlags = {
    draggable: 0x01,
    sizable: 0x02,
    fillparent: 0x04, // maximized in parent
    visible: 0x10, // Controls the window visibility
    parentnotify: 0x20, // Notify parent for move, resize show
    popup: 0x40, // DEPRECATED. DO NOT USE. Child or top level window outside the DOM hierarchy. Such a window can hover over the rest.
    adjustclient: 0x80, // Notify the window to adjust its client area
	topmost: 0x100, // Keep the window on top among all its siblings
	nobroadcast: 0x200, // Default processing will stop the broadcast messages (Broadcast and BroadcastAction), but they still can be handled on this window.
    sizenotify: 0x400, // Propagate size changed messages to children regardless of adjust client flag
    relative: 0x800, // Keeps the window position: relative instead of absolute
    Default: 0x30 // WindowStyleFlags.visible
};