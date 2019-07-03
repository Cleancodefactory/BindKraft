function IAppElementImpl() {}
IAppElementImpl.InterfaceImpl(IAppElement);
IAppElementImpl.ImplementProperty("approot", new Initialize("Only the root windows of the application should have this set to the AppBase object of the application"));