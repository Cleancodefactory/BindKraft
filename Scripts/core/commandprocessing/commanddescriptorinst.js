(function() {
    function CommandDescriptorInst() {
        CommandDescriptor.apply(this, arguments);
    }
    CommandDescriptorInst.Inherit(CommandDescriptor,"CommandDescriptorInst")
        .ImplementProperty("instance", new Initialize("Instance over which the action to be executed", null));
    CommandDescriptorInst.prototype.get_action = function() {
        var inst = this.instance;
        var action = this.$action;
        return function(args, api) {
            return action.call(inst, args, api);
        }
    }
})();