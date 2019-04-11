


/*CLASS*/
function TargetedMessage(target) {
    Message.apply(this, arguments);
    this.target = target; // the only subscriber that will be honoured
};
TargetedMessage.Inherit(Message, "TargetedMessage");
TargetedMessage.Implement(ITargetedMessage);
