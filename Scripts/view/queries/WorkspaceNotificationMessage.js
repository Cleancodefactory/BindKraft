



//Notify Message
var WorkspaceNotificationMessage = function (from, hint, content, iserror) {
    this.from = from;
    this.hint = hint;
    this.content = content;
    this.isError = iserror;
};
WorkspaceNotificationMessage.Inherit(BaseObject, "WorkspaceNotificationMessage");
WorkspaceNotificationMessage.prototype.from = null;
WorkspaceNotificationMessage.prototype.hint = null;
WorkspaceNotificationMessage.prototype.content = null;
WorkspaceNotificationMessage.prototype.isError = false;
WorkspaceNotificationMessage.prototype.equals = function (other) {
    if (this !== other) return false;
    return true;
};