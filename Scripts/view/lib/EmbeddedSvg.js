(function(){
    function EmbeddedSvg() {
        Base.apply(this,arguments);
    }
    EmbeddedSvg.Inherit(Base, "EmbeddedSvg")
        .Implement(ICustomParameterizationStdImpl, "svgpath", "usedefault", "width", "height")
        .Implement(IPlatformUrlMapperImpl)
        .ImplementProperty("svgpath", new InitializeStringParameter("The path of the Svg image", null), null, "OnUpdate")
        .ImplementProperty("usedefault", new InitializeBooleanParameter("Should the control use default svg if the main one is not found or leave it empty (false)", true))
        .ImplementProperty("width", new InitializeStringParameter("Input for init width of the svg", null),null,"OnUpdate")
        .ImplementProperty("height", new InitializeStringParameter("Input for init height of the svg", null),null, "OnUpdate");

    EmbeddedSvg.loadTimeOut = 30000;
    EmbeddedSvg.mapPath = function(url) {
        return mapPath(url);
    }

    EmbeddedSvg.$register = {
        "default": '<svg version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" width="25" height="25" x="0px" y="0px"' +
        'viewBox="0 0 20 24" style="enable-background:new 0 0 20 24;" xml:space="preserve">' +
        '<ellipse transform="matrix(0.708 -0.7062 0.7062 0.708 -0.3648 13.3378)"  cx="15.9" cy="7.1" rx="1.1" ry="1.1"/>' +
        '<path  d="M18.5,0H1.5C0.7,0,0,0.7,0,1.5v20.9C0,23.3,0.7,24,1.5,24h16.9c0.8,0,1.5-0.7,1.5-1.5V1.5C20,0.7,19.3,0,18.5,0' +
        'z M5.4,6.7c0-0.8,0.4-1.4,1.2-1.9c0.4-0.2,0.8-0.4,1.3-0.5c0.5-0.1,1-0.2,1.5-0.2h0.3v1.2c-0.2,0-0.3,0.1-0.4,0.1' +
        'C9.1,5.5,9.1,5.6,9.1,5.7c0,0.1,0,0.2,0.1,0.3l0.1,0.3c0.1,0.2,0.1,0.3,0.1,0.5c0,0.5-0.2,0.9-0.6,1.3S7.9,8.7,7.4,8.7' +
        'c-0.6,0-1-0.2-1.4-0.6S5.4,7.3,5.4,6.7z M10.3,19.3c-0.4,0.4-0.9,0.6-1.5,0.6c-0.6,0-1.1-0.2-1.5-0.6c-0.4-0.4-0.6-0.9-0.6-1.5' +
        'c0-0.6,0.2-1.1,0.6-1.5c0.4-0.4,0.9-0.6,1.5-0.6c0.6,0,1.1,0.2,1.5,0.6c0.4,0.4,0.6,0.9,0.6,1.5C10.9,18.3,10.7,18.9,10.3,19.3z' +
        'M14.3,10.2c-0.2,0.5-0.5,1-0.9,1.4c-0.4,0.5-0.9,0.9-1.6,1.2c-0.6,0.3-1.3,0.5-2.1,0.6c-0.3,0-0.6,0.1-0.7,0.2' +
        'C9.1,13.7,9,13.9,9,14.2c0,0.2,0,0.4-0.1,0.5c-0.1,0.1-0.2,0.2-0.4,0.2c-0.4,0-0.6-0.2-0.6-0.7v-3.9c0-0.2,0-0.3,0-0.3' +
        'c0,0,0.1-0.1,0.1-0.1c0.1-0.1,0.3-0.1,0.6-0.1c0.7,0,1.3-0.2,1.8-0.7c0.6-0.5,0.8-1.2,0.8-2c0-0.4-0.1-0.7-0.2-1s-0.3-0.5-0.5-0.7' +
        'V4.1c0.7,0.1,1.3,0.3,1.8,0.6c0.7,0.4,1.3,1,1.7,1.7c0.4,0.7,0.6,1.4,0.6,2.2C14.6,9.1,14.5,9.7,14.3,10.2z"/>' +
        '</svg>'
    }; // Loaded SVGs
    EmbeddedSvg.cacheSvgString = function(url, svg) {
        if (typeof svg == "string") {
            this.$register[url] = svg;
        } else {
            throw "SVG can be cached only as string."
        }
    }
    EmbeddedSvg.$failedEntry = { failed: true };
    EmbeddedSvg.$defaultName = "default"; // Must exist

    EmbeddedSvg.$loadDefaultSVG = function() {
        return EmbeddedSvg.$loadSVG(EmbeddedSvg.$defaultName);
    }
    /**
     * Low level loading. No cloning occurs here because multiple parties may be interested in the same entry.
     * The results MUST be cloned before use (in both cases Operation and Element).
     * 
     * @param url {string} Final url mapped or whatever
     * @returns {Operation | Element | null} 
     */
    EmbeddedSvg.$loadSVG = function(url) {
        if (this.$register.hasOwnProperty(url) && this.$register[url] != null) {
            var x = this.$register[url];
            if (x == EmbeddedSvg.$failedEntry) return EmbeddedSvg.$loadSVG(EmbeddedSvg.$defaultName);
            if (BaseObject.is(x, "Operation")) return x;
            if (x instanceof Node && !(x instanceof Document)) {
                return x;
            }
            if (typeof x == "string") { // Convert it to nodes immediately
                var fr = DOMUtil.fragmentFromHTML(x,true);
                if (fr != null) {
                    var nodes = DOMUtil.filterElements(fr.childNodes,null, Element);
                    if (nodes != null && nodes.length > 0) {
                        this.$register[url] = nodes[0];
                        return nodes[0];
                    } else { // Empty
                        if (url == EmbeddedSvg.$defaultName) throw "The default SVG image cannot be parsed";
                        this.$register[url] = EmbeddedSvg.$failedEntry;
                    }
                } else {
                    // Not parsable, set it to failed to prevent future attempts of any kind
                    if (url == EmbeddedSvg.$defaultName) throw "The default SVG image cannot be parsed";
                    this.$register[url] = EmbeddedSvg.$failedEntry;
                }
            }
            // All other cases are invalid - we should probably clear it
            return EmbeddedSvg.$loadSVG(EmbeddedSvg.$defaultName);
        }
        
        var op = new Operation(); // This one is returned or stored in the register
        var opsave = new Operation(null, EmbeddedSvg.loadTimeOut);
        opsave.onsuccess(function(r) {
            if (r instanceof Node) {
                EmbeddedSvg.$register[url] = r;
                op.CompleteOperation(true, r);
            } else {
                EmbeddedSvg.$register[url] = EmbeddedSvg.$failedEntry;
                op.CompleteOperation(true, EmbeddedSvg.$loadSVG(EmbeddedSvg.$defaultName));
            }
        });
        var xhr = new XMLHttpRequest();
        xhr.open("GET", EmbeddedSvg.mapPath(url));
        xhr.onload = function(progEvent) {
            var xml = null;
            try {
                xml = progEvent.currentTarget.responseXML;
            } catch (err) {
                xml = null; // Loaded something very wrong
            }
            if (xml == null) { // Failed type - set the default
                opsave.CompleteOperation(true, EmbeddedSvg.$loadSVG(EmbeddedSvg.$defaultName));
            } else { // Ok - xml treated as SVG (if it is not we do not care)
                opsave.CompleteOperation(true, xml.documentElement);
            }
        }
        xhr.onloadend = function() {
            if (!opsave.isOperationComplete()) {
                // error, timeout, abort - set default
                opsave.CompleteOperation(true, EmbeddedSvg.$loadSVG(EmbeddedSvg.$defaultName));
            }
            // If completed we have nothing more to do.
        }
        xhr.send();
        this.$register[url] = op;
        return op;
    }

    EmbeddedSvg.prototype.OnUpdate = function(prop, oldv, newv) {
        if (this.__obliterated) return;
        // This should be possible at any time regardless of bindings.
        // However it will cause inconsistencies if width/height and svgpath are bound differently (parameter vs normal binging)
        this.discardAsync("update");
        this.async(this.updateSvg).key("update").execute();

    }
    EmbeddedSvg.prototype.$updateSvg = function(svg) {
        if (svg instanceof Node) {
            DOMUtil.Empty(this.root);
            var clone = svg.cloneNode(true);
            // TODO: We should probably inspect the element a little and make sure it is SVG? Or should it be done earlier
            if (clone instanceof Element) {
                if (this.get_width() != null) clone.setAttribute("width", this.get_width() + "");
                if (this.get_height() != null) clone.setAttribute("height", this.get_height() + "");
            }
            if (this.root instanceof HTMLElement) {
                this.root.appendChild(clone);
            }
        } else if (this.get_usedefault()) {
            this.$updateSvg(EmbeddedSvg.$loadDefaultSVG());
        }
    }
    EmbeddedSvg.prototype.updateSvg = function() {
        if (this.__obliterated) return;
        var r = EmbeddedSvg.$loadSVG(this.mapResourceUrl(this.get_svgpath()));
        if (r != null) {
            if (BaseObject.is(r, "Operation")) {
                r.onsuccess(new Delegate(this, this.$updateSvg));
            } else {
                this.$updateSvg(r);
            }
        } else {
            // Default is a little bit misconfigured at the moment
        }
    }





})();