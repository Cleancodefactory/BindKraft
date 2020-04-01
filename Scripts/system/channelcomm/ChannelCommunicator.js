
/**
 * The main communicator hub. Designed to be used as global singleton, with the option
 * to create additional instances (e.g. for mockups).
 *
 */
function ChannelCommunicator() {
    BaseObject.apply(this, arguments);
}
ChannelCommunicator.Inherit(BaseObject, "ChannelCommunicator");
