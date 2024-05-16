(function() {
    var ILookupInputCallback =  Interface("ILookupInputCallback");
    function LookupTest() {
        Base.apply(this,arguments);
    }
    LookupTest.Inherit(Base,"LookupTest")
    .Implement(IUIControl)
    .Implement(ITemplateSourceImpl, new Defaults("templateName"),"autofill")
    .Defaults({
        templateName: "bindkraft/element-lookuptest"
    });
    LookupTest.prototype.init = function() {

    }
    LookupTest.ImplementInterfaceBubble("lookupcallback", ILookupInputCallback,{
        getChoices: function(flt) {
            return ["00","15","30","45"].filter(i => flt == null || flt.length == 0 || i.indexOf(flt) >= 0);
            // return [
            //     { val:"AAA",desc: "Item A"},
            //     { val:"BB",desc: "Item B"},
            //     { val:"CCC",desc: "Item C"}
            // ].filter(o => flt == null || flt == "" || o.val.indexOf(flt) >= 0);
        },
        makeSelection: function(choice) {
            return choice;
        }
    })

})();