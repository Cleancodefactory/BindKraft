
// Test validator - ref implementation //
/*CLASS*/
function TestValidateControl(v) {
	ValidateValue.apply(this, arguments);
}
TestValidateControl.Inherit(ValidateValue, "TestValidateControl");
TestValidateControl.registerValidator("testv");
TestValidateControl.prototype.validateValue = function (validator, value, binding) {
	if (value == null || value.length == 0) return ValidationResultEnum.incorrect;
	if (value.length > 1) return ValidationResultEnum.fail;
	return ValidationResultEnum.correct;
};


////////////// CompareNumbersValidatorControl /////////////////////////
function CompareNumbersValidatorControl(v) {
	ValidateValue.apply(this, arguments);
}
CompareNumbersValidatorControl.Inherit(ValidateValue, "CompareNumbersValidatorControl");
CompareNumbersValidatorControl.registerValidator("comparenumbers");
CompareNumbersValidatorControl.prototype.$valueToCompare = null;
CompareNumbersValidatorControl.prototype.get_message = function (lastValue) {
	var msg = this.get_text();
	if (IsNull(msg) || msg.length == 0) {
		msg = Binding.resources.get("Validation.Compare");
	}
	if (IsNull(msg) || msg.length == 0) {
		msg = "Input value must be equal to %l";
	}
	return msg.sprintf(this.get_valueToCompare());
};
CompareNumbersValidatorControl.prototype.get_valueToCompare = function () {
	return this.$valueToCompare;
};
CompareNumbersValidatorControl.prototype.set_valueToCompare = function (v) {
	this.$valueToCompare = v;
};
CompareNumbersValidatorControl.prototype.validateValue = function (validator, value, binding) {
	var result = ValidationResultEnum.correct;
	if (!IsNull(value) && value.toString().trim().length > 0) {
		var numericValue = parseFloat(value);
		var numericValueToCompare = parseFloat(this.get_valueToCompare());
		if (numericValue != numericValueToCompare) {
			result = ValidationResultEnum.incorrect;
		}
	}
	return this.validationResult(result);
};
//////////////////////END/////////////////////////////


////////////// CompareDatesValidatorControl /////////////////////////
function CompareDatesValidatorControl(v) {
	ValidateValue.apply(this, arguments);
	this.raw = 0;
}
CompareDatesValidatorControl.Inherit(ValidateValue, "CompareDatesValidatorControl");
CompareDatesValidatorControl.registerValidator("comparedates");
CompareDatesValidatorControl.prototype.$valueToCompare = null;
CompareDatesValidatorControl.prototype.$isSmaller = null;
CompareDatesValidatorControl.prototype.get_message = function (lastValue) {
	var msg = this.get_text();
	if (IsNull(msg) || msg.length == 0) {
		if (!IsNull(this.$isSmaller)) {
			if (this.$isSmaller > 0) {
				msg = Binding.resources.get("Validation.CompareDateBefore");
			} else {
				msg = Binding.resources.get("Validation.CompareDateAfter");
			}
		}
	}
	if (IsNull(msg) || msg.length == 0) {
		if (!IsNull(this.$isSmaller)) {
			if (this.$isSmaller > 0) {
				msg = 'Input date must be before %l';
			} else {
				msg = 'Input date must be after %l';
			}
		}
	}
	return msg.sprintf(this.get_valueToCompare());
};
CompareDatesValidatorControl.prototype.get_valueToCompare = function () {
	return this.$valueToCompare;
};
CompareDatesValidatorControl.prototype.set_valueToCompare = function (v) {
	this.$valueToCompare = v;
};

CompareDatesValidatorControl.prototype.get_isSmaller = function () {
	return this.$isSmaller;
};
CompareDatesValidatorControl.prototype.set_isSmaller = function (v) {
	this.$isSmaller = v;
};

CompareDatesValidatorControl.prototype.validateValue = function (validator, value, binding) {
	var result = ValidationResultEnum.correct;
	if (!IsNull(value) && value.toString().trim().length > 0) {
		if (!IsNull(this.$isSmaller)) {
			var value4ComparisonDate = this.get_valueToCompare();
			if (realTypeOf(value4ComparisonDate) == 'date') {
				if (this.$isSmaller > 0) {
					if (value >= value4ComparisonDate) {
						result = ValidationResultEnum.incorrect;
					}
				} else {
					if (value < value4ComparisonDate) {
						result = ValidationResultEnum.incorrect;
					}
				}
			}
		}
	}
	return this.validationResult(result);
};
//////////////////////END/////////////////////////////


//============================================/ FixedNumberValidatorControl \============================================>>

function FixedNumberValidatorControl(v) {
	ValidateValue.apply(this, arguments);
};

FixedNumberValidatorControl.Inherit(ValidateValue, "FixedNumberValidatorControl");
FixedNumberValidatorControl.registerValidator("fixednumbers");

FixedNumberValidatorControl.prototype.$before = null;
FixedNumberValidatorControl.prototype.$after = null;

FixedNumberValidatorControl.prototype.get_before = function () {
	return this.$before;
};
FixedNumberValidatorControl.prototype.set_before = function (v) {
	this.$before = v;
};
FixedNumberValidatorControl.prototype.get_after = function () {
	return this.$after;
};
FixedNumberValidatorControl.prototype.set_after = function (v) {
	this.$after = v;
};

FixedNumberValidatorControl.prototype.get_message = function () {
	var msg = this.get_text();

	if (msg == null || msg.length == 0) {
		if (this.get_before() != null && this.get_after() != null) {
			msg = Binding.resources.get("Validation.FixedNumber");
			if (msg == null || msg.length == 0) {
				msg = "The input value must have most of %l numeric characters before the floating point and %l after";
			}
			return msg.sprintf(this.get_before(), this.get_after());
		} else {
			msg = Binding.resources.get("Validation.FixedNumber_LeftPartOnly");
			if (msg == null || msg.length == 0) {
				msg = "The input value must have most of %l numeric characters before the floating";
			}
			return msg.sprintf(this.get_before());
		}
	}
	return msg;
}

FixedNumberValidatorControl.prototype.validateValue = function (validator, value, binding) {
	var result = ValidationResultEnum.correct;

	var num = value.toString();
	if (!isNaN(Number(num))) {
		var numParts = num.split('.');
		var leftPart = numParts[0];
		var rightPart = numParts[1];

		if (this.get_before() != null) {
			if (leftPart == undefined || leftPart.length <= 0 || leftPart.length > this.get_before()) {
				result = ValidationResultEnum.incorrect;
			}

			if (this.get_after() != null) {
				if (rightPart != undefined) {
					if (rightPart.length <= 0 || rightPart.length != this.get_after()) {
						result = ValidationResultEnum.incorrect;
					}
				}
				else {
					result = ValidationResultEnum.incorrect;
				}
			}
		}
	} else {
		result = ValidationResultEnum.incorrect;
	}

	return this.validationResult(result);
}

//<<============================================/ END FixedNumberValidatorControl \============================================

////////////// RangeNumbersValidatorControl /////////////////////////
function RangeNumbersValidatorControl(v) {
	ValidateValue.apply(this, arguments);
}
RangeNumbersValidatorControl.Inherit(ValidateValue, "RangeNumbersValidatorControl");
RangeNumbersValidatorControl.registerValidator("rangenumbers");
RangeNumbersValidatorControl.prototype.$minValue = null;
RangeNumbersValidatorControl.prototype.$maxValue = null;
RangeNumbersValidatorControl.prototype.get_minValue = function () {
	return this.$minValue;
};
RangeNumbersValidatorControl.prototype.set_minValue = function (v) {
	this.$minValue = v;
};
RangeNumbersValidatorControl.prototype.get_maxValue = function () {
	return this.$maxValue;
};
RangeNumbersValidatorControl.prototype.set_maxValue = function (v) {
	this.$maxValue = v;
};
RangeNumbersValidatorControl.prototype.get_message = function (lastValue) {
	var msg = this.get_text();

	if (msg == null || msg.length == 0) {
		if (this.get_minValue() != null && this.get_maxValue() != null) {
			msg = Binding.resources.get("Validation.Range");
			if (msg == null || msg.length == 0) {
				msg = msg = "The input value must be between %l and %l";
			}
			return msg.sprintf(this.get_minValue(), this.get_maxValue());
		} else if (this.get_minValue() != null) {
			msg = Binding.resources.get("Validation.Range_MinValueOnly");
			if (msg == null || msg.length == 0) {
				msg = "The input value must be greater or equal to %l";
			}
			return msg.sprintf(this.get_minValue());
		} else if (this.get_maxValue() != null) {
			msg = Binding.resources.get("Validation.Range_MaxValueOnly");
			if (msg == null || msg.length == 0) {
				msg = "The input value must be less or equal to %l";
			}
			return msg.sprintf(this.get_maxValue());
		}
	}

	return msg;
};
RangeNumbersValidatorControl.prototype.validateValue = function (validator, value, binding) {
	var result = ValidationResultEnum.correct;
	if (!IsNull(value) && value.toString().trim().length != 0) {
		var minValue = parseFloat(this.get_minValue());
		if (IsNull(minValue)) {
			minValue = Number.MIN_VALUE;
		}
		var maxValue = parseFloat(this.get_maxValue());
		if (IsNull(maxValue)) {
			maxValue = Number.MAX_VALUE;
		}
		var numericValue = parseFloat(value);
		if (numericValue < minValue || numericValue > maxValue) {
			result = ValidationResultEnum.incorrect;
		}
	}
	return this.validationResult(result);
};
//////////////////////END/////////////////////////////


////////////// CRangeDatesValidator //////////////////////////////
function RangeDatesValidatorControl(v) {
	ValidateValue.apply(this, arguments);
}
RangeDatesValidatorControl.Inherit(RangeNumbersValidatorControl, "RangeDatesValidatorControl");
RangeDatesValidatorControl.registerValidator("rangedates");
RangeDatesValidatorControl.prototype.$minValue = null;
RangeDatesValidatorControl.prototype.$maxValue = null;
RangeDatesValidatorControl.prototype.raw = false;
RangeDatesValidatorControl.prototype.get_minValue = function () {
	return this.$minValue;
};
RangeDatesValidatorControl.prototype.set_minValue = function (v) {
	this.$minValue = v;
};
RangeDatesValidatorControl.prototype.get_maxValue = function () {
	return this.$maxValue;
};
RangeDatesValidatorControl.prototype.set_maxValue = function (v) {
	this.$maxValue = v;
};
RangeDatesValidatorControl.prototype.get_message = function (lastValue) {
	var msg = this.get_text();
	if (msg == null || msg.length == 0) {
		msg = Binding.resources.get("jsValidation.RangeDate");
	}
	if (msg == null || msg.length == 0) {
		msg = "Input value must be between %l and %l";
	}
	return msg.sprintf(this.get_minValue(), this.get_maxValue());
};
RangeDatesValidatorControl.prototype.validateValue = function (validator, value, binding) {
	var result = ValidationResultEnum.correct;
	if (!IsNull(value) && value.toString().trim().length != 0) {
		var formatterObject = Function.classes[binding.$formatter];
		var dateValue = value; //formatterObject.FromTarget(formatterObject.ToTarget(value));
		var minValue = this.get_minValue();
		minValue = !IsNull(minValue) ? new Date(minValue) : new Date(1800, 0, 1);
		var maxValue = this.get_maxValue();
		maxValue = !IsNull(maxValue) ? new Date(maxValue) : new Date(9999, 11, 31);
		if (dateValue < minValue || dateValue > maxValue) {
			result = ValidationResultEnum.incorrect;
		}
	}
	return this.validationResult(result);
};
//////////////////////END/////////////////////////////

////////////// LengthValidatorControl //////////////////////////////
function LengthValidatorControl(v) {
	ValidateValue.apply(this, arguments);
}
LengthValidatorControl.Inherit(ValidateValue, "LengthValidatorControl");
LengthValidatorControl.registerValidator("length");
LengthValidatorControl.prototype.$minChar = null;
LengthValidatorControl.prototype.$maxChar = null;
LengthValidatorControl.prototype.$allowEmptySpaces = true;
LengthValidatorControl.prototype.set_minChar = function (v) {
	this.$minChar = v;
};
LengthValidatorControl.prototype.set_maxChar = function (v) {
	this.$maxChar = v;
};
LengthValidatorControl.prototype.set_allowEmptySpaces = function (v) {
	this.$allowEmptySpaces = 
		(v === 1 || v === "1" || v === "true" || v === true) ? true: false;
};
LengthValidatorControl.prototype.get_minChar = function () {
	return this.$minChar;
};
LengthValidatorControl.prototype.get_maxChar = function () {
	return this.$maxChar;
};
LengthValidatorControl.prototype.get_allowEmptySpaces = function () {
	return this.$allowEmptySpaces;
};
LengthValidatorControl.prototype.get_message = function (lastValue) {
	var msg = this.get_text();
	if (msg == null || msg.length == 0) {
		msg = Binding.resources.get("Validation.Length");
	}
	if (msg == null || msg.length == 0) {
		msg = this.get_allowEmptySpaces() ? 
		"Input value must be between %l and %l" : 
		"Input value must be between %l and %l. Only empty spaces are not allowed!";
	}
	return msg.sprintf(this.get_minChar(), this.get_maxChar());
};
LengthValidatorControl.prototype.validateValue = function (validator, value, binding) {
	var result = ValidationResultEnum.correct;
	var min = this.get_minChar();
	var max = this.get_maxChar();
	
	if (!this.get_allowEmptySpaces())
		value = value.trim();
	
	if (!IsNull(value) && (!IsNull(min)) && (!IsNull(max))) {
		if ((value.length < min) || (max < value.length)) {
			result = ValidationResultEnum.incorrect;
		}
	}
	return this.validationResult(result);
};
//////////////////////END/////////////////////////////

////////////// RequiredFieldValidatorControl //////////////////////////////
function RequiredFieldValidatorControl(v) {
	ValidateValue.apply(this, arguments);
}
RequiredFieldValidatorControl.Inherit(ValidateValue, "RequiredFieldValidatorControl");
RequiredFieldValidatorControl.registerValidator("required");
RequiredFieldValidatorControl.prototype.get_message = function (lastValue) {
	var msg = this.get_text();
	if (msg == null || msg.length == 0) {
		msg = Binding.resources.get("Validation.Required");
	}
	if (msg == null || msg.length == 0) {
		msg = "Field is required";
	}
	return msg;
};
RequiredFieldValidatorControl.prototype.validateValue = function (validator, value, binding) {
	var result = ValidationResultEnum.correct;
	if (IsNull(value) || value.toString().trim().length == 0) {
		result = ValidationResultEnum.incorrect;
	}
	return this.validationResult(result);
};
//////////////////////END/////////////////////////////


////////////// RegularExpressionValidatorControl //////////////////////////////
function RegularExpressionValidatorControl(v) {
	ValidateValue.apply(this, arguments);
}
RegularExpressionValidatorControl.Inherit(ValidateValue, "RegularExpressionValidatorControl");
RegularExpressionValidatorControl.registerValidator("regex");
RegularExpressionValidatorControl.prototype.$expresion = null;
RegularExpressionValidatorControl.prototype.set_expresion = function (v) {
	return this.$expresion = v;
};
RegularExpressionValidatorControl.prototype.get_expresion = function () {
	return this.$expresion;
};

//Regex Flags
RegularExpressionValidatorControl.prototype.$global = 0;
RegularExpressionValidatorControl.prototype.$ignorecase = 0;
RegularExpressionValidatorControl.prototype.$multiline = 0;

RegularExpressionValidatorControl.prototype.set_global = function (v) {
	return this.$global = Number(v);
};
RegularExpressionValidatorControl.prototype.get_global = function () {
	return this.$global;
};

RegularExpressionValidatorControl.prototype.set_ignorecase = function (v) {
	return this.$ignorecase = Number(v);
};
RegularExpressionValidatorControl.prototype.get_ignorecase = function () {
	return this.$ignorecase;
};

RegularExpressionValidatorControl.prototype.set_multiline = function (v) {
	return this.$multiline = Number(v);
};
RegularExpressionValidatorControl.prototype.get_multiline = function () {
	return this.$multiline;
};

RegularExpressionValidatorControl.prototype.get_message = function (lastValue) {
	var msg = this.get_text();
	if (msg == null || msg.length == 0) {
		msg = Binding.resources.get("Validation.Regex");
	}
	if (msg == null || msg.length == 0) {
		msg = "Regular expression: %l is not match";
	}
	return msg.sprintf(lastValue);
};
RegularExpressionValidatorControl.prototype.validateValue = function (validator, value, binding) {
	var result = ValidationResultEnum.correct;
	var expresion = this.get_expresion();
	var flags = "";
	if (!isNaN(this.get_global()) && this.get_global()) {
		flags += 'g';
	}
	if (!isNaN(this.get_ignorecase()) && this.get_ignorecase()) {
		flags += 'i';
	}
	if (!isNaN(this.get_multiline()) && this.get_multiline()) {
		flags += 'm';
	}

	if (!IsNull(expresion)) {
		var regex = new RegExp(expresion, flags);
		if (!(value.match(regex))) {
			result = ValidationResultEnum.incorrect;
		}
	}
	return this.validationResult(result);
};
//////////////////////END/////////////////////////////


////////////// EmailValidatorControl //////////////////////////////
function EmailValidatorControl(v) {
	ValidateValue.apply(this, arguments);
}
EmailValidatorControl.Inherit(ValidateValue, "EmailValidatorControl");
EmailValidatorControl.registerValidator("email");
EmailValidatorControl.expresion = /^[-a-z0-9~!$%^&*_=+}{\'?]+(\.[-a-z0-9~!$%^&*_=+}{\'?]+)*@([a-z0-9_][-a-z0-9_]*(\.[-a-z0-9_]+)*\.([a-z][a-z]+)|([0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}))(:[0-9]{1,5})?$/i;
EmailValidatorControl.addExpresion = /^\w+[\w-\.]*\@\w+((-\w+)|(\w*))\.[a-z]{2,3}$/;
EmailValidatorControl.prototype.get_message = function (lastValue) {
	var msg = this.get_text();
	if (msg == null || msg.length == 0) {
		msg = Binding.resources.get("Validation.Email");
	}
	if (msg == null || msg.length == 0) {
		msg = "Email: %l is incorrect";
	}
	return msg.sprintf(lastValue);
}.Description("Message from the validator");
EmailValidatorControl.prototype.validateValue = function (validator, value, binding) {
	var result = ValidationResultEnum.correct;
	// 
	if (!IsNull(value)) {
		if (!(value.match(EmailValidatorControl.expresion))) {
			result = ValidationResultEnum.incorrect;
		}
		//        if (!EmailValidatorControl.addExpresion.test(value)) {
		//            result = ValidationResultEnum.incorrect;
		//        }
	}
	return this.validationResult(result);
}.Description(
	"Validates the input" +
	"\n@param validator - " +
	"\n@param value - " +
	"\n@param binding - " +
	"\n@return @enum ValidationResultEnum value"
);
//////////////////////END/////////////////////////////

////////////// ZipCodeValidatorControl //////////////////////////////
function ZipCodeValidatorControl(v) {
	ValidateValue.apply(this, arguments);
}
ZipCodeValidatorControl.Inherit(ValidateValue, "ZipCodeValidatorControl");
ZipCodeValidatorControl.registerValidator("zipcode");
//5 digit US ZIP code + 4 standard
ZipCodeValidatorControl.expresion = /^\d{5}$|^\d{5}-\d{4}$/i;
ZipCodeValidatorControl.addExpresion = '';
ZipCodeValidatorControl.prototype.get_message = function (lastValue) {
	var msg = this.get_text();
	if (msg == null || msg.length == 0) {
		msg = Binding.resources.get("Validation.ZipCode");
	}
	if (msg == null || msg.length == 0) {
		msg = "ZipCode: %l is incorrect";
	}
	return msg.sprintf(lastValue);
};
ZipCodeValidatorControl.prototype.validateValue = function (validator, value, binding) {
	var result = ValidationResultEnum.correct;
	if (!IsNull(value)) {
		if (!(value.match(ZipCodeValidatorControl.expresion))) {
			result = ValidationResultEnum.incorrect;
		}
		//if (!ZipCodeValidatorControl.expresion.test(value)) { result = ValidationResultEnum.incorrect; }
	}
	return this.validationResult(result);
};
//////////////////////END/////////////////////////////

////////////// PhonenumberValidatorControl //////////////////////////////
function PhonenumberValidatorControl(v) {
	ValidateValue.apply(this, arguments);
}
PhonenumberValidatorControl.Inherit(ValidateValue, "PhonenumberValidatorControl");
PhonenumberValidatorControl.registerValidator("phonenumber");
PhonenumberValidatorControl.expresion = /^((\d[-. ]?)?((\(\d{3}\))|\d{3}))?[-. ]?\d{3}[-. ]?\d{4}$/;
PhonenumberValidatorControl.prototype.get_message = function (lastValue) {
	var msg = this.get_text();
	if (msg == null || msg.length == 0) {
		msg = Binding.resources.get("Validation.PhoneNumber");
	}
	if (msg == null || msg.length == 0) {
		msg = "Phone number is incorrect";
	}
	return msg.sprintf();
};
PhonenumberValidatorControl.prototype.validateValue = function (validator, value, binding) {
	var result = ValidationResultEnum.correct;
	if (!IsNull(value)) {
		if (!(value.match(PhonenumberValidatorControl.expresion))) {
			result = ValidationResultEnum.incorrect;
		}
	}
	return this.validationResult(result);
};
//////////////////////END/////////////////////////////

////////////// UrlValidatorControl //////////////////////////////
function UrlValidatorControl(v) {
	ValidateValue.apply(this, arguments);
}
UrlValidatorControl.Inherit(ValidateValue, "UrlValidatorControl");
UrlValidatorControl.registerValidator("url");
//UrlValidatorControl.expresion = /^(http|https|ftp)\:\/\/[a-zA-Z0-9\-\.]+\.[a-zA-Z]{2,3}(?:[a-zA-Z0-9]*)?\/?([a-zA-Z0-9-\._?\,\&\;\%\$\#\=\~])*$/i;
//UrlValidatorControl.expresion = /^(http|https|ftp)\:\/\/[a-zA-Z0-9\-\.]+\.[a-zA-Z]{2,3}(?:[a-zA-Z0-9]*)?\/(?[a-zA-Z0-9\-\._\?\,\'\/\\%\$#\=~])*[^\.\,\)\(\s]$/i;
UrlValidatorControl.expresion = /^(http|ftp|https)\:\/\/[a-zA-Z0-9\-\.]+(\.[a-zA-Z])+([\w\-\.,@?^=%&amp;:\/~\+#])*$/i;
UrlValidatorControl.prototype.get_message = function (lastValue) {
	var msg = this.get_text();
	if (msg == null || msg.length == 0) {
		msg = Binding.resources.get("Validation.Url");
	}
	if (msg == null || msg.length == 0) {
		msg = "URL : %l is incorrect";
	}
	return msg.sprintf(lastValue);
};
UrlValidatorControl.prototype.validateValue = function (validator, value, binding) {
	var result = ValidationResultEnum.correct;
	if (!(value.match(UrlValidatorControl.expresion))) {
		result = ValidationResultEnum.incorrect;
	}
	//    if (!(UrlValidatorControl.expresion.test(value))) {
	//        result = ValidationResultEnum.incorrect;
	return this.validationResult(result);
};
//////////////////////END/////////////////////////////

////////////// NumberValidatorControl //////////////////////////////
function NumberValidatorControl(v) {
	ValidateValue.apply(this, arguments);
}
NumberValidatorControl.Inherit(ValidateValue, "NumberValidatorControl");
NumberValidatorControl.registerValidator("number");
NumberValidatorControl.expresion = /^(\+|-)?\d*$/;
NumberValidatorControl.prototype.get_message = function (lastValue) {
	var msg = this.get_text();
	if (msg == null || msg.length == 0) {
		msg = Binding.resources.get("Validation.Number");
	}
	if (msg == null || msg.length == 0) {
		msg = "This field requires a numeric value !";
	}
	return msg.sprintf();
};
NumberValidatorControl.prototype.validateValue = function (validator, value, binding) {
	var result = ValidationResultEnum.correct;
	if (!(NumberValidatorControl.expresion.test(value))) {
		result = ValidationResultEnum.incorrect;
	}
	return this.validationResult(result);
};
//////////////////////END/////////////////////////////

////////////// StateCodeValidatorControl //////////////////////////////
function StateCodeValidatorControl(v) {
	ValidateValue.apply(this, arguments);
}
StateCodeValidatorControl.Inherit(ValidateValue, "StateCodeValidatorControl");
StateCodeValidatorControl.registerValidator("statecode");
StateCodeValidatorControl.expresion = /^(?:(A[KLRZ]|C[AOT]|D[CE]|FL|GA|HI|I[ADLN]|K[SY]|LA|M[ADEINOST]|N[CDEHJMVY]|O[HKR]|P[AR]|RI|S[CD]|T[NX]|UT|V[AIT]|W[AIVY]))$/;
StateCodeValidatorControl.prototype.get_message = function (lastValue) {
	var msg = this.get_text();
	if (msg == null || msg.length == 0) {
		msg = Binding.resources.get("Validation.StateCode");
	}
	if (msg == null || msg.length == 0) {
		msg = "Invalid code";
	}
	return msg.sprintf();
};
StateCodeValidatorControl.prototype.validateValue = function (validator, value, binding) {
	var result = ValidationResultEnum.correct;
	if (!IsNull(value)) {
		if (!(value.match(StateCodeValidatorControl.expresion))) {
			result = ValidationResultEnum.incorrect;
		}
	}
	return this.validationResult(result);
};
//////////////////////END/////////////////////////////

////////////// AsyncValidatorControl //////////////////////////////
function AsyncValidatorControl(v) {
	ValidateValue.apply(this, arguments);
	this.$validator = v;
	this.$order = 10000;
};

AsyncValidatorControl.Inherit(ValidateValue, "AsyncValidatorControl");
AsyncValidatorControl.registerValidator("async");
AsyncValidatorControl.prototype.$validator = null;
AsyncValidatorControl.prototype.get_delegate = function () { return null; };
AsyncValidatorControl.prototype.get_param1 = function () { return null; };
AsyncValidatorControl.prototype.get_param2 = function () { return null; };
AsyncValidatorControl.prototype.get_param3 = function () { return null; };
AsyncValidatorControl.ImplementProperty("nocheck", null);
AsyncValidatorControl.prototype.get_message = function (lastValue) {
	var msg = this.get_text();
	if (msg != null && msg.length > 0) msg = msg.sprintf(lastValue);
	return msg;
};
AsyncValidatorControl.prototype.validateValue = function (validator, value, binding) {
	var result = ValidationResultEnum.correct;
	var d = this.get_delegate();
	if (this.get_nocheck() || (d != null && !IsNull(value))) {
		var r = d.invoke({ rule: this, validator: validator, value: value, binding: binding });
		if (r > result) result = r;
		if (r == ValidationResultEnum.pending) return r;
	}
	return this.validationResult(result);
};

// the delegate should call this method if it is performing an async operation
AsyncValidatorControl.prototype.reportBack = function (result, message, forceIndicate) {
	if (message != null) this.$text = message;
	if (this.$validator != null) {
		this.indicate = forceIndicate;
		this.$validator.reportResult(this, result);
	}
};

/* Callback delegate prototype:
	function ( obj) returns ValidationResultEnum
	obj {
		rule: this rule
		validator: the validator container
		value: value to validate
		binding: the binding from which the value has come
	}
	Asynchronous delegates must call back reportBack on rule e.g.
	rule.reportBack(result [, changeMessage[, forceIndicate]]);
	the changeMessage will have no effect if any is specified in the markup (which takes precedence)
	the forceIndicate triggers any indication of the state of the validation supported by the container 
	even if the result is correct (by default correct values do not show part or all of the validation indication UI)
*/
//////////////////////END/////////////////////////////

////////////// DelegateValidatorControl //////////////////////////////
function DelegateValidatorControl(v) {
	ValidateValue.apply(this, arguments);
	this.$validator = v;
	this.$order = 10000;
};

DelegateValidatorControl.Inherit(ValidateValue, "DelegateValidatorControl");
DelegateValidatorControl.registerValidator("sync");
DelegateValidatorControl.prototype.$validator = null;
DelegateValidatorControl.prototype.get_delegate = function () { return null; };
DelegateValidatorControl.prototype.get_param1 = function () { return null; };
DelegateValidatorControl.prototype.get_param2 = function () { return null; };
DelegateValidatorControl.prototype.get_param3 = function () { return null; };
DelegateValidatorControl.prototype.get_message = function (lastValue) {
	var msg = this.get_text();
	if (msg != null && msg.length > 0) msg = msg.sprintf(lastValue);
	return msg;
};

DelegateValidatorControl.prototype.validateValue = function (validator, value, binding) {
	var result = ValidationResultEnum.correct;
	var d = this.get_delegate();
	if (d != null && !IsNull(value)) {
		return d.invoke({ rule: this, validator: validator, value: value, binding: binding });
	}
	return this.validationResult(result);
};



function ValidationSummaryControl(v) {
	ValidateValue.apply(this, arguments);
}
ValidationSummaryControl.Inherit(ValidateValue, "ValidationSummaryControl");
ValidationSummaryControl.prototype.validateValue = function (validator, value, binding) {
	var result = ValidationResultEnum.correct;
	return this.validationResult(result);
};

////////////// RangeDatesValidatorControlEx //////////////////////////////
function RangeDatesValidatorControlEx(v) {
	ValidateValue.apply(this, arguments);
}
RangeDatesValidatorControlEx.Inherit(RangeNumbersValidatorControl, "RangeDatesValidatorControlEx");
RangeDatesValidatorControlEx.registerValidator("rangedatesex");
RangeDatesValidatorControlEx.prototype.$minValue = null;
RangeDatesValidatorControlEx.prototype.$maxValue = null;
RangeDatesValidatorControlEx.prototype.get_minValue = function () {
	return this.$minValue;
};
RangeDatesValidatorControlEx.prototype.set_minValue = function (v) {
	this.$minValue = v;
};
RangeDatesValidatorControlEx.prototype.get_maxValue = function () {
	return this.$maxValue;
};
RangeDatesValidatorControlEx.prototype.set_maxValue = function (v) {
	this.$maxValue = v;
};
RangeDatesValidatorControlEx.prototype.get_message = function (lastValue) {
	if (this.$isValid) return "Data is OK";
	var msg = this.get_text();
	if (msg == null || msg.length == 0) {
		msg = Binding.resources.get("jsValidation.RangeDate");
	}
	if (msg == null || msg.length == 0) {
		msg = "Input value must be between %l and %l";
	}
	return msg.sprintf(this.get_minValue(), this.get_maxValue());
};
RangeDatesValidatorControlEx.prototype.validateValue = function (validator, value, binding) {
	var result = ValidationResultEnum.correct;
	if (!IsNull(value) && value.toString().trim().length != 0) {
		var minValue = DateShort.FromTarget(DateShort.ToTarget(this.get_minValue()));
		var maxValue = DateShort.FromTarget(DateShort.ToTarget(this.get_maxValue()));
		if (IsNull(minValue)) {
			minValue = new Date(1800, 0, 1);
		}
		if (IsNull(maxValue)) {
			maxValue = new Date(9999, 11, 31);
		}
		var dateValue = DateShort.FromTarget(value);
		if (dateValue < minValue || dateValue > maxValue || IsNull(dateValue)) {
			result = ValidationResultEnum.incorrect;
		}
	}
	else {
		result = ValidationResultEnum.incorrect;
	};
	return this.validationResult(result);
};
//////////////////////END/////////////////////////////

////////////// SameValuesValidatorControl //////////////////////////////
function SameValuesValidatorControl(v) {
	ValidateValues.apply(this, arguments);
}

SameValuesValidatorControl.Inherit(ValidateValues, "SameValuesValidatorControl");
SameValuesValidatorControl.registerValidator("samevalues");
SameValuesValidatorControl.prototype.get_message = function (lastValue) {
	var msg = this.get_text();
	if (msg == null || msg.length == 0) {
		msg = "Mismatching Values"; //Binding.resources.get("Validation.MismatchingValues");
	}

	return msg.sprintf();
};

SameValuesValidatorControl.prototype.validateValues = function (validator, values, bindings) {
	var result = ValidationResultEnum.correct;
	if (!IsNull(values) && values.length > 1) {
		var curval = values[0];
		for (var i = 1; i < values.length; i++) {
			if (!values[i]) continue;
			if (!curval) {
				curval = values[i];
			}
			if (values[i] != curval) return this.validationResult(ValidationResultEnum.incorrect);
		}
	}
	return this.validationResult(result);
};
//////////////////////END/////////////////////////////

////////////// ValidDateFieldValidatorControl //////////////////////////////
function ValidDateFieldValidatorControl(v) {
	ValidateValue.apply(this, arguments);
}
ValidDateFieldValidatorControl.Inherit(ValidateValue, "ValidDateFieldValidatorControl");
ValidDateFieldValidatorControl.registerValidator("validdate");
ValidDateFieldValidatorControl.prototype.get_message = function (lastValue) {
	var msg = this.get_text();
	if (msg == null || msg.length == 0) {
		msg = Binding.resources.get("Validation.ValidDate");
	}
	if (msg == null || msg.length == 0) {
		msg = 'Date is not valid. Required format "' + this.get_dateformat() + '".';
	}
	return msg;
};
ValidDateFieldValidatorControl.prototype.set_dateformat = function (v) {
	this.$dateformat = v;
};
ValidDateFieldValidatorControl.prototype.get_dateformat = function () {
	return this.$dateformat;
};
ValidDateFieldValidatorControl.prototype.validateValue = function (validator, value, binding) {
	var result = ValidationResultEnum.correct;
	if (!IsNull(value) && !value.toString().trim().length == 0) {
		var date = Globalize.parseDate(value, this.get_dateformat());
		if (IsNull(date)) {
			result = ValidationResultEnum.incorrect;
		}
	}
	return this.validationResult(result);
};
//////////////////////END/////////////////////////////