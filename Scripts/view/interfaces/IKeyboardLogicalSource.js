


// Classes that expect to be used together with consumers of shared logical keyboard events SHOULD Implement this Interface to make it possible to wire them together through the markup.
// definition of SHARED LOGICAL KEYBOARD EVENT: A common medium (bare javscript object with a few commonly known properties) is defined and a standart convertor from browser keyboard event is also available.
// This medium (object) is used among classes supporting IKeyboardHandler or/and IKeyboardLogicalSource to advise one class from another of a keyboard event occuring somewhere, but not on the target element.
// Typical usage example is the case when the focus is in a textbox that is connected to a drop down. The drop down needs to handle some keys in order to perform navigation, but the focus is not on the drop down, so
// the textbox can route the keyboard messages or some of them through this logical Interface.
// To simplify things the Interface for natural (browser backed) keyboard event handlers (IKeyboardEventHandler) implments processKey as a redirection to processKeyData in IKeyboardHandler assuming both interfaces
// are implemented. In most cases this SHOULD be true, because this streamlines the processing through a single point (processKeyData method) and the behavior will need tobe changed only in specific cases where
// specific (up/down/press) phase is important.
// In more complicated cases where some command-like behaviour is also needed the recommende approach is to keep things simple and use the abovementioned interfaces for the navigational and text entry part of the behaviour,
// then Implement the command-like part through accelerators (see IProcessAccelerators and the related interfaces and implementors). This approach gives you the option to separate things in more natural way and use the frameworks
// built-in features to the possible maximum, which will enable flexibility and manageability.
// See the implementation of IKeyboardHandler.packKeyDataFromEvent for details on the object content.
/*INTERFACE*/
function IKeyboardLogicalSource() {}
IKeyboardLogicalSource.Interface("IKeyboardLogicalSource");
IKeyboardLogicalSource.prototype.keydataevent = new InitializeEvent("Fired when a logical keyboard event is produced. Logical events have no up/down/press variants, they are simplified keyboard Interface for interconnecting elements that need to handle redirected keyboard events from each other");
IKeyboardLogicalSource.prototype.fireKeyDataEvent = function(event_or_data) {
	this.keydataevent.invoke(this, IKeyboardHandler.packKeyDataFromEvent(event_or_data));
}
