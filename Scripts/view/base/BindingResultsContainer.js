(function(){function BindingResultsContainer(descend){BaseObject.apply(this,arguments);this.bindings=[];this.bindingDescendants=[];this.descend=descend;this.handlers=[];this.namedBindings={};}BindingResultsContainer.Inherit(BaseObject,"BindingResultsContainer");BindingResultsContainer.prototype.contextBinding=null;BindingResultsContainer.prototype.descend=false;BindingResultsContainer.prototype.bindings=null;BindingResultsContainer.prototype.bindingDescendants=null;BindingResultsContainer.prototype.handlers=null;BindingResultsContainer.prototype.namedBindings=null;})();