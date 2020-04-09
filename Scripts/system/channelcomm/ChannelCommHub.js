
/**
 * The main communicator hub. Designed to be used as global singleton, with the option
 * to create additional instances (e.g. for mockups).
 *
 */
function ChannelCommHub() {
    BaseObject.apply(this, arguments);
}
ChannelCommHub.Inherit(BaseObject, "ChannelCommHub");
