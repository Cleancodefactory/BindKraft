(function(){ 

    var IAjaxResponsePacket = Interface("IAjaxResponsePacket");
    /**
     * The response data received from the fetcher is composed in certain way (a convention bordering a standard)
     * This enables a class like this one to provide easy access to parts of the response. The class is based on an interface
     * and the interface should be used to recognize the object if multiple variants are supported in future.
     */
    function AjaxResponsePacket(packet) {
        BaseObject.apply(this, arguments);
        this.$packet = packet;
        
    }
    AjaxResponsePacket.Inherit(BaseObject, "AjaxResponsePacket")
        .Implement(IAjaxResponsePacket);

    //#region Status

    AjaxResponsePacket.prototype.get_status = function() { 
        if (this.$packet && this.$packet.status) return this.$packet.status;
        return null;
    }
    AjaxResponsePacket.prototype.get_issuccessful = function() { 
        if (this.$packet && this.$packet.status) return this.$packet.status.issuccessful;
        return false;
    }
    AjaxResponsePacket.prototype.get_message = function() { 
        if (this.$packet && this.$packet.status) return this.$packet.status.message;
        return null;
    }
    //#endregion

    //#region DATA

    AjaxResponsePacket.prototype.get_data = function() { 
        var datas = this.get_alldatas();
        if (datas.length == 0) return null;
        var def = datas[0];
        if (def && def.name == "default") return def.data;
    }
    AjaxResponsePacket.prototype.get_datahash = function() { 
        var datas = this.get_alldatas();
        if (datas.length == 0) return null;
        var def = datas[0];
        if (def && def.name == "default") {
            return this.getAttribute("datas", "default", "sid");
        }
        return null;
    }

    /**
     * Gets the specified piece of returned data
     * @param key {string} Optional, if omitted returns an object containing all the pieces in its properties.
     * @returns {object} the specified piece of data or all the datas (if key is omitted)
     */
    AjaxResponsePacket.prototype.get_datas = function(key) { 
        if (key == null) {
            if (this.$packet && this.$packet.datas) return this.$packet.datas;
        } else {
            if (this.$packet && this.$packet.datas) return this.$packet.datas[key];
        }
        return null;
    }
    /**
     * Returns the hash of the specified data piece or all the hashes as an object with properties containing the hashes. Each property is named the same way as in the result of get_datas()
     */
    AjaxResponsePacket.prototype.get_datashash = function(key) { 
        return this.getAttribute("datas", key, "sid");
    }

    AjaxResponsePacket.prototype.$datas = null;
    /**
     * @returns All the data pieces in 1.0 format.
     */
    AjaxResponsePacket.prototype.get_alldatas = function() { 
        // TODO: Maybe add the attributes too? Maybe not
        if (this.$datas != null) return this.$datas;
        var datas = [], o;
        if (this.$packet != null && this.$packet.datas != null) {
            for (var key in this.$packet.datas) {
                if (key == "default") {
                    datas.unshift({ name: "default", data: this.$packet.datas[key] });
                } else {
                    datas.push({ name: key, data: this.$packet.datas[key] });
                }
            }
        } else if (this.$packet != null && this.$packet.data != null) {
            datas.push({ name: "default", data: this.$packet.data });
        }
        this.$datas = datas;
        return datas;
    }
    //#endregion

    //#region Views
    // TODO 

    /**
     * Returns the specified view as string
     * @returns {string} The requested view by key. By convention the default view must have a key "normal"
     */
    AjaxResponsePacket.prototype.get_view = function(key) { 
         if (this.$packet != null && this.$packet.views) {
             var _key = key || "normal";
             return this.$packet.views[_key];
         }
         return null;
    }
     /**
      * Returns the hash of the specified view
      * @returns {string} The hash of the specified view
      */
    AjaxResponsePacket.prototype.get_viewhash = function(key) { 
         return this.getAttribute("views",_key, "sid");
    }
 
     /**
      * @returns all the views as an object with properties named after the view name and the view as string in it.
      */
    AjaxResponsePacket.prototype.get_views = function() { 
         if (this.$packet) return this.$packet.views;
         return null;
    }
    /**
     * @returns all the view hashes as an object with properties named after the view name and the hash as a string in it.
     */
    AjaxResponsePacket.prototype.get_viewshash = function() { 
          var sids = {};
          if (this.$packet && this.$packet.attributes && this.$packet.attributes.views) {
                var views = this.$packet.attributes.views;
                for (var k in views) {
                    if (views.hasOwnProperty(k) && views[k] != null) {
                        sids[k] = views[k].sid;
                    }
                }
          }
          return sids;
      }
 
 
     //#endregion

    //#region Attributes
    AjaxResponsePacket.prototype.getAttributes = function(kind, name) { 
        if (typeof kind != "string" || typeof name != "string" || typeof attribute != "string") {
            this.LASTERROR("All parameters must present and be strings.", "getAttribute");
            return null;
        }
        if (this.$packet && this.$packet.attributes && this.$packet.attributes[kind]) {
            return this.$packet.attributes[kind][name];
        }
        return null;
    }

    AjaxResponsePacket.prototype.getAttribute = function(kind, name, attribute) {
        var attrs = this.getAttributes(kind, name);
        if (attrs == null) return null;
        return attrs[attribute];
    }
    //#endregion


})();