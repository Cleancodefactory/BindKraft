(function() {
    /**
     * @param {MediaDeviceInfo} tracker The media tracker root object.
     */
    function MediaQueryNotificationBase(tracker) {
        BaseObject.apply(this,arguments);
        this.$tracker = tracker;
    }
    MediaQueryNotificationBase.Inherit(BaseObject, "MediaQueryNotificationBase");

    MediaQueryNotificationBase.prototype.$tracker = null;
})();