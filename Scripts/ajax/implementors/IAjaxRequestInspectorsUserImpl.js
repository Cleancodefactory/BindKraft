(function(){

    var IAjaxRequestInspectorsUser = Interface("IAjaxRequestInspectorsUser");

    function IAjaxRequestInspectorsUserImpl(){}
    IAjaxRequestInspectorsUserImpl.InterfaceImpl(IAjaxRequestInspectorsUser, "IAjaxRequestInspectorsUserImpl");

    IAjaxRequestInspectorsUserImpl.classInitialize = function(cls) {

        cls.prototype.$inspectors = new InitializeArray("All the inspectors");
        cls.prototype.addInspector = function(v) { 
            if (BaseObject.is(v, "IAjaxRequestInspector") && this.$inspectors.indexOf(v) < 0) {
                this.$inspectors.push(v);
            }
        }
        cls.prototype.removeInspector = function(v) { 
            if (BaseObject.is(v, "IAjaxRequestInspector")) {
                var i = this.$inspectors.indexOf(v);
                if (i >= 0) {
                    this.$inspectors.splice(i,1);
                }
            }
        }
        cls.prototype.removeAllInspectors = function() { 
            this.$inspectors.splice(0);
        }

        //#region Using it
        cls.prototype.inspectRequest = function(req) {
            if (BaseObject.is(req, "IAjaxRequest")) {
                var details = {}, d;
                for (var i = 0; i < this.$inspectors.length; i++) {
                    d = this.$inspectors[i].inspectRequest(req);
                    if (d == null) return null;
                    details = BaseObject.CombineObjects(details, d);
                }
                return details;
            }
            return null;
        }
        //#endregion
    }


})();