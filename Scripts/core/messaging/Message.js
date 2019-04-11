


////// Base message types for Messenger ========================================================
// Base message types. Messenger does not require the messages to be of a specific type but using these classes as base allows some more advanced message processing options.
function Message() {
    BaseObject.apply(this, arguments);
}
Message.Inherit(BaseObject, "Message");

