(function() {
    var DialogViewBase = Class("DialogViewBase");
    function ConfirmDialog() {
        DialogViewBase.apply(this, arguments);
    }
    ConfirmDialog.Inherit(DialogViewBase, "ConfirmDialog");    

    ConfirmDialog.prototype.onOk = function() {
        this.completeDialog(true, true);
    }
    ConfirmDialog.prototype.onCancel = function() {
        this.completeDialog(false, null);
    }
    ConfirmDialog.prototype.InitWorkData = function(workData) {
        if (typeof workData == "string") {
            this.set_data(workData);
        }
    }
})();