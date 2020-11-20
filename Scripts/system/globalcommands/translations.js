

System.CommandLibs.LoadTranslation = (function() {
    var LocalizationManagement = Class("LocalizationManagement");

    return function(context, api) {
        var op = new Operation(null, 20000);
        var arg = api.pullNextToken();
        var arr = arg.split("/");
        var url = api.pullNextToken();
        var appClass, locale;
        if (arr.length == 2) {
            appClass = arr[0];
            locale = arr[1];
        } else if (arr.length == 1) {
            appClass = arr[0];
            locale = System.Default().settings.CurrentLang;
        } else {
            op.CompleteOperation(false, "usage: loadtranslation <appClass>/<locale> <modulename>:<nodeset>[/<node1>.<node2>...] {appclass or locale is incorrect}");
        }
        // Check locale and appclass
        if (!/^\w{2}(-.*)?$/.test(locale)) {
            op.CompleteOperation(false, "usage: loadtranslation <appClass>/<locale> <modulename>:<nodeset>[/<node1>.<node2>...] {locale is incorrect}");
            return op;
        }
        if (Class.getClassName(appClass) == null) {
            op.CompleteOperation(false, "usage: loadtranslation <appClass>/<locale> <modulename>:<nodeset>[/<node1>.<node2>...] {appClass is not defined}");
            return op;
        }
        url = url.replace(/%locale%/,locale)
        var mng = new LocalizationManagement(appClass);

		var actualurl = IPlatformUrlMapper.mapModuleUrl(url.slice(url.indexOf(":") + 1),url.slice(0,url.indexOf(":")));
        var bo = new BaseObject();
        bo.ajaxGetXml(actualurl,null, function(result) {
			if (result.status.issuccessful) {
                if (BaseObject.is(result.data, "object")) {
                    mng.setTranslation(locale, result.data);
                    op.CompleteOperation(true,null);
                    return;
                }
            } else {
                BaseObject.LASTERROR("loadtranslation received error response:" + result.status.message)    
            }
    		op.CompleteOperation(false, "Request for a translation failed or returned unexpected data (object was expected).");

		});
        return op;
    }
})();
System.CommandLibs.LoadTranslations =(function() {
    var LocalizationManagement = Class("LocalizationManagement");

    return function(context, api) {
        var op = new Operation(null, 20000);
        var appClass = api.pullNextToken();
        var url = api.pullNextToken();
        
        if (Class.getClassName(appClass) == null) {
            op.CompleteOperation(false, "usage: loadtranslations <appClass> <modulename>:<nodeset>[/<node1>.<node2>...] {appClass is not defined}");
            return op;
        }

        var mng = new LocalizationManagement(appClass);

		var actualurl = IPlatformUrlMapper.mapModuleUrl(url.slice(url.indexOf(":") + 1),url.slice(0,url.indexOf(":")));
        var bo = new BaseObject();
        bo.ajaxGetXml(actualurl,null, function(result) {
			if (result.status.issuccessful) {
                if (BaseObject.is(result.data, "object")) {
                    for (var k in result.data) {
                        if (result.data.hasOwnProperty(k)) {
                            if (/^\w{2}(-.*)?$/.test(k)) {
                                mng.setTranslation(k, result.data[k]);            
                            }
                        }
                    }
                    op.CompleteOperation(true,null);
                    return;
                } 
            } else {
                BaseObject.LASTERROR("loadtranslations received error response:" + result.status.message)    
            }
    		op.CompleteOperation(false, "Request for a translation failed or returned unexpected data (object with sub-objects named after locale codes was expected).");

		});
        return op;
    }
})();