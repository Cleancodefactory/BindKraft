// DEPRECATED
/*
	Usage of these is almost fully removed and the file will be removed soon.
*/


// The stupid jQuery needs extensions 
(function ($) {
    $.fn.getAttributes = function (filt) {
        var a = {};

        if (!this.length)
            return a;
        var reFilt = (filt == null) ? null : new RegExp(filt, "i");
        var matches = null;

        $.each(this[0].attributes, function (index, attr) {
            matches = null;
            if (reFilt == null) {
                a[attr.name] = attr.value;
            } else {
                matches = attr.name.match(reFilt);
                if (matches != null && matches.length > 0) {
                    if (matches[1] == null) {
                        a[''] = attr.value;
                    } else {
                        a[matches[1]] = attr.value;
                    }
                }
            }
        });

        return a;
    };
    $.fn.Clean = function () { // Cleans the DOM inside the element(s) from any JB attachments
        if (!this.length)
            return this;
        this.each(function () { JBUtil.obliterateDom(this); });
        return this;
    };
    $.fn.Remove = function () { // Cleans the DOM and removes the elements(s) from it
        if (!this.length)
            return this;
        this.each(function () { JBUtil.obliterateDom(this, true); });
        return this.remove();
    };
    $.fn.Empty = function () { // Cleans the DOM inside the element(s) and removes it
        if (!this.length)
            return this;
        this.each(function () { JBUtil.obliterateDom(this); });
        return this.empty();
    };
})(jQuery);




(function ($) {
    $.fn.checkedn = function (v) {
        if (v != null) {
            for (var i = 0; i < this.length; i++) {
                this[i++].checked = v;
            }
        }
        if (this.length > 0) {
            return this[0].checked ? -1:0 ;
        }
        return 0;
    };
})(jQuery);

(function ($) {
    $.fn.activeclass = function () {
        if (this.length == 0) {
            return null;
        }
        var el = this[0];
        if (el != null && el.activeClass != null) {
            return el.activeClass;
        }
        return null;
    };
})(jQuery);

(function ($) {
    $.fn.callActiveObjects = function (proto, method) {
        if (this.length == 0) {
            return;
        }
        var el, arr = new Array();
        for (i = 2; i < arguments.length; i++) {
            arr.push(arguments[i]);
        }
        for (var i = 0; i < this.length; i++) {
            el = this[i];
            if (BaseObject.is(el.activeClass,proto)) {
                if (BaseObject.is(method, "string")) {
                    el.activeClass[method].apply(el.activeClass, arr);
                } else if (BaseObject.is(method,"function")) {
                    method.apply(el.activeClass, arr);
                }
            }
        }
    };
})(jQuery);


(function ($) {
    $.fn.hinttext = function (v) {
        if (!this.length) return null;
        var el = this[0];
        if (el != null && v != null) el.hintText = v;
        if (el != null && el.hintText != null) return el.hintText;
        return null;
    };
})(jQuery);

(function ($) {
    $.fn.stricttext = function(v) {
        return this.text((v == null)?"":v);
    };
    $.fn.ellipsis = function (v, l) {
        if (!this.length) return null;
        if (v != null && typeof v == "string") {
            var limit = (l == null)?30:parseInt(l,10);
            limit = isNaN(limit)?30:limit;
            for (var i = 0; i < this.length; i++) {
                if (this[i] != null) {
                    $(this[i]).text((v.length > limit)?(v.slice(0,limit) + "..."):v);
                }
            }
        }
        return this.text();
    };
    
    $.fn.croptext = function (element,parameter) {
        var skipProcessing = false;
        if ( element !== "" && IsNull(parameter) === false && parameter.toString() === "css" )
        {
            skipProcessing = true;
            this.addClass("cropped_text_current_width");
            this.css("width", ( this.width() || this.parent().width() ) + "px");
        }
        if ( skipProcessing === false && !IsNull ( element ) && element !== "" && element.length > 4 )
        {
            var hidden = $("#get_length_of_text");
            if(hidden.length == 0)
            {
                $('body').append('<span id="get_length_of_text" style="position:absolute;left:-500px;top:-500px;"></span>');
                hidden = $("#get_length_of_text");
	        }
            hidden.css({
                "font-size":this.css("font-size"),
                "font-weight":this.css("font-weight"),
                "font-family":this.css("font-family"),
            	"font-variant":this.css("font-variant"),
            	"font-style":this.css("font-style"),
            	"text-transform":this.css("text-transform"),
            	"word-spacing":this.css("word-spacing"),
            	"letter-spacing":this.css("letter-spacing")
            });
	        hidden.text( element );
            var elementwidth = hidden.width();
	        var locationwidth = this.width();
            if (locationwidth == 0)
            {
                var p = this.parent();
                if (p.length > 0)
                {
                    locationwidth = p.width();
                }
            }
            locationwidth = locationwidth - ( parameter || 0 );
	        if ( elementwidth > locationwidth && locationwidth > 0 )
	        {
		        var count = Math.floor ( locationwidth / Math.floor ( elementwidth / element.length ) );
		        var temp = "";
		        do {
		    	    temp = element.substr(0,count);
		    	    hidden.text( temp + "..." );
		    	    elementwidth = hidden.width();
		    	    count -= 1;
		        } while ( locationwidth < elementwidth + 1 );
		        element = (temp != element) ? (temp + "..." ) : temp;
	        }
        }
        return ( this.prop("tagName").toLowerCase() == "input" ) ? this.val ( element ) : this.text ( element );
    };
    
})(jQuery);



(function ($) {
    $.fn.elementinlinevisible = function (v) {
        if (!this.length) return null;
        if (v) {
            $(this).css("display","inline-block");
            return true;
        }
        else {
            $(this).css("display","none");
            return false;
        }
    };
})(jQuery);


(function ($) {
	
	function $pixelsize(v,side) {
		if (!this.length || this.length == 0) return null;
		if (arguments.length > 0) {
			if (v != null) {
				this[side](v);
			}
		}
		return this[side]();
	}
	$.fn.pixelheight = function(v1, v2, v3) { return $pixelsize.call(this, v1, "height", v2, v3); }
	$.fn.pixelwidth = function(v1, v2, v3) { return $pixelsize.call(this, v1, "width", v2, v3); }
	
})(jQuery);

(function ($) {
    $.fn.ng_width = function (v) {
        if (!this.length) return null;
        if (IsNull(v)) {
            return this.css('width');
        }
        this.css('width', v);
        return this;
    };
})(jQuery);
(function ($) {
    $.fn.ng_Height = function (v) {
        if (!this.length) return null;
        if (IsNull(v)) {
            return this.css('height');
        }
        this.css('height', v);
        return this;
    };
})(jQuery);
(function ($) {
    $.fn.ng_Left = function (v) {
        if (!this.length) return null;
        if (IsNull(v)) {
            return this.css('left');
        }
        this.css('left', v);
        return this;
    };
})(jQuery);
(function ($) {
    $.fn.ng_Top = function (v) {
        if (!this.length) return null;
        if (IsNull(v)) {
            return this.css('top');
        }
        this.css('top', v);
        return this;
    };
})(jQuery);
(function ($) {
    $.fn.ng_WidthFloat = function (v) {
        if (!this.length) return null;
        if (IsNull(v)) {
            return parseFloat(this.css('width'));
        }
        this.css('width', v + 'px');
        return this;
    };
})(jQuery);
(function ($) {
    $.fn.ng_HeightFloat = function (v) {
        if (!this.length) return null;
        if (IsNull(v)) {
            return parseFloat(this.css('height'));
        }
        this.css('height', v + 'px');
        return this;
    };
})(jQuery);
(function ($) {
    $.fn.ng_LeftFloat = function (v) {
        if (!this.length) return null;
        if (IsNull(v)) {
            return parseFloat(this.css('left'));
        }
        this.css('left', v + 'px');
        return this;
    };
})(jQuery);
(function ($) {
    $.fn.ng_TopFloat = function (v) {
        if (!this.length) return null;
        if (IsNull(v)) {
            return parseFloat(this.css('top'));
        }
        this.css('top', v + 'px');
        return this;
    };
})(jQuery);

(function ($) {
    $.fn.ng_WidthInt = function (v) {
        if (!this.length) return null;
        if (IsNull(v)) {
            return parseInt(this.css('width'));
        }
        this.css('width', v + 'px');
        return this;
    };
})(jQuery);
(function ($) {
    $.fn.ng_HeightInt = function (v) {
        if (!this.length) return null;
        if (IsNull(v)) {
            return parseInt(this.css('height'));
        }
        this.css('height', v + 'px');
        return this;
    };
})(jQuery);
(function ($) {
    $.fn.ng_LeftInt = function (v) {
        if (!this.length) return null;
        if (IsNull(v)) {
            return parseInt(this.css('left'));
        }
        this.css('left', v + 'px');
        return this;
    };
})(jQuery);
(function ($) {
    $.fn.ng_TopInt = function (v) {
        if (!this.length) return null;
        if (IsNull(v)) {
            return parseInt(this.css('top'));
        }
        this.css('top', v + 'px');
        return this;
    };
})(jQuery);

(function ($) {
    $.fn.ng_findSlot = function (s) {
        if (!this.length) return null;
        return this.find('div[data-slot="' + s + '"]');
    };
})(jQuery);

(function ($) {
    $.fn.ng_AddWidthFloat = function (v) {
        if (!this.length) return null;
        var add = 0;
        if (!IsNull(v)) {
            add = v;
        }
        this.css('width', parseFloat(this.css('width')) + add + 'px');
        return this;
    };
})(jQuery);

(function ($) {
    $.fn.ng_AddHeightFloat = function (v) {
        if (!this.length) return null;
        var add = 0;
        if (!IsNull(v)) {
            add = v;
        }
        this.css('height', parseFloat(this.css('height')) + add + 'px');
        return this;
    };
})(jQuery);

(function ($) {
    $.fn.ng_AddLeftFloat = function (v) {
        if (!this.length) return null;
        var add = 0;
        if (!IsNull(v)) {
            add = v;
        }
        this.css('left', parseFloat(this.css('left')) + add + 'px');
        return this;
    };
})(jQuery);

(function ($) {
    $.fn.ng_AddTopFloat = function (v) {
        if (!this.length) return null;
        var add = 0;
        if (!IsNull(v)) {
            add = v;
        }
        this.css('top', parseFloat(this.css('top')) + add + 'px');
        return this;
    };
})(jQuery);

(function ($) {
    $.fn.ng_AddLeftFloat = function (v) {
        if (!this.length) return null;
        var add = 0;
        if (!IsNull(v)) {
            add = v;
        }
        this.css('left', parseFloat(this.css('left')) + add + 'px');
        return this;
    };
})(jQuery);

(function ($) {
    $.fn.ng_setSlotVerticalStretch = function(v) {
        if (!IsNull(this) && this.length > 0) {
            this.attr(aStretchV, v);
            var card = $('#desktop_container').find('#' + this.attr(aCardId));
            if (!IsNull(card) && card.length > 0) {
                card.ng_CollapseIcon(this);
            }
            return this;
        }
        return null;
    };
})(jQuery);

(function ($) {
    $.fn.ng_CollapseIcon = function(slot) {
        if (!IsNull(this) && this.length > 0 &&!IsNull(slot) && slot.length > 0) {                
                var collapseIcon = this.find('.j_collapse');
                if (!IsNull(collapseIcon) && collapseIcon.length > 0) {
                    if (slot.attr(aStretchV) == 'false') {
                        collapseIcon.show();
                    } else {
                        collapseIcon.hide();
                    }                
            }
            return this;
        }
        return null;
    };
})(jQuery);

//
(function ($) {
    $.fn.smartTextbox = function (options) {
        var defaults = {
            'text': 'Enter a text ...',
            'cssClass': '', 
            'callbackFocusIn': function () {},
            'callbackBlur': function () {},
            'callbackClick': function () {}
        };

        var options = $.extend(defaults, options);
        return this.each(function () {
            var isIn = false;
            $(this).mousemove(function(event) {
                if ($(this).hasClass(options.cssClass + '_content'))
                {
                  if (event.offsetX > 140 && (event.offsetY > 2 || event.offsetY < 18))
                  {
                    $(this).css( 'cursor', 'pointer' );
                    isIn = true;
                  }
                  else
                  {
                    $(this).css( 'cursor', 'default' );
                    isIn = false;
                  }
               }
            });
            $(this).click(function() {
              if (isIn == true)
              {
                $(this).val('');
                $(this).removeClass(options.cssClass + '_content');
              }
              options.callbackClick.call(this, {isIn : isIn});
            });
            $(this).focus(function () {
                if ($(this).val() == options.text) {
                    $(this).val('');
                }
                options.callbackFocusIn.call(this, {isIn : isIn});
            });

            $(this).keyup(function (event) {
                var tb_val = $(this).val();
                if (tb_val == options.text || tb_val.length == 0) {
                    $(this).val('');
                    $(this).removeClass(options.cssClass + '_content');
                }
                else
                {
                    $(this).addClass(options.cssClass + '_content');
                }
            });

            $(this).blur(function () {
                if ($(this).val() == '') {
                    $(this).val(options.text);
                }
                options.callbackBlur.call();
            });

            $(this).blur();

        });
    };
})(jQuery);
// FIXES
(function ($) {
	if ($.browser == null) {
		$.browser = {
			msie: false
		};
	}
})(jQuery);