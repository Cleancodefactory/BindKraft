(function() {
    function DialogViewBase() {
        GenericViewBaseEx.apply(this, arguments);
    }
    DialogViewBase.Inherit(GenericViewBaseEx, "DialogViewBase")
    .Implement(IDialogViewImpl);

    // override 
    DialogViewBase.prototype.OnOk = function() {
        //TODO Create the data for success.
    }
    DialogViewBase.prototype.onOk = function() {
        var data = this.OnOk();
        this.completeDialog(true, data);
    }
    DialogViewBase.prototype.onCancel = function() {
        this.completeDialog(false, null);
    }
    DialogViewBase.prototype.InitWorkData = function(workData) {

    }
})();