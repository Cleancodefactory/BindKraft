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
        //How to compare urls?
        //TODO For now we compare without query strings and fragments
        var token = this.$storage.getToken(bkurl.composeAsString(true));
        if (token != null) {
            xhr.setRequestHeader("Authorization", "Bearer " + token);
        }
    }
}