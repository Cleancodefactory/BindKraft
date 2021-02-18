(function() {

    var IMediaQueryNotificator = Interface("IMediaQueryNotificator"),
        MediaQueryNotificatorBase = Class("MediaQueryNotificatorBase"),
        Messenger = Class("Messenger").Instance(),
        MediaChangedMessage = Class("MediaChangedMessage");

    /**
     * @param {MediaDeviceInfo} tracker The media tracker root object.
     */
    function MediaQueryNotificatorBroadcaster(tracker, name) {
        MediaQueryNotificatorBase.apply(this,arguments);
    }
    MediaQueryNotificatorBroadcaster.Inherit(MediaQueryNotificatorBase, "MediaQueryNotificatorBroadcaster");

    /**
     * @param {boolean} matchingUnMatching True if the state changes from non-matching to matching and false otherwise
     */
    MediaQueryNotificatorBroadcaster.prototype.OnMediaStateChanged = function(matchingUnMatching) {
        MediaQueryNotificatorBase.prototype.OnMediaStateChanged.apply(this,arguments);
        var query = new MediaChangedMessage(this.$name);
        query.set_expression(this.$condition);
        query.set_matched(matchingUnMatching);
        Messenger.post(query);
    }
    
    //#endregion
})();