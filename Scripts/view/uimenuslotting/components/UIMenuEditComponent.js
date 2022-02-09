(function () {

    var UIMenuComponentBase = Class("UIMenuComponentBase");
    function UIMenuEditComponent() {
        UIMenuComponentBase.apply(this, arguments);
    }

    UIMenuEditComponent.Inherit(UIMenuComponentBase, "UIMenuEditComponent")
        .Implement(IUIControl)
        .Implement(ITemplateSourceImpl, new Defaults("templateName"))
        .CompatibleTypes("IUIMenuEditProcessor")
        .Defaults({
            templateName: "bkdevmodule1/menu-itemeditbase"
        });

    UIMenuEditComponent.prototype.init = function () {
        ITemplateSourceImpl.InstantiateTemplate(this);
    }

    UIMenuEditComponent.prototype.on_input = function(event, value) {
        var item = this.get_data(); // Teh menu item is set as data context directly over the component.
        if (item != null) { // !!!
            if (BaseObject.is(item.get_processor(), "IUIMenuEditProcessor")) {
                var oe = event.originalEvent?event.originalEvent:event;
                var old = oe.target.value;
                item.set_data("text",oe.target.value);
                if (item.get_processor().change(item, oe.target.value) === false) {
                    oe.target.value = old;
                    item.set_data("text",old);
                };
            } else {
                item.get_data().text = oe.target.value;// no changed event caused
            }
        }        
    }
    UIMenuEditComponent.prototype.on_keyUp = function(event, value) {
        var item = this.get_data(); // Teh menu item is set as data context directly over the component.
        if (item != null) { // !!!
            if (BaseObject.is(item.get_processor(), "IUIMenuEditProcessor")) {
                var oe = event.originalEvent?event.originalEvent:event;
                var keydata = this.packKeyboardEventData(event);
                var selection = this.packInputSelectionData(oe.target);
                // TODO: returns?
                item.get_processor().keyinput(item, keydata, oe.target.value, selection);
            }
        }
    }
    UIMenuEditComponent.prototype.on_keyDown = function(event, value) {
        var item = this.get_data(); // Teh menu item is set as data context directly over the component.
        if (item != null) { // !!!
            if (BaseObject.is(item.get_processor(), "IUIMenuEditProcessor")) {
                var oe = event.originalEvent?event.originalEvent:event;
                var keydata = this.packKeyboardEventData(event);
                if (keydata.key == "Enter") {
                    item.get_data().text = oe.target.value;
                    if (item.get_processor().submit(item, oe.target.value) !== false) {
                        item.fireChanged();
                    };
                }
            }
        }        
    }
})();