(function(){ 
    
    function AjaxResponsePacket(packet) {
        BaseObject.apply(this, arguments);
        this.$packet = packet;
        
    }
    AjaxResponsePacket.Inherit(BaseObject, "AjaxResponsePacket")
    .Implement(IAjaxResponsePacket);

    //#region Status

    AjaxResponsePacket.prototype.get_status = function() { throw "not impl.";}
    AjaxResponsePacket.prototype.get_issuccessful = function() { throw "not impl.";}
    AjaxResponsePacket.prototype.get_message = function() { throw "not impl.";}
    //#endregion

    //#region DATA

    AjaxResponsePacket.prototype.get_data = function() { 
        var datas = this.get_alldatas();
        if (datas.length == 0) return null;
        var def = datas[0];
        if (def && def.name == "default") return def.data;
    }
    IAjaxResponsePacket.prototype.get_datahash = function() { 
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
    IAjaxResponsePacket.prototype.get_datas = function(key) { 
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
    IAjaxResponsePacket.prototype.get_datashash = function(key) { 
        return this.getAttribute("datas", key, "sid");
    }

    AjaxResponsePacket.prototype.$datas = null;
    /**
     * @returns All the data pieces in 1.0 format.
     */
     AjaxResponsePacket.prototype.get_alldatas = function() { 
        // TODO: May be add the attributes too?
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
            datas.push({ "default": this.$packet.data });
        }
        this.$datas = datas;
        return datas;
    }
    //#endregion

    //#region Attributes
    AjaxResponsePacket.prototype.getAttribute = function(kind, name, attribute) {
        if (typeof kind != "string" || typeof name != "string" || typeof attribute != "string") {
            this.LASTERROR("All parameters must present and be strings.", "getAttribute");
            return null;
        }
        if (this.$packet && this.$packet.attributes && this.$packet.attributes[kind]) {
            var attrs = this.$packet.attributes[kind][name];
            if (attrs != null) return attrs[attribute];
        }
        return null;
    }
    //#endregion


})();