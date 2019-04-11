


///////////////////////////////////////////////////////////
// Class MultiStateControl
// Used to change state across its content.

/*  ////////////////////////////////////////
    //////////////////Implementation Example

<div data-class="MultiStateControl paramset='p1,p2'"
    data-bind-$p1[0]="{read source=static text='/Content/Images/MenuPhotos/loading.gif'}"
    data-bind-$p1[1]="{read source=static text='/Content/Images/MenuPhotos/validation_fail.png'}"
    data-bind-$p2[0]="{read source=static text='Text 1'}"
    data-bind-$p2[1]="{read source=static text='Text 2'}"        
    >
    <img  data-class="ImageElement" data-bind-$src="{read source=__control path=$p1.(__control@$state)}" class="c_left_img_spliter" data-on-click="{bind source=__control path=NextState}"/>
    <span data-bind-text="{read source=__control path=$p2.(__control@$state)}"></span>
</div>*/

function MultiStateControl() {
    Base.apply(this, arguments);
};
MultiStateControl.Inherit(Base, "MultiStateControl");
MultiStateControl.Implement(IUIControl);
// get/set state
MultiStateControl.prototype.$state = null;
MultiStateControl.prototype.get_state = function () {
    return this.$state;
};
MultiStateControl.prototype.set_state = function (v) {
    if (v != null) {
        this.$state = v;
        this.updateTargets();
    }
};
MultiStateControl.ImplementProperty("paramset", new InitializeStringParameter("Used to hold the sets of parameters.", ""));

MultiStateControl.prototype.NextState = function () {
    var s = this.get_state();
    var p = this.get_paramset();
    var l = 0;
    if (!IsNull(p) && p != "") {
        var arr = p.split(",");
        for (var i = 0; i < arr.length; i++) {
            if (this["$" + arr[i]].length > l) {
                l = this["$" + arr[i]].length;
            }
        }
    }
    l--;
    if (l <= s) {
        this.set_state(0);
    } else {
        this.set_state(++s);
    }
};
MultiStateControl.prototype.PrevState = function () {
    var s = this.get_state();
    var p = this.get_paramset();
    var l = 0;
    if (!IsNull(p) && p != "") {
        var arr = p.split(",");
        for (var i = 0; i < arr.length; i++) {
            if (this["$" + arr[i]].length > l) {
                l = this["$" + arr[i]].length;
            }
        }
    }
    l--;
    if (s == 0) {
        this.set_state(l);
    } else {
        this.set_state(--s);
    }
};
MultiStateControl.prototype.init = function () {
    if (this.$state == null) this.set_state(0);
    var p = this.get_paramset();
    if (!IsNull(p) && p != "") {
        var arr = p.split(",");
        for (var i = 0; i < arr.length; i++) {
            this["$" + arr[i]] = [];
            this["get_" + arr[i]] = this.genIndexedProp(arr[i]);
            this["set_" + arr[i]] = this.genSetIndexedProp(arr[i]);
        }
    }
};
// Used to create a generate prop function
MultiStateControl.prototype.genIndexedProp = function (pname) {
    return function (idx, v) {
        if (idx != null) {
            return this["$" + pname][this.get_state()];
        } else {
            return this["$" + pname];
        }
    };
};
MultiStateControl.prototype.genSetIndexedProp = function (pname) {
    return function (idx, v) {
        if (arguments.length > 1) {
            if (idx != null) {
                this["$" + pname][parseInt(idx,10)] = v;
            } else {
                this["$" + pname] = v;
            }
        } else {
            this["$" + pname] = parseInt(idx, 10); // if called with a single arg we assume the caller calls this as normal (non-indexed property).
        }
    };
};