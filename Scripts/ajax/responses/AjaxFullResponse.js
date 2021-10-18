(function(){

    var IAjaxResponsePacket = Interface("IAjaxResponsePacket");

    function AjaxFullResponse(packet, message) {
        if (!BaseObject.is(packet, IAjaxResponsePacket)) {
            packet = new AjaxResponsePacket(packet);
        }
        AjaxResponse.call(this, packet.get_data(), message);
        this.packet = packet;
    }
    AjaxFullResponse.Inherit(AjaxResponse, "AjaxFullResponse");

    ///////////////

})();