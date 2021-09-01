// Please do not include this in any dep files. This file is only example ajax pipeline configuration

BkInit.AjaxPipeline(function(pipeline){
    pipeline
        .createPipeline()
        .useDefaultSendQueue()
        .useProgressQueue()
        .AddCarrier(function(carrier) {
            carrier
                .addPickRule(function(picker) {
                    picker
                        .name("server.com")
                        .criticalLimit(10)
                        .criticalAge(1000)
                        .pickLimit(1)
                        .rule("AjaxRequestInspectorUrl", function(inspector) { 
                            inspector.set_server("*.server.com");
                        });
                })
                .poolSender(2);        
        })
        
});