/**
 * Created by Greg Zhang
 */
;(function (factory) {

  if (typeof define === 'function' && define.amd) {
    define(['jquery'], factory);
  } else if (typeof exports === 'object') {
    factory(require('jquery'));
  } else {
    factory(jQuery);
  }

})(function ($) {

  'use strict';

  var dateUtils = (function () {
      var fecha = {};
      var token = /d{1,4}|M{1,4}|yy(?:yy)?|S{1,3}|Do|ZZ|([HhMsDm])\1?|[aA]|"[^"]*"|'[^']*'/g;
      var twoDigits = /\d\d?/;
      var threeDigits = /\d{3}/;
      var fourDigits = /\d{4}/;
      var word = /[0-9]*['a-z\u00A0-\u05FF\u0700-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]+|[\u0600-\u06FF\/]+(\s*?[\u0600-\u06FF]+){1,2}/i;
      var noop = function () {
      };

      function shorten(arr, sLen) {
        var newArr = [];
        for (var i = 0, len = arr.length; i < len; i++) {
          newArr.push(arr[i].substr(0, sLen));
        }
        return newArr;
      }

      function monthUpdate(arrName) {
        return function (d, v, i18n) {
          var index = i18n[arrName].indexOf(v.charAt(0).toUpperCase() + v.substr(1).toLowerCase());
          if (~index) {
            d.month = index;
          }
        };
      }

      function pad(val, len) {
        val = String(val);
        len = len || 2;
        while (val.length < len) {
          val = '0' + val;
        }
        return val;
      }

      var dayNames = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
      var monthNames = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
      var monthNamesShort = shorten(monthNames, 3);
      var dayNamesShort = shorten(dayNames, 3);
      fecha.i18n = {
        dayNamesShort: dayNamesShort,
        dayNames: dayNames,
        monthNamesShort: monthNamesShort,
        monthNames: monthNames,
        amPm: ['am', 'pm'],
        DoFn: function DoFn(D) {
          return D + ['th', 'st', 'nd', 'rd'][D % 10 > 3 ? 0 : (D - D % 10 !== 10) * D % 10];
        }
      };

      var formatFlags = {
        D: function(dateObj) {
          return dateObj.getDay();
        },
        DD: function(dateObj) {
          return pad(dateObj.getDay());
        },
        Do: function(dateObj, i18n) {
          return i18n.DoFn(dateObj.getDate());
        },
        d: function(dateObj) {
          return dateObj.getDate();
        },
        dd: function(dateObj) {
          return pad(dateObj.getDate());
        },
        ddd: function(dateObj, i18n) {
          return i18n.dayNamesShort[dateObj.getDay()];
        },
        dddd: function(dateObj, i18n) {
          return i18n.dayNames[dateObj.getDay()];
        },
        M: function(dateObj) {
          return dateObj.getMonth() + 1;
        },
        MM: function(dateObj) {
          return pad(dateObj.getMonth() + 1);
        },
        MMM: function(dateObj, i18n) {
          return i18n.monthNamesShort[dateObj.getMonth()];
        },
        MMMM: function(dateObj, i18n) {
          return i18n.monthNames[dateObj.getMonth()];
        },
        yy: function(dateObj) {
          return String(dateObj.getFullYear()).substr(2);
        },
        yyyy: function(dateObj) {
          return dateObj.getFullYear();
        },
        h: function(dateObj) {
          return dateObj.getHours() % 12 || 12;
        },
        hh: function(dateObj) {
          return pad(dateObj.getHours() % 12 || 12);
        },
        H: function(dateObj) {
          return dateObj.getHours();
        },
        HH: function(dateObj) {
          return pad(dateObj.getHours());
        },
        m: function(dateObj) {
          return dateObj.getMinutes();
        },
        mm: function(dateObj) {
          return pad(dateObj.getMinutes());
        },
        s: function(dateObj) {
          return dateObj.getSeconds();
        },
        ss: function(dateObj) {
          return pad(dateObj.getSeconds());
        },
        S: function(dateObj) {
          return Math.round(dateObj.getMilliseconds() / 100);
        },
        SS: function(dateObj) {
          return pad(Math.round(dateObj.getMilliseconds() / 10), 2);
        },
        SSS: function(dateObj) {
          return pad(dateObj.getMilliseconds(), 3);
        },
        a: function(dateObj, i18n) {
          return dateObj.getHours() < 12 ? i18n.amPm[0] : i18n.amPm[1];
        },
        A: function(dateObj, i18n) {
          return dateObj.getHours() < 12 ? i18n.amPm[0].toUpperCase() : i18n.amPm[1].toUpperCase();
        },
        ZZ: function(dateObj) {
          var o = dateObj.getTimezoneOffset();
          return (o > 0 ? '-' : '+') + pad(Math.floor(Math.abs(o) / 60) * 100 + Math.abs(o) % 60, 4);
        }
      };

      var parseFlags = {
        d: [twoDigits, function (d, v) {
          d.day = v;
        }],
        M: [twoDigits, function (d, v) {
          d.month = v - 1;
        }],
        yy: [twoDigits, function (d, v) {
          var da = new Date(), cent = +('' + da.getFullYear()).substr(0, 2);
          d.year = '' + (v > 68 ? cent - 1 : cent) + v;
        }],
        h: [twoDigits, function (d, v) {
          d.hour = v;
        }],
        m: [twoDigits, function (d, v) {
          d.minute = v;
        }],
        s: [twoDigits, function (d, v) {
          d.second = v;
        }],
        yyyy: [fourDigits, function (d, v) {
          d.year = v;
        }],
        S: [/\d/, function (d, v) {
          d.millisecond = v * 100;
        }],
        SS: [/\d{2}/, function (d, v) {
          d.millisecond = v * 10;
        }],
        SSS: [threeDigits, function (d, v) {
          d.millisecond = v;
        }],
        D: [twoDigits, noop],
        ddd: [word, noop],
        MMM: [word, monthUpdate('monthNamesShort')],
        MMMM: [word, monthUpdate('monthNames')],
        a: [word, function (d, v, i18n) {
          var val = v.toLowerCase();
          if (val === i18n.amPm[0]) {
            d.isPm = false;
          } else if (val === i18n.amPm[1]) {
            d.isPm = true;
          }
        }],
        ZZ: [/[\+\-]\d\d:?\d\d/, function (d, v) {
          var parts = (v + '').match(/([\+\-]|\d\d)/gi), minutes;

          if (parts) {
            minutes = +(parts[1] * 60) + parseInt(parts[2], 10);
            d.timezoneOffset = parts[0] === '+' ? minutes : -minutes;
          }
        }]
      };
      parseFlags.DD = parseFlags.DD;
      parseFlags.dddd = parseFlags.ddd;
      parseFlags.Do = parseFlags.dd = parseFlags.d;
      parseFlags.mm = parseFlags.m;
      parseFlags.hh = parseFlags.H = parseFlags.HH = parseFlags.h;
      parseFlags.MM = parseFlags.M;
      parseFlags.ss = parseFlags.s;
      parseFlags.A = parseFlags.a;


      // Some common format strings
      fecha.masks = {
        'default': 'ddd MMM dd yyyy HH:mm:ss',
        shortDate: 'M/D/yy',
        mediumDate: 'MMM d, yyyy',
        longDate: 'MMMM d, yyyy',
        fullDate: 'dddd, MMMM d, yyyy',
        shortTime: 'HH:mm',
        mediumTime: 'HH:mm:ss',
        longTime: 'HH:mm:ss.SSS'
      };

      /***
       * Format a date
       * @method format
       * @param {Date|number} dateObj
       * @param {string} mask Format of the date, i.e. 'mm-dd-yy' or 'shortDate'
       */
      fecha.format = function (dateObj, mask, i18nSettings) {
        var i18n = i18nSettings || fecha.i18n;

        if (typeof dateObj === 'number') {
          dateObj = new Date(dateObj);
        }

        if (Object.prototype.toString.call(dateObj) !== '[object Date]' || isNaN(dateObj.getTime())) {
          throw new Error('Invalid Date in fecha.format');
        }

        mask = fecha.masks[mask] || mask || fecha.masks['default'];

        return mask.replace(token, function ($0) {
          return $0 in formatFlags ? formatFlags[$0](dateObj, i18n) : $0.slice(1, $0.length - 1);
        });
      };

      /**
       * Parse a date string into an object, changes - into /
       * @method parse
       * @param {string} dateStr Date string
       * @param {string} format Date parse format
       * @returns {Date|boolean}
       */
      fecha.parse = function (dateStr, format, i18nSettings) {
        var i18n = i18nSettings || fecha.i18n;

        if (typeof format !== 'string') {
          throw new Error('Invalid format in fecha.parse');
        }

        format = fecha.masks[format] || format;

        // Avoid regular expression denial of service, fail early for really long strings
        // https://www.owasp.org/index.php/Regular_expression_Denial_of_Service_-_ReDoS
        if (dateStr.length > 1000) {
          return false;
        }

        var isValid = true;
        var dateInfo = {};
        format.replace(token, function ($0) {
          if (parseFlags[$0]) {
            var info = parseFlags[$0];
            var index = dateStr.search(info[0]);
            if (!~index) {
              isValid = false;
            } else {
              dateStr.replace(info[0], function (result) {
                info[1](dateInfo, result, i18n);
                dateStr = dateStr.substr(index + result.length);
                return result;
              });
            }
          }

          return parseFlags[$0] ? '' : $0.slice(1, $0.length - 1);
        });

        if (!isValid) {
          return false;
        }

        var today = new Date();
        if (dateInfo.isPm === true && dateInfo.hour != null && +dateInfo.hour !== 12) {
          dateInfo.hour = +dateInfo.hour + 12;
        } else if (dateInfo.isPm === false && +dateInfo.hour === 12) {
          dateInfo.hour = 0;
        }

        var date;
        if (dateInfo.timezoneOffset != null) {
          dateInfo.minute = +(dateInfo.minute || 0) - +dateInfo.timezoneOffset;
          date = new Date(Date.UTC(dateInfo.year || today.getFullYear(), dateInfo.month || 0, dateInfo.day || 1,
            dateInfo.hour || 0, dateInfo.minute || 0, dateInfo.second || 0, dateInfo.millisecond || 0));
        } else {
          date = new Date(dateInfo.year || today.getFullYear(), dateInfo.month || 0, dateInfo.day || 1,
            dateInfo.hour || 0, dateInfo.minute || 0, dateInfo.second || 0, dateInfo.millisecond || 0);
        }
        return date;
      };

      return fecha;
    })();

  // Const DAY_DURATION
  var DAY_DURATION = 86400000;
  // Const DEFAULT_TIME_FORMAT
  var DEFAULT_TIME_FORMAT = 'HH:mm:ss';
  // Const DEFAULT_TIME_VALUE
  var DEFAULT_TIME_VALUE = '00:00:00';
  // Const DATE_PANEL_Z_INDEX
  var DATE_PANEL_Z_INDEX = 2008;
  // Const TIME_PANEL_Z_INDEX
  var TIME_PANEL_Z_INDEX = DATE_PANEL_Z_INDEX + 1;
  // Const TIME_PANEL_WIDTH
  var TIME_PANEL_WIDTH = 154;
  // Const KEY_CODE_ENTER
  var KEY_CODE_ENTER = 13;
  // Const CLASS_PLACEMENT_LEFT_BOTTOM
  var CLASS_PLACEMENT_LEFT_BOTTOM = 'placement-left-bottom';
  // Const CLASS_PLACEMENT_CENTER_BOTTOM
  var CLASS_PLACEMENT_CENTER_BOTTOM = 'placement-center-bottom';
  // Const CLASS_PLACEMENT_RIGHT_BOTTOM
  var CLASS_PLACEMENT_RIGHT_BOTTOM = 'placement-right-bottom';
  // Const IE_MODE
  var inBrowser = typeof window !== 'undefined';
  var UA = inBrowser && window.navigator.userAgent.toLowerCase();
  var isIE = UA && /msie|trident/.test(UA);
  var IE_MODE = document.documentMode;

  var DatePicker = function ($el, options) {
    var datepicker = this;
    var core = {
      defaults: {
        readonly: false,
        disabled: false,
        type: 'date', // year/month/date/date-range/datetime/datetime-range
        format: 'yyyy-MM-dd',
        placeholder: 'Please pick a day',
        align: 'left',
        startDate: null,
        endDate: null,
        lang: 'en-US',
        rangeSeparator: '-',
        weekStart: 0,
        defaultValue: '',
        zIndex: DATE_PANEL_Z_INDEX,
        onChange: null,
        onShow: null,
        onHide: null
      },
      _init: function () {
        // copy property from options
        datepicker = $.extend(true, datepicker, core.defaults, options || {});
        if (datepicker.lang) datepicker = $.extend(datepicker, $.fn.datepicker.lang[datepicker.lang]);

        var type = datepicker.type;

        if ((type === 'datetime' || type === 'datetime-range')
          && datepicker.format === core.defaults.format) {
          datepicker.format = 'yyyy-MM-dd HH:mm:ss';
        } else if (type === 'year') {
          datepicker.format = 'yyyy';
        } else if (type === 'month' && datepicker.format === core.defaults.format) {
          datepicker.format = 'yyyy-MM';
        }

        // init param date and value
        datepicker.date = new Date();
        datepicker.value = '';
        datepicker.yearLabel = datepicker.date.getFullYear();
        datepicker.monthLabel = datepicker.date.getMonth();

        if (datepicker.readonly) $el.attr('readonly', true);
        if (datepicker.disabled) $el.attr('disabled', true);
        if (datepicker.placeholder) $el.attr('placeholder', datepicker.placeholder);
        core._created();
      },
      _created: function () {
        var type = datepicker.type;
        var align = datepicker.align;
        var zIndex = datepicker.zIndex;
        var originX = align === 'center' ? '50%' : align === 'right' ? '100%' : '0';
        var $body = $('body');
        var dateDom;

        if (type === 'date' || type === 'month' || type === 'year' || type === 'datetime') {
          if (type === 'date' || type === 'datetime') {
            datepicker.currentView = 'dateView';
          } else if (type === 'year') {
            datepicker.currentView = 'yearView';
          } else if (type === 'month') {
            datepicker.currentView = 'monthView';
          }
          // get datepicker panel
          dateDom = core._generateDateDOM();
        } else if (type === 'date-range' || type === 'datetime-range') {
          // get range datepicker panel
          dateDom = core._generateRangeDateDOM();
        }

        // append picker panel into the dom tree
        datepicker.$pickerPanel = $(dateDom).appendTo($body).css({
          position: 'absolute',
          zIndex: parseInt(zIndex, 10)
        });

        if (!isIE  || (isIE && IE_MODE > 9)) {
          datepicker.$pickerPanel.css({transformOrigin: originX + ' 0', msTransformOrigin: originX + ' 0'});
        }

        // set position for time panel
        if (datepicker.$pickerPanel.find('.gmi-time-panel').length > 0) {
          var $timePanel = datepicker.$pickerPanel.find('.gmi-time-panel');
          $timePanel.css({
            width: TIME_PANEL_WIDTH + 'px',
            position: 'absolute',
            left: 0,
            zIndex: TIME_PANEL_Z_INDEX
          });
          datepicker.$timePanel = $timePanel;
        }

        // bind EVENT_PICK for $el
        if ($.isFunction(datepicker.onChange)) {
          $el.on('pick.datepicker', datepicker.onChange);
        }

        // set default date
        core._setDate(datepicker.defaultValue);

        // set table show or hide for date, datetime, year, month
        switch (type) {
          case 'date':
            datepicker.$pickerPanel.find('.gmi-date-table').show().siblings().hide();
            break;
          case 'datetime':
            datepicker.$pickerPanel.find('.gmi-date-table').show().siblings().hide();
            break;
          case 'year':
            datepicker.$pickerPanel.find('.gmi-year-table').show().siblings().hide();
            break;
          case 'month':
            datepicker.$pickerPanel.find('.gmi-month-table').show().siblings().hide();
            break;
        }
        // push date or time value into the input elements
        core._echoDateOrTimeIntoInput();
        // bind events for datepicker
        core._bindEvent();
      },
      _unCreate: function () {
        var $pickPanel = datepicker.$pickerPanel;
        if ($pickPanel && $pickPanel.length > 0) $pickPanel.remove();
      },
      _bindEvent: function () {
        $(document).on('click.datepicker', function (e) {
          var $target = $(e.target);
          if (!$target.is($el) && $el.has($target).length <= 0) {
            core._hidePickerPanel();
          }
        });

        // when window resizing or scrolling that the panel will change its position
        $(window).on('resize.datepicker', function () {
          core._setDatePanelPosition();
        }).on('scroll.datepicker', function () {
          core._setDatePanelPosition();
        });

        // bind events for $el
        $el.on('focus.datepicker', core._elFocusHandler)
          .on('click.datepicker', core._elClickHandler)
          .on('change.datepicker', core._elChangeHandler)
          .on('keyup.datepicker', core._elKeyUpHandler);

        if ($.isFunction(datepicker.onShow)) {
          $el.on('show.datepicker', datepicker.onShow);
        }

        if ($.isFunction(datepicker.onHide)) {
          $el.on('show.datepicker', datepicker.onHide);
        }

        // cancel bubble for $pickerPanel
        datepicker.$pickerPanel.on('click.datepicker', function (e) {
          e.stopPropagation();
        });

        // bind events for time input
        datepicker.$pickerPanel.on('focus.datepicker', '.gmi-time-picker--input', function (e) {
          var $self = $(this);
          core._setTimeView($self, e);
        }).on('keyup.datepicker', '.gmi-time-picker--input', function (e) {
          var $self = $(this);
          core._setTimeView($self, e);
        }).on('change.datepicker', '.gmi-time-picker--input', function (e) {
          var $self = $(this);
          core._setTimeView($self, e);
        });

        if (datepicker.$timePanel && datepicker.$timePanel.length > 0) {
          datepicker.$timePanel.on('mouseenter.datepicker', '.gmi-time-panel__body__item', function (e) {
            // mouseenter
            var $self = $(this);
            var $spinner = $self.find('> ul.gmi-time-panel__body__item--spinner');
            $self.css('overflow', 'auto');
            $spinner.css('width', '100%');
          }).on('mouseleave.datepicker', '.gmi-time-panel__body__item', function (e) {
            // mouseleave
            var $self = $(this);
            var $spinner = $self.find('> ul.gmi-time-panel__body__item--spinner');
            var selfWidth = $self.outerWidth();
            $self.css('overflow', 'hidden');
            $spinner.css('width', selfWidth + 'px');
          });

          datepicker.$timePanel.on('click.datepicker', '.gmi-time-panel__body__item--spinner__item:not(.disabled)', function (e) {
            var $timeItem = $(this);
            var $timeItemWrapper = $timeItem.parents('.gmi-time-panel__body__item').eq(0);
            var role = $timeItem.parents('.gmi-time-panel__body__item--spinner').data('role');
            var num = Number($timeItem.text());
            var itemHeight = $timeItem.outerHeight();
            var scrollTop = num * itemHeight;

            $timeItem.addClass('active').siblings().removeClass('active');
            $timeItemWrapper.scrollTop(scrollTop);
            e.stopPropagation();
          });

          // timer panel button events
          datepicker.$timePanel.on('click.datepicker', '.gmi-time-panel__btn', function (e) {
            var $self = $(this);
            var role = $self.data('role');
            var tempDate = new Date();
            var $delegateTarget = $(e.delegateTarget);
            var $timeInput = $delegateTarget.siblings('.gmi-time-picker--input');
            var $hourSpinner = $delegateTarget.find('.gmi-time-panel__body__item--spinner[data-role="hour"]');
            var $minSpinner = $delegateTarget.find('.gmi-time-panel__body__item--spinner[data-role="min"]');
            var $secSpinner = $delegateTarget.find('.gmi-time-panel__body__item--spinner[data-role="sec"]');
            var hour = Number($hourSpinner.find('> li.active').text());
            var minutes = Number($minSpinner.find('> li.active').text());
            var seconds = Number($secSpinner.find('> li.active').text());

            tempDate.setHours(hour, minutes, seconds, 0);
            switch (role) {
              case 'confirm':
                $timeInput.val($.formatDate(tempDate, DEFAULT_TIME_FORMAT));
                $delegateTarget.hide();
                var $allTimeInput = datepicker.$pickerPanel.find('.gmi-time-picker--input').filter(function () {
                  return $(this).val() === '' || !$.parseDate($(this).val(), DEFAULT_TIME_FORMAT);
                });
                if ($allTimeInput && $allTimeInput.length === 0) datepicker.$pickerPanel.find('.gmi-picker-panel__link-btn--determine').removeClass('disabled');
                break;
              case 'cancel':
                $delegateTarget.hide();
                break;
              default:
                break;
            }
          });
        }

        // bind event for td
        datepicker.$pickerPanel.on('click.datepicker', 'td:not(.disabled)', function (e) {
          var type = datepicker.type;
          var format = datepicker.format;
          var $delegateTarget = $(e.delegateTarget);
          var $determineButton = $delegateTarget.find('.gmi-picker-panel__link-btn--determine');
          var $timeInput;
          var $td = $(this);
          var elValue;

          e.stopPropagation();
          if (type === 'date' || type === 'datetime') {
            var currentView = datepicker.currentView;
            var year;
            var month;

            if (currentView === 'dateView') { // dateView
              var date = $td.text() === datepicker.todaySuffix ? new Date().getDate() : Number($td.text());
              if ($td.hasClass('prev-month') || $td.hasClass('next-month')) {
                if ($td.hasClass('prev-month')) {
                  year = datepicker.monthLabel - 1 < 0 ? datepicker.yearLabel - 1 : datepicker.yearLabel;
                  month = datepicker.monthLabel - 1 < 0 ? 11 : datepicker.monthLabel - 1;
                } else if ($td.hasClass('next-month')) {
                  year = datepicker.monthLabel + 1 > 11 ? datepicker.yearLabel + 1 : datepicker.yearLabel;
                  month = datepicker.monthLabel + 1 > 11 ? 0 : datepicker.monthLabel + 1;
                }

                if (type === 'date') {
                  elValue = $.formatDate(new Date(year, month, date), format);
                  core._setDate(elValue);
                } else {
                  elValue = $.formatDate(new Date(year, month, date));
                  core._setNewDateDOM($delegateTarget, year, month, date);
                  $delegateTarget.find('.gmi-date-table td').removeClass('current').filter(function () {
                    return Number($(this).data('year')) === year && Number($(this).data('month')) === month &&
                      Number($(this).text()) === date;
                  }).addClass('current');
                  datepicker.yearLabel = year;
                  datepicker.monthLabel = month;
                }
              } else {
                year = datepicker.yearLabel;
                month = datepicker.monthLabel;

                if (type === 'date') {
                  elValue = $.formatDate(new Date(year, month, date), format);
                  core._setDate(elValue);
                } else {
                  elValue = $.formatDate(new Date(year, month, date));
                  $delegateTarget.find('.gmi-date-table').find('td').removeClass('current');
                  $td.addClass('current');
                }
              }
              if (type === 'datetime') {
                $delegateTarget.find('.gmi-date-picker--input').val(elValue);
                $timeInput = $delegateTarget.find('.gmi-time-picker--input');
                if ($timeInput.val() === '' || !$.parseDate($timeInput.val(), DEFAULT_TIME_FORMAT)) {
                  $timeInput.val(DEFAULT_TIME_VALUE);
                }
                $determineButton.removeClass('disabled');
                return false;
              }
              core._hidePickerPanel();
            } else if (currentView === 'yearView') { // yearView
              core._setYearView($td);
            } else { // monthView
              core._setMonthView($td);
            }
          } else if (type === 'month') {
            switch (datepicker.currentView) {
              case 'monthView':
                core._setMonthView($td);
                break;
              case 'yearView':
                core._setYearView($td);
                break;
              default:
                break;
            }
          } else if (type === 'year') {
            core._setYearView($td);
          } else if (type === 'date-range' || type === 'datetime-range') {
            var minDate = datepicker.minDate;
            var maxDate = datepicker.maxDate;
            var $startDateInput = $delegateTarget.find('.gmi-date-picker--input[data-role="range-start"]');
            var $startTimeInput = $delegateTarget.find('.gmi-time-picker--input[data-role="range-start"]');
            var $endDateInput = $delegateTarget.find('.gmi-date-picker--input[data-role="range-end"]');
            var $endTimeInput = $delegateTarget.find('.gmi-time-picker--input[data-role="range-end"]');
            var value;
            year = Number($td.data('year'));
            month = Number($td.data('month'));
            date = $td.text() === datepicker.todaySuffix ? new Date().getDate() : Number($td.text());
            if (minDate && maxDate) {
              datepicker.minDate = new Date(year, month, date);
              datepicker.maxDate = null;
              $delegateTarget.find('.gmi-date-table td').removeClass('start-date in-range end-date');
              if (!$td.hasClass('prev-month') && !$td.hasClass('next-month')) $td.addClass('start-date in-range');
              if (type === 'datetime-range') {
                $startDateInput.val($.formatDate(datepicker.minDate));
                $determineButton.addClass('disabled');
              }
            } else if (minDate && !maxDate) {
              if (new Date(year, month, date).getTime() < minDate.getTime()) {
                datepicker.minDate = new Date(year, month, date);
                $delegateTarget.find('.gmi-date-table td').removeClass('start-date in-range');
                if (!$td.hasClass('prev-month') && !$td.hasClass('next-month')) $td.addClass('start-date in-range');
                if (type === 'datetime-range') {
                  $startDateInput.val($.formatDate(datepicker.minDate));
                  $determineButton.addClass('disabled');
                }
              } else {
                datepicker.maxDate = new Date(year, month, date);
                if (!$td.hasClass('prev-month') && !$td.hasClass('next-month')) $td.addClass('end-date in-range');
                $delegateTarget.find('.gmi-date-table td').filter(function () {
                  var $self = $(this);
                  var selfYear = Number($self.data('year'));
                  var selfMonth = Number($self.data('month'));
                  var selfDate = $self.text() === datepicker.todaySuffix ? new Date().getDate() : Number($self.text());
                  var rangeDate = new Date(selfYear, selfMonth, selfDate);
                  return !$self.hasClass('prev-month') && !$self.hasClass('next-month') &&
                    (rangeDate > datepicker.minDate.getTime()) &&
                    (rangeDate.getTime() < datepicker.maxDate.getTime());
                }).addClass('in-range');
                if (type === 'date-range') {
                  value = $.formatDate(datepicker.minDate, format) + ' '+ datepicker.rangeSeparator +' ' + $.formatDate(datepicker.maxDate, format);
                  core._setDate(value);
                  core._hidePickerPanel();
                } else {
                  $endDateInput.val($.formatDate(datepicker.maxDate));
                  if ($startTimeInput.val() === '') $startTimeInput.val(DEFAULT_TIME_VALUE);
                  if ($endTimeInput.val() === '') $endTimeInput.val(DEFAULT_TIME_VALUE);
                  $determineButton.removeClass('disabled');
                }
              }
            } else if (!minDate) {
              datepicker.minDate = new Date(year, month, date);
              if (!$td.hasClass('prev-month') && !$td.hasClass('next-month')) $td.addClass('start-date in-range');
              if (type === 'datetime-range') {
                $startDateInput.val($.formatDate(datepicker.minDate));
                $determineButton.addClass('disabled');
              }
            }
          }
        });

        // bind event for month label
        datepicker.$pickerPanel.on('click.datepicker', '.gmi-date-picker__header__label--month', function (e) {
          var $monthLabel = $(this);
          var $yearLabel = $monthLabel.siblings('.gmi-date-picker__header__label--year');
          var $delegateTarget = $(e.delegateTarget);
          var $monthTable = $delegateTarget.find('.gmi-month-table');
          var year = datepicker.yearLabel;
          var month = datepicker.monthLabel;

          // add current class for month table td
          if (!$monthTable.find('td').removeClass('current').eq(Number(month)).hasClass('disabled')) {
            $monthTable.find('td').removeClass('current').eq(Number(month)).addClass('current');
          }

          // change year label text
          $yearLabel.text(year + ' '+ datepicker.yearSuffix +'');
          // hide month label
          $monthLabel.hide();
          // show month table
          core._setNewMonthDOM($delegateTarget, month);
          // reset picker current view, current view is month view
          datepicker.currentView = 'monthView';
          e.stopPropagation();
        });

        // bind event for year label
        datepicker.$pickerPanel.on('click.datepicker', '.gmi-date-picker__header__label--year', function (e) {
          if (datepicker.currentView === 'yearView') {
            return false;
          }
          var $yearLabel = $(this);
          var $monthLabel = $yearLabel.siblings('.gmi-date-picker__header__label--month');
          var $delegateTarget = $(e.delegateTarget);
          var year = datepicker.yearLabel;

          // generate new year dom
          core._setNewYearDOM($delegateTarget, year, $yearLabel);
          // hide month label
          $monthLabel.hide();
          // show year table
          datepicker.currentView = 'yearView';
          e.stopPropagation();
        });

        // bind events for arrow-down and arrow-up
        datepicker.$pickerPanel.on('click.datepicker', '.gmi-date-picker__header__icon-btn', function (e) {
          var $delegateTarget = $(e.delegateTarget);
          var $button = $(this);
          var action = $button.data('action');
          var currentView = datepicker.currentView;

          switch (action) {
            case 'prev':
              core._setPrevButtonAction($delegateTarget, currentView);
              break;
            case 'next':
              core._setNextButtonAction($delegateTarget, currentView);
              break;
            default:
              break;
          }
          e.stopPropagation();
        });

        // bind event for link button
        datepicker.$pickerPanel.on('click.datepicker', '.gmi-picker-panel__link-btn:not(.gmi-time-panel__btn)', function (e) {
          var $linkButton = $(this);
          var $delegateTarget = $(e.delegateTarget);
          var role = $linkButton.data('role');
          var type = datepicker.type;
          var dateValue;
          var timeValue;
          var date;
          var time;
          var minDateValue;
          var minTimeValue;
          var minDate;
          var minTime;
          var minValue;
          var maxDateValue;
          var maxTimeValue;
          var maxDate;
          var maxTime;
          var maxValue;
          var value;

          switch (role) {
            case 'determine':
              if ($linkButton.hasClass('disabled')) {
                return false;
              }
              if (type === 'datetime') {
                dateValue = $delegateTarget.find('.gmi-date-picker--input').val();
                timeValue = $delegateTarget.find('.gmi-time-picker--input').val();
                date = $.parseDate(dateValue);
                time = $.parseDate(timeValue, DEFAULT_TIME_FORMAT);
                date.setHours(time.getHours(), time.getMinutes(), time.getSeconds(), 0);
                value = $.formatDate(date, datepicker.format);
              } else if (type === 'datetime-range') {
                minDateValue = $delegateTarget.find('.gmi-date-picker--input[data-role="range-start"]').val();
                minTimeValue = $delegateTarget.find('.gmi-time-picker--input[data-role="range-start"]').val();
                minDate = $.parseDate(minDateValue);
                minTime = $.parseDate(minTimeValue !== '' ? minTimeValue : DEFAULT_TIME_VALUE, DEFAULT_TIME_FORMAT);
                minDate.setHours(minTime.getHours(), minTime.getMinutes(), minTime.getSeconds(), 0);
                minValue = $.formatDate(minDate, datepicker.format);
                maxDateValue = $delegateTarget.find('.gmi-date-picker--input[data-role="range-end"]').val();
                maxTimeValue = $delegateTarget.find('.gmi-time-picker--input[data-role="range-end"]').val();
                maxDate = $.parseDate(maxDateValue);
                maxTime = $.parseDate(maxTimeValue !== '' ? maxTimeValue : DEFAULT_TIME_VALUE, DEFAULT_TIME_FORMAT);
                maxDate.setHours(maxTime.getHours(), maxTime.getMinutes(), maxTime.getSeconds(), 0);
                maxValue = $.formatDate(maxDate, datepicker.format);
                value = minValue + ' '+ datepicker.rangeSeparator +' ' + maxValue;
              }
              core._setDate(value);
              core._hidePickerPanel();
              break;
            case 'now':
              value = $.formatDate(new Date(), datepicker.format);
              core._setDate(value);
              core._hidePickerPanel();
              break;
            case 'clear':
              core._clear();
              break;
            default:
              break;
          }
          e.stopPropagation();
        });

        // bind events for range date button
        datepicker.$pickerPanel.on('click.datepicker', '.gmi-date-range-picker__header__icon-btn', function (e) {
          var $delegateTarget = $(e.delegateTarget);
          var $button = $(this);
          var action = $button.data('action');

          core._setRangeDateView($delegateTarget, action);
          e.stopPropagation();
        });

        datepicker.$pickerPanel.on('mouseenter.datepicker', 'td:not(.disabled)', function (e) {
          if (datepicker.type !== 'date-range' && datepicker.type !== 'datetime-range') {
            return false;
          }
          var $delegateTarget = $(e.delegateTarget);
          var $td = $(this);
          var year = Number($td.data('year'));
          var month = Number($td.data('month'));
          var date = $td.text() === datepicker.todaySuffix ? new Date().getDate() : Number($td.text());
          var currentDate = new Date(year, month, date);
          var minDate = datepicker.minDate;
          var maxDate = datepicker.maxDate;

          if (minDate && !maxDate) {
            datepicker.$minDateTarget = $delegateTarget.find('.gmi-date-table td').filter(function () {
              return !$(this).hasClass('prev-month') && !$(this).hasClass('next-month') &&
                Number($(this).data('year')) === minDate.getFullYear() &&
                Number($(this).data('month')) === minDate.getMonth() &&
                ($(this).text() === datepicker.todaySuffix ? new Date().getDate() : Number($(this).text())) === minDate.getDate();
            });
            if (!datepicker.$minDateTarget.hasClass('start-date')) {
              datepicker.$minDateTarget.addClass('in-range start-date');
            }
            if (currentDate.getTime() >= minDate.getTime()) {
              $delegateTarget.find('.gmi-date-table td').filter(function () {
                var inRangeYear = Number($(this).data('year'));
                var inRangeMonth = Number($(this).data('month'));
                var inRangeDate = $(this).text() === datepicker.todaySuffix ? new Date().getDate() : Number($(this).text());
                return !$(this).hasClass('prev-month') && !$(this).hasClass('next-month') &&
                  new Date(inRangeYear, inRangeMonth, inRangeDate).getTime() > minDate.getTime() &&
                  new Date(inRangeYear, inRangeMonth, inRangeDate).getTime() < new Date(year, month, date).getTime();
              }).addClass('in-range');
              if (!$td.hasClass('prev-month') && !$td.hasClass('next-month')) {
                $td.addClass('in-range end-date');
              } else {
                $delegateTarget.find('.gmi-date-table td').filter(function () {
                  var endDateYear = Number($(this).data('year'));
                  var endDateMonth = Number($(this).data('month'));
                  var endDateDate = $(this).text() === datepicker.todaySuffix ? new Date().getDate() : Number($(this).text());
                  return !$(this).hasClass('prev-month') && !$(this).hasClass('next-month') &&
                    endDateYear === year && endDateMonth === month && endDateDate === date;
                }).addClass('in-range end-date');
              }
            }
          }
          e.stopPropagation();
        }).on('mouseleave.datepicker', 'td:not(.disabled)', function (e) {
          if (datepicker.type !== 'date-range' && datepicker.type !== 'datetime-range') {
            return false;
          }
          var $delegateTarget = $(e.delegateTarget);
          var $td = $(this);
          var year = Number($td.data('year'));
          var month = Number($td.data('month'));
          var date = $td.text() === datepicker.todaySuffix ? new Date().getDate() : Number($td.text());
          var minDate = datepicker.minDate;
          var maxDate = datepicker.maxDate;

          if (minDate && !maxDate) {
            $delegateTarget.find('.gmi-date-table td').filter(function () {
              return !$(this).hasClass('start-date') && !$(this).hasClass('end-date');
            }).removeClass('in-range');
            if (!$td.hasClass('prev-month') && !$td.hasClass('next-month')) {
              $td.removeClass('in-range end-date');
            } else {
              $delegateTarget.find('.gmi-date-table td').filter(function () {
                var endDateYear = Number($(this).data('year'));
                var endDateMonth = Number($(this).data('month'));
                var endDateDate = $(this).text() === datepicker.todaySuffix ? new Date().getDate() : Number($(this).text());
                return !$(this).hasClass('prev-month') && !$(this).hasClass('next-month') &&
                  endDateYear === year && endDateMonth === month && endDateDate === date;
              }).removeClass('in-range end-date');
            }
          }
          e.stopPropagation();
        });
      },
      _unBindEvent: function () {
        $el.off('focus.datepicker', core._elFocusHandler);
        $el.off('click.datepicker', core._elClickHandler);
        $el.off('change.datepicker', core._elChangeHandler);
        $el.off('keyup.datepicker', core._elKeyUpHandler);
        $el.off('pick.datepicker', datepicker.onChange);
        $el.off('show.datepicker', datepicker.onShow);
        $el.off('hide.datepicker', datepicker.onHide);
      },
      _generateDateDOM: function () {
        var type = datepicker.type;
        var hasTimeClass = type === 'datetime' ? 'has-time' : '';
        var datetimeHeaderStr = type === 'datetime' ? core._generateDatetimeHeader() : '';
        var datetimeFooterStr = type === 'datetime' ? core._generateDatetimeFooter(type) : '';
        var startYear = Math.floor(datepicker.date.getFullYear() / 10) * 10;
        var endYear = Math.floor(datepicker.date.getFullYear() / 10) * 10 + 9;
        var yearLabel = type === 'date' || type === 'month' || type === 'datetime' ? datepicker.date.getFullYear() + ' '+ datepicker.yearSuffix +'' : startYear + ' '+ datepicker.yearSuffix +'' + ' - ' + endYear + ' '+ datepicker.yearSuffix +'';
        var monthLabel = datepicker.monthsShort[datepicker.date.getMonth()];
        var monthDom = type === 'date' || type === 'datetime' ? '<span class="gmi-date-picker__header__label--month">'+ monthLabel +'</span>' : '';
        var dateDomStr = '<div data-role="'+ type +'" class="gmi-picker-panel gmi-date-picker '+ hasTimeClass +'" style="display: none;">' +
          '<div class="gmi-picker-panel__body">'
          + datetimeHeaderStr +
          '<div class="gmi-picker-panel__body__header">' +
          '<span class="gmi-date-picker__header__label--year">'+ yearLabel +'</span>'
          + monthDom +
          '<em data-action="next" class="gmi-date-picker__header__icon-btn gmi-picker-panel__btn--next"></em>' +
          '<em data-action="prev" class="gmi-date-picker__header__icon-btn gmi-picker-panel__btn--prev"></em>' +
          '</div>' +
          '<div class="gmi-picker-panel__body__main">'
          + core._getDateTable(datepicker.date) +
          '' + core._getYearTable(datepicker.date.getFullYear()) +
          '' + core._getMonthTable(datepicker.date.getMonth()) +
          '</div>' +
          '</div>'
          + datetimeFooterStr +
          '</div>';

        return dateDomStr;
      },
      _generateRangeDateDOM: function () {
        var date = datepicker.date;
        var firstDate = datepicker.minDate ? datepicker.minDate : date;
        var nextDate = datepicker.minDate ? $.getNextMonth(datepicker.minDate) : $.getNextMonth(date);
        var type = datepicker.type;
        var hasTimeClass = type === 'datetime-range' ? 'has-time' : '';
        var rangeDatetimeHeaderStr = type === 'datetime-range' ? core._generateRangeDatetimeHeader() : '';
        var rangeDatetimeFooterStr = type === 'datetime-range' ? core._generateDatetimeFooter(type) : '';
        var rangeDateDomStr = '<div data-role="'+ type +'" class="gmi-picker-panel gmi-date-range-picker '+ hasTimeClass +'" style="display: none;">'
          + rangeDatetimeHeaderStr +
          '<div class="gmi-picker-panel__body gmi-date-range-picker__body">' +
          '<div class="gmi-picker-panel__body__main f-lt">' +
          '<div class="gmi-date-range-picker__body__header">' +
          '<p>'+ firstDate.getFullYear() +' '+ datepicker.yearSuffix +' '+ datepicker.monthsShort[firstDate.getMonth()] +'</p>' +
          '<em data-action="prev-year" class="gmi-date-range-picker__header__icon-btn gmi-date-range-picker__btn--prev gmi-date-range-picker__btn--prev-year"></em>' +
          '<em data-action="prev-month" class="gmi-date-range-picker__header__icon-btn gmi-date-range-picker__btn--prev gmi-date-range-picker__btn--prev-month"></em>' +
          '</div>'
          + core._getDateTable(firstDate) +
          '</div>' +
          '<div class="gmi-picker-panel__body__main f-rt">' +
          '<div class="gmi-date-range-picker__body__header">' +
          '<p>'+ nextDate.getFullYear() +' '+ datepicker.yearSuffix +' '+ datepicker.monthsShort[nextDate.getMonth()] +'</p>' +
          '<em data-action="next-year" class="gmi-date-range-picker__header__icon-btn gmi-date-range-picker__btn--next gmi-date-range-picker__btn--next-year"></em>' +
          '<em data-action="next-month" class="gmi-date-range-picker__header__icon-btn gmi-date-range-picker__btn--next gmi-date-range-picker__btn--next-month"></em>' +
          '</div>'
          + core._getDateTable(nextDate) +
          '</div>' +
          '</div>'
          + rangeDatetimeFooterStr +
          '</div>';
        return rangeDateDomStr;
      },
      _generateDatetimeHeader: function () {
        var datetimeHeaderStr = '<ul class="gmi-picker-panel__body__header--time">' +
          '<li class="gmi-picker-panel__body__header--time__wrapper">' +
          '<div class="gmi-input">' +
          '<input data-role="date" type="text" readonly class="gmi-input__inner gmi-date-picker--input" placeholder="'+ datepicker.dateInputPlaceholder +'">' +
          '</div>' +
          '</li>' +
          '<li class="gmi-picker-panel__body__header--time__wrapper">' +
          '<div data-role="date" class="gmi-input gmi-time-picker--wrapper">' +
          '<input data-role="date" type="text" class="gmi-input__inner gmi-time-picker--input" placeholder="'+ datepicker.dateTimeInputPlaceholder +'">'
          + core._generateTimePickerDOM('date') +
          '</div>' +
          '</li>' +
          '</ul>';

        return datetimeHeaderStr;
      },
      _generateRangeDatetimeHeader: function () {
        var rangeDatetimeHeaderStr = '<ul class="gmi-picker-panel__body__header--time">' +
          '<li class="gmi-picker-panel__body__header--time__wrapper gmi-date-range-picker__header--time__wrapper">' +
          '<div class="gmi-input">' +
          '<input data-role="range-start" type="text" readonly class="gmi-input__inner gmi-date-picker--input" placeholder="'+ datepicker.rangeStartInputPlaceholder +'">' +
          '</div>' +
          '<div data-role="range-start" class="gmi-input gmi-time-picker--wrapper">' +
          '<input data-role="range-start" type="text" class="gmi-input__inner gmi-time-picker--input" placeholder="'+ datepicker.rangeStartTimeInputPlaceholder +'">'
          + core._generateTimePickerDOM('range-start') +
          '</div>' +
          '</li>' +
          '<li class="gmi-picker-panel__body__header--time__wrapper gmi-date-range-picker__header--time__wrapper">' +
          '<div class="gmi-input">' +
          '<input data-role="range-end" type="text" readonly class="gmi-input__inner gmi-date-picker--input" placeholder="'+ datepicker.rangeEndPlaceholder +'">' +
          '</div>' +
          '<div data-role="range-end" class="gmi-input gmi-time-picker--wrapper">' +
          '<input data-role="range-end" type="text" class="gmi-input__inner gmi-time-picker--input" placeholder="'+ datepicker.rangeEndTimeInputPlaceholder +'">'
          + core._generateTimePickerDOM('range-end') +
          '</div>' +
          '</li>' +
          '</ul>';

        return rangeDatetimeHeaderStr;
      },
      _generateDatetimeFooter: function (type) {
        var buttonText = type === 'datetime-range' ? datepicker.clearButton : datepicker.nowDateButton;
        var buttonClass = type === 'datetime-range' ? 'gmi-picker-panel__link-btn--clear' : 'gmi-picker-panel__link-btn--now';
        var buttonRole = type === 'datetime-range' ? 'clear' : 'now';
        var disabledClass = type === 'datetime-range' && datepicker.minDate && datepicker.maxDate ? '' : type === 'datetime' ? '' : 'disabled';
        var datetimeFooterStr = '<div class="gmi-picker-panel__footer">' +
          '<a href="JavaScript:" data-role="'+ buttonRole +'" class="gmi-picker-panel__link-btn '+ buttonClass +'">'+ buttonText +'</a>' +
          '<a href="JavaScript:" data-role="determine" class="gmi-picker-panel__link-btn gmi-picker-panel__link-btn--determine '+ disabledClass +'">'+ datepicker.confirmDateButton +'</a>' +
          '</div>';
        return datetimeFooterStr;
      },
      _generateTimePickerDOM: function (role) {
        var timePickerStr = '<div data-role="'+ role +'" class="gmi-time-panel gmi-time-picker" style="display: none;">' +
          '<div class="gmi-time-panel__body">' +
          '<div class="gmi-time-panel__body__item">'
          + core._getTimeSpinner('hour') +
          '</div>' +
          '<div class="gmi-time-panel__body__item">'
          + core._getTimeSpinner('min') +
          '</div>' +
          '<div class="gmi-time-panel__body__item">'
          + core._getTimeSpinner('sec') +
          '</div>' +
          '</div>' +
          '<div class="gmi-picker-panel__footer gmi-time-panel__footer">' +
          '<a href="JavaScript:" data-role="cancel" class="gmi-picker-panel__link-btn gmi-time-panel__btn gmi-picker-panel__link-btn--default">'+ datepicker.cancelTimeButton +'</a>' +
          '<a href="JavaScript:" data-role="confirm" class="gmi-picker-panel__link-btn gmi-time-panel__btn gmi-picker-panel__link-btn--primary">'+ datepicker.confirmDateButton +'</a>' +
          '</div>' +
          '</div>';
        return timePickerStr;
      },
      _getDateRows: function (nowDate) {
        var tableRows = [ [], [], [], [], [], [] ];
        var year = nowDate.getFullYear();
        var month = nowDate.getMonth();

        var date = new Date(year, month, 1);
        var day = $.getFirstDayOfMonth(date);// day of first day
        var dateCountOfMonth = $.getTotalDayCountOfMonth(date.getFullYear(), date.getMonth());
        var dateCountOfLastMonth = $.getTotalDayCountOfMonth(date.getFullYear(), (date.getMonth() === 0 ? 11 : date.getMonth() - 1));

        day = (day === 0) ? 7 : day;
        var offset = -1 * datepicker.weekStart;
        var rows = tableRows;
        var count = 1;
        var firstDayPosition;
        var startDate = $.getStartDateOfMonth(year, month);
        var now = $.clearHours(new Date()); // get now time

        for (var i = 0; i < 6; i++) {
          var row = rows[i];
          for (var j = 0; j < 7; j++) {
            var cell = row[j];
            if (!cell) {
              cell = { row: i, column: j, type: 'normal', year: date.getFullYear(), month: date.getMonth(), inRange: false, start: false, end: false}; // init cell
            }
            cell.type = 'normal';
            var index = i * 7 + j;
            var time = startDate.getTime() + DAY_DURATION * (index - offset);
            cell.inRange = time >= $.clearHours(datepicker.minDate) && time <= $.clearHours(datepicker.maxDate);
            cell.start = datepicker.minDate && time === $.clearHours(datepicker.minDate);
            cell.end = datepicker.maxDate && time === $.clearHours(datepicker.maxDate);
            cell.disabled = false;
            if (datepicker.startDate && isDate(datepicker.startDate) && time < $.clearHours(datepicker.startDate)) {
              cell.disabled = true;
            }
            if (datepicker.endDate && isDate(datepicker.endDate) && time > $.clearHours(datepicker.endDate)) {
              cell.disabled = true;
            }
            var isToday = time === now;
            if (isToday) {
              cell.type = 'today';
            }

            if (i >= 0 && i <= 1) {
              if (j + i * 7 >= (day + offset)) {
                cell.text = count++;
                if (count === 2) {
                  firstDayPosition = i * 7 + j;
                }
                cell.year = date.getFullYear();
                cell.month = date.getMonth();
              } else {
                cell.text = dateCountOfLastMonth - (day + offset - j % 7) + 1 + i * 7;
                cell.type = 'prev-month';
                cell.year = date.getMonth() === 0 ? date.getFullYear() - 1 : date.getFullYear();
                cell.month = date.getMonth() === 0 ? 11 : date.getMonth() - 1;
              }
            } else {
              if (count <= dateCountOfMonth) {
                cell.text = count++;
                if (count === 2) {
                  firstDayPosition = i * 7 + j;
                }
                cell.year = date.getFullYear();
                cell.month = date.getMonth();
              } else {
                cell.text = count++ - dateCountOfMonth;
                cell.type = 'next-month';
                cell.year = date.getMonth() === 11 ? date.getFullYear() + 1 : date.getFullYear();
                cell.month = date.getMonth() === 11 ? 0 : date.getMonth() + 1;
              }
            }
            row[j] = $.extend({}, cell);
          }
        }
        rows.firstDayPosition = firstDayPosition;
        return rows;
      },
      _getWeekDayRows: function () {
        var weekDayRows = datepicker.daysMin;
        if (datepicker.weekStart) weekDayRows = weekDayRows.slice(datepicker.weekStart).concat(weekDayRows.slice(0,datepicker.weekStart));
        return weekDayRows;
      },
      _getYearRows: function (year) {
        var startYear = Math.floor(year / 10) * 10;
        var yearRows = [[], [], []];

        for (var i = 0; i < 3; i++) {
          var yearRow = yearRows[i];
          for (var j = 0; j < 4; j++) {
            var index = i * 4 + j;
            if (index > 9) {
              break;
            }
            yearRow[j] = startYear + index;
          }
        }

        return yearRows;
      },
      _getMonthRows: function () {
        var monthsRows = [[], [], []];
        var monthsArray = datepicker.monthsShort;
        var index = 0;
        for (var i = 0; i < monthsArray.length; i++) {
          var monthCell = monthsArray[i];
          if (i % 4 === 0 && i !== 0) {
            index++;
          }
          monthsRows[index].push(monthCell);
        }
        return monthsRows;
      },
      _getTimeSpinnerData: function (type) {
        var timeArray = [];
        switch (type) {
          case 'hour':
            for (var h = 0; h <= 23; h++) {
              timeArray.push(h);
            }
            break;
          case 'min':
            for (var m = 0; m <= 59; m++) {
              timeArray.push(m);
            }
            break;
          case 'sec':
            for (var s = 0; s <= 59; s++) {
              timeArray.push(s);
            }
            break;
          default:
            break;
        }
        return timeArray;
      },
      _getDateTable: function (nowDate) {
        var rows = core._getDateRows(nowDate);
        var weekDayRows = core._getWeekDayRows();
        var type = datepicker.type;
        var showStyle = type === 'date-range' || type === 'datetime-range' ? '' : 'style="display:none;"';
        var tableStr = '<table cellspacing="0" cellpadding="0" class="gmi-date-table" '+ showStyle +'><tbody>';

        tableStr += '<tr>';
        for (var w = 0; w < weekDayRows.length; w++) {
          tableStr += '<th>'+ weekDayRows[w] +'</th>';
        }
        tableStr += '</tr>';

        for (var i = 0; i < rows.length; i++) {
          var row = rows[i];
          tableStr += '<tr class="gmi-date-table__row">';
          for (var j = 0; j < row.length; j++) {
            var cell = row[j];
            var classes = core._getCellClasses(cell);
            var text = cell.type === 'today' ? datepicker.todaySuffix : cell.text;
            tableStr += '<td data-year="'+ cell.year +'" data-month="'+ cell.month +'" class="'+ classes +'">'+ text +'</td>';
          }
          tableStr += '</tr>';
        }

        tableStr += '</tbody></table>';
        return tableStr;
      },
      _getYearTable: function (year) {
        var yearRows = core._getYearRows(year);
        var startYear = datepicker.startDate && isDate(datepicker.startDate) ? datepicker.startDate.getFullYear() : null;
        var endYear = datepicker.endDate && isDate(datepicker.endDate) ? datepicker.endDate.getFullYear() : null;
        var tableStr = '<table class="gmi-year-table" style="display:none;"><tbody>';

        for (var i = 0; i < yearRows.length; i++) {
          var yearRow = yearRows[i];
          tableStr += '<tr>';
          for (var j = 0; j < yearRow.length; j++) {
            var yearCell = yearRow[j];
            var isDisabled = false;
            if (startYear && yearCell < startYear) {
              isDisabled = true;
            }
            if (endYear && yearCell > endYear) {
              isDisabled = true;
            }
            var disabledClass = isDisabled ? 'disabled' : '';
            var currentClass = year === yearCell && !isDisabled ? 'current' : '';
            tableStr += '<td class="available '+ currentClass +' '+ disabledClass +'"><span class="cell">'+ yearCell +'</span></td>';
          }
          tableStr += '</tr>';
        }

        tableStr += '</tbody></table>';
        return tableStr;
      },
      _getMonthTable: function (month) {
        var monthRows = core._getMonthRows();
        var startYear = datepicker.startDate && isDate(datepicker.startDate) ? datepicker.startDate.getFullYear() : null;
        var startMonth = datepicker.startDate && isDate(datepicker.startDate) ? datepicker.startDate.getMonth() : null;
        var startTime = startYear && startMonth ? new Date(startYear, startMonth, 1).getTime() : null;
        var endYear = datepicker.endDate && isDate(datepicker.endDate) ? datepicker.endDate.getFullYear() : null;
        var endMonth = datepicker.endDate && isDate(datepicker.endDate) ? datepicker.endDate.getMonth() : null;
        var endTime = endYear && endMonth ? new Date(endYear, endMonth, 1).getTime() : null;
        var tableStr = '<table class="gmi-month-table" style="display:none;"><tbody>';

        for (var i = 0; i < monthRows.length; i++) {
          var monthRow = monthRows[i];
          tableStr += '<tr>';
          for (var j = 0; j < monthRow.length; j++) {
            var monthCell = monthRow[j];
            var isDisabled = false;
            if (startTime && (new Date(datepicker.yearLabel, i * 4 + j, 1) < startTime)) {
              isDisabled = true;
            }

            if (endTime && (new Date(datepicker.yearLabel, i * 4 + j, 1) > endTime)) {
              isDisabled = true;
            }
            var disabledClass = isDisabled ? 'disabled' : '';
            var currentClass = month === (i * 4 + j) && !isDisabled ? 'current' : '';
            tableStr += '<td data-year="'+ datepicker.date.getFullYear() +'" data-month="'+ (i * 4 + j) +'" class="'+ currentClass +' '+ disabledClass +'"><span class="cell">'+ monthCell +'</span></td>';
          }
          tableStr += '</tr>';
        }
        tableStr += '</tbody></table>';
        return tableStr;
      },
      _getTimeSpinner: function (type) {
        var data = core._getTimeSpinnerData(type);
        var timeSpinnerStr = '<ul data-role="'+ type +'" class="gmi-time-panel__body__item--spinner">';
        for (var i = 0; i < data.length; i++) {
          timeSpinnerStr += '<li class="gmi-time-panel__body__item--spinner__item">'+ data[i] +'</li>';
        }
        timeSpinnerStr += '</ul>';
        return timeSpinnerStr;
      },
      _echoDateOrTimeIntoInput: function () {
        var type = datepicker.type;
        if (type === 'datetime') {
          var $dateInput = datepicker.$pickerPanel.find('.gmi-date-picker--input');
          var $timeInput = datepicker.$pickerPanel.find('.gmi-time-picker--input');
          var date = $.formatDate(datepicker.date);
          var time = $.formatDate(datepicker.date, DEFAULT_TIME_FORMAT);
          $dateInput.val(date);
          $timeInput.val(time);
        } else if (type === 'datetime-range') {
          var $startDateInput = datepicker.$pickerPanel.find('.gmi-date-picker--input').filter('[data-role="range-start"]');
          var $endDateInput = datepicker.$pickerPanel.find('.gmi-date-picker--input').filter('[data-role="range-end"]');
          var $startTimeInput = datepicker.$pickerPanel.find('.gmi-time-picker--input').filter('[data-role="range-start"]');
          var $endTimeInput = datepicker.$pickerPanel.find('.gmi-time-picker--input').filter('[data-role="range-end"]');
          var startDate;
          var startTime;
          var endDate;
          var endTime;
          if (datepicker.minDate && datepicker.maxDate) {
            startDate = $.formatDate(datepicker.minDate);
            startTime = $.formatDate(datepicker.minDate, DEFAULT_TIME_FORMAT);
            endDate = $.formatDate(datepicker.maxDate);
            endTime = $.formatDate(datepicker.maxDate, DEFAULT_TIME_FORMAT);
            $startDateInput.val(startDate);
            $startTimeInput.val(startTime);
            $endDateInput.val(endDate);
            $endTimeInput.val(endTime);
          } else {
            startDate = $.formatDate(datepicker.date);
            startTime = $.formatDate(datepicker.date, DEFAULT_TIME_FORMAT);
            endDate = $.formatDate(datepicker.date);
            endTime = $.formatDate(datepicker.date, DEFAULT_TIME_FORMAT);
            $startDateInput.val(startDate);
            $startTimeInput.val(startTime);
            $endDateInput.val(endDate);
            $endTimeInput.val(endTime);
          }
        }
      },
      _echoTimeIntoSpinner: function (time, rangeType) {
        var type = datepicker.type;

        if (type === 'datetime') {
          var hour = time && typeof time === 'object' ? time.hour : datepicker.date.getHours();
          var min = time && typeof time === 'object' ? time.min : datepicker.date.getMinutes();
          var sec = time && typeof time === 'object' ? time.sec : datepicker.date.getSeconds();
          var $hourSpinner = datepicker.$timePanel.find('.gmi-time-panel__body__item--spinner[data-role=hour]');
          var $minSpinner = datepicker.$timePanel.find('.gmi-time-panel__body__item--spinner[data-role=min]');
          var $secSpinner = datepicker.$timePanel.find('.gmi-time-panel__body__item--spinner[data-role=sec]');
          var $curHourItem = $hourSpinner.children('li').filter(function () {
            return Number($(this).text()) === hour;
          });
          var $curMinItem = $minSpinner.children('li').filter(function () {
            return Number($(this).text()) === min;
          });
          var $curSecItem = $secSpinner.children('li').filter(function () {
            return Number($(this).text()) === sec;
          });
          var curTimeItemHeight = $curHourItem.outerHeight();

          datepicker.$timePanel.show();
          if ($curHourItem.length > 0 && $curMinItem.length > 0 && $curSecItem.length > 0) {
            $curHourItem.addClass('active').siblings().removeClass('active');
            $curMinItem.addClass('active').siblings().removeClass('active');
            $curSecItem.addClass('active').siblings().removeClass('active');
            $hourSpinner.parent().scrollTop(hour * curTimeItemHeight);
            $minSpinner.parent().scrollTop(min * curTimeItemHeight);
            $secSpinner.parent().scrollTop(sec * curTimeItemHeight);
          } else {
            return;
          }
        } else if (type === 'datetime-range') {
          if (rangeType === 'range-start') {
            var minHour = time && typeof time === 'object' ? time.minHour : datepicker.minDate ? datepicker.minDate.getHours() : datepicker.date.getHours();
            var minMin = time && typeof time === 'object' ? time.minMin : datepicker.minDate ? datepicker.minDate.getMinutes() : datepicker.date.getMinutes();
            var minSec = time && typeof time === 'object' ? time.minSec : datepicker.minDate ? datepicker.minDate.getSeconds() : datepicker.date.getSeconds();
            var $minHourSpinner = datepicker.$timePanel.filter('[data-role="range-start"]').find('.gmi-time-panel__body__item--spinner[data-role=hour]');
            var $minMinSpinner = datepicker.$timePanel.filter('[data-role="range-start"]').find('.gmi-time-panel__body__item--spinner[data-role=min]');
            var $minSecSpinner = datepicker.$timePanel.filter('[data-role="range-start"]').find('.gmi-time-panel__body__item--spinner[data-role=sec]');
            var $curMinHourItem = $minHourSpinner.children('li').filter(function () {
              return Number($(this).text()) === minHour;
            });
            var $curMinMinItem = $minMinSpinner.children('li').filter(function () {
              return Number($(this).text()) === minMin;
            });
            var $curMinSecItem = $minSecSpinner.children('li').filter(function () {
              return Number($(this).text()) === minSec;
            });
            var curMinTimeItemHeight = $curMinHourItem.outerHeight();

            datepicker.$timePanel.filter('[data-role="range-start"]').show();

            if ($curMinHourItem.length > 0 && $curMinMinItem.length > 0 && $curMinSecItem.length > 0) {
              $curMinHourItem.addClass('active').siblings().removeClass('active');
              $curMinMinItem.addClass('active').siblings().removeClass('active');
              $curMinSecItem.addClass('active').siblings().removeClass('active');
              $minHourSpinner.parent().scrollTop(minHour * curMinTimeItemHeight);
              $minMinSpinner.parent().scrollTop(minMin * curMinTimeItemHeight);
              $minSecSpinner.parent().scrollTop(minSec * curMinTimeItemHeight);
            } else {
              return;
            }
          } else if (rangeType === 'range-end') {
            var maxHour = time && typeof time === 'object' ? time.maxHour : datepicker.maxDate ? datepicker.maxDate.getHours() : datepicker.date.getHours();
            var maxMin = time && typeof time === 'object' ? time.maxMin : datepicker.maxDate ? datepicker.maxDate.getMinutes() : datepicker.date.getMinutes();
            var maxSec = time && typeof time === 'object' ? time.maxSec : datepicker.maxDate ? datepicker.maxDate.getSeconds() : datepicker.date.getSeconds();
            var $maxHourSpinner = datepicker.$timePanel.filter('[data-role="range-end"]').find('.gmi-time-panel__body__item--spinner[data-role=hour]');
            var $maxMinSpinner = datepicker.$timePanel.filter('[data-role="range-end"]').find('.gmi-time-panel__body__item--spinner[data-role=min]');
            var $maxSecSpinner = datepicker.$timePanel.filter('[data-role="range-end"]').find('.gmi-time-panel__body__item--spinner[data-role=sec]');
            var $curMaxHourItem = $maxHourSpinner.children('li').filter(function () {
              return Number($(this).text()) === maxHour;
            });
            var $curMaxMinItem = $maxMinSpinner.children('li').filter(function () {
              return Number($(this).text()) === maxMin;
            });
            var $curMaxSecItem = $maxSecSpinner.children('li').filter(function () {
              return Number($(this).text()) === maxSec;
            });

            var curMaxTimeItemHeight = $curMaxHourItem.outerHeight();

            datepicker.$timePanel.filter('[data-role="range-end"]').show();

            if ($curMaxHourItem.length > 0 && $curMaxMinItem.length > 0 && $curMaxSecItem.length > 0) {
              $curMaxHourItem.addClass('active').siblings().removeClass('active');
              $curMaxMinItem.addClass('active').siblings().removeClass('active');
              $curMaxSecItem.addClass('active').siblings().removeClass('active');
              $maxHourSpinner.parent().scrollTop(maxHour * curMaxTimeItemHeight);
              $maxMinSpinner.parent().scrollTop(maxMin * curMaxTimeItemHeight);
              $maxSecSpinner.parent().scrollTop(maxSec * curMaxTimeItemHeight);
            } else {
              return;
            }
          }
        }
      },
      _getCellClasses: function (cell) {
        var type = datepicker.type;
        var classes = [];

        // push class 'available' or 'today'
        if (cell.type === 'normal' || cell.type === 'today' && !cell.disabled) {
          classes.push('available');
          if (cell.type === 'today') {
            classes.push('today');
          }
        } else {
          classes.push(cell.type);
        }

        // push class 'current'
        if ((type === 'date' || type === 'datetime') && ((cell.type === 'normal' || cell.type === 'today') &&
          Number(cell.year) === datepicker.date.getFullYear() && Number(cell.month) === datepicker.date.getMonth() &&
          Number(cell.text) === datepicker.date.getDate())) {
          classes.push('current');
        }

        // push class 'in-range' or 'start-date' or 'end-date'
        if (cell.inRange && ((type === 'date-range' || type === 'datetime-range') && (cell.type === 'normal' || cell.type === 'today'))) {
          classes.push('in-range');

          if (cell.start) {
            classes.push('start-date');
          }

          if (cell.end) {
            classes.push('end-date');
          }
        }

        if (cell.disabled) {
          classes.push('disabled');
        }

        return classes.join(' ');
      },
      _setDate: function (date) {
        var type = datepicker.type;
        var format = datepicker.format;
        if (date) {
          if (isString(date)) {
            if (type === 'date-range' || type === 'datetime-range') {
              if (date !== datepicker.value) {
                datepicker.date = date.split(' '+ datepicker.rangeSeparator +' ');
                var minDate = $.parseDate(datepicker.date[0], format);
                var maxDate = $.parseDate(datepicker.date[1], format);
                var startDate = datepicker.startDate && isDate(datepicker.startDate) ? new Date($.clearHours(datepicker.startDate)) : null;
                var endDate = datepicker.endDate && isDate(datepicker.endDate) ? new Date($.clearHours(datepicker.endDate)) : null;
                if (startDate && (minDate.getTime() < startDate.getTime() || maxDate.getTime() < startDate.getTime())) {
                  date = '';
                }
                if (endDate && (minDate.getTime() > endDate.getTime() || maxDate.getTime() > endDate.getTime())) {
                  date = '';
                }
                if (date && date !== '') {
                  if (maxDate.getTime() >= minDate.getTime()) {
                    // EVENT_PICK triggered
                    core._trigger('pick.datepicker', {newDate: date, oldDate: datepicker.value});
                    datepicker.value = date;
                    datepicker.minDate = minDate;
                    datepicker.maxDate = maxDate;
                    core._setRangeDateView(datepicker.$pickerPanel);
                    if (type === 'datetime-range') {
                      datepicker.$pickerPanel.find('.gmi-date-picker--input[data-role="range-start"]')
                        .val($.formatDate(minDate));
                      datepicker.$pickerPanel.find('.gmi-date-picker--input[data-role="range-end"]')
                        .val($.formatDate(maxDate));
                      datepicker.$pickerPanel.find('.gmi-time-picker--input[data-role="range-start"]')
                        .val($.formatDate(minDate, DEFAULT_TIME_FORMAT));
                      datepicker.$pickerPanel.find('.gmi-time-picker--input[data-role="range-end"]')
                        .val($.formatDate(maxDate, DEFAULT_TIME_FORMAT));
                      datepicker.$pickerPanel.find('.gmi-picker-panel__link-btn--determine').removeClass('disabled');
                    }
                    $el.val(date);
                  } else {
                    throw new Error('The maximum date must be greater than or equal to the minimum date');
                  }
                } else {
                  datepicker.date = new Date();
                  datepicker.limitStartDate = new Date();
                }
              }
            } else if (type === 'date' || type === 'datetime') {
              var oldDate = datepicker.date;
              var oldDateTime = oldDate.getTime();
              var newDate = $.parseDate(date, format);
              var newDateTime = newDate.getTime();
              if (oldDateTime !== newDateTime) {
                // EVENT_PICK triggered
                core._trigger('pick.datepicker', {newDate: date, oldDate: $.formatDate(datepicker.date, format)});
                datepicker.value = date;
                datepicker.date = newDate;
                datepicker.yearLabel = newDate.getFullYear();
                datepicker.monthLabel = newDate.getMonth();
                core._setNewDateDOM(datepicker.$pickerPanel, newDate.getFullYear(), newDate.getMonth(), newDate.getDate());
                if (type === 'datetime') {
                  datepicker.$pickerPanel.find('.gmi-date-picker--input').val($.formatDate(newDate));
                  datepicker.$pickerPanel.find('.gmi-time-picker--input').val($.formatDate(newDate, DEFAULT_TIME_FORMAT));
                  datepicker.$pickerPanel.find('.gmi-picker-panel__link-btn--determine')
                    .removeClass('disabled');
                }
                $el.val(date);
              }
            } else if (type === 'month') {
              var oldMonth = $.formatDate(datepicker.date, format);
              var newMonth = date;
              var oldMonthTime = datepicker.date.getTime();
              var newMonthTime = new Date($.parseDate(newMonth, format).getFullYear(), $.parseDate(newMonth, format).getMonth(), 1).getTime();
              if (newMonthTime !== oldMonthTime) {
                // EVENT_PICK triggered
                core._trigger('pick.datepicker', {newDate: newMonth, oldDate: oldMonth});
                if ($.parseDate(newMonth, format).getFullYear() !== datepicker.date.getFullYear()) {
                  datepicker.$pickerPanel.find('.gmi-date-picker__header__label--year')
                    .text($.parseDate(newMonth, format).getFullYear() + ' '+ datepicker.yearSuffix +'');
                  datepicker.$pickerPanel.find('.gmi-month-table td')
                    .attr('data-year', $.parseDate(newMonth, format).getFullYear())
                    .data('year', $.parseDate(newMonth, format).getFullYear());
                }
                datepicker.value = date;
                datepicker.date = new Date($.parseDate(newMonth, format).getFullYear(), $.parseDate(newMonth, format).getMonth(), 1);
                datepicker.yearLabel = $.parseDate(newMonth, format).getFullYear();
                datepicker.monthLabel = $.parseDate(newMonth, format).getMonth();
                core._setNewMonthDOM(datepicker.$pickerPanel, $.parseDate(newMonth, format).getMonth());
                $el.val(newMonth);
              }
            } else if (type === 'year') {
              var oldYear = datepicker.date.getFullYear();
              var oldStartYear = Math.floor(oldYear / 10) * 10;
              var newYear = Number(date);
              var newStartYear = Math.floor(newYear / 10) * 10;
              if (oldYear !== newYear) {
                // EVENT_PICK triggered
                core._trigger('pick.datepicker', {newDate: date, oldDate: oldYear});
                datepicker.value = date;
                datepicker.date = new Date(newYear, 0, 1);
                datepicker.yearLabel = newYear;

                if (oldStartYear === newStartYear) {
                  datepicker.$pickerPanel.find('.gmi-year-table td').removeClass('current').filter(function () {
                    return Number($(this).text()) === newYear;
                  }).addClass('current');
                } else {
                  core._setNewYearDOM(datepicker.$pickerPanel, newYear);
                }
                $el.val(newYear);
              }
            }
          } else if (isDate(date)) {
            if (type === 'date-range' || type === 'datetime-range') return;
            var formatDate = $.formatDate(date, format);
            core._setDate(formatDate);
          }
        } else {
          datepicker.date = new Date();
          datepicker.limitStartDate = new Date();
          if (datepicker.type !== 'date-range' || datepicker.type !== 'datetime-range') {
            datepicker.yearLabel = datepicker.date.getFullYear();
            datepicker.monthLabel = datepicker.date.getMonth();
          }
        }
      },
      _setPrevButtonAction: function ($delegateTarget, currentView) {
        var $yearLabel;
        var year;
        var month;
        switch (currentView) {
          case 'dateView':
            month = datepicker.monthLabel - 1 < 0 ? 11 : datepicker.monthLabel - 1;
            year = datepicker.monthLabel - 1 < 0 ? datepicker.yearLabel - 1 : datepicker.yearLabel;
            core._setNewDateDOM($delegateTarget, year, month);
            datepicker.yearLabel = year;
            datepicker.monthLabel = month;
            break;
          case 'monthView':
            $yearLabel = $delegateTarget.find('.gmi-date-picker__header__label--year');
            year = datepicker.yearLabel - 1;
            month = datepicker.monthLabel;
            $yearLabel.text(year + ' '+ datepicker.yearSuffix +'');
            datepicker.yearLabel = year;
            core._setNewMonthDOM($delegateTarget, month);
            break;
          case 'yearView':
            year = datepicker.yearLabel - 10;
            core._setNewYearDOM($delegateTarget, year);
            datepicker.yearLabel = year;
            break;
          default:
            break;
        }
      },
      _setNextButtonAction: function ($delegateTarget, currentView) {
        var $yearLabel;
        var year;
        var month;
        switch (currentView) {
          case 'dateView':
            month = datepicker.monthLabel + 1 > 11 ? 0 : datepicker.monthLabel + 1;
            year = datepicker.monthLabel + 1 > 11 ? datepicker.yearLabel + 1 : datepicker.yearLabel;
            core._setNewDateDOM($delegateTarget, year, month);
            datepicker.yearLabel = year;
            datepicker.monthLabel = month;
            break;
          case 'monthView':
            $yearLabel = $delegateTarget.find('.gmi-date-picker__header__label--year');
            year = datepicker.yearLabel + 1;
            month = datepicker.monthLabel;
            $yearLabel.text(year + ' '+ datepicker.yearSuffix +'');
            datepicker.yearLabel = year;
            core._setNewMonthDOM($delegateTarget, month);
            break;
          case 'yearView':
            year = datepicker.yearLabel + 10;
            core._setNewYearDOM($delegateTarget, year);
            datepicker.yearLabel = year;
            break;
          default:
            break;
        }
      },
      _setNewDateDOM: function ($delegateTarget, year, month, date) {
        var newDateTableStr = core._getDateTable(new Date(year, month, date ? date : 1));
        var $tableWrapper = $delegateTarget.find('.gmi-picker-panel__body__main');
        var $yearLabel = $delegateTarget.find('.gmi-date-picker__header__label--year');
        var $monthLabel = $delegateTarget.find('.gmi-date-picker__header__label--month');
        $yearLabel.text(year + ' '+ datepicker.yearSuffix +'');
        $monthLabel.show().text(datepicker.monthsShort[month]);
        $delegateTarget.find('.gmi-date-table').remove();
        $(newDateTableStr).appendTo($tableWrapper).show().find('td').removeClass('current').filter(function () {
          return (!$(this).hasClass('prev-month') && !$(this).hasClass('next-month')) && year === datepicker.date.getFullYear() &&
            month === datepicker.date.getMonth() &&
            ($(this).text() === datepicker.todaySuffix ? new Date().getDate() : Number($(this).text()))  === datepicker.date.getDate();
        }).addClass('current');
      },
      _setNewYearDOM: function ($delegateTarget, year, $yearLabel) {
        var $tableWrapper = $delegateTarget.find('.gmi-picker-panel__body__main');
        var $yearLabel = $yearLabel && $yearLabel.length > 0 ? $yearLabel : $delegateTarget.find('.gmi-date-picker__header__label--year');
        var $yearTable = $delegateTarget.find('.gmi-year-table');
        var startYear = Math.floor(year / 10) * 10;
        var endYear = startYear + 9;
        var newYearTableStr = core._getYearTable(year);

        $yearTable.remove();
        // add current class for year table td
        $(newYearTableStr).appendTo($tableWrapper).show().find('td').removeClass('current').filter(function () {
          return !$(this).hasClass('disabled') && Number($(this).text()) === year;
        }).addClass('current');
        $delegateTarget.find('.gmi-year-table').siblings('table').hide();
        // show year label text
        $yearLabel.text(startYear + ' '+ datepicker.yearSuffix +' - ' + endYear + ' '+ datepicker.yearSuffix +'');
      },
      _setNewMonthDOM: function ($delegateTarget, month) {
        var $tableWrapper = $delegateTarget.find('.gmi-picker-panel__body__main');
        var $monthTable = $delegateTarget.find('.gmi-month-table');
        var newMonthTableStr = core._getMonthTable(month);
        $monthTable.remove();
        $(newMonthTableStr).appendTo($tableWrapper).show();
        $delegateTarget.find('.gmi-month-table').siblings('table').hide();
      },
      _setYearView: function ($currentTd) {
        var $yearTable = datepicker.$pickerPanel.find('.gmi-year-table');
        var $yearLabel = datepicker.$pickerPanel.find('.gmi-date-picker__header__label--year');
        var type = datepicker.type;
        var year = Number($currentTd.text());

        $yearTable.find('td').removeClass('current');
        $currentTd.addClass('current');
        if (type === 'date' || type === 'datetime' || type === 'month') {
          $yearTable.hide();
          $yearLabel.text(year + ' '+ datepicker.yearSuffix +'');
          datepicker.yearLabel = year;
          core._setNewMonthDOM(datepicker.$pickerPanel, datepicker.date.getMonth());
          datepicker.currentView = 'monthView';
        } else if (type === 'year') {
          var oldValue = datepicker.date.getTime();
          var elValue = new Date(year, 0, 1).getTime();
          if (elValue !== oldValue) {
            core._trigger('pick.datepicker', {newDate: $.formatDate(new Date(year, 0, 1), datepicker.format), oldDate: $.formatDate(datepicker.date, datepicker.format)});
            datepicker.date = new Date(year, 0, 1);
            datepicker.value = year;
            datepicker.yearLabel = year;
          }
          $el.val($.formatDate(new Date(year, 0, 1), datepicker.format));
          core._hidePickerPanel();
        }
      },
      _setMonthView: function ($currentTd) {
        var $delegateTarget = datepicker.$pickerPanel;
        var $monthTable = $delegateTarget.find('.gmi-month-table');
        var type = datepicker.type;
        var year = datepicker.yearLabel;
        var month = Number($currentTd.data('month'));

        $monthTable.find('td').removeClass('current');
        $currentTd.addClass('current');
        if (type === 'date' || type === 'datetime') {
          core._setNewDateDOM($delegateTarget, year, month);
          $monthTable.hide();
          datepicker.currentView = 'dateView';
        } else if (type === 'month') {
          var oldValue = datepicker.date.getTime();
          var elValue = new Date(year, month, 1).getTime();
          if (elValue !== oldValue) {
            core._trigger('pick.datepicker', {newDate: $.formatDate(new Date(year, month, 1), datepicker.format), oldDate: $.formatDate(datepicker.date, datepicker.format)});
            datepicker.date = new Date(year, month, 1);
          }
          datepicker.value = $.formatDate(new Date(year, month, 1), datepicker.format);
          $el.val($.formatDate(new Date(year, month, 1), datepicker.format));
          core._hidePickerPanel();
        }
        datepicker.monthLabel = month;
      },
      _setRangeDateView: function ($delegateTarget, action) {
        var $leftTableWrapper = $delegateTarget.find('.gmi-picker-panel__body__main.f-lt');
        var $leftDateLabel = $leftTableWrapper.find('.gmi-date-range-picker__body__header > p');
        var $rightTableWrapper = $delegateTarget.find('.gmi-picker-panel__body__main.f-rt');
        var $rightDateLabel = $rightTableWrapper.find('.gmi-date-range-picker__body__header > p');
        var minDate = datepicker.limitStartDate;
        var methodName;
        var leftDate;
        var rightDate;
        var leftTableStr;
        var rightTableStr;

        switch (action) {
          case 'next-year':
            methodName = 'getNextYear';
            break;
          case 'next-month':
            methodName = 'getNextMonth';
            break;
          case 'prev-year':
            methodName = 'getPrevYear';
            break;
          case 'prev-month':
            methodName = 'getPrevMonth';
            break;
          default:
            methodName = 'normal';
            break;
        }

        if (methodName === 'normal') {
          leftDate = datepicker.minDate;
        } else {
          leftDate = $[methodName](minDate);
        }
        datepicker.limitStartDate = leftDate;
        rightDate = $.getNextMonth(leftDate);
        leftTableStr = core._getDateTable(leftDate);
        rightTableStr = core._getDateTable(rightDate);
        $delegateTarget.find('.gmi-date-table').remove();
        $(leftTableStr).appendTo($leftTableWrapper).show();
        $(rightTableStr).appendTo($rightTableWrapper).show();
        $leftDateLabel.text(leftDate.getFullYear() + ' '+ datepicker.yearSuffix +' ' + datepicker.monthsShort[leftDate.getMonth()] + '');
        $rightDateLabel.text(rightDate.getFullYear() + ' '+ datepicker.yearSuffix +' ' + datepicker.monthsShort[rightDate.getMonth()] + '');
      },
      _setTimeView: function ($timeInput, event) {
        var eventType = event.type;
        var keyCode = eventType === 'keyup' ? event.which : null;
        if ($timeInput.val() === '') datepicker.$pickerPanel.find('.gmi-picker-panel__link-btn--determine').addClass('disabled');
        if (eventType === 'focusin' || eventType === 'change' || (eventType === 'keyup' && keyCode && keyCode === KEY_CODE_ENTER)) {
          var hour = $timeInput.val() !== '' && $.parseDate($timeInput.val(), DEFAULT_TIME_FORMAT) ? $.parseDate($timeInput.val(), DEFAULT_TIME_FORMAT).getHours() : 0;
          var minutes = $timeInput.val() !== '' && $.parseDate($timeInput.val(), DEFAULT_TIME_FORMAT) ? $.parseDate($timeInput.val(), DEFAULT_TIME_FORMAT).getMinutes() : 0;
          var seconds = $timeInput.val() !== '' && $.parseDate($timeInput.val(), DEFAULT_TIME_FORMAT) ? $.parseDate($timeInput.val(), DEFAULT_TIME_FORMAT).getSeconds() : 0;
          var role = $timeInput.data('role');
          var time = {};
          switch (role) {
            case 'date':
              time.hour = hour;
              time.min = minutes;
              time.sec = seconds;
              break;
            case 'range-start':
              time.minHour = hour;
              time.minMin = minutes;
              time.minSec = seconds;
              break;
            case 'range-end':
              time.maxHour = hour;
              time.maxMin = minutes;
              time.maxSec = seconds;
              break;
            default:
              break;
          }
        }
        core._echoTimeIntoSpinner(time, role);
      },
      _echoInputValue: function (value) {
        if (datepicker.type === 'date-range' || datepicker.type === 'datetime-range') {
          core._setDate(value);
        } else {
          if ($.parseDate(value, datepicker.format)) {
            core._setDate($.formatDate($.parseDate(value, datepicker.format), datepicker.format));
            $(this).val($.formatDate($.parseDate(value, datepicker.format), datepicker.format));
          }
        }
      },
      _getDatePanelPosition: function () {
        var viewHeight = $(window).height();
        var scrollTop = document.documentElement.scrollTop || window.pageYOffset || document.body.scrollTop;
        var elHeight = $el.outerHeight();
        var panelHeight = datepicker.$pickerPanel.outerHeight();
        var top = $el.offset().top;
        var left = $el.offset().left;
        var classOriginBottomX = datepicker.align === 'left' ? CLASS_PLACEMENT_LEFT_BOTTOM : datepicker.align === 'center' ? CLASS_PLACEMENT_CENTER_BOTTOM : CLASS_PLACEMENT_RIGHT_BOTTOM;

        if ((top - scrollTop > panelHeight) && (top - scrollTop + elHeight + panelHeight > viewHeight)) {
          top -= panelHeight + Number(datepicker.$pickerPanel.css('margin-top').replace(/px/, '')) * 2;
          datepicker.$pickerPanel.addClass(classOriginBottomX);
        } else {
          top += elHeight;
          datepicker.$pickerPanel.removeClass(classOriginBottomX);
        }
        return {top: top, left: left};
      },
      _setDatePanelPosition: function () {
        var elWidth = $el.outerWidth();
        var position = core._getDatePanelPosition();
        var panelWidth;
        var left;
        if (datepicker.$pickerPanel.length > 0) {
          panelWidth = datepicker.$pickerPanel.outerWidth();
          switch (datepicker.align) {
            case 'left':
              left = position.left;
              break;
            case 'center':
              left = position.left - Math.abs(panelWidth - elWidth)/2;
              break;
            case 'right':
              left = position.left - Math.abs(panelWidth - elWidth);
              break;
            default:
              break;
          }
          datepicker.$pickerPanel.css({
            top: position.top + 'px',
            left: left + 'px'
          });
        }
      },
      _clear: function () {
        var type = datepicker.type;
        var $delegateTarget = datepicker.$pickerPanel;
        var $determineLinkButton = $delegateTarget.find('.gmi-picker-panel__link-btn--determine');
        var $yearLabel = $delegateTarget.find('.gmi-date-picker__header__label--year');

        $delegateTarget.find('.gmi-date-picker--input, .gmi-time-picker--input').val('');
        if ($determineLinkButton.length > 0) $determineLinkButton.addClass('disabled');
        if ('' !== datepicker.value) {
          // EVENT_PICK triggered
          core._trigger('pick.datepicker', {newDate: '', oldDate: datepicker.value});
          $el.val('');
          datepicker.date = new Date();
          datepicker.value = '';
          datepicker.yearLabel = datepicker.date.getFullYear();
          datepicker.monthLabel = datepicker.date.getMonth();
        }
        if (type === 'date-range' || type === 'datetime-range') {
          $delegateTarget.find('.gmi-date-table td').removeClass('start-date in-range end-date');
          datepicker.minDate= null;
          datepicker.maxDate= null;
        } else {
          if (type === 'year') {
            core._setNewYearDOM($delegateTarget, datepicker.yearLabel, $yearLabel);
          } else if (type === 'month') {
            $yearLabel.text(datepicker.yearLabel + ' '+ datepicker.yearSuffix +'');
            core._setNewMonthDOM($delegateTarget, datepicker.monthLabel);
          } else {
            core._setNewDateDOM($delegateTarget,datepicker.yearLabel,
              datepicker.monthLabel, new Date().getDate());
          }
        }
      },
      _showPickerPanel: function () {
        if (!datepicker.$pickerPanel.is(':hidden')) return;
        datepicker.$pickerPanel.show();
        // set picker panel position
        core._setDatePanelPosition();

        animation(datepicker.$pickerPanel, 'picker-show', function () {
          core._trigger('show.datepicker');
        });
      },
      _hidePickerPanel: function () {
        var type = datepicker.type;
        var currentView = datepicker.currentView;
        if (datepicker.$pickerPanel.is(':hidden')) return;
        if (type === 'date-range' || type === 'datetime-range' || type === 'month' || type === 'year') {
          animation(datepicker.$pickerPanel, 'picker-hide', function () {
            datepicker.$pickerPanel.hide();
            core._trigger('hide.datepicker');
          });
        } else {
          switch (currentView) {
            case 'yearView':
              datepicker.$pickerPanel.find('.gmi-date-picker__header__label--year')
                .text(datepicker.yearLabel + ' ' + datepicker.yearSuffix)
                .siblings('.gmi-date-picker__header__label--month').show();
              break;
            case 'monthView':
              datepicker.$pickerPanel.find('.gmi-date-picker__header__label--month')
                .show();
              break;
            default:
              break;
          }
          animation(datepicker.$pickerPanel, 'picker-hide', function () {
            datepicker.$pickerPanel.hide().find('.gmi-date-table').show()
                .siblings('table').hide();
            core._trigger('hide.datepicker');
          });
        }
      },
      _elFocusHandler: function () {
        core._showPickerPanel();
      },
      _elClickHandler: function (e) {
        e.stopPropagation();
      },
      _elChangeHandler: function () {
        var elValue = $(this).val();
        core._echoInputValue(elValue);
      },
      _elKeyUpHandler: function (e) {
        var keyCode = e.which;
        var elValue = $(this).val();
        if (keyCode === KEY_CODE_ENTER) {
          core._echoInputValue(elValue);
        }
      },
      _trigger: function (type, data) {
        var evt = $.Event(type, data);
        $el.trigger(evt);
        return evt;
      }
    };

    datepicker.version = '1.0.15';

    datepicker.setDate = function (date) {
      core._setDate(date);
    };

    datepicker.getDate = function () {
      return datepicker.value;
    };

    datepicker.show = function () {
      core._showPickerPanel();
    };

    datepicker.hide = function () {
      core._hidePickerPanel();
    };

    datepicker.clear = function () {
      core._clear();
    };

    datepicker.disable = function (disable) {
      $el.attr('disabled', disable);
      core._hidePickerPanel();
    };

    datepicker.destroy = function () {
      core._unBindEvent();
      core._unCreate();
      $el.removeData('datepicker');
    };

    core._init();
  };

  DatePicker.LANG = {
    'en-US': {
      days: ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'],
      daysMin: ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'],
      months: ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'],
      monthsShort: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
      yearSuffix: '',
      monthSuffix: '',
      todaySuffix: 'Today',
      dateInputPlaceholder: 'Select date',
      rangeStartInputPlaceholder: 'Start Date',
      rangeEndPlaceholder: 'End Date',
      dateTimeInputPlaceholder: 'Select time',
      rangeStartTimeInputPlaceholder: 'Start Time',
      rangeEndTimeInputPlaceholder: 'End Time',
      nowDateButton: 'Now',
      confirmDateButton: 'Confirm',
      cancelTimeButton: 'Cancel',
      clearButton: 'Clear'
    }
  };

  $.fn.datepicker = function (options) {
    var args = toArray(arguments, 1);
    var options = options || {};
    var $self = this;
    var result;

    $self.each(function () {
      var data = $(this).data('datepicker');
      var fn;
      if (!data) {
        if (/destroy/.test(options)) {
          return false;
        }
        if (typeof options !== 'string') return $(this).data('datepicker', (data = new DatePicker($(this), options)));
      }

      if (data && typeof options === 'string' && $.isFunction(fn = data[options])) {
        result = fn.apply(data, args);
      }
    });
    return typeof result === 'undefined' ? $self : result;
  };

  $.fn.datepicker.Constructor = DatePicker;
  $.fn.datepicker.lang = DatePicker.LANG;

  $.isLeapYear = function (year) {
    return year % 4 === 0 && year % 100 !== 0 || year % 400 === 0;
  };

  $.getTotalDayCountOfMonth = function (year, month) {
    var lastDayArray = [31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31],
      totalCount = lastDayArray[month];
    if ($.isLeapYear(year) && month === 1) {
      totalCount++;
    }
    return totalCount;
  };

  $.getWeekDay = function (year, month, date) {
    var date = new Date(year, month-1, date);
    return date.getDay();
  };

  $.getFirstDayOfMonth = function (date) {
    var tempDate = new Date(date.getTime());
    tempDate.setDate(1);
    return tempDate.getDay();
  };

  $.getStartDateOfMonth = function (year, month) {
    var date = new Date(year, month, 1),
      day = date.getDay();
    if (day === 0) {
      date.setTime(date.getTime() - DAY_DURATION * 7);
    } else {
      date.setTime(date.getTime() - DAY_DURATION * day);
    }
    return date;
  };

  $.getWeekNumber = function (d) {
    var date = new Date(d.getTime()),
      firstWeek;
    date.setHours(0, 0, 0, 0);
    date.setDate(date.getDate() + 3 - (date.getDay() + 6) % 7);
    firstWeek = new Date(date.getFullYear(), 0, 4);
    return 1 + Math.round(((date.getTime() - firstWeek.getTime()) / 86400000 - 3 + (firstWeek.getDay() + 6) % 7) / 7);
  };

  $.getPrevMonth = function (d) {
    var year = d.getFullYear(),
      month = d.getMonth(),
      date = d.getDate(),
      newDate = new Date(),
      newYear = month === 0 ? year - 1 : year,
      newMonth = month === 0 ? 11 : month - 1,
      newMonthDayCount = $.getTotalDayCountOfMonth(newYear, newMonth);

    newDate.setMonth(newMonth);
    newDate.setFullYear(newYear);

    if (newMonthDayCount < date) {
      newDate.setDate(newMonthDayCount);
    }
    return new Date(newDate.getTime());
  };

  $.getNextMonth = function (d) {
    var year = d.getFullYear(),
      month = d.getMonth(),
      date = d.getDate(),
      newDate = new Date(),
      newYear = month === 11 ? year + 1 : year,
      newMonth = month === 11 ? 0 : month + 1,
      newMonthDayCount = $.getTotalDayCountOfMonth(newYear, newMonth);

    newDate.setMonth(newMonth);
    newDate.setFullYear(newYear);

    if (newMonthDayCount < date) {
      newDate.setDate(newMonthDayCount);
    }
    return new Date(newDate.getTime());
  };

  $.getPrevYear = function (d) {
    var year = d.getFullYear(),
      month = d.getMonth(),
      date = d.getDate(),
      newDate = new Date(),
      newYear = year - 1,
      newMonth = month,
      newMonthDayCount = $.getTotalDayCountOfMonth(newYear, newMonth);

    newDate.setMonth(newMonth);
    newDate.setFullYear(newYear);

    if (newMonthDayCount < date) {
      newDate.setDate(newMonthDayCount);
    }
    return new Date(newDate.getTime());
  };

  $.getNextYear = function (d) {
    var year = d.getFullYear(),
      month = d.getMonth(),
      date = d.getDate(),
      newDate = new Date(),
      newYear = year + 1,
      newMonth = month,
      newMonthDayCount = $.getTotalDayCountOfMonth(newYear, newMonth);

    newDate.setMonth(newMonth);
    newDate.setFullYear(newYear);

    if (newMonthDayCount < date) {
      newDate.setDate(newMonthDayCount);
    }
    return new Date(newDate.getTime());
  };

  $.clearHours = function (time) {
    var cloneDate = new Date(time);
    cloneDate.setHours(0, 0, 0, 0);
    return cloneDate.getTime();
  };

  $.formatDate = function (date, format) {
    date = new Date(date);
    if (isNaN(date.getTime())) return null;
    if (!date) return '';
    return dateUtils.format(date, format || 'yyyy-MM-dd');
  };

  $.parseDate = function (string, format) {
    return dateUtils.parse(string, format || 'yyyy-MM-dd');
  };

  // toArray Method
  function toArray (obj, offset) {
    var args = [];
    if (Array.from) {
      return Array.from(obj).slice(offset || 0);
    }
    if (typeof offset === 'number' && !isNaN(offset)) {
      args.push(offset);
    }
    return args.slice.apply(obj, args);
  }

  // isString Method
  function isString (str) {
    return typeof str === 'string';
  }

  // isDate Method
  function isDate (date) {
    return typeof date === 'object' && date instanceof Date;
  }

  function animation ($target, classes, fn) {
    $target.removeClass(classes).addClass(classes).one('webkitAnimationEnd mozAnimationEnd MSAnimationEnd oanimationend animationend', function(){
      $(this).removeClass(classes);
      fn.apply($target, toArray(arguments));
    });
    if (isIE && IE_MODE <= 9) {
      $target.removeClass(classes);
      fn.apply($target, toArray(arguments));
    }
  }
});
