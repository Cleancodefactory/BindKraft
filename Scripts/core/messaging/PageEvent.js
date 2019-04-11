// This class is used by the built in implementation in Messenger as medium for a few global events:
// eventType:
//      closepopup (caused by click on the body or esc key pressed)
//      
/*CLASS*/
/*???*/
function PageEvent(evntType) {
    Message.apply(this, arguments);
    this.eventType = evntType;
}
PageEvent.Inherit(Message, "PageEvent");