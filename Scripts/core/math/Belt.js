


function Belt(l, t, r, b) {
    this.l = l; this.t = t; this.r = r; this.b = b;
};
Belt.Inherit(BaseObject, "Belt");
Belt.prototype.toString = function () {
    return ("l=" + this.l + ",t=" + this.t + ";r=" + this.r + ",b=" + this.b);
};