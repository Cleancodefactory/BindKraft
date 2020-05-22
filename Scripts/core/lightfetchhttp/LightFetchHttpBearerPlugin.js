function LightFetchHttpBearerPlugin(/*IQueryTokenStorage*/ tokenStorage) {
    LightFetchHttpPluginBase.apply(this,arguments);
    this.$storage = tokenStorage;
}
LightFetchHttpBearerPlugin.Inherit(LightFetchHttpPluginBase, "LightFetchHttpBearerPlugin");
LightFetchHttpBearerPlugin.prototype.$storage = null;

// Override this in inheriting classes
LightFetchHttpBearerPlugin.prototype.manipulateRequest = function(fetcher, xhr) {
    if (BaseObject.is(this.$storage,"IQueryTokenStorage")) {
        var bkurl = fetcher.get_url();
        var token = this.$storage.getToken(bkurl.toString());
        if (token != null) {
            xhr.setRequestHeader("Authorization", "Bearer " + token);
        }
    }
}