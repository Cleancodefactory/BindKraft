/**
 * This file is gradually replacing the JBUtil functions in ViewUtil-legacy.js. At the end of the process the other one will be removed.
 */

 (function() {
    
    var GRect = Class("GRect"),
        GPoint = Class("GPoint");
    
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
    ViewUtil.adjustPopupInHost = function(view, el, shiftLeft, shiftTop, mode) {
        var th;
        if (!BaseObject.is(view, "Base")) {
            BaseObject.LASTERROR("ViewUtil.adjustPopupInHost: view is not a Base object");
            return;
        }
        if (typeof el == "string") {
            th = ViewUtil.getRelatedElements(view.root, el);
        } else if (el instanceof HTMLElement) {
            th = el;
        }
        if (th == null) {
            BaseObject.LASTERROR("ViewUtil.adjustPopupInHost: el is not found or null has been passed.");
            return;
        }
        var query = new HostCallQuery(HostCallCommandEnum.gethost);
        view.throwStructuralQuery(query);
        var viewcontainer = null;
        if (query.host != null) {
            if (BaseObject.is(query.host, "IViewHostQuery")) {
                viewcontainer = query.host.get_viewcontainerelement();
                if (viewcontainer != null) {
                    if (!DOMUtil.findParent(th, viewcontainer)) {
                        viewcontainer = null;
                    }
                }
            }
            if (viewcontainer == null) {
                // Try window
                if (BaseObject.is(query.host, "BaseWindow")) {
                    viewcontainer = query.host.get_windowelement();
                }
            }
    
            if (viewcontainer == null) {
                BaseObject.LASTERROR("ViewUtil.adjustPopupInHost: Cannot find appropriate container.");
                return;
            }
            // Viewport coordinates, we will calc relatives to enable more relaxed choice of styling
            var containerRect = GRect.fromDOMElementClientViewport(viewcontainer);
            var controlRect = GRect.fromDOMElementClientViewport(view.root);
            // Viewport coordinates of the control's left/top corner, plus shifts
            var pt = new Point(controlRect.x + (shiftLeft ? shiftLeft : 0), controlRect.y + (shiftTop ? shiftTop : 0));
            /////////////////////////////////////////////////
            var ballonRect = Rect.fromDOMElementOffset(th);
            // Safety madness
            if (ballonRect.w <= 0) {
                ballonRect.w = 250;
            }
            if (ballonRect.h <= 0) {
                ballonRect.h = 20;
            }
            var placementRect = containerRect.adjustPopUp(controlRect, ballonRect, (typeof mode == "string"?mode:"aboveunder"), 0);
            // Assume the control is relative and correct to that
            placementRect.x = placementRect.x - controlRect.x;
            placementRect.y = placementRect.y - controlRect.y;
            th.css("z-index", "9999");
            // We do not want to change the size - the popup is glued to the host element and if something remains hidden we are good with that.
            placementRect.w = null;
            placementRect.h = null;
            placementRect.toDOMElement(th);
        } else {
            BaseObject.LASTERROR("JBUtil.adjustPopupInHost: cannot find the view's host.");
        }
    
    }
 })();