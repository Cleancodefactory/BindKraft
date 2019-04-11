


function CardLinkBehavior() {
    ElementBehaviorBase.apply(this, arguments);
}
CardLinkBehavior.Inherit(ElementBehaviorBase, "CardLinkBehavior");
CardLinkBehavior.behaviorPhase = BehaviorPhaseEnum.bind;
CardLinkBehavior.prototype.init = function () {
    this.on("click", this.onClick);
    this.on("keypress", this.onKeypress);
    this.openedevent = new EventDispatcher(this);
};

CardLinkBehavior.prototype.set_baseurl = function (url) {
    this.$baseurl = url;
};
CardLinkBehavior.prototype.get_baseurl = function () {
    return this.$baseurl;
};
CardLinkBehavior.prototype.set_paramname = function (n) {
    this.$paramname = n;
};
CardLinkBehavior.prototype.get_paramname = function () {
    return this.$paramname
};
CardLinkBehavior.prototype.set_paramvalue = function (v) {
    this.$paramvalue = v;
};
CardLinkBehavior.prototype.get_paramvalue = function () {
    return this.$paramvalue
};

CardLinkBehavior.prototype.openedevent = null;

CardLinkBehavior.prototype.get_url = function () {
    var url = this.get_baseurl();
    var nam = this.get_paramname();
    var val = this.get_paramvalue();
    if (url != null) {
        if (nam != null && nam.lenght != 0) {
            if (val != null && val.lenght != 0) {
                return url + '?' + nam + '=' + val;
            } else {
                return url + '?' + nam + '=';
            }
        } else if (val != null && val.lenght != 0) {
            return url + '/' + val;
        } else {
            return url;
        }
    } return null;
};

CardLinkBehavior.prototype.openView = function (url) {
    if (window.Shell != null) {
        Shell.openWindowedView({ url: url });
    } else {
        CCardContainer.create(workspace, url);
    }
}
CardLinkBehavior.prototype.onClick = function () {
    var url = this.get_url();
    if (url != null) {
        this.openView(url);
        this.openedevent.invoke(this, url);
    }
};

CardLinkBehavior.prototype.onKeypress = function (e) {
    if (e.which == 13 || e.which == 32) {
        var url = this.get_url();
        if (url != null) {
            this.openView(url);
            this.openedevent.invoke(this, url);
        }
    }
};