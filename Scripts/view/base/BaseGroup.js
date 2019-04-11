/**
	A helper class that defines methods that call their counterparts over all the Base class instances in a group.
	For the purposes of this class a group can be defined in these two ways:
	1) explicitly - passing an array of naked DOM nodes
	2) implicitly - using the static method FromNode, passing a DOM node. The method will look for an ElementGroup and will take all the elements in that group.
*/
function BaseGroup(arr) {
	BaseObject.apply(this,arguments);
	if (BaseObject.is(arr,"Array")) {
		this.elements = Array.createCopyOf(arr);
	}
}
BaseGroup.Inherit(BaseObject,"BaseGroup");
BaseGroup.prototype.elements = null;

BaseGroup.FromNode = function(node) {
	// TODO: Check if node is indeed DOM node
	var els = ElementGroup.getElementSet(node);
	return new BaseGroup(els);
};

// returns BaseGroup from neightbours nodes or null
// first transforms the node to DOMMNode, get its parent and tries to find its index in the parent's children
// finally returns all neighbours of the node based on its index
// the method receives a node to which to find the neighbours and the length of the template
BaseGroup.FromSibling = function (node, templateLength) {
	var parentNode;
	var children;
	var nativeNode;
	var itemIndex = 0;
    var mode = 0;
    var baseGroupElements = [];
    var startIndex = 0;
	
	if (!(node instanceof DOMMNodeCollection)) {
		node = $$(node);
		
		if (!(node instanceof DOMMNodeCollection)) {
			return null;
		}
		
		node = node.first();
	}
	
	if (!(node instanceof DOMMNode) || node.isDummy()) {
		return null;
	}
	
	parentNode = node.getParent();
	children = parentNode.getChildren().toArray();
	nativeNode = node.getNative();
	
	var foundNode = children.FirstOrDefault(function (index, childNode) {
        if (nativeNode === childNode) {
            itemIndex = index;
            return childNode;
        }

        return null;
    });
	
    if (foundNode === null) {
        return null;
    }

    if (templateLength === 1) {
        return new BaseGroup([foundNode]);
    }

    if (itemIndex > 0) {
        mode = itemIndex % templateLength;
    }

    startIndex = itemIndex - mode;

    for (var i = startIndex, lastIndex = startIndex + templateLength; i < lastIndex; i++) {
        baseGroupElements.push(children[i]);
    }

    return new BaseGroup(baseGroupElements);
}.Description("Returns BaseGroup from neightbours nodes or null.")
	.Param("node", "Node to which the find the neighbours")
	.Param("templateLength", "The length of the temlate");

// Proxy call
BaseGroup.prototype.$applymethod = function(type, method, /*array*/ params) {
	// TODO: What are we going to return? Aggregated results, nothing?
	this.elements.Each(function(idx, base) {
		if (BaseObject.is(base.activeClass,"Base") && (type == null || BaseObject.is(base.activeClass,type)) ) {
			base.activeClass[method].apply(base.activeClass,params);
		}
	});
}
// PRoxy methods to base

BaseGroup.prototype.updateTargets = function() {
	this.$applymethod(null,"updateTargets", Array.createCopyOf(arguments));
}
BaseGroup.prototype.updateSources = function() {
	this.$applymethod(null,"updateSources", Array.createCopyOf(arguments));
}
BaseGroup.prototype.setData = function(data) {
	this.$applymethod(null,"set_data", Array.createCopyOf(arguments));
}

