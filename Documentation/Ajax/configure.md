# Configure pipeline

There are BKInit classes for use in `init.js` files, that configure pipeline(s). Most often only the main pipeline is configured, but it is possible to configure custom ones for use only in specific app(s).

## Configuring main pipeline

This is an example and incomplete configuration, we use the argument names from it further in the document:

```Javascript

BkInit.AjaxPipeline(function(pipeline){
    pipeline
        .useDefaultSendQueue()
        .useProgressQueue()
        .AddCarrier(function(carrier) {
            carrier
				.name("server.com")
                .addPickRule(function(picker) {
                    picker
                        .criticalLimit(10)
                        .criticalAge(1000)
                        .pickLimit(5)
                        .rule("AjaxRequestInspectorUrl", function(inspector) { 
                            inspector.set_server("*server.com");
                        });
                })
                .poolSender(2);        
        })
        .AddCarrier(function(carrier){
            carrier
                .name("canceller")
                .addPickRule(function(picker) {
                    picker
                        .criticalLimit(10)
                        .criticalAge(1000)
                        .pickLimit(5)
                        .rule("AjaxRequestInspectorUrl", function(inspector) { 
                            inspector.set_server("*");
                        });
                })
                .cancelRequest();
        })
        
});

```

### pipeline settings

`.useDefaultSendQueue()` - Uses the main send queue. It is recommended to use it in the main pipeline only. See below how to create additional queues when creating custom pipelines.

_Note that it is possible to have multiple pipelines using hte same send queue, but such a scenario is very hard to configure in any predicable fashion and it is not recommended._