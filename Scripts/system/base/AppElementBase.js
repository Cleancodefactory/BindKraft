function AppElementBase(app){BaseObject.apply(this,arguments);this.set_approot(app);}AppElementBase.Inherit(BaseObject,"AppElementBase");AppElementBase.Implement(IAppElementImpl);AppElementBase.Implement(IStructuralQueryEmiterImpl,"appelements",function(){return this.get_approot();});