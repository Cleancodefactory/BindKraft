(function() {

    var LightFetchHttpResponseBase = Class("LightFetchHttpResponseBase");

    function LightFetchHttpResponsePacketXml() {
        LightFetchHttpResponseBase.apply(this, arguments);
    }
    LightFetchHttpResponsePacketXml.Inherit(LightFetchHttpResponseBase, "LightFetchHttpResponsePacketXml");
    LightFetchHttpResponsePacketXml.prototype.adjustRequest = function(xhr) {
        xhr.responseType = "";
    }
    LightFetchHttpResponsePacketXml.prototype.processResponse = function(xhr, result) {
        try {
            var parser = new DOMParser();
            var doc = parser.parseFromString(xhr.responseText, "application/xml");
            var node = doc.querySelector("packet>status");
            var v, x, i;
            if (node != null) {
                result.status.issuccessful = this.readAttributeAsBool(node,"issuccessful");
                result.status.isreadonly = this.readAttributeAsBool(node,"isreadonly");
                result.status.isprobing = this.readAttributeAsBool(node,"isprobing");
            }
            node = doc.querySelector("packet>status>message");
            if (node != null) {
                result.status.message = node.textContent;
                if (typeof result.status.message == "string" && result.status.message.length == 0) {
                    result.status.message = null;
                }
            }
            node = doc.querySelector("packet>status>returnurl");
            if (node != null) {
                result.status.returnurl = node.textContent;
            }
            node = doc.querySelector("packet>status>title");
            if (node != null) {
                result.status.title = node.textContent;
            }
            node = doc.querySelector("packet>status>messages");
            if (node != null) {
                result.status.messages = JSON.parse(node.textContent);
            }
            node = doc.querySelector("packet>status>operations");
            if (node != null) {
                result.status.operations = JSON.parse(node.textContent);
            }

            // Data
            var data = doc.querySelector("packet>data");
            if (data != null) {
                if (data.children.length > 0) {
                    result.datas = {};
                    for (i = 0; i < data.children.length; i++) {
                        node = data.children[i];
                        result.datas[node.tagName] = JSON.parse(node.textContent);
                        if (i == 0) {
                            result.data = result.datas[node.tagName];
                        }
                    }
                } else {
                    result.data = JSON.parse(data.textContent);
                }
            }

            // Views
            data = doc.querySelector("packet>views");
            if (data != null) {
                result.views = {};
                for (i = 0; i < data.children.length; i++) {
                    node = data.children[i];
                    result.views[node.tagName] = node.textContent;
                    
                }
            }

            // metadata
            data = doc.querySelector("packet>metadata");
            if (data != null) {
                result.metadata = JSON.parse(data.textContent);
            }

            // resources
            var data = doc.querySelector("packet>resources");
            if (data != null) {
                if (data.children.length > 0) {
                    result.resources = {};
                    for (i = 0; i < data.children.length; i++) {
                        node = data.children[i];
                        result.resources[node.tagName] = JSON.parse(node.textContent);
                    }
                }
            }

            // lookups
            var data = doc.querySelector("packet>lookups");
            if (data != null) {
                if (data.children.length > 0) {
                    result.lookups = {};
                    for (i = 0; i < data.children.length; i++) {
                        node = data.children[i];
                        result.lookups[node.tagName] = JSON.parse(node.textContent);
                    }
                }
            }

        } catch (e) {
            result.status.issuccessful = false;
            result.status.message = e + "";
        }
    }
    LightFetchHttpResponsePacketXml.prototype.readAttributeAsBool = function(node, attr) {
        var v = node.getAttribute(attr);
        var x = ((v != null)? parseInt(v, 10): 0);
        return (!isNaN(x) && x != 0) ? true : false;
    }
})();