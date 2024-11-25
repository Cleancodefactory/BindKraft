function IInfoDisplayWindowImpl(){}IInfoDisplayWindowImpl.InterfaceImpl(IInfoDisplay,"IInfoDisplayWindowImpl");IInfoDisplayWindowImpl.RequiredTypes("BaseWindow","IStructuralQueryProcessor,IStructuralQueryEmiter");IInfoDisplayWindowImpl.defaultInfoDisplayTemplate="bindkraft/defaultinfodisplaytemplate";IInfoDisplayWindowImpl.ImplementProperty("infodisplayautoclear",new InitializeNumericParameter("0 do not clear, > 0 seconds to clear after the last message",0));IInfoDisplayWindowImpl.ImplementProperty("infodisplayelement",new InitializeStringParameter("data-key of an element in the window caption area that implements the infodisplay. The element must have data class implementing IInfoDisplayPanel.",null));IInfoDisplayWindowImpl.classInitialize=function(cls,useTemplate,options){if(BaseObject.is(useTemplate,"string")&&useTemplate.length>0){cls.prototype.$defaultInfoDisplayTemplate=useTemplate;}function _gettemplate(name_or_connector){var tmlName=name_or_connector;var tml;if(BaseObject.is(tmlName,"Connector")){if(!tmlName.isAsync)return tmlName.createNewConnector().bind();return null;}else if(typeof tmlName=="string"){if(BaseObject.getProperty(options,"legacy",false)){tml=DOMUtil.queryOne(tmlName);if(tml!=null)tml=tml.innerHTML;if(tml!=null&&tml.length>0){return tml;}tml=null;}var tn=ITemplateSourceImpl.ParseTemplateName(tmlName);tml=ITemplateSourceImpl.GetGlobalTemplate(tn,options);if(tml!=null)return tml;}return null;}function _template(_this){var tmlname=BaseObject.getProperty(_this,"createParameters.data.infoDisplayTemplate",BaseObject.getProperty(_this,"$defaultInfoDisplayTemplate",IInfoDisplayWindowImpl.defaultInfoDisplayTemplate));return _gettemplate(tmlname);}cls.prototype.$infoDisplayView=null;cls.prototype.$infoDisplayCreate=function(){var idisp=_template(this);var cc=this.get_clientcontainer();if(cc!=null&&BaseObject.isDOM(cc)){this.$infoDisplayView=ViewBase.materialize($(cc),idisp,"prepend");if(this.$infoDisplayView!=null)this.$infoDisplayView.rebind();if(BaseObject.is(this.$infoDisplayView,"IInfoDisplayPanel")){this.$infoDisplayView.set_infodisplayautoclear(this.get_infodisplayautoclear());this.$infoDisplayView.dataexhaustedevent.add(new Delegate(this,function(){this.$infoDisplayDestroy();}));}}return this.$infoDisplayView;};cls.prototype.$get_infoDisplay=function(bDoNotCreate){var idisp=this.$infoDisplayView;if(idisp!=null&&idisp.isLive())return idisp;if(bDoNotCreate){return null;}else{if(this.get_infodisplayelement()!=null){idisp=this.childObject(this.get_displayelement());if(BaseObject.is(idisp,"Base")){this.$infoDisplayView=idisp;return idisp;}return null;}return this.$infoDisplayCreate();}};cls.prototype.$infoDisplayDestroy=function(){var idisp=this.$infoDisplayView;if(idisp!=null){if(idisp.root!=null)DOMUtil.Remove(idisp.root);}this.$infoDisplayView=null;};cls.prototype.$infoDisplayUpdate=function(){this.updateTargets();};cls.prototype.infoDisplayAdd=function(info){var idisp=this.$get_infoDisplay();if(idisp!=null){if(BaseObject.is(idisp,"IInfoDisplayPanel")){idisp.addEntry(info);}}};cls.prototype.infoDisplayClear=function(messageTypes){var idisp=this.$get_infoDisplay(true);if(idisp!=null){if(messageTypes!=null&&typeof messageTypes=="string"&&messageTypes.length>0){var dc=idisp.get_data();if(dc!=null&&BaseObject.is(dc,"Array")){var msgTypes=messageTypes.split(",");dc=dc.Select(function(idx,item){if(msgTypes!=null&&msgTypes.length>0){if(item.messageType!=null&&item.messageType.inSet(msgTypes))return null;}return item;});idisp.set_data(dc);}}else{this.$infoDisplayDestroy();}}};cls.prototype.get_isinfodisplayactive=function(){if(!this.$isinfodisplayactive)return false;if(this.isWindowVisible())return true;return false;};cls.prototype.set_isinfodisplayactive=function(v){this.$isinfodisplayactive=v;};cls.$infomessageDisplayFromQuery=function(query){};cls.onStructuralQuery("InfoMessageQuery",function(query,procInstructions){var maxp=this.get_maxinfomessagepriority();var thisp=query.priority!=null?query.priority:0;if(thisp>maxp)return false;if(this.get_isinfodisplayactive()){this.infoDisplayAdd(query);return true;}});};