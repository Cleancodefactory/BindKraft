
(function() {

    var IUIAppMenuHost = Interface("IUIAppMenuHost"),
        IUIMenuHost = Interface("IUIMenuHost"),
        UIMenuSlotBase = Class("UIMenuSlotBase");

    function UIAppMenuSlot() {
        UIMenuSlotBase.apply(this,arguments);
    }
    UIAppMenuSlot.Inherit(UIMenuSlotBase, "UIAppMenuSlot")
        .Implement(ITemplateSourceImpl, new Defaults("templateName"))
        .Implement(IUIAppMenuHost)
        .Defaults({
            templateName: new StringConnector('<div data-class="%%%"></div>')
        });

    UIAppMenuSlot.prototype.init = function() {

    }

    //#region IUIMenuSlot

    UIAppMenuSlot.prototype.addMenu = function(m) { 
        if (BaseObject.is(m, "UIMenuItem")) {
            var existing = this.$findMenu(m);
            if (existing >= 0) { return true; }
            if (!m.mixAttachedInfo(IUIAppMenuHost, {cookie: this.genCookie()})) {
                this.LASTERROR("Failed to attach cookie", "addMenu");
            }
            this.$menus.push(m);
            this.$refresh();
            return true;
        }
        return false;
    }
    UIAppMenuSlot.prototype.removeMenu = function(cookie) { 
        var existing = this.$findMenu(cookie);
        if (existing >= 0) { 
            var mi = this.$menus.splice(existing, 1);
            if (BaseObject.is(mi, "UIMenuItem")) {
                if (!mi.mixAttachedInfo(IUIAppMenuHost, {cookie: null})) {
                    this.LASTERROR("Failed to remove cookie", "removeMenu");
                }
            }
            this.$refresh();
        }
    }

    //#endregion

    //#region Manage menu data
    UIAppMenuSlot.ImplementProperty("menus", new InitializeArray("All the added menus"));
    UIAppMenuSlot.prototype.$findMenu = function(cookie_or_mi) {
        var cookie = null;
        var info, mitem;
        if (BaseObject.is(cookie_or_mi, "UIMenuItem")) {
            info = cookie_or_mi.getAttachedInfo(IUIAppMenuHost);
            if (info != null) cookie = info.cookie;
        } else {
            cookie = cookie_or_mi;
        }
        if (cookie == null) return -1;
        for (var i = 0; i < this.$menus.length; i++) {
            mitem = this.$menus[i];
            if (BaseObject.is(mitem, "UIMenuItem")) {
                info = mitem.getAttachedInfo(IUIAppMenuHost);
                if (info != null && info.cookie == cookie) return i;
            }
        }
        return -1;
    }
    //#endregion

    //#region UI
    UIAppMenuSlot.prototype.$refresh = function() { 
        this.$regenMenu(); //?
    }
    
    UIAppMenuSlot.prototype.$regenMenu = function() {
        this.$().Empty();
        var appslottemplate = this.get_template();
        if (appslottemplate == null) {
            this.LASTERROR("Cannot regenerate menu, because there is not template", "$regenMenu");
            return;
        }
        // TODO The first item ?!?
        for (var i = 0; i < this.$menus.length; i++) {
            var nv = this.$menus[i];
            if (BaseObject.is(nv, "UIMenuItem")) {
                var tml,item;
                if (nv.is("UIMenuStrip")) {
                    tml = appslottemplate.replace("%%%", this.getOpinion(IUIAppMenuHost, nv, "UIMenuStripComponent"));
                    Materialize.cloneTemplate(this.root, tml, nv);
                } else {
                    tml = appslottemplate.replace("%%%", this.getOpinion(IUIAppMenuHost, nv, "UIMenuComponent"));
                    Materialize.cloneTemplate(this.root, tml, nv);
                }
            }
        }
        this.rebind();
        this.updateTargets();
    };
    //#endregion

})();