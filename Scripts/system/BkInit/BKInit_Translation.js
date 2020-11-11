function BKInit_Translation(appClass) {
    BaseObject.apply(this,arguments);
    this.appClass = appClass;
    this.manager = new (Class("LocalizationManagement"))(appClass);
}
BKInit_Translation.Inherit(BaseObject,"BKInit_Translation");
BKInit_Translation.prototype.add = function(locale, content) {
    this.manager.setTranslation(locale, content);
    return this;
}
