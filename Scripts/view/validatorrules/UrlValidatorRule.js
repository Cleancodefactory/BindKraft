////////////// UrlValidatorRule //////////////////////////////
function UrlValidatorRule(v) {
	ValidateValue.apply(this, arguments);
}
UrlValidatorRule.Inherit(ValidateValue, "UrlValidatorRule");
UrlValidatorRule.registerValidator("url");
//UrlValidatorRule.expresion = /^(http|https|ftp)\:\/\/[a-zA-Z0-9\-\.]+\.[a-zA-Z]{2,3}(?:[a-zA-Z0-9]*)?\/?([a-zA-Z0-9-\._?\,\&\;\%\$\#\=\~])*$/i;
//UrlValidatorRule.expresion = /^(http|https|ftp)\:\/\/[a-zA-Z0-9\-\.]+\.[a-zA-Z]{2,3}(?:[a-zA-Z0-9]*)?\/(?[a-zA-Z0-9\-\._\?\,\'\/\\%\$#\=~])*[^\.\,\)\(\s]$/i;
UrlValidatorRule.expresion = /^(http|ftp|https)\:\/\/[a-zA-Z0-9\-\.]+(\.[a-zA-Z])+([\w\-\.,@?^=%&amp;:\/~\+#])*$/i;
UrlValidatorRule.prototype.get_message = function (lastValue) {
	var msg = this.get_text();
	if (msg == null || msg.length == 0) {
		msg = Binding.resources.get("Validation.Url");
	}
	if (msg == null || msg.length == 0) {
		msg = "URL : %l is incorrect";
	}
	return msg.sprintf(lastValue);
};
UrlValidatorRule.prototype.validateValue = function (validator, value, binding) {
	var result = ValidationResultEnum.correct;
	if (!(value.match(UrlValidatorRule.expresion))) {
		result = ValidationResultEnum.incorrect;
	}
	//    if (!(UrlValidatorRule.expresion.test(value))) {
	//        result = ValidationResultEnum.incorrect;
	return this.validationResult(result);
};
var UrlValidatorControl = UrlValidatorRule;
//////////////////////END/////////////////////////////