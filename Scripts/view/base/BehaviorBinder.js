


// Static calss - binds behaviors, called from Base.rebind
function BehaviorBinder() {

}
BehaviorBinder.Inherit(BaseObject, "BehaviorBinder");
BehaviorBinder.registerDOMDestructor("defaultBehaviors");
// BehaviorBinder.reParseBehaviors = /\{.+?\}/gi;
// BehaviorBinder.reParseBehavior = /\{(\S+)(.*)\}/i;
BehaviorBinder.reParseBehaviorName = /^(\S+)(.*)$/i;
BehaviorBinder.$bindBehaviors = function (node, behaviorType, expr, phase) {
    var beh;
    if (BaseObject.is(expr, "string")) {
        var behs = JBUtil.getEnclosedTokens("{", "}", "\\", expr); // var behs = expr.match(BehaviorBinder.reParseBehaviors);
        if (behs != null) {
            if (node != null && node.length > 0) {
                var rawnode = node.get(0);
                if (rawnode.defaultBehaviors == null) rawnode.defaultBehaviors = {};
                for (var i = 0; i < behs.length; i++) {
                    if (rawnode.defaultBehaviors[phase + behs[i]] == null) {
                        beh = BehaviorBinder.$bindBehavior(node, behaviorType, behs[i], phase);
						// This is done in the $bindBehavior now - we want to be able to bind single behavior - i.e. make the $bindBehavior public
                        // if (beh != null) rawnode.defaultBehaviors[phase + behs[i]] = beh;
                    }
                }
            }
        }
    }
};
BehaviorBinder.$bindBehavior = function (node, behaviorType, behspec, phase) {
    var beh = null;
	if (node != null && node.length > 0) {
		var rawnode = node.get(0);
		if (rawnode.defaultBehaviors == null) rawnode.defaultBehaviors = {};
		if (rawnode.defaultBehaviors[phase + behspec] != null) {
			return rawnode.defaultBehaviors[phase + behspec];
		}
		if (BaseObject.is(behspec, "string")) {
			var behspec = behspec.slice(1, -1).trim();
			var arr = behspec.match(BehaviorBinder.reParseBehaviorName);
			if (arr != null && arr.length > 0) {
				var behClass = arr[1].trim();
				var behParams = arr[2].trim();
				if (Function.classes[behClass] != null) {
					if (behaviorType != null && behaviorType.length > 0) {
						beh = BehaviorBinder["bind_" + behaviorType](node, Function.classes[behClass], behParams, phase);
					} else { // use default
						beh = BehaviorBinder.$bind_default(node, Function.classes[behClass], behParams, phase);
					}
				} else {
					jbTrace.log("Behavior class " + behClass + " does not exist.");
				}

				//            if (BehaviorBinder["bind_" + behaviorType] != null) {
				//                var beh = new Function.classes[behClass](node, behClass);
				//                JBUtil.parametrize.call(beh, node, null, behParams);
				//                BehaviorBinder["bind_" + behaviorType](node, beh);
				//                beh.init();
				//            } else {
				//                jbTrace.log("Behavior " + behaviorType + " not supported");
				//            }
			}
		}
		if (beh != null) rawnode.defaultBehaviors[phase + behspec] = beh;
	}
    return beh;
};
BehaviorBinder.$bind_default = function (node, behClass, behParams, phase) {
    var beh = null;
    if (behClass.bindBehavior != null) {
        // Supports STATIC binding - takes care for the binding itself
        beh = behClass.bindBehavior(node, behParams, phase);
    } else {
        // Instance is to be created and initialized
        if (Class.is(behClass, "ElementBehaviorBase")) {
            if (phase == behClass.behaviorPhase) {
                beh = new behClass(node, phase);
                JBUtil.parametrize.call(beh, node, null, behParams); // JBUtil.parametrize.call(beh, behParams);
                beh.init(phase);
            }
        } else {
            beh = new behClass(node, phase);
            JBUtil.parametrize.call(beh, node, null, behParams); // JBUtil.parametrize.call(beh, behParams);
            // init is not guaranteed to exist or serve the same purpose
        }
    }
    return beh;
};
// set of routines called bind_<behaviourType> currently not used, only one for testing the feature is provided
BehaviorBinder.bind_hintbox = function (node, beh) {
    return null;
};
