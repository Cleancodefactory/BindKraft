(function() {
    function ConfirmDialog() {
        GenericViewBaseEx.apply(this, arguments);
    }
    ConfirmDialog.Inherit(GenericViewBaseEx, "ConfirmDialog")
    .Implement(IDialogViewImpl);

    ConfirmDialog.prototype.onOk = function() {
        this.completeDialog(true, { confirm: true});
    }
    ConfirmDialog.prototype.onCancel = function() {
        this.completeDialog(false, { confirm: false});
    }
    ConfirmDialog.prototype.InitWorkData = function(workData) {

    }
})();