// This class is used by the built in implementation in Messenger as medium for a few global events:
// eventType:
//      closepopup (caused by click on the body or esc key pressed)
//      
/*CLASS*/
/*???*/
function PageEvent(evntType, etarget) {
    Message.apply(this, arguments);
    this.eventType = evntType;
    this.set_target(etarget);
}
PageEvent.Inherit(Message, "PageEvent");
PageEvent.ImplementProperty("target", new Initialize("The target element to which the event travels", null));
