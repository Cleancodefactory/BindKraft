function IFindServiceImpl() {}
IFindServiceImpl.InterfaceImpl(IFindService);
IFindServiceImpl.RequiredTypes("IStructuralQueryEmiter");
IFindServiceImpl.prototype.findService = function(_type, reason) {
    var p = new FindServiceQuery(_type, reason);
    if (this.throwStructuralQuery(p)) return p.result;    
    return null;    
}