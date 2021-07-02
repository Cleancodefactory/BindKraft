(function(){

    /**
     * Represents all pieces in an advanced response packet (assumed by BindKraft). Even the results of simple requests can be represented
     * by such an object, but most properties will be empty, of course.
     * //TODO: Probably add the status stuff as well?
     */
    function IAjaxResponsePacket() {}
    IAjaxResponsePacket.Interface("IAjaxResponsePacket");


    //#region DATA

    /**
     * Returns the main data or the first piece of data (if there are many)
     */
    IAjaxResponsePacket.prototype.get_data = function() { throw "not impl.";}
    /**
     * Returns the hash of the main data (first data)
     */
    IAjaxResponsePacket.prototype.get_datahash = function() { throw "not impl.";}

    /**
     * Gets the specified piece of returned data
     * @param key {string} Optional, if omitted returns an object containing all the pieces in its properties.
     * @returns {object} the specified piece of data or all the datas (if key is omitted)
     */
    IAjaxResponsePacket.prototype.get_datas = function(key) { throw "not impl.";}
    /**
     * Returns the hash of the specified data piece or all the hashes as an object with properties containing the hashes. Each property is named the same way as in the result of get_datas()
     */
    IAjaxResponsePacket.prototype.get_datashash = function(key) { throw "not impl.";}

    //#endregion

    //#region Views

    /**
     * Returns the specified view as string
     * @returns {string} The requested view by key. By convention the default view must have a key "normal"
     */
    IAjaxResponsePacket.prototype.get_view = function(key) { throw "not impl.";}
    /**
     * Returns the hash of the specified view
     * @returns {string} The hash of the specified view
     */
    IAjaxResponsePacket.prototype.get_viewhash = function(key) { throw "not impl.";}

    /**
     * @returns all the views as an object with properties named after the view name and the view as string in it.
     */
    IAjaxResponsePacket.prototype.get_views = function() { throw "not impl.";}
    /**
     * @returns all the view hashes as an object with properties named after the view name and the hash as a string in it.
     */
     IAjaxResponsePacket.prototype.get_viewshash = function() { throw "not impl.";}


    //#endregion



})();