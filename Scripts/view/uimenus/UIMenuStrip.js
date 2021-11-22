(function(){

    var UIMenuItem = Class("UIMenuItem");

    function UIMenuStrip() {
        UIMenuItem.apply(this, arguments);
    }
    UIMenuStrip.Inherit(UIMenuItem, "UIMenuStrip")
        .ImplementProperty("items", new InitializeArray(""));
    
    //#region Items management
    UIMenuStrip.prototype.get_count = function() { return this.$items.length; };
    UIMenuStrip.prototype.append = function(/* ...UIMenuItems */) {
        for (var i = 0; i < arguments.length; i++) {
            var mi = arguments[i];
            if (BaseObject.is(mi , UIMenuItem)) {
                this.$items.push(mi);
            } else {
                this.LASTERROR("An argument is not a UIMenuItem", "append");
            }
        }
        return this;
    }
  
    UIMenuStrip.prototype.insert = function(index_or_item /* ...UIMenuItems */) {
        var pos = null;
        if (typeof index_or_item == "number") {
            if (index_or_item >= 0 && index_or_item < this.$items.length) {
                pos = Math.floor(index_or_item);
            }
        } else if (BaseObject.is(index_or_item, UIMenuItem)) {
            pos = this.$items.indexOf(index_or_item);
            if (pos < 0) pos = null;
        }
        if (pos == null) { 
            this.LASTERROR("Index out of range or anchor item not found", "insert");
            return this;
        }
        var args = Array.createCopyOf(arguments,2).Select(function(idx, itm) {
            return (BaseObject.is(itm, UIMenuItem)?itm:null);
        });
        this.$items.splice.apply(this.$items, [pos,0].concat(args));
        return this;
    }
    UIMenuStrip.prototype.remove = function(index_or_item /* ...UIMenuItem */) {
        var pos;
        if (typeof index_or_item == "number") {
            if (index_or_item >= 0 && index_or_item < this.$items.length) {
                pos = Math.floor(index_or_item);
                this.$items.splice(pos,1);
                return this;
            } else {
                this.LASTERROR("Numeric index out of range", "remove");
            }
        } else {
            for (var i = 0; i < arguments.length; i++) {
                pos = this.$items.indexOf(arguments[i]);
                if (pos >= 0) this.$items.splice(pos, 1);
            }
        }
        return this;
    }
    //#endregion



})();