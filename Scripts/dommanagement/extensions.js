


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


//(function ($) {
//    var reArray = /data-array-([a-zA-Z0-9_]+)(?:(?:-(\S+))|(?:\[(\S+)\]))*/i; // $1 = arrname, $2/$3 - elindex
//    $.fn.getArrayBindingDefs = function () {
//        var a = {};

//        if (!this.length)
//            return a;
//        var reFilt = (filt == null) ? null : new RegExp(filt, "i");
//        var matches = null;

//        $.each(this[0].attributes, function (index, attr) {
//            matches = null;
//            if (reFilt == null) {
//                a[attr.name] = attr.value;
//            } else {
//                matches = attr.name.match(reFilt);
//                if (matches != null && matches.length > 0) {
//                    if (matches[1] == null) {
//                        a[''] = attr.value;
//                    } else {
//                        a[matches[1]] = attr.value;
//                    }
//                }
//            }
//        });

//        return a;
//    };
//})(jQuery);
(function ($) {
	// var original = $.fn.text;
	// $.fn.text = function () {
		// if (arguments.length > 0 && arguments[0] == null) {
			// var args = Array.createCopyOf(arguments);
			// args[0] = '';
			// return original.apply(this, args);
		// } else {
			// return original.apply(this, arguments);
		// }
	// }
})(jQuery);
(function ($) {
    // $.fn.attributebyparameter = function (v, aname) {
        // if (aname == null || aname.length == 0) return null;
        // if (v != null) {
            // this.attr(aname, v);
        // }
        // return this.attr(aname);
    // };
    // $.fn.elementattribute = function(attrName, v) { // use as data-bind-elementattribute[someattribute]="{ ... }"
        // if (arguments.length == 0 || attrName == null || attrName.length == 0) return null;
        // if (arguments.length > 1) {
            // this.attr(attrName, v);
        // }
        // return this.attr(attrName);
    // };
})(jQuery);

(function ($) {
    // $.fn.checked = function (v) {
        // if (v != null) {
            // for (var i = 0; i < this.length; i++) {
                // this[i].checked = v;
            // }
        // }
        // if (this.length > 0) {
            // return this[0].checked;
        // }
        // return false;
    // };
})(jQuery);

(function ($) {
    // $.fn.elementdisabled = function (v, b) {
        // if (v != null) {
            // if (v) {
                // this.prop("disabled",true); 
					// if(b == null || b != "noopacity"){
						// this.css("opacity","0.5"); 
					// }
            // } else {
                // this.prop("disabled",false);
                // this.css("opacity","1.0"); 
            // }
            // for (var i = 0; i < this.length; i++) {
                // if (this.get(i) != null && BaseObject.is(this.get(i).activeClass,"IDisablable")) {
                    // this.get(i).activeClass.set_disabled(v ? true: false);
                // }
            // }
        // }
        // if (this.length > 0) {
            // return $(this[0]).prop("disabled");
        // }
        // return false;   
    // };
	// $.fn.elementreadonly = function(v) {
		// if (arguments.length > 0) {
			// this.prop("readonly", ((v)?true:false));
			// return ((v)?true:false);
		// } else {
			// if (this.length > 0) {
				// return $(this[0]).prop("readonly");
			// }
		// }
		// return false;
	// }
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
    // $.fn.datacontext = function (v) {
        // if (this.length == 0) {
            // return null;
        // }
        // var el = this[0];
        // if (el != null) {
            // if (arguments.length > 0) el.dataContext = v;
            // if (el.dataContext != null) {
                // return el.dataContext;
            // }
        // }
        // return null;
    // };
    // $.fn.metainfo = function(v) {
        
    // };
})(jQuery);
(function ($) {
    // $.fn.elementtitle = function (v) {
        // if (!this.length) return null;
        // var el = this[0];
        // if (el != null && v != null) el.title = v;
        // if (el != null && el.title != null) return el.title;
        // return null;
    // };
})(jQuery);

(function ($) {
    // $.fn.textcolor = function (v) {
        // if (!this.length) return null;
        // this.css('color',v);
        // return this.css('color');
    // };
})(jQuery);
(function ($) {
    // $.fn.backcolor = function (v) {
        // if (!this.length) return null;
        // this.css('background-color', v);
        // return this.css('background-color');
    // };

    // $.fn.backimage = function (v) {
        // if (!this.length) return null;
        // this.css('background-image', v);
        // return this.css('background-image');
    // };
	
    // $.fn.backposition = function (v) {
        // if (!this.length) return null;
        // this.css('background-position', v);
        // return this.css('background-position');
    // };
	
    // $.fn.backgrnd = function (v) {
        // if (!this.length) return null;
        // this.css('background', v);
        // return this.css('background');
    // };
	
    // $.fn.imgheight = function (v) {
        // if (!this.length) return null;
        // this.css('height', v);
        // return this.css('height');
    // };
	
    // $.fn.imgwidth = function (v) {
        // if (!this.length) return null;
        // this.css('width', v);
        // return this.css('width');
    // };
})(jQuery);

(function ($) {
	// $.fn.src = function (v) {
        // if (!this.length) return null;
		// if (v == null || typeof v !== 'string') return null;
		
		// if (!(v.indexOf('http://') === 0 || v.indexOf('https://') === 0)) {
			// v = mapPath(v);
		// }
		
		// if (this.is('script') || this.is('input') || this.is('frame') || this.is('iframe') || this.is('img')) {
			// this.attr('src', v);
		
			// return this.attr('src');
		// }
		
		// if (this.is('sparta')) {
			// return null;
		// }
		
		// return null;
    // };
})(jQuery);

(function ($) {
    // $.fn.textalign = function (v) {
        // if (!this.length) return null;
        // this.css('text-align', v);
        // return this.css('text-align');
    // };
    // $.fn.fontweight = function (v) {
        // if (!this.length) return null;
        // this.css('font-weight', v);
        // return this.css('font-weight');
    // };
    // $.fn.cssclass = function (v) {
        // if (!this.length) return null;
        // if (v != null) {
            // for (var i = 0; i < this.length; i++) {
                // this[i].className = v;
            // }
        // }
        // if (this.length > 0) return this[0].className;
        // return null;
    // };
    // This one must be use with index data-bind-addcssclass[<classname>]
    // Consequently the <classname> must be lowercase and can contain only alphanumerics + _
    // $.fn.addcssclass = function (idx,v) {
        // if (!this.length) return null;
        // if (v != null && idx != null) {
            // $(this.get(0)).removeClass(idx);
            // if (v) {
                // $(this.get(0)).addClass(idx);
            // }
        // } else if (idx != null) {
            // $(this.get(0)).hasClass(idx);
        // } else {
            // return null;
        // }
    // };
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
    // $.fn.elementid = function (v) {
        // if (!this.length) return null;
        // var el = this[0];
        // if (el != null && v != null) el.id = v;
        // if (el != null && el.id != null) return el.id;
        // return null;
    // };
})(jQuery);

(function ($) {
    // $.fn.elementvisible = function (v) {
        // if (!this.length) return null;
        // if (v) {
            // this.show();
            // return true;
        // }
        // else {
            // this.hide();
            // return false;
        // }
    // };
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
    // $.fn.elementvisibility = function (v) {
        // if (!this.length) return null;
        // if (v) {
            // this.css("visibility", "visible");
            // return true;
        // }
        // else {
            // this.css("visibility","hidden");
            // return false;
        // }
    // };
})(jQuery);

(function ($) {
	/*
    $.fn.indentination = function (v) {
        if (!this.length) return null;
        if (v != null) {
            this.css("margin-left",v + "px");
            // for (var i = 0; i < this.length; this[i++].css("margin-left",v + "px"));
            return v;
        }
        else {
            return $(this[0]).css("margin-left");
        }
    };
	*/
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

//Obviously there is no need for this correction in IE8 for drag'n'drop (Robert)
//(function ($) {
//    $.fn.ctrl = function (key, callback) {
//        if (typeof key != 'object') key = [key];
//        callback = callback || function () { return false; }
//        return $(this).keydown(function (e) {
//            var ret = true;
//            $.each(key, function (i, k) {
//                if (e.keyCode == k.toUpperCase().charCodeAt(0) && e.ctrlKey) {
//                    ret = callback(e);
//                }
//            });
//            return ret;
//        });
//    };

//    $.fn.disableSelection = function () {
//        $(window).ctrl(['a', 's', 'c']);
//        return this.each(function () {
//            $(this).attr('unselectable', 'on')
//               .css({ '-moz-user-select': 'none',
//                   '-o-user-select': 'none',
//                   '-khtml-user-select': 'none',
//                   '-webkit-user-select': 'none',
//                   '-ms-user-select': 'none',
//                   'user-select': 'none'
//               })
//               .each(function () {
//                   $(this).attr('unselectable', 'on')
//                    .bind('selectstart', function () { return false; });
//               });
//        });
//    };
//    
//    $.fn.enableSelection = function () {
//        return this.each(function() {
//            $(this).unbind('selectstart');
//        });
//    };
//})(jQuery);

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