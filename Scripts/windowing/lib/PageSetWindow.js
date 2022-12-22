
/**
    @classdesc A window containing a collection of child windows, showing only one at a time. No full UI support is implemented in PageSetWindow, because it is intended
        to serve as base class for tab sets and alike.
    @class
*/
function PageSetWindow() {
    PanelWindow.apply(this, arguments);
    this.$cachedChildren = this.getDelegatedProperty("_cachedChildren", new Delegate(this, this.$filterVisibleChildren));
}
PageSetWindow.Inherit(PanelWindow, "PageSetWindow");
PageSetWindow.Defaults({
    templateName: new StringConnector("<div class=\"f_windowframe\" style=\"position:absolute\" data-key=\"_window\" data-wintype=\"PageSet based\"></div>")
});
PageSetWindow.prototype.$selectedPage = null;
PageSetWindow.prototype.get_selectedpage = function() {
    return this.$selectedPage;
}
PageSetWindow.prototype.set_selectedpage = function(wnd) {
    //TODO:
}
PageSetWindow.prototype.get_currentindex = function () {
    var pages = this.get_pages();
    if (pages != null && pages.length > 0) {
        var sel = this.get_selectedpage();
        return pages.indexOf(sel);
    }
    return -1;
};
PageSetWindow.prototype.set_currentindex = function (v) {
    WindowingMessage.fireOn(this, PageSetEventEnum.selectPage, { index: v });
};
PageSetWindow.prototype.whenRemovedSelectPage = "next"; // next/prev
/**
 * Returns appropriate other page to switch to by default 
 * nav or when selected is going to be removed
 */
PageSetWindow.prototype.get_otherpage = function() {
    var pages = this.get_pages();
    var idx = pages.indexOf(this.$selectedPage);
    if (pages.length <=1) return null; // Must be another
    if (idx >= 0) {
        if (this.whenRemovedSelectPage === "next") {
            if (idx < pages.length - 1) {
                return pages[idx + 1];
            } else {
                return pages[0];
            }
        } else if (this.whenRemovedSelectPage === "prev") {
            if (idx > 0) {
                return pages[idx - 1];
            } else {
                return pages[pages.length - 1];
            }
        }
    }
    return null;
}
PageSetWindow.prototype.get_page = function (idx) { // Only visible pages
    var pages = this.get_pages();
    if (pages != null && idx >= 0 && idx < pages.length) return pages[idx];
    return null;
};
PageSetWindow.prototype.get_pageindex = function (page) {
    var pages = this.get_pages();
    if (Array.isArray(pages)) {
        for (var i = 0; i < pages.length; i++) {
            if (pages[i] == page) {
                return i;
            }
        }
    }
    return -1;
};
PageSetWindow.prototype.$defaultWindowStyles = WindowStyleFlags.Default | WindowStyleFlags.adjustclient;
PageSetWindow.prototype.handleWindowEvent = function (evnt, currentResult) { // Override the handler procedure
    switch (evnt.type) {
        case PageSetEventEnum.notifyPageAdded:
        case PageSetEventEnum.notifyPageRemoved:
        case PageSetEventEnum.notifyPageSelected:
            this.$cachedChildren.clear();
            this.updateTargets();
            break;
    }
    return this.handleWindowEventDefault(evnt, currentResult);
};

//#region Handling notifications

/**
 * Just fixes some window characteristics when notices that an window is added
 * 
 */
PageSetWindow.prototype.on_ChildAdded = function (msg) {
    if (msg.data != null && msg.data.child != null) {
        msg.data.child.setWindowStyles(WindowStyleFlags.fillparent, "set");
        // This is not fatal, but for future changes sake we better remove this flag to avoid unexpected behavior
        msg.data.child.setWindowStyles(WindowStyleFlags.topmost, "reset"); // make sure no topmost windows are used as pages
        this.notifyParent(PageSetEventEnum.notifyPageAdded, { page: msg.data.child });
        this.callAsync(this.updateTabs);
    }
};
/**
 * Invokes recalc of the active pages
 */
PageSetWindow.prototype.on_ChildRemoved = function (msg) {
    this.$cachedChildren.clear();
    // Correct this
    var newIndex = this.get_currentindex();
    if (newIndex >= this.get_pages().length) {
        newIndex = this.get_pages().length - 1;
    }
    if (newIndex <= 0) newIndex = 0;
    this.set_currentindex(newIndex);
    this.notifyParent(PageSetEventEnum.notifyPageRemoved, { page: msg.data.child });
    this.callAsync(this.updateTabs);
}
/**
 * Performs the actual page addition for pagesetwindows. It calls addChild but before and after that adjusts 
 * the window to the pageset's needs. addChild is also overridden, but will not do anything else but reset 
 * the cached collection. If the window is not enabled it will remain so.
 * 
 * @param {*} msg - msg.data: { active, noactive, index, page: page, enable: boolean, disable: boolean}
 *  - index causes window to be moved to that index among the children (not the active ones - pages!)
 */
PageSetWindow.prototype.on_addPage = function (msg) {
    if (msg.data != null && BaseObject.is(msg.data.page, "BaseWindow")) {
        var newpage = msg.data.page;
        // Check what we have to do initially
        var msgdata = msg.data;
        if (msgdata.enable) {
            newpage.set_enabledwindow(true, true);
        } else if (msgdata.disable) {
            newpage.set_enabledwindow(false, true);
        }
        if (this.addChild(msg.data.page) === false) { //this clears the cache - no need again
            // Add refused - do nothing
        } else {
            // reorder children if necessary (the new page is already in the list)
            if (msg.data != null && msg.data.index != null) {
                if (msg.data.index >= 0 && msg.data.index <= this.children.length) {
                    this.reOrderChild(msg.data.page, index); // index is according to all children
                }
            }
            if (!msg.data.noactive && ((!BaseObject.getProperty(this, "createParameters.data.dontActivateAddedPages") && msg.data.active) || BaseObject.getProperty(this, "createParameters.data.activateAddedPages"))) {
                msg.data.page.set_enabledwindow(true);
                //this.$cachedChildren.clear();
            }
            var pages = this.get_pages();
            if (!msg.data.noactive && ((!BaseObject.getProperty(this, "createParameters.data.dontActivateAddedPages") && msg.data.active) || BaseObject.getProperty(this, "createParameters.data.activateAddedPages") || pages.length == 1)) {
                if (msg.data.get_enabledwindow()) {
                    WindowingMessage.postTo(this, PageSetEventEnum.selectPage, { page: msg.data.page });
                }
            } else {
                msg.data.page.setWindowStyles(WindowStyleFlags.visible, "reset"); // Just in case it is not hidden by default
            }
        }
        msg.handled = true;
    }
};
PageSetWindow.prototype.on_removePage = function (msg) {
    var page;
    if (msg.data != null && msg.data.page != null) {
        page = msg.data.page;
    } else if (msg.data != null && msg.data.index != null) {
        page = this.get_childwindow(msg.data.index);
    }
    if (page != null) {
        if (this.get_selectedpage() == page) {
            // Have to fix the selection first.
            this.selectAnother();
        }
        this.removeChild(page);
        this.$cachedChildren.clear();
    }
};
PageSetWindow.prototype.on_selectPage = function (msg) {
    var _old = this.get_selectedpage();
    var _new = null;
    if (msg.data.page != null) {
        _new = msg.data.page;
    } else if (msg.data != null && typeof msg.data.index == 'number') {
        _new = this.get_page(msg.data.index);
    }
    if (_new != null) {
        if (_old != _new) {
            if (_old != null) {
                // Ask with the pageset specific message if we can change the page
                var result = this.notifyChild(_old, PageSetEventEnum.pageDeactivating, { page: _old, newPage: _new });
                if (result === false) {
                    return; // Do nothing
                }
                // Ask with the abstract deactivation notification if the current page permits the deactivation.
                result = this.notifyChild(_old, WindowEventEnum.Deactivating, { window: _old, reason: "pageset", newWindow: _new });
                if (result === false) return; // Do nothing

                _old.setWindowStyles(WindowStyleFlags.visible, "reset");
                this.notifyChild(_old, PageSetEventEnum.pageDeactivated, { page: _old });
            }
            _new.setWindowStyles(WindowStyleFlags.visible | WindowStyleFlags.fillparent, "set");
            this.notifyChild(_new, PageSetEventEnum.pageActivated, { page: _new });
            
            this.$selectedPage = _new;
            this.$cachedChildren.clear(); // TODO: seems unneeded
            this.notifyParent(PageSetEventEnum.notifyPageSelected, { page: _new, oldpage: _old, index: this.get_currentindex() });
        } else {
            // TODO: maybe reapply
        }
    }
    ///////////
}
/**
 * Selects next or previous page depending on whenRemovedSelectPage.
 */
PageSetWindow.prototype.selectAnother = function() {
    var page = this.get_otherpage();
    if (page != null) {
        this.set_selectedpage(page);
    }
}

// PageSetWindow.prototype.on_selectPage_old = function (msg) {
//     var current = null, old = this.get_selectedpage(), newIndex = -1;
//     var pages = this.get_pages();
//     if (msg.data != null) {
//         if (msg.data.page != null) {
//             var i = pages.findElement(msg.data.page);
//             if (i >= 0 && i < pages.length) {
//                 newIndex = i;
//                 if (newIndex == this.get_currentindex()) {
//                     return;
//                 }
//                 current = msg.data.page;
//             }
//         } else if (msg.data.index != null) {
//             var i = msg.data.index;
//             if (i >= 0 && i < pages.length) {
//                 newIndex = i;
//                 if (newIndex == this.get_currentindex()) {
//                     return;
//                 }
//                 current = pages[i];
//             }
//         }
//     }
//     if (newIndex >= 0 && newIndex < pages.length) { // A bit paranoid
//         if (old != null) {
//             // Ask with the pageset specific message if we can change the page
//             var result = this.notifyChild(old, PageSetEventEnum.pageDeactivating, { page: old, index: this.$currentIndex, newPage: current, newIndex: newIndex });
//             if (result === false) {
//                 return;
//             }
//             // Ask with the abstract deactivation notification if the current page permits the deactivation.
//             result = this.notifyChild(old, WindowEventEnum.Deactivating, { window: old, reason: "pageset", newWindow: current });
//             if (result === false) return;

//             old.setWindowStyles(WindowStyleFlags.visible, "reset");
//             this.notifyChild(old, PageSetEventEnum.pageDeactivated, { page: old, index: this.$currentIndex });
//         }
//         if (current != null) {
//             current.setWindowStyles(WindowStyleFlags.visible | WindowStyleFlags.fillparent, "set");
//             this.notifyChild(current, PageSetEventEnum.pageActivated, { page: current, index: newIndex });
//         }
//         this.$currentIndex = newIndex;
//         this.notifyParent(PageSetEventEnum.notifyPageSelected, { page: current, oldpage: old, index: this.$currentIndex });
//     }
// };

//#endregion

//#region Overrides of base window API
PageSetWindow.prototype.addChild = function (wnd) {
    //debugger
    var result = PanelWindow.prototype.addChild.apply(this, arguments);
    this.$cachedChildren.clear(); // Reset active collection
    return result;
}
//#endregion

//#region PageSet API

/**
 *  A method for loading pages. The actual work is done by on_AddPage, but this method offers
 *  more convenient invocation (a bit)
 *  @param {object|boolean} - null - nothing, true - activate, false noactive ... see the 
 *              on_AddPage for more details when it is an object
 */
PageSetWindow.prototype.addPage = function (page, options) {
    var msgdata = { page: page };
    if (typeof options == "boolean") {
        if (options) {
            msgdata.active = true;
            msgdata.noactive = false;
        } else {
            msgdata.noactive = true;
            msgdata.active = false;
        }
    } else if (typeof options == "object") {
        msgdata = BaseObject.CombineObjects(msgdata, options);
    }
    WindowingMessage.fireOn(this, PageSetEventEnum.addPage, msgdata);
    return this;
};
PageSetWindow.prototype.removePage = function (page) {
    WindowingMessage.fireOn(this, PageSetEventEnum.removePage, { page: page });
    return this;
};
/**
 * Removes all the pages one by one. By default it removes only the active pages, 
 * with bAll set to true - all the child windows (pages).
 * 
 * @param {bool} bAll - If true removes all the children, otherwise only the active pages.
 */
PageSetWindow.prototype.removeAllPages = function (bAll) {
    var pages = bAll?this.children:this.get_pages();
    if (pages != null) {
        pages = Array.createCopyOf(pages);
        for (var i = 0; i < pages.length; i++) {
            var page = pages[i];
            if (page != null) {
                WindowingMessage.fireOn(this, PageSetEventEnum.removePage, { page: page });
            }
        }
    }
    return this;
};

PageSetWindow.prototype.selectPage = function (page) {
    if (typeof page == 'string') {
        page = this.findChildByName(page);
    }
    if (BaseObject.is(page, "BaseWindow")) {
        WindowingMessage.fireOn(this, PageSetEventEnum.selectPage, { page: page });
    } else {
        this.LASTERROR("The page argument is not a BaseWindow or the window cannot be found.")
    }
};

//#endregion




PageSetWindow.prototype.on_ActivateChild = function (msg) {
    if (msg.target != this) { // Wrong message - we stop its processing
        msg.handled = true;
    }
};





//////////////////////////////////////////
PageSetWindow.prototype.on_EnableWindow = function (msg) {
    if (msg.data != null && msg.data.enable != null) {
        var enabledPage = msg.target;
        var pages;
        if (msg.data.enabled) { // Just enabled
            if (this.$cachedChildren != null) this.$cachedChildren.clear();
            pages = this.get_pages();
            var idx = pages.findElement(enabledPage);
            if (idx <= this.get_currentindex()) {
                this.set_currentindex(this.get_currentindex() + 1);
            }
        } else if (msg.data.disabled) { // just disabled
            var disabledRawIndex = this.children.indexOf(enabledPage);
            var selectedRawIndex = this.children.indexOf(this.get_selectedpage());
            if (this.$cachedChildren != null) this.$cachedChildren.clear();
            if (disabledRawIndex < selectedRawIndex) { // One visible page less
                if (this.get_currentindex() > 0) {
                    this.set_currentindex(this.get_currentindex() - 1);
                }
            } else if (disabledRawIndex == selectedRawIndex) { // Selected page was disabled - choose another
                pages = this.get_pages();
                if (pages.length > disabledRawIndex) {
                    this.set_currentindex(disabledRawIndex); // The next page
                } else { // The 

                }
            }
        } else { // Nothing changed from the window's point of view - we have to ensure everything is Ok.

        }




        var currentIndex = this.get_currentindex();
        if (!msg.data.enable) {
            if (this.$cachedChildren != null) this.$cachedChildren.clear();
            var currentIndex = this.get_currentindex();
            var currentPage = this.get_childwindow(currentIndex);
            if (currentPage == msg.target) {
                // The disabled page is the current page, we need to deal with that and switch to another
                var newIndex = currentIndex;
                var pages = this.get_pages();
                if (currentIndex == pages.length - 1) {
                    newIndex = (pages.length > 0) ? 0 : currentIndex; // We keep the same index if there are other enabled pages after this one
                }
                this.set_currentindex(newIndex);
            }
        } else if (msg.data.enable) {
            
            if (this.$cachedChildren != null) this.$cachedChildren.clear();
            var pages = this.get_pages();
            
            var idx = pages.findElement(enabledPage);
            if (idx > 0 && idx < (pages.length - 1)) {
                idx++;
            }
            if (idx != null) {
                this.$currentindex = idx;
            }
        };
    }
    this.callAsync(this.updateTabs);
    //this.updateTabs();
};
PageSetWindow.prototype.updateTabs = function () {
    this.updateSources();
    this.updateTargets();
    return this;
};




/*
    msg.data {
        page - page to add (a window)
        active - (boolean) - activate on add
        noactive
    }
 */



// Only the visible pages
// PageSetWindow.prototype.$currentIndex = -1;

PageSetWindow.prototype.get_selectedpage = function () {
    var i = this.get_currentindex();
    return this.get_page(i);
};
PageSetWindow.prototype.set_selectedpage = function (page) {
    this.selectPage(page);
}


PageSetWindow.prototype.deactivateCurrentTab = function (callback, syncSave) {
    this.notifyChild(this.get_selectedpage(), WindowEventEnum.Deactivating, { callback: callback, sync: syncSave });
};
PageSetWindow.prototype.$filterVisibleChildren = function () {
    if (!IsNull(this.children)) {
        return this.children.Select(function (idx, item) {
            if (item.get_enabledwindow != null && item.get_enabledwindow()) {
                return item;
            }
        });
    }
    else {
        return null;
    }
};
PageSetWindow.prototype.get_pages = function () {
    if (this.$cachedChildren != null) return this.$cachedChildren.get();
    return null;
};
PageSetWindow.prototype.rearangePages = function (currentIndex, newIndex) {
    RearangeItems(this.children, currentIndex, newIndex);
    this.$cachedChildren.clear();
};
