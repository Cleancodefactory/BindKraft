


/*INTERFACE*/
function IDelayedMessage() { }
IDelayedMessage.Interface("IDelayedMessage");
IDelayedMessage.prototype.isTimeToSend = function (ms) {
    this.delay -= ms;
    return (this.delay <= 0) ? true : false;
};