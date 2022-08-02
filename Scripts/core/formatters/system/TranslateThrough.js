(function() {

    var SystemFormatterBase = Class("SystemFormatterBase");
    var IArgumentListParserStdImpl = InterfaceImplementer("IArgumentListParserStdImpl");
        

    /**
     * Converts empty values to null in the both direction
     * By default treats the value as string or uses its toString form to determine if it is empty.
     * Parameters number or bool can be passed to do this for numbers or booleans.
     */
    function TranslateThrough() {
        SystemFormatterBase.apply(this,arguments);
    }
    TranslateThrough.Inherit(SystemFormatterBase,"TranslateThrough");
    TranslateThrough.Implement(IArgumentListParserStdImpl,"trim");

    TranslateThrough.prototype.Read = function(val, bind, params) {
        var Localization = Class("Localization");
        var translations = Localization.get_translation(params);
        if (translations != null) {
            return BaseObject.GetProperty(val, null);
        } else {
            this.LASTERROR("Translations for the class " + params + " was not found. Check if it is loaded.");
            return null;
        }
    }
    TranslateThrough.prototype.Write = function(val, bind, params) {
        throw "TranslateThrough formatter works only in read direction (ToTarget)";
    }

})();