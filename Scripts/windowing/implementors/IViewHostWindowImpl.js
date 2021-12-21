


/* VIEW HOSTING PROTOCOL IMPL */
/*PROTOCOL PViewHostWindow*/
// This Impl style Interface will add implementations of other interfaces as well.
// The Interface implements view hosting capability over a window (BaseWindow derived) class. The capability remains for all the inherited classes.
// For now we Implement this over BaseWindow, so every window is capable of hosting views, but this is actually wrong (!) Especially for windows
// that are supposed to be just containers for other windows.
// Notes:
// 	This Interface adds a new paremter holding member to the classes - viewLoadParameters
//	It has a role very similar to createParameters, but contains only the parameters that are related to the view - URL, data that needs to be passed to the view and so on.
//  Why separete member? The createParameters are expected to match the lifecycle of the window and it does not match all the possible 
//  lifecycle scenarios for a view hosted in the window - the view can be reloaded, replaced and so on, while the window will remain basicly the same. So,
//  to avoid mixups that will mess up with the lifecycles there is this additional place for data that lives together with the view and not the window.
function IViewHostWindowImpl() { 
	var x = this.root;
}
IViewHostWindowImpl.InterfaceImpl(IViewHostWindow, "IViewHostWindowImpl");
IViewHostWindowImpl.RequiredTypes("BaseWindow");
IViewHostWindowImpl.classInitialize = function (cls) {
    cls.Implement(IStructuralQueryProcessorImpl);
    cls.Implement(IAjaxQueryRequestContent);
    cls.Implement(IViewHostQuery);
    cls.prototype.getRequestContentFlags = function (settings) {
        var flags = STUFFRESULT.ALL;
        if (this.viewLoadParameters != null) {
            if (this.viewLoadParameters.view != null) flags ^= STUFFRESULT.VIEWS;
            if (this.viewLoadParameters.directData) flags ^= STUFFRESULT.DATA;
        }
        return flags;
    };
    cls.prototype.on_LoadView = function (msg) {
        if (msg.data == null) {
            this.ReloadView(true);
        } else {
            this.LoadViewNow(msg.data);
        }
    };
    cls.prototype.on_Deactivating = function (msg) {
        if (this.currentView != null) {
			if (BaseObject.is(this.currentView,"IOpionatedView")) {
				if (this.currentView.ViewDeactivating(msg) === false) {
					return false;
				}
			}
			/* See the comments in IOpionatedView for future impl of IPersistableView
            if (BaseObject.is(this.currentView, "IPersistableView") && !this.currentView.get_disablePersistableView()) {
                if (this.currentView.ValidateViewData() === false) {
                    return false;
                } else {
                    this.currentView.SaveViewData(msg.data.callback, msg.data.sync);
                }
            }
			*/
        } else {
            this.notifyChild(null, WindowEventEnum.Deactivating, msg.data);
        }
    };
    cls.prototype.closeView = function (bForceClose) {
		if (this.currentView != null) {
			if (this.currentView.onClose) {
				if (this.currentView.onClose() === false && (bForceClose != true)) { // Warning! The order is important - onClose must ba called always!
					return false;
				}
			}
			if (BaseObject.is(this.currentView, "IOpionatedView")) {
				if (this.currentView.ViewClosing() === false && (bForceClose != true)) {
					return false;
				}
			}
			
			this.$disconnectViewEventConnectors(); // ??? May be we do not need to be so thorough?
			if (typeof this.currentView.removeView == "function") this.currentView.removeView();
			this.currentView = null;
        }
        return true;
    } .Description("Attempts to close the view, if it responds with explicit false to the onClose query, the method will return false or forcibly close it if bForceClose parameter is true");
	cls.prototype.on_Create = function(msg) {
		// hook into certain window events in order to retranslate them to the view
		this.registerExternalHandler(WindowEventEnum.SizeChanged, new Delegate(this, function (msg) {
			if (BaseObject.is(this.currentView, "IViewContainerEventsSink")) {
				// TODO: Try to make size reported as precise as possible
				this.currentView.onViewSizeChanged(Size.fromDOMElement(this.currentView.root)); // Size reported is not always dependable
			}
		}));
		this.registerExternalHandler(WindowEventEnum.PosChanged, new Delegate(this, function (msg) {
			if (BaseObject.is(this.currentView, "IViewContainerEventsSink")) {
				this.currentView.onViewPosChanged(Rect.fromDOMElement(this.currentView.root));
			}
		}));
		this.registerExternalHandler(WindowEventEnum.Show, new Delegate(this, function (msg) {
			if (BaseObject.is(this.currentView, "IViewContainerEventsSink")) {
				this.currentView.onViewVisibilityChanged(this.isWindowVisible());
			}
		}));
		this.registerExternalHandler([WindowEventEnum.ActivateWindow, WindowEventEnum.Activated, PageSetEventEnum.pageActivated], new Delegate(this, function (msg) {
			if (BaseObject.is(this.currentView, "IViewContainerEventsSink")) {
				this.currentView.onViewActivated(true);
			}
		}));
	};
    cls.prototype.on_Close = function (msg) {
        return this.closeView();
    };
	cls.prototype.on_Destroy = function (msg) {
        return this.closeView(true);
    };
    cls.prototype.ReloadView = function (loadnow, initData, clientState) {
        if (this.closeView() === false) return false;
		if (loadnow === true) {
			BaseObject.setProperty(this,"createParameters.data.lazyload", false);
		} else if (loadnow === false) {
			BaseObject.setProperty(this,"createParameters.data.lazyload", true);
		}
        if (IsNull(this.createParameters.data.clientData)) {
            this.createParameters.data.clientData = clientState;
        }
        else if (!IsNull(clientState)) {
            for (var prop in clientState) {
                this.createParameters.data.clientData[prop] = clientState[prop];
            }
        }
        if (this.isWindowVisible() || loadnow) {
            this.LoadViewNow(BaseObject.CombineObjectsDeep(0, BaseObject.getProperty(this, "createParameters.data"), initData));
            return;
        }
		// Please do not remove this block yet! We have some code we hate here, but we cannot afford to remove it, so it is a bit more complicated than it should be.
		// This was the old version and may need to be reviewed if something goes wrong.
        // if (this.createParameters.taskDispenser != null) {
            // this.createParameters.taskDispenser.post(
                // new WindowingMessage("LoadView", null, this, this),
                // this,
                // null,
                // function (taskDesc, target) { //{task:,target:,comparable:,condition:}, targetAsked, comparableAsked, param
                    // if (target.isWindowVisible()) return true;
                // }
            // );
        // } else {
            this.LoadView(initData);
        //}
    } .Description("Reloads the current view. With loadnow true immediately and schedules the load for the next time the window becomes visible otherwise. Passing task dispenser to windows using lazyload is recommended - leads to better performance.");
    cls.prototype.LoadView = function (initData) {
        if (IsNull(initData)) {
            initData = this.createParameters.data;
        } else if (BaseObject.is(initData, "string")) {
            this.createParameters.data.url = initData;
            initData = this.createParameters.data;
        } else {
            this.createParameters.data = BaseObject.CombineObjectsDeep(0, this.createParameters.data, initData);
			initData = this.createParameters.data;
        }
        if (!initData.lazyload || this.isWindowVisible()) {
            this.LoadViewNow(initData);
        } else {
            if (this.createParameters.taskDispenser != null) {
                this.createParameters.taskDispenser.post( // Enqueue task that is queried on every window message and executed when window becomes visible
                    new WindowingMessage("LoadView", initData, this, this),
                    this,
                    null,
                    function (taskDesc, target) { //{task:,target:,comparable:,condition:}, targetAsked, comparableAsked, param
                        if (target.isWindowVisible()) return true;
                    }
                );
            } else {
                EventPump.Default().post(new WindowingMessage("LoadView", initData, this, this),
                                function (msg) {
                                    if (msg.target != null && msg.target.isWindowVisible()) return true;
                                    return false;
                                });
                // this.LoadView();
            }
        }
    } .Description("Loads the specified view or reloads current. if the passed data or the remembered one has lazyload=true the load is scheduled for the next time the window becomes visible.");
    // Obsoleted
    cls.prototype.on_ReloadData = function (msg) {
        //        if (this.currentView != null) {
        //            if (BaseObject.is(this.currentView, "PDataViewControl")) {
        //                return this.currentView.OnDataViewReloadData();
        //            }
        //        }
    };
    cls.prototype.LoadViewNow = function (initData) {
        this.viewLoadParameters = initData;
        if (initData != null) {
            if (BaseObject.is(initData.cachedView,"ViewLoadCache")) {
                initData.url = initData.cachedView.get_url();
                initData.view = initData.cachedView.get_view();
            }
            if (initData.ajaxsettings != null) {
                if (initData.ajaxsettings.RoleId != null) {
                    this.set_localajaxcontextparameter(AjaxContextParameterFlags.RoleId, initData.ajaxsettings.RoleId);
                    this.$isFinalAuthority = true;
                }
            }
            if (initData.view != null && initData.directData != null) {
                this.$LoadView({ status: { issuccessful: true }, data: initData.data });
            } else if (initData.url != null) {
                var localThis = this;
                System.showLoadingIndicator($(this.get_clientcontainer(initData.subContainer)));
				if (initData.url != null && initData.url.length > 0 && initData.url.indexOf("post:") == 0) {
					initData.post = true;
					initData.url = initData.url.slice(5);
				}
                if (initData.post) {
                    this.ajaxPostXml(initData.url, initData.data, function (result) {
                        localThis.$LoadView(result); localThis.clientInit(initData.clientData);
                    });
                } else {
                    this.ajaxGetXml(initData.url, initData.data, function (result) {
                        localThis.$LoadView(result);
                        localThis.clientInit(initData.clientData);
                    });
                }
            }
        }
    };
    cls.prototype.viewLoadParameters = null; // Holds the parameters with which the view has been opened
    cls.prototype.$LoadView = function (result) {
        var useView = null;
		var arSetViewData = null; // Async result for set_data of just loded view
        if (result.status.issuccessful) {
            var initData = this.viewLoadParameters;
            if (initData != null && initData.view != null) {
                useView = initData.view;
            } else if (initData != null && initData.viewName != null) {
                useView = result.views[initData.viewName];
                if (BaseObject.is(initData.cachedView,"ViewLoadCache")) {
                    initData.cachedView.put(useView);
                }
            } else {
                for (var v in result.views) {
                    if (result.views[v] != null && result.views[v].length > 0) {
                        useView = result.views[v];
                        break;
                    }
                }
            }
            if (useView != null) {

                // We can proceed
                var c = (initData != null) ? $(this.get_clientcontainer(initData.subContainer)) : null;
                if (c != null && c.length > 0) {
                    this.currentView = ViewBase.materializeIn(c, useView);
                    if (this.currentView != null) {
						this.currentView.rebind();
						CacheManager.Default.applyToInstance(result, this.currentView);
						this.$attachViewEvents(); // Attach subscriptions
						this.$connectViewEventConnectors();
                        WindowingMessage.fireOn(this, WindowEventEnum.ViewPreLoad, initData);
                        arSetViewData = this.currentView.set_data((initData.directData) ? initData.directData : result.data);
						if (result.metadata != null) this.currentView.metadata = result.metadata;

						// TODO The window's get_caption looks first in the view, so this is rather limiting
                        //if (this.currentView.get_caption != null && this.$staticCaption == null) {
                        //    this.$staticCaption = this.currentView.get_caption();
                        //}
                        initData.loadedView = this.currentView;
                        if (this.hostClientCSSClasses != null && this.hostClientCSSClasses.length > 0) {
                            c.addClass(this.hostClientCSSClasses);
                        }
                        if (this.hostClientCSSStyles != null && this.hostClientCSSStyles.length > 0) {
                            var arrStyles = this.hostClientCSSStyles.split(";");
                            if (arrStyles != null) {
                                for (var i = 0; i < arrStyles.length; i++) {
                                    var arr_sv = arrStyles[i].split(":");
                                    if (arr_sv.length == 2) {
                                        c.css(arr_sv[0].trim(), arr_sv[1].trim());
                                    }
                                }
                            }
                        }
                        this.updateTargets();
                        // TODO: This should be moved in afterasync
                        WindowingMessage.fireOn(this, WindowEventEnum.ViewLoaded, initData);
						this.afterAsync(arSetViewData, function () {
						   if (BaseObject.is(this.currentView, "IViewContainerEventsSink")) {
							   this.currentView.onViewSizeChanged(Size.fromDOMElement(this.currentView.root));
						   }
						}); 
						/* Deprecated section - will go away soon.
							This code has been moved to on_Create, because it is a window characteristic that checks if a view is loaded and if it is
							IViewContainerEventsSink and advises it when needed - no need to reregister this every time a view is loaded, needless to say
							that these handlers are never unregistered and if a view is reloaded their number will mount (coughing).
                        if (BaseObject.is(this.currentView, "IViewContainerEventsSink")) {
                            // hook into certain window events in order to retranslate them to the view
                            this.registerExternalHandler(WindowEventEnum.SizeChanged, new Delegate(this, function (msg) {
                                if (BaseObject.is(this.currentView, "IViewContainerEventsSink")) {
									// TODO: Try to make size reported as precise as possible
                                    this.currentView.onViewSizeChanged(Size.fromDOMElement(this.currentView.root)); // Size reported is not always dependable
                                }
                            }));
                            this.registerExternalHandler(WindowEventEnum.PosChanged, new Delegate(this, function (msg) {
                                if (BaseObject.is(this.currentView, "IViewContainerEventsSink")) {
                                    this.currentView.onViewPosChanged(Rect.fromDOMElement(this.currentView.root));
                                }
                            }));
                            this.registerExternalHandler(WindowEventEnum.Show, new Delegate(this, function (msg) {
                                if (BaseObject.is(this.currentView, "IViewContainerEventsSink")) {
                                    this.currentView.onViewVisibilityChanged(this.isWindowVisible());
                                }
                            }));
                            this.registerExternalHandler([WindowEventEnum.ActivateWindow, WindowEventEnum.Activated, PageSetEventEnum.pageActivated], new Delegate(this, function (msg) {
                                if (BaseObject.is(this.currentView, "IViewContainerEventsSink")) {
                                    this.currentView.onViewActivated(true);
                                }
                            }));

                        }
						*/
                    }
                    this.viewLoaded = true;
                } else {
                    jbTrace.log("ViewHost: The client container in this window is missing.");
                }
            } else {
                jbTrace.log("ViewHost: Cannot select/find suitable view for the view being loaded. ");
            }
        } else {
            jbTrace.log("ViewHost: Ajax error while attempting to load a view.");
        }
    };
    cls.prototype.hostClientCSSStyles = new InitializeStringParameter("CSS styles to set to the view container on load", "overflow: auto");
    cls.prototype.hostClientCSSClasses = new InitializeStringParameter("CSS class to add to the view container on load", "f_view_container");
    // IViewHostQuery implementation
    cls.prototype.get_viewcontainerelement = function () {
        var c = $(this.get_clientcontainer());
        if (c != null && c.length > 0) {
            return c.get(0);
        }
        return null;
    };
    cls.prototype.get_containerposition = function () {
        return null;
    };
    cls.prototype.get_currentview = function() {
        return this.currentView;
    }
    //    // Retranslators for IViewContainerEventsSink enabled views
    //    cls.prototype.viewHost_onSizeChanged = function() {
    //    }
    cls.onStructuralQuery("HostCallQuery", function (query, procInst) {
		if (query.command & HostCallCommandEnum.updateui) {
            this.updateTargets();
        }
        if (query.command & HostCallCommandEnum.hide) {
            this.set_enabledwindow(false);
        } else if (query.command & HostCallCommandEnum.show) {
            this.set_enabledwindow(true);
        }
        if (query.command & HostCallCommandEnum.gethost) {
            query.host = this;
        }
        if (query.command & HostCallCommandEnum.getshell) {
            if (window.Shell != null) query.shell = Shell;
        }
        if (query.command & HostCallCommandEnum.activate) {
            WindowManagement.Default().set_activewindow(this);
        }
        if (query.command & HostCallCommandEnum.reload) {
            this.ReloadView();
        }
        if (query.command & HostCallCommandEnum.close) {
            this.closeWindow();
        }
        return true;
    });

    cls.onStructuralQuery("ChangeContainerStyleQuery", function (query, procInst) {
        if (query.scrollable != null) {
            var clnt = this.get_clientcontainer();
            if (query.scrollable) {
                $(clnt).css("overflow", "auto");
            } else {
                $(clnt).css("overflow", "hidden");
            }
        }
        if (query.scrollbottom) {
            $(clnt).scrollTop($(clnt).children(":first").height());
        }
        return true;
    });
    cls.prototype.$updateCommandBars = function () {
		this.updateTargets();
        //var cmdBar = this.childObject("window_CommandBar");
        //if (cmdBar != null) {
        //    cmdBar.updateTargets();
        //}
    };
    cls.onStructuralQuery("UpdateCommandBars", function (query, procInst) {
        //var parent = this.get_windowparent();
        this.$updateCommandBars();
    });
    cls.prototype.clientInit = function (params) {
        if (!IsNull(this.currentView) && !IsNull(this.currentView.clientInit)) {
            this.currentView.clientInit(params);
        }
    };
    cls.prototype.viewService = function (pSvc) {
        if (BaseObject.is(this.currentView, pSvc)) return this.currentView;
        return null;
    };
    cls.prototype.viewDelegate = function (func, params) {
        return new WeakDelegate(this, "currentView", func, params);
    };
    cls.prototype.$connectToViewEvent = null;
    cls.prototype.$attachToViewEvent = function (eventname, handler) {
        if (this.currentView != null) {
            if (BaseObject.is(this.currentView[eventname], "EventDispatcher")) {
                this.currentView[eventname].add(handler);
            }
        }
    };
    cls.prototype.$detachFromViewEvent = function (eventname, handler) {
        if (this.currentView != null) {
            if (BaseObject.is(this.currentView[eventname], "EventDispatcher")) {
                this.currentView[eventname].remove(handler);
            }
        }
    };
    cls.prototype.$attachViewEvents = function () {
        if (this.currentView != null && this.$connectToViewEvent != null) {
            var e;
            for (var i = 0; this.$connectToViewEvent != null && i < this.$connectToViewEvent.length; i++) {
                e = this.$connectToViewEvent[i];
                if (e != null) {
                    this.$attachToViewEvent(e.event, e.handler);
                }
            }
            this.$connectToViewEvent = null;
        }
    };
    cls.prototype.connectToViewEvent = function (eventname, handler) {
        if (this.$connectToViewEvent == null) this.$connectToViewEvent = [];
        this.$connectToViewEvent.push({ event: eventname, handler: handler });
        this.$attachViewEvents();
    };
    cls.prototype.disconnectFromViewEvent = function (eventname, handler) {
        if (this.$connectToViewEvent == null) {
            var e;
            for (var i = 0; this.$connectToViewEvent != null && i < this.$connectToViewEvent.length; i++) {
                e = this.$connectToViewEvent[i];
                if (e != null && e.event == eventname && BaseObject.equals(e.handler, handler)) {
                    this.$connectToViewEvent[i] = null; // No need to delete it
                }
            }
        }
        if (this.currentView != null) {
            this.$detachFromViewEvent(eventname, handler);
        }
    };
    cls.prototype.$viewEventConnectors = null;
    cls.prototype.$connectViewEventConnector = function (conn) {
        if (this.currentView != null && conn != null) {
            conn.connect(this.currentView);
        }
    };
    cls.prototype.$disconnectViewEventConnector = function (conn) {
        if (this.currentView != null && conn != null) {
            conn.disconnect(this.currentView);
        }
    };
    cls.prototype.$connectViewEventConnectors = function () {
        if (this.$viewEventConnectors != null) {
            for (var i = 0; this.$viewEventConnectors != null && i < this.$viewEventConnectors.length; i++) {
                this.$connectViewEventConnector(this.$viewEventConnectors[i]);
            }
        }
    };
    cls.prototype.$disconnectViewEventConnectors = function () {
        if (this.$viewEventConnectors != null) {
            for (var i = 0; this.$viewEventConnectors != null && i < this.$viewEventConnectors.length; i++) {
                this.$disconnectViewEventConnector(this.$viewEventConnectors[i]);
            }
        }
    };
    cls.prototype.addViewEventConnector = function (conn) {
        if (this.$viewEventConnectors == null) this.$viewEventConnectors = [];
        if (this.$viewEventConnectors.findElement(conn) < 0) {
            this.$viewEventConnectors.addElement(conn);
            this.$connectViewEventConnector(conn);
        }
    };
    cls.prototype.removeViewEventConnector = function (conn) {
        if (this.$viewEventConnectors != null) {
            if (this.$viewEventConnectors.findElement(conn) >= 0) {
                this.$viewEventConnectors.removeElement(conn);
                this.$disconnectViewEventConnector(conn);
            }
        }
    };
};