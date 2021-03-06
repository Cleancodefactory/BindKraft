/**
 * This file is gradually replacing the JBUtil functions in ViewUtil-legacy.js. At the end of the process the other one will be removed.
 */

 (function() {
    function ViewUtil() {
        throw "ViewUtil is a static class, instances of it cannot be created."
    }
    ViewUtil.Inherit(BaseObject, "ViewUtil");

    ViewUtil.getRelatedElementsPC = function(baseEl, pattParent, pattChild, bAll) {

    }
    ViewUtil.getRelatedElements = function (baseEl, patt, details) {
        if (patt == null || patt.length <= 0) return [];
        var el = DOMUtil.toDOMElement(baseEl);
        var result = [];
        var arrPatts = patt.split(",");
        var arr, p, c, parentKey, childKey, bAll, g;
        if (arrPatts.length > 1 && details != null) details.arrayResult = true;
        for (var i = 0; i < arrPatts.length; i++) {
            arr = arrPatts[i].split("/");
            if (arr.length > 0) {
                parentKey = arr[0].trim();
                if (arr.length > 1) {
                    childKey = arr[1].trim();
                    bAll = false;
                    if (childKey.charAt(childKey.length - 1) == "*") {
                        childKey = childKey.slice(0, childKey.length - 1);
                        bAll = true;
                        if (details != null) details.arrayResult = true;
                    }
                } else {
                    bAll = false;
                    childKey = null;
                }
                switch (arr[0].trim()) {
                    case ".":
                    case "self":
                        p = el;
                        break;
                    case "..":
                    case "parent":
                        p = el.parent();
                        break;
                    case "__control":
                        p = JBUtil.getSpecialParent(el, JBUtil.EParentKinds.control);
                        break;
                    case "__view":
                        p = JBUtil.getSpecialParent(el, JBUtil.EParentKinds.templateRoot);
                        break;
                    default:
                        p = el.parents('[data-key="' + arr[0] + '"]');
                }
                p = (p.length <= 1) ? p : $(p.get(0));
                if (p.length > 0) {
                    if (childKey == null) {
                        result.push(p.get(0));
                    } else {
                        g = ElementGroup.getElementSet(p); // get the group
                        if (g.length > 0) {
                            p = $(g);
                            c = p.find('[data-key="' + childKey + '"]');
                            if (c.length > 0) {
                                if (bAll) {
                                    for (var j = 0; j < c.length; result.push(c.get(j++)));
                                } else {
                                    result.push(c.get(0));
                                }
                            }
                            if (bAll || c.length <= 0) {
                                c = p.filter('[data-key="' + childKey + '"]');
                                if (c.length > 0) {
                                    if (bAll) {
                                        for (var j = 0; j < c.length; result.push(c.get(j++)));
                                    } else {
                                        result.push(c.get(0));
                                    }
                                }
                            }
                        }
                    }
                }
            }
        }
        return result;
    };
 })();