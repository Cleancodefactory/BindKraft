function SubView(){ViewBase.apply(this,arguments);$(this.root).hide();}SubView.Inherit(ViewBase,"SubView");SubView.Implement(IStructuralQueryProcessor);SubView.Implement(IAjaxQueryRequestContent);SubView.Implement(IAjaxContextParameters);SubView.$supportedParamCount=9;SubView.reParam=[];SubView.prototype.viewUrl=null;SubView.prototype.get_viewurl=function(){return this.viewUrl;};SubView.prototype.set_viewurl=function(u){this.viewUrl=u;};SubView.prototype.localTemplate=-1;SubView.prototype.directData=-1;SubView.prototype.viewName="normal";SubView.prototype.clientParams=null;SubView.prototype.get_clientParams=function(){return this.clientParams;};SubView.prototype.set_clientParams=function(u){this.clientParams=u;};function __defineSubViewProp(SV,n){SV.prototype["param"+n]=null;SV.prototype["get_param"+n]=function(){return this["param"+n];};SV.prototype["set_param"+n]=function(v){this["param"+n]=v;};SV.reParam.push(new RegExp("\\{"+n+"\\}","gi"));};for(var _paramX=1;_paramX<=SubView.$supportedParamCount;_paramX++){__defineSubViewProp(SubView,_paramX);}SubView.prototype.changedevent=new InitializeEvent("Fired when the contained view changes its data. The view's data context is both emited through the event and exposed through the viewdata property. proto: handler(sender, datacontext);");SubView.prototype.closedevent=new InitializeEvent("Fired when the sub view closes. Should be used only for visual binding. proto: handler(sender, datacontext);");SubView.prototype.openedevent=new InitializeEvent("Fired when the sub view opens. Should be used only for visual binding. proto: handler(sender, datacontext);");SubView.prototype.currentView=null;SubView.prototype.getRequestContentFlags=function(settings){var flags=STUFFRESULT.ALL;if(this.localTemplate)flags^=STUFFRESULT.VIEWS;if(this.directData)flags^=STUFFRESULT.DATA;return flags;};SubView.prototype.get_viewTemplate=function(){if(this.root!=null){return this.root.jboundViewTemplate;}return null;};SubView.prototype.set_viewTemplate=function(v){this.root.jboundViewTemplate=v;};SubView.prototype.$isopen=false;SubView.prototype.get_isopen=function(){return this.$isopen;};SubView.prototype.$viewdata=null;SubView.prototype.get_viewdata=function(){return this.$viewdata;};SubView.prototype.set_viewdata=function(d){this.$viewdata=d;if(this.currentView!=null){this.currentView.set_data(d);}};SubView.prototype.$init=function(){var el=$(this.root);if(this.get_viewTemplate()==null){this.set_viewTemplate(el.children(":first-child").clone().get(0));}el.empty();this.init();this.initializedevent.invoke(this,null);this.rebind();};SubView.prototype.open=function(e,dc){var directData=this.viewUrl==null||this.viewUrl.length==0||this.directData;if(this.localTemplate&&directData){var tml=this.get_viewTemplate();if(tml!=null){var el=$(this.root);el.empty();this.currentView=ViewBase.materializeIn($(this.root),tml);if(this.currentView!=null){this.currentView.rebind();this.currentView.set_data(dc);}$(this.root).show();this.$isopen=true;this.openedevent.invoke(this,this.$viewdata);}}else{var url=this.viewUrl;if(url!=null&&url.length>0){var p,i;this.clientData=this.clientParams;for(var i=1;i<=SubView.$supportedParamCount;i++){p=this["get_param"+i]();if(p!=null){if(typeof p=="number"){url=url.replace(SubView.reParam[i-1],p);if(!IsNull(this.clientData)){this.clientData=this.clientData.replace(SubView.reParam[i-1],p);}}else{url=url.replace(SubView.reParam[i-1],"'"+p+"'");if(!IsNull(this.clientData)){this.clientData=this.clientData.replace(SubView.reParam[i-1],p);}}}else{url=url.replace(SubView.reParam[i-1],"");if(!IsNull(this.clientData)){this.clientData=this.clientData.replace(SubView.reParam[i-1],"");}}}this.$viewdata=dc;System.showLoadingIndicator(this.root,"horizontal");this.ajaxGetXml(mapPath(url),null,this.$open);}}};SubView.prototype.$open=function(result){var useView=null;if(result.status.issuccessful){if(this.localTemplate){useView=this.get_viewTemplate();}else{if(this.viewName!=null){useView=result.views[this.viewName];}else{for(var v in result.views){if(result.views[v]!=null&&result.views[v].length>0){useView=result.views[v];break;}}}}if(useView!=null){if(this.currentView!=null){this.currentView.onviewcloseevent.invoke(this,this.$viewdata);}var el=$(this.root);el.empty();this.currentView=ViewBase.materializeIn($(this.root),useView);if(this.currentView!=null){this.currentView.rebind();CacheManager.Default.applyToInstance(result,this.currentView);if(this.directData){this.currentView.set_data(this.$viewdata);this.$viewdata=null;}else{this.currentView.set_data(result.data);if(result.metadata!=null)this.currentView.metadata=result.metadata;}if(!IsNull(this.currentView.clientInit)&&!IsNull()){var params=IsNull(this.clientData)?null:this.clientData.split(' ');this.currentView.clientInit.apply(this.currentView,params);}}$(this.root).show();this.$isopen=true;this.openedevent.invoke(this,this.$viewdata);}else{CWorkspace.showError("SubView","","Cannot select/find suitable view for the sub view");}}};SubView.prototype.close=function(e,dc){this.$viewdata=null;if(this.currentView!=null&&this.currentView.get_data!=null){this.$viewdata=this.currentView.get_data();}else{this.$viewdata=null;}if(this.currentView!=null&&!this.currentView.onClose())return false;$(this.root).empty().hide();this.$isopen=false;this.closedevent.invoke(this,this.$viewdata);return true;};SubView.prototype.processStructuralQuery=function(query,processInstructions){if(!IsNull(query)){if(BaseObject.is(query,"ChangeContainerStyleQuery")){if(query.scrollable!=null){if(query.scrollable){$(this.root).css("overflow","auto");}else{$(this.root).css("overflow","visible");}}if(query.scrollbottom){}return true;}else if(BaseObject.is(query,"UpdateCommandBars")){return true;}else if(BaseObject.is(query,"AjaxContextParameterQuery")){if(this.is("IAjaxContextParameters")){var result=this.get_localajaxcontextparameter(query.requestedParameter);if(result!=null||this.isFinalAuthority(query.requestedParameter)){query.result=result;return true;}}}else if(BaseObject.is(query,"RequestViewStateQuery")){return true;}else if(BaseObject.is(query,"CHideForWorkflow")){return true;}else if(BaseObject.is(query,"HostCallQuery")){if(query.command&HostCallCommandEnum.gethost){query.host=this;query.clearCommandFlag(HostCallCommandEnum.gethost);}if(query.command&HostCallCommandEnum.hide){$(this.root).hide();this.$isopen=false;query.clearCommandFlag(HostCallCommandEnum.hide);}if(query.command&HostCallCommandEnum.show){$(this.root).show();this.$isopen=true;query.clearCommandFlag(HostCallCommandEnum.show);}if(query.command&HostCallCommandEnum.datachanged){this.$viewdata=null;if(this.currentView!=null)this.$viewdata=this.currentView.get_data();query.clearCommandFlag(HostCallCommandEnum.datachanged);this.changedevent.invoke(this,this.$viewdata);}if(query.command&HostCallCommandEnum.close){this.close();query.clearCommandFlag(HostCallCommandEnum.close);}return query.isComplete();}}return false;};SubView.prototype.get_localajaxcontextparameter=function(param){var md=this.$localajaxcontextparameter;if(md!=null){switch(param){case AjaxContextParameterFlags.RoleId:if(md.roleid!=null)return md.roleid;break;case AjaxContextParameterFlags.OnBehalfUserId:if(md.onbehalfuserid!=null)return md.onbehalfuserid;break;}}return null;};SubView.prototype.get_ajaxcontextparameter=function(param){var result=this.get_localajaxcontextparameter(param);if(result!=null||this.isFinalAuthority(param))return result;var query=new AjaxContextParameterQuery(param);if(this.throwStructuralQuery(query)){return query.result;}return null;};SubView.prototype.set_localajaxcontextparameter=function(param,v){if(this.$localajaxcontextparameter==null)this.$localajaxcontextparameter={};var md=this.$localajaxcontextparameter;if(md!=null){switch(param){case AjaxContextParameterFlags.RoleId:md.roleid=v;break;case AjaxContextParameterFlags.OnBehalfUserId:md.onbehalfuserid=v;break;}}};SubView.prototype.$isFinalAuthority=false;SubView.prototype.isFinalAuthority=function(param){return this.$isFinalAuthority;};