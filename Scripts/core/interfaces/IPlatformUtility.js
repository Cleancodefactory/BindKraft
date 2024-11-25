function IPlatformUtility(){}IPlatformUtility.Interface("IPlatformUtility");IPlatformUtility.prototype.$platformModuleServer=null;IPlatformUtility.prototype.$platformModuleName=null;IPlatformUtility.prototype.moduleUrl=function(readWrite,pack,nodePath){throw"Not implemented.";};IPlatformUtility.prototype.resourceUrl=function(restype,path){throw"Not implemented.";};IPlatformUtility.moduleUrl=function(moduleName,readWrite,pack,nodePath){throw"Not implemented. A IPlatformUtility.moduleUrl must be implemented and loaded in the PlatformUtility module to supply URL construction logic for your specific setup.";}.Description("The default URL constructor - constructs an URL to an entry point as string");IPlatformUtility.resourceUrl=function(moduleName,readWrite,restype,resPath){throw"Not implemented. A IPlatformUtility.resourceUrl must be implemented and loaded in the PlatformUtility module to supply URL construction logic for your specific setup.";}.Description("The default resource URL constructor - constructs an URL to a resource as string");IPlatformUtility.servers={};IPlatformUtility.resourceservers={};IPlatformUtility.standardModuleUrlParse=function(url,module,server){var re=/^(?:(post|get)\:)?(?:(read|write)\/)?([a-z0-9_\-]+)(?:\/([a-z0-9_\-\.]+))?(?=$|\?.*$)/i;var m=re.exec(url);if(m!=null){var r={action:m[2]=="write"?"write":"read",method:m[1]=="post"?"post":"get",pack:m[3],nodepath:m[4]==null||m[4].length==0?null:m[4],server:server?server:null,module:module?module:null,start:m.index,length:m[0].length,mappedRaw:null,mapped:null};if(module!=null&&module.length>0){r.mappedRaw=IPlatformUtility.standardModuleUrlMap(url,r,false);r.mapped=IPlatformUtility.standardModuleUrlMap(url,r,true);}return r;}else{return null;}};IPlatformUtility.standardModuleUrlMap=function(url,parsedURL,bWithMethod){var murlproc=parsedURL.server!=null?IPlatformUtility.servers[parsedURL.server]:IPlatformUtility.moduleUrl;var mpart=murlproc(parsedURL.module,parsedURL.action,parsedURL.pack,parsedURL.nodepath);if(mpart==null)BaseObject.LASTERROR("Failed to map a node logical URL. url="+url,"IPlatformUtility.standardModuleUrlMap");var result=mpart+url.slice(parsedURL.length);if(bWithMethod&&parsedURL.method!="get"){return parsedURL.method+":"+result;}return result;};IPlatformUtility.standardResourceUrlParse=function(url,module,server){var re=/^(?:(post|get)\:)?(?:(read|write)\/)?([a-z0-9_\$\-]+)(?:\/([a-z0-9\$_\-\.\/]+))(?=$|\?.*$)/i;var m=re.exec(url);if(m!=null){var r={action:m[2]=="write"?"write":"read",method:m[1]=="post"?"post":"get",restype:m[3],respath:m[4]==null||m[4].length==0?null:m[4],server:server?server:null,module:module?module:null,start:m.index,length:m[0].length,mappedRaw:null,mapped:null};if(module!=null&&module.length>0){r.mappedRaw=IPlatformUtility.standardResourceUrlMap(url,r,false);r.mapped=IPlatformUtility.standardResourceUrlMap(url,r,true);}return r;}else{return null;}};IPlatformUtility.standardResourceUrlMap=function(url,parsedURL,bWithMethod){var murlproc=parsedURL.server!=null?IPlatformUtility.resourceservers[parsedURL.server]:IPlatformUtility.resourceUrl;var mpart=murlproc(parsedURL.module,parsedURL.action,parsedURL.restype,parsedURL.respath);if(mpart==null)BaseObject.LASTERROR("Failed to map a resource logical URL. url="+url,"IPlatformUtility.standardResourceUrlMap");var result=mpart+url.slice(parsedURL.length);if(bWithMethod&&parsedURL.method!="get"){return parsedURL.method+":"+result;}return result;};