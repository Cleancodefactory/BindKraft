function DetachedAjaxContext(){BaseObject.apply(this,arguments);this.contentFlags=STUFFRESULT.ALL;if(arguments.length>0){for(var i=0;i<arguments.length;i++){var a=arguments[i];if(a!=null&&!BaseObject.is(a,"BaseObject")&&typeof a=="object"){for(var k in a){if(AjaxContextParameterFlags[k]!=null){this.set_localajaxcontextparameter(AjaxContextParameterFlags[k],a[k]);}else{jbTrace.log("DetachedAjaxContext: Unrecognized ajax context parameter "+k);throw"DetachedAjaxContext: Unrecognized ajax context parameter "+k;}}}else if(a!=null&&typeof a=="number"){this.contentFlags=a;}else if(BaseObject.is(a,"BaseObject")){this.$queryparent=a;}}}};DetachedAjaxContext.Inherit(BaseObject,"DetachedAjaxContext");DetachedAjaxContext.$getQueryParentProc=function(){if(BaseObject.is(this,"DetachedAjaxContext"))return this.rules_query();return null;};DetachedAjaxContext.Implement(IAjaxContextParameters);DetachedAjaxContext.Implement(IAjaxQueryRequestContent);DetachedAjaxContext.Implement(IStructuralQueryEmiterImpl,"AjaxContext",DetachedAjaxContext.$getQueryParentProc);DetachedAjaxContext.Implement(IStructuralQueryRouterImpl,"AjaxContext",DetachedAjaxContext.$getQueryParentProc);DetachedAjaxContext.Create=function(a1,a2,a3){return new DetachedAjaxContext(a1,a2,a3);};DetachedAjaxContext.prototype.contentFlags=null;DetachedAjaxContext.prototype.$queryparent=null;DetachedAjaxContext.prototype.rules_query=function(){return this.$queryparent;};DetachedAjaxContext.prototype.getRequestContentFlags=function(settings){return this.contentFlags;};DetachedAjaxContext.prototype.get_ajaxcontextparameter=function(param){return this.get_localajaxcontextparameter(param);}.Description("Returns the parameter in the context.");DetachedAjaxContext.prototype.get_localajaxcontextparameter=function(param){if(this.$ajaxcontextparameter!=null&&this.$ajaxcontextparameter[""+param]!=null)return this.$ajaxcontextparameter[""+param];return null;}.Description("Implements only local query for ajax context parameters");DetachedAjaxContext.prototype.isFinalAuthority=function(paramKey){return true;}.Description("This context wrapper is always self-closed and is a final authority.");DetachedAjaxContext.prototype.set_localajaxcontextparameter=function(param,v){if(this.$ajaxcontextparameter==null)this.$ajaxcontextparameter={};this.$ajaxcontextparameter[""+param]=v;}.Description("Sets context parameters over this object.");