(function(){
    /*
        This file initializes late singletons defined around the framework.
        While these singletons can be initialized on demand, we need to register them as LocalAPI
        and this is better done in the beginning.
        The dependence on other features and standard configurations requires us to bring them
        here - where the dependencies are already Ok.
        Most singletons will move here gradually to bring some order into the singleton initialization (even if it is absolutely necessary)
    */

        // Urlactions2 - run commands on startup from URL.
        var UrlActionsService2 = Class("UrlActionsService2");
        UrlActionsService2.Default();
    

})();