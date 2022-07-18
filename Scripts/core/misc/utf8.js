(function(){
	function UTF8Encoding() {
		BaseObject.apply(this,arguments);
	}
	UTF8Encoding.Inherit(BaseObject, "UTF8Encoding");

	//#region Static methods
	UTF8Encoding.encodeToBinaryString = function(input) { 
		var c;
		input = input + "";
		if (typeof input == "string") {
			var bstr = "";
 			for (var i = 0; i < input.length; i++) {
				c = input.charCodeAt(i);
				if (c < 0x80) { // ASCII - single byte
					bstr += String.fromCharCode(c);
				} else if((c >= 0x80) && (c < 0x800)) { // 2 bytes
					bstr += String.fromCharCode((c >> 6) | 0xC0); // hi 5 bits
					bstr += String.fromCharCode((c & 0x3F) | 0x80); // low 6 bits
				} else if (c >= 0x800 && c < 0x10000) { // 3 bytes
					bstr += String.fromCharCode((c >> 0xC) | 0xE0); // hi 4 bits
					bstr += String.fromCharCode(((c >> 6) & 0x3F) | 0x80); // middle 6 bits
					bstr += String.fromCharCode((c & 0x3F) | 0x80); // low 6 bits
				} else if (c >= 0x10000 && c <= 0x10FFFF) {
					bstr += String.fromCharCode((c >> 0x12) | 0xF0); // hi 3 bits
					bstr += String.fromCharCode(((c >> 12) & 0x3F) | 0x80); // hi low 6 bits
					bstr += String.fromCharCode(((c >> 6) & 0x3F) | 0x80); // low hi 6 bits
					bstr += String.fromCharCode((c & 0x3F) | 0x80); // low 6 bits
				} else {
					BaseObject.LASTERROR("Invalid code point");
					return null;
				}
			}
			return bstr;
		}
		BaseObject.LASTERROR("Invalid input");
		return null;
	}
	UTF8Encoding.decodeFromBinaryString = function(binput) {
		if (typeof binput == "string") {
			var s = ""; // output
			var cp,c,i = 0;
			while (i < binput.length) {
				c = binput.charCodeAt(i++);
				if (c < 0x80) {
					s += String.fromCharCode(c);
				} else if (c >= 0x80) { // Multibyte character
					if (c >= 0xF0) { // 4 bytes
						cp = (c & 0x07) << 18;
						cp = cp | ((binput.charCodeAt(i++) & 0x3F) << 12);
						cp = cp | ((binput.charCodeAt(i++) & 0x3F) << 6);
						cp = cp | (binput.charCodeAt(i++) & 0x3F);
					} else if (c >= 0xE0 && c < 0xF0) {// 3 bytes
						cp = (c & 0x0F) << 12;
						cp = cp | ((binput.charCodeAt(i++) & 0x3F) << 6);
						cp = cp | (binput.charCodeAt(i++) & 0x3F);
					} else if (c >= 0xC0 && c < 0xE0) { //2 bytes
						cp = (c & 0x1F) << 6;
						cp = cp | (binput.charCodeAt(i++) & 0x3F);
					} else {
						BaseObject.LASTERROR("Unrecognized UTF 8 character - " + c);
						cp = 0;
					}
					if (cp > 0) {
						s += String.fromCharCode(cp);
					}
				}
			}
			return s;
		}
		return null;
	}

})();

