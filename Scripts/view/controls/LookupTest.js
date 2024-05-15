(function() {

    function LookupTest() {
        Base.apply(this,arguments);
    }
    LookupTest.Inherit(Base,"LookupTest")
    .Implement(ITemplateSourceImpl, new Defaults("templateName"),"autofill")
    .Defaults({
        templateName: "bindkraft/element-lookuptest.html"
    });

    LookupTest.ImplementInterfaceBubble("lookupcallback", ILookupInputCallback,{
        getChoices: function(flt) {
            return [
                "AAA",
                "BBB"
            ]
        },
        makeSelection: function(choice) {
            return choice;
        }
    })

})();