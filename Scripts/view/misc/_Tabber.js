


/////////////////------------------------------------------------TabberHelper ---------------------------------
function TabberHelper() {
    Panel.apply(this, arguments);
}

TabberHelper.Inherit(Panel, "TabberHelper");

TabberHelper.$rootParameters = ["buttons", "pages", "initial", "mode", "selectedcssclass"];
TabberHelper.prototype.setObjectParameter = function (name, value) {
    if (name.inSet(TabberHelper.$rootParameters)) {
        BaseObject.setProperty(this, name, value);
    } else {
        this.$parameters[name] = value;
    }
};
TabberHelper.prototype.buttons = new InitializeStringParameter("Default keys for tab head", "./tab_button*");
TabberHelper.prototype.selectedcssclass = new InitializeStringParameter("Set different CSS class fot the selected tab", "c_active");
TabberHelper.prototype.pages = new InitializeStringParameter("Default keys for tab body", "./tab_page*");
TabberHelper.prototype.selected = new InitializeStringParameter("Selected tab", "");
TabberHelper.ImplementProperty("initial", new InitializeNumericParameter("The default opened tab = 0,1,2,3...... , default 0 ", 0));
TabberHelper.prototype.mode = new InitializeStringParameter("Changes the mode of the Tabber between 'manual attaching clicks' and 'automatic attachment of clicks', default manual", ""); // data-on-click="{bind source=tabber path=ChangeTab parameter='tab_b3'}"
TabberHelper.prototype.init = function () {
    if (this.mode == "auto") {
        this.on(this.buttons, "click", this.ChangeTab);
        this.on(this.buttons, "keydown", this.ChangeTabKey);
    }
    this.SelectTab(this.$initial);
};
TabberHelper.prototype.OnDataContextChanged = function () {
    
};
TabberHelper.prototype.ChangeTab = function (event, dc, binding, bindingParam) {
    var $tab_heads = this.getRelatedElements(this.buttons);
    //var $tab_bodys = this.getRelatedElements(this.pages);
    //if (!IsNull(binding)) {
    //    var tar = binding.get_target();
    //    $tab_heads.removeClass("c_active_tab");
    //    $(tar).addClass("c_active_tab");
    //    $tab_bodys.hide();
    //    this.child(bindingParam).show();
    //} else {
    //var current;
    for (var i = 0; i < $tab_heads.length; i++) {
        if ($tab_heads[i] == event.target) { break; } //current = i;
    }
    this.SelectTab(i);
    //}
};
// data-on-click="{bind source=<tabber> path=ChangeTabIndex parameter='<indexprop>'}
TabberHelper.prototype.ChangeTabIndex = function (event, dc, binding, bindingParam) {
    if (dc != null) {
        this.SelectTab(dc[bindingParam]);
    }
};
// todo: Tochka i zapetaika

TabberHelper.prototype.ChangeTabKey = function (event, dc, binding, bindingParam) {              //40-down 38-up 39-right 37-left
    var $tab_heads = this.getRelatedElements(this.buttons);
    var $tab_bodys = this.getRelatedElements(this.pages);
    if (!IsNull(event.originalEvent)) {
        if (event.originalEvent.which == 39 || event.originalEvent.which == 38) {
            for (var i = 0; i < $tab_heads.length; i++) {
                if ($($tab_heads[i]).hasClass(this.selectedcssclass)) {
                    if (i < $tab_heads.length - 1) {
                        i++;
                        this.SelectTab(i);
                        break;
                    }
                }
            }
        } else if (event.originalEvent.which == 37 || event.originalEvent.which == 40) {
            for (var i = $tab_heads.length - 1; i >= 0; i--) {
                if ($($tab_heads[i]).hasClass(this.selectedcssclass)) {
                    if (i > 0) {
                        i--;
                        this.SelectTab(i);
                        break;
                    }
                }
            }
        }
    }
};
TabberHelper.prototype.SelectTab = function (i) {
    var $tab_heads = this.getRelatedElements(this.buttons);
    var $tab_bodys = this.getRelatedElements(this.pages);
    $tab_heads.removeClass(this.selectedcssclass);
    $($tab_heads[i]).addClass(this.selectedcssclass);
    $($tab_heads[i]).focus();
    $tab_bodys.hide();
    $($tab_bodys[i]).show();
    this.selected = $($tab_bodys[i]).attr('data-key');
};