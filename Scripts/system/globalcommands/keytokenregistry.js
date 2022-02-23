/**
 * This file contains the implementations of commands managing the key/token storage accessible from the LocalAPI as IQueryTokenStorage 
 */

System.CommandLibs.TokenStorage = (function() {
    function _checkObject(obj) { // Check object if it matches the key storage expectations
        if (typeof obj == "object" && obj != null) {
            // Existence of other keys is not expected
            for (var k in obj) {
                if (!obj.hasOwnProperty(k)) continue;
                if (k == "key" || k == "token" || k == "servicename" || k == "timeoutinseconds") continue;
                return false;
            }
            if (typeof obj.key != "string") return false;
            if (obj.key.length == 0) return false;
            if (    (typeof obj.token == "string" && obj.token.length > 0) ||
                    (typeof obj.servicename == "string" && obj.servicename.length > 0)
            ) {
                return true;
            }
        }
        return false;
    }
    function _registerToken(o) {
        var k = o.key;
		var t = o.token;
		var sn = o.servicename;
        
        if (SystemTokenStorage.Default().storage.registerToken(k,t, (sn?sn:null))) {
            return true;
        } else {
            return false;
        }
        
    }
    return function(context, api) {
        var op = new Operation(null, 20000);
		var module = api.pullNextToken();
		var lurl = api.pullNextToken();
		var bo = new BaseObject();
		var actualurl = IPlatformUrlMapper.mapModuleUrl(lurl,module);
		bo.ajaxGetXml(actualurl,null, function(result) {
			if (result.status.issuccessful) {
                var some_err = false;
                if (BaseObject.is(result.data, "Array")) {
                    for (var i = 0; i < result.data.length; i++) {
                        var r = result.data[i];
                        if (_checkObject(r)) {
                            if (!_registerToken(r)) some_err = true;
                        }
                    }
                    if (some_err) {
                        op.CompleteOperation(false, "Could not register all the returned key/token entries.");
                    } else {
                        op.CompleteOperation(true,null);
                    }
                } else {
                    if (_checkObject(result.data)) { // Single entry
                        if (_registerToken(result.data)) {
                            op.CompleteOperation(true,null);
                        } else {
                            op.CompleteOperation(false, "Could not register the single entry received.");
                        }
                    } else { // Multiple entries in sub-object
                        for (var k in result.data) {
                            if (result.data.hasOwnProperty(k)) {
                                if (_checkObject(result.data[k])) {
                                    if (!_registerToken(result.data[k])) some_err = true;
                                }
                            }
                        }
                        if (some_err) {
                            op.CompleteOperation(false, "Could not register all the returned key/token entries.");
                        } else {
                            op.CompleteOperation(true,null);
                        }
                    }
                }
            } else {
				op.CompleteOperation(false, "Request for the auth token failed.");
			}
		});			
		return op;
    }

 })();