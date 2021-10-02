/**
 * Created with JetBrains PhpStorm.
 * User: user
 * Date: 11/26/12
 * Time: 10:34 PM
 * To change this template use File | Settings | File Templates.
 */

function isInt(n) {
    n=parseInt(n,10);
    return +n === n && !(n % 1);
}

function toBool(b) {
    return String(b) == "true" || String(b) == "yes" || String(b) == "1";
}

function isMobile() {
    try{ document.createEvent("TouchEvent"); return true; }
    catch(e){ return false; }
}


function isNumeric(n) {
    return !isNaN(parseFloat(n)) && isFinite(n);
}

String.prototype.endsWith = function (s) { return this.substr(-s.length)==s; };

/*
 * Date Format 1.2.3
 * (c) 2007-2009 Steven Levithan <stevenlevithan.com>
 * MIT license
 *
 * Includes enhancements by Scott Trenda <scott.trenda.net>
 * and Kris Kowal <cixar.com/~kris.kowal/>
 *
 * Accepts a date, a mask, or a date and a mask.
 * Returns a formatted version of the given date.
 * The date defaults to the current date/time.
 * The mask defaults to dateFormat.masks.default.
 */

var dateFormat = function () {
    var	token = /d{1,4}|m{1,4}|yy(?:yy)?|([HhMsTt])\1?|[LloSZ]|"[^"]*"|'[^']*'/g,
        timezone = /\b(?:[PMCEA][SDP]T|(?:Pacific|Mountain|Central|Eastern|Atlantic) (?:Standard|Daylight|Prevailing) Time|(?:GMT|UTC)(?:[-+]\d{4})?)\b/g,
        timezoneClip = /[^-+\dA-Z]/g,
        pad = function (val, len) {
            val = String(val);
            len = len || 2;
            while (val.length < len) val = "0" + val;
            return val;
        };

    // Regexes and supporting functions are cached through closure
    return function (date, mask, utc) {
        var dF = dateFormat;

        // You can't provide utc if you skip other args (use the "UTC:" mask prefix)
        if (arguments.length == 1 && Object.prototype.toString.call(date) == "[object String]" && !/\d/.test(date)) {
            mask = date;
            date = undefined;
        }

        // Passing date through Date applies Date.parse, if necessary
        date = date ? new Date(date) : new Date;
        if (isNaN(date)) throw SyntaxError("invalid date");

        mask = String(dF.masks[mask] || mask || dF.masks["default"]);

        // Allow setting the utc argument via the mask
        if (mask.slice(0, 4) == "UTC:") {
            mask = mask.slice(4);
            utc = true;
        }

        var	_ = utc ? "getUTC" : "get",
            d = date[_ + "Date"](),
            D = date[_ + "Day"](),
            m = date[_ + "Month"](),
            y = date[_ + "FullYear"](),
            H = date[_ + "Hours"](),
            M = date[_ + "Minutes"](),
            s = date[_ + "Seconds"](),
            L = date[_ + "Milliseconds"](),
            o = utc ? 0 : date.getTimezoneOffset(),
            flags = {
                d:    d,
                dd:   pad(d),
                ddd:  dF.i18n.dayNames[D],
                dddd: dF.i18n.dayNames[D + 7],
                m:    m + 1,
                mm:   pad(m + 1),
                mmm:  dF.i18n.monthNames[m],
                mmmm: dF.i18n.monthNames[m + 12],
                yy:   String(y).slice(2),
                yyyy: y,
                h:    H % 12 || 12,
                hh:   pad(H % 12 || 12),
                H:    H,
                HH:   pad(H),
                M:    M,
                MM:   pad(M),
                s:    s,
                ss:   pad(s),
                l:    pad(L, 3),
                L:    pad(L > 99 ? Math.round(L / 10) : L),
                t:    H < 12 ? "a"  : "p",
                tt:   H < 12 ? "am" : "pm",
                T:    H < 12 ? "A"  : "P",
                TT:   H < 12 ? "AM" : "PM",
                Z:    utc ? "UTC" : (String(date).match(timezone) || [""]).pop().replace(timezoneClip, ""),
                o:    (o > 0 ? "-" : "+") + pad(Math.floor(Math.abs(o) / 60) * 100 + Math.abs(o) % 60, 4),
                S:    ["th", "st", "nd", "rd"][d % 10 > 3 ? 0 : (d % 100 - d % 10 != 10) * d % 10]
            };

        return mask.replace(token, function ($0) {
            return $0 in flags ? flags[$0] : $0.slice(1, $0.length - 1);
        });
    };
}();

// Some common format strings
dateFormat.masks = {
    "default":      "ddd mmm dd yyyy HH:MM:ss",
    shortDate:      "m/d/yy",
    mediumDate:     "mmm d, yyyy",
    longDate:       "mmmm d, yyyy",
    fullDate:       "dddd, mmmm d, yyyy",
    shortTime:      "h:MM TT",
    mediumTime:     "h:MM:ss TT",
    longTime:       "h:MM:ss TT Z",
    isoDate:        "yyyy-mm-dd",
    isoTime:        "HH:MM:ss",
    isoDateTime:    "yyyy-mm-dd'T'HH:MM:ss",
    isoUtcDateTime: "UTC:yyyy-mm-dd'T'HH:MM:ss'Z'"
};

// Internationalization strings
dateFormat.i18n = {
    dayNames: [
        "Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat",
        "Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"
    ],
    monthNames: [
        "Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec",
        "January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"
    ]
};

// For convenience...
Date.prototype.format = function (mask, utc) {
    return dateFormat(this, mask, utc);
};

jQuery.extend({
    postJSON     : function( url, data, callbackSuccess,callbackFail) {
        if (callbackFail==undefined) {
            return jQuery.post(url, data, callbackSuccess, "json");
        } else {
            return jQuery.post(url, data, callbackSuccess, "json").fail(callbackFail);
        }

    },
    isNumKeyCode :  function (key,shiftStatus) {

    shiftStatus=shiftStatus==undefined ? false : shiftStatus;

    if((key>=48 && key<=57) ||
        (key>=96 && key<=120) ||
        key==46 ||
        key==8  ||
        key==37 ||
        key==38 ||
        key==39 ||
        key==40 ||
        key==9  ||
        (key==9 && shiftStatus)
        ) {
        return true;
    };
    return false;
},
    getUrlParams: function () {
        var url         = window.location.href;
        var host        = url.split('?')[0];
        var paramsQuery  = url.split('?')[1];
        var tmp={},oldParams={},p={};

        if (paramsQuery != undefined) {
            tmp=paramsQuery.split('&');
            $.each(tmp,function(i,el) {
                p=el.split('=');
                oldParams[p[0]]= p.hasOwnProperty('1') ? p[1] : null;
            });

        };

        return oldParams;
    },
    getUrl : function (e) {
       return window.location.hash;
    },
    getCurrentUrl : function() {
       return window.location.pathname+window.location.hash;
    },
    getUrlMethod: function () {
      var url = $.getUrl().substring(1);
      var method=url.split('?')[0];

      return method;
    },
    createUrl:function(action,method,params) {
        return action + (method!=null && method!=undefined ? '/' + method : '') + (params==undefined ? '' : '?' + $.param(params));
    },
    /**
     * Thanks for StackOverflow
     * Url http://stackoverflow.com/questions/1634748/how-can-i-delete-a-query-string-parameter-in-javascript
     * @param url
     * @param param
     * @return {*}
     */
    removeURLParam: function (url, param) {
    var urlparts= url.split('?');
    if (urlparts.length>=2)
    {
        var prefix= encodeURIComponent(param)+'=';
        var pars= urlparts[1].split(/[&;]/g);
        for (var i=pars.length; i-- > 0;)
            if (pars[i].indexOf(prefix, 0)==0)
                pars.splice(i, 1);
        if (pars.length > 0)
            return urlparts[0]+'?'+pars.join('&');
        else
            return urlparts[0];
    }
    else
        return url;
},
    /* Calc beg and end date by week number */
    getDateByWeek: function (w,y) {
        var d = 0;
        var days1 = 2 + d + (w - 1) * 7 - (new Date(y,0,1)).getDay();
        var days2 = 2 + (d + 6) + (w - 1) * 7 - (new Date(y,0,1)).getDay();
        return new Array(new Date(y, 0, days1),new Date(y,0,days2));
    },
    /**
     * Функция возвращает строку input, дополненную слева, справа или с обоих сторон до заданной длины
     * @param {string} str дополняемая строка
     * @param {int} pad_length длина результирующей строки
     * @param {string} pad_string строка, которой дополняем str
     * @param {int} pad_type в какую сторону дополнять (По-умолчанию 1)
     *      -1 дополняем слева
     *      0 дополняем слева и справа
     *      1 дополняем справа
     * @returns {*}
     */
    str_pad: function (str, pad_length, pad_string, pad_type) {
    str = "" + str;
    if (pad_length <= str.length) {
        return str;
    }

    pad_string = pad_string || ' ';
    pad_type = pad_type === undefined ? 1 : pad_type;



    var left_pad = 0,
        left_repeat,
        right_pad = 0,
        right_repeat,
        num_pad = pad_length - str.length;

    if (pad_type === 1) {
        // с правой стороны
        right_pad = num_pad;
    } else if (pad_type === -1) {
        // дополняем слева
        left_pad = num_pad;
    } else if (pad_type === 0) {
        // с каждой стороны
        left_pad = Math.floor(num_pad / 2);
        right_pad = num_pad - left_pad;
    } else {
        return str;
    }

    // Сколько раз надо повторить строку слева
    left_repeat = Math.floor(left_pad / pad_string.length);

    // Сколько раз надо повторить строку справа
    right_repeat = Math.floor(right_pad / pad_string.length);

    if (left_pad > 0) {
        str = (left_repeat > 0 ? $.str_repeat(pad_string, left_repeat) : pad_string).substring(0, left_pad) + str;
    }

    if (right_pad > 0) {
        str += (right_repeat > 0 ? $.str_repeat(pad_string, right_repeat) : pad_string).substring(0, right_pad);
    }

    return str;
},

    /**
 * Функция повторения строки N раз
 */
    str_repeat: function (input, multiplier) {
    return new Array(multiplier + 1).join(input);
}

});

(function( $ ){
    $.fn.form2json = function() {
        var key,params={};
        var inputs=this.find('input,textarea');

        $.each(inputs,function (index,el) {
            key = $(el).attr('name');
            if (key!=undefined) {
                params[key.replace('signin-','')]=$(el).val();
            };
        });
        return params;
    }
  })( jQuery );

var isiPad = navigator.userAgent.match(/iPad/i) != null;





