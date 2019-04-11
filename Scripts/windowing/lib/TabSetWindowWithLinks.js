


function TabSetWithLinks() {
    TabSetWindow.apply(this, arguments);
    this.captions = [];
    this.linkcaptions = [];
}
TabSetWithLinks.Inherit(TabSetWindow, "TabSetWithLinks");
TabSetWithLinks.Defaults({
	templateName: "BindKraft/TabSetWithLinksTemplate"
});
// TabSetWithLinks.prototype.templateSource = new DOMConnector('#TabSetWithLinksTemplate');
TabSetWithLinks.prototype.init = function () {
    var tabsScrollableMain = $(this.root).find('.scrollable_tabs_main');
    tabsScrollableMain.scrollable({ circular: false, mousewheel: true, keyboard: true });
    var left = $(this.root).find('.prev_tab_main').first();
    var right = $(this.root).find('.next_tab_main').first();
};

TabSetWithLinks.prototype.addPage = function (page, options) {
    if (!IsNull(page)) {
        if (page.linkcaption) {
            this.linkcaptions.push(page);
        }
        else if (!page.invisible) {
            this.captions.push(page);
        }
    }
    var lastSelectedCaptionIndex = this.child('tabs').children('.c_selected_tab_caption').index();
    TabSetWindow.prototype.addPage.apply(this, arguments);
    
    if (lastSelectedCaptionIndex < 0) {
        lastSelectedCaptionIndex = 0;
    }
    $(this.child('tabs').children().get(lastSelectedCaptionIndex)).addClass('c_selected_tab_caption');
};
TabSetWithLinks.prototype.OnSelectCaption = function (e, dc) {
    var index = $(e.target).index();
    this.selectPage(dc);
    var clickedTab = this.child('tabs').children().get(index);
    $(clickedTab).addClass('c_selected_tab_caption');
};
TabSetWithLinks.prototype.OnSelectLinkCaption = function (e, dc) {
    if (!IsNull(dc.workonbehalf) && (dc.workonbehalf === true)) {
        return;
    }

    if (!this.tabshidden) {
        this.selectNonTabsPage(dc);
    }
};
TabSetWithLinks.prototype.hideTabs = function () {
    this.child('tab_nav').hide();
    this.tabshidden = true;
    WindowingMessage.fireOn(this, WindowEventEnum.SizeChanged, { vertical: true });
};
TabSetWithLinks.prototype.showTabs = function () {
    this.child('tab_nav').show();
    this.tabshidden = false;
    WindowingMessage.fireOn(this, WindowEventEnum.SizeChanged, { vertical: true });
};
TabSetWithLinks.prototype.back = function () {
    this.showTabs();
    this.selectPage(this.lastSelectedPage);
    var selectedCaption = this.child('tabs').children().get(this.lastSelectedCaptionIndex);
    $(selectedCaption).addClass('c_selected_tab_caption');
};
TabSetWithLinks.prototype.selectNonTabsPage = function (page) {
    this.hideTabs();
    this.lastSelectedPage = this.get_selectedpage();
    this.lastSelectedCaptionIndex = this.child('tabs').children('.c_selected_tab_caption').index();
    this.selectPage(page);
};

TabSetWithLinks.prototype.captions = null;
TabSetWithLinks.prototype.linkcaptions = null;
TabSetWithLinks.prototype.lastSelectedPage = null;