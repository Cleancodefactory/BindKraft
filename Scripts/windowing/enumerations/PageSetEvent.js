



var PageSetEventEnum = {
    pageActivated: "pageActivated",
    pageDeactivated: "pageDeactivated",
    pageDeactivating: "pageDeactivating",
    notifyPageAdded: "notifyPageAdded",
    notifyPageRemoved: "notifyPageRemoved",
    notifyPageSelected: "notifyPageSelected", // A page has been selected
    addPage: "addPage", // { page: BaseWindow[, caption: x], [data: windowData], [index: posinStack],[active: true|false] }
    removePage: "removePage", // {[page: BaseWindow], [ index: <index to remove>], [callback: <callback(wnd) to return true for removal of pages>] } // Only one should be specified because the order of preference is not guaranteed.
    selectPage: "selectPage" // { [page: BaseWindow], [ index: ] }
};