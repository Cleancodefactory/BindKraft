(function () {

    function UIMenuEditComponent() {
        Base.apply(this, arguments);
    }

    UIMenuEditComponent.Inherit(Base, "UIMenuEditComponent")
        .Implement(IUIControl)
        .Implement(ITemplateSourceImpl, new Defaults("templateName"))
        .Defaults({
            templateName: "bkdevmodule1/menu-itemeditbase"
        });

    UIMenuEditComponent.prototype.init = function () {
        ITemplateSourceImpl.InstantiateTemplate(this);
    }

    UIMenuEditComponent.prototype.on_keyUp = function(event, value) {
        var item = this.get_dataContext();   
        if (item != null) { // !!!

            var keyCode = event.originalEvent.key;
            var content = event.originalEvent.target.value;
            var position = event.originalEvent.code;

            if (BaseObject.is(item.get_processor(), "IUIMenuEditProcessor")) {
                item.get_processor().keyinput(this, item, keyCode, content, position);
            } else if (BaseObject.is(item.get_processor(), "Delegate")) {
                item.get_processor().invoke(this, item);
            }
        }
    }
})();