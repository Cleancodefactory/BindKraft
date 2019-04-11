/*CLASS*/
// Use with a couple templates data-key = default | alternate. They are switched through the $alternatetemplate property.

function DualTemplate() {
    TemplateSwitcher.apply(this, arguments);
    this.requireData = false;
}

DualTemplate.Inherit(TemplateSwitcher, "DualTemplate");
DualTemplate.prototype.defaultTemplate = new InitializeStringParameter("The data-key of the default template. Default is 'default'", "default");
DualTemplate.prototype.alternateTemplate = new InitializeStringParameter("The data-key of the alternate template. Default is 'alternate'", "alternate");
DualTemplate.prototype.dynamicSwitch = new InitializeStringParameter("Default is false. If true the template is changed whenever the alternatetemplate property is set", false);
DualTemplate.prototype.$alternatetemplate = false;
DualTemplate.prototype.get_alternatetemplate = function() { return this.$alternatetemplate; };
DualTemplate.prototype.set_alternatetemplate = function(v) {
    this.$alternatetemplate = v;
    if (this.dynamicSwitch) this.$reset();
};
DualTemplate.prototype.Reset = function() {
    this.$reset();
};
DualTemplate.prototype.ToggleTemplate = function() {
    this.$alternatetemplate = !this.$alternatetemplate;
    this.$reset();
}
DualTemplate.prototype.select = function(switcher, template) {
    if (switcher.$alternatetemplate) {
        return this.getTemplateByKey(this.alternateTemplate);
    } else {
        return this.getTemplateByKey(this.defaultTemplate);
    }
};