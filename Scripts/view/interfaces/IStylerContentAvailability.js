


// This Interface adds styling capabilities to a Base derived class
// Through binding the methods of this Interface can be bound to some data that changes the appearance of the element.
/*INTERFACE*/
function IStylerContentAvailability() { }
IStylerContentAvailability.Interface("IStylerContentAvailability");
IStylerContentAvailability.RequiredTypes("Base");
IStylerContentAvailability.prototype.get_cssclass = function () {
    if (this.is("Base")) {
        return $(this.root).attr("class");
    }
    return '';
};
IStylerContentAvailability.prototype.set_cssclass = function (v) {
    if (this.is("Base")) {
        return $(this.root).attr("class", v);
    }
    return $(this.root).attr("class", v);
};
IStylerContentAvailability.prototype.set_enabledcontent = function (v) {
    if (this.pstylerClassEnabled != null && this.pstylerClassEnabled.length > 0) {
        if (v) {
            this.set_cssclass(this.pstylerClassEnabled);
        } else {
            this.set_cssclass(this.pstylerClassDisabled);
        }
    } else if (this.pstylerBackgroundColorEnabled != null && this.pstylerBackgroundColorEnabled.length > 0) {
        if (v) {
            $(this.root).css("background-color", this.pstylerBackgroundColorEnabled);
        } else {
            $(this.root).css("background-color", this.pstylerBackgroundColorDisabled);
        }
    }
};