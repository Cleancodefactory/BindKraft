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
    ViewUtil.EParentKinds = { control: 0, templateRoot: 1 };
    ViewUtil.getSpecialParent = function (baseEl, parentKind) {
        var cur = DOMUtil.toDOMElement(baseEl);
        if (cur instanceof HTMLElement) {
            var result = null;
            var ac;
            if (parentKind == ViewUtil.EParentKinds.control) {
                cur = cur.parentElement; // We need to start from the parent in case this is a control root too
                while (cur != null) {
                    ac = cur.activeClass;
                    if (BaseObject.is(ac, "IUIControl")) {
                        return cur;
                    }
                    if (this.isTemplateRoot(cur)) return null;
                    cur = cur.parentElement;
                }
            } else if (parentKind == ViewUtil.EParentKinds.templateRoot) {
                while (cur != null) {
                    if (this.isTemplateRoot(cur)) {
                        return cur;
                    }
                    cur = cur.parentElement;
                }
            }
        }
        return null;
    };
    ViewUtil.isTemplateRoot = function (el) {
        var he = DOMUtil.toDOMElement(el); // HTMLElement
        if (he != null) {
            var ac = he.activeClass;
            if (BaseObject.is(ac, "ITemplateRoot")) return true;
            if (he.getAttribute("data-template-root") != null) return true;
        }
        return false;
    };
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
                        p = el.parentElement;
                        break;
                    case "__control":
                        p = this.getSpecialParent(el, this.EParentKinds.control);
                        break;
                    case "__view":
                        p = this.getSpecialParent(el, this.EParentKinds.templateRoot);
                        break;
                    default:
                        p = DOMUtil.parentByDataKey(el,arr[0]);
                }
                
                if (p != 0) {
                    if (childKey == null) {
                        result.push(p);
                    } else {
                        g = ElementGroup.getElementSet(p); // get the group
                        if (g.length > 0) {
                            if (bAll) { 
                                c = DOMUtil.queryAllByDataKey(g, childKey) 
                            } else {
                                c = DOMUtil.queryOneByDataKey(g, childKey) 
                                if (c != null) c = [c]; else c = [];
                            }
                            if (Array.isArray(c) && c.length > 0) {
                                result = result.concat(c);
                            } 
                            if (!Array.isArray(c) || c.length <= 0 || bAll) {
                                c = DOMUtil.filterAllByDataKey(g, childKey);
                                if (Array.isArray(c) && c.length > 0) {
                                    if (bAll) {
                                        result = result.concat(c);
                                    } else {
                                        result.push(c[0]);
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