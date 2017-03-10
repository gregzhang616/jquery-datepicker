/**
 * Created by Greg Zhang.
 */
(function (factory, jQuery) {
  if (typeof define === 'function' && define.amd) {
    define('datepicker.vi', ['jquery'], factory);
  } else if (typeof exports === 'object') {
    factory(require('jquery'));
  } else {
    factory(jQuery);
  }
})(function ($) {
  $.fn.datepicker.lang['vi'] = {
    days: ["Chủ Nhật","Thứ 2", "Thứ 3", "Thứ 4", "Thứ 5", "Thứ 6", "Thứ 7", "Chủ Nhật"],
    daysMin: ["CN", "T2", "T3", "T4", "T5", "T6", "T7", "CN"],
    months: ["Tháng 1", "Tháng 2", "Tháng 3", "Tháng 4", "Tháng 5", "Tháng 6", "7", "Tháng 8", "Tháng 9", "Tháng 10", "Tháng 11", "Tháng 12"],
    monthsShort: ["Thg1", "Thg2", "Thg3", "Thg4", "Thg5", "Thg6", "Thg7", "Thg8", "Thg9", "Thg10", "Thg11", "Thg12"],
    yearSuffix: '',
    monthSuffix: '',
    todaySuffix: 'Hôm nay',
    dateInputPlaceholder: 'tuyển chọn ngày tháng',
    rangeStartInputPlaceholder: 'bắt đầu công việc ngày tháng',
    rangeEndPlaceholder: 'cuối cùng ngày tháng',
    dateTimeInputPlaceholder: 'tuyển chọn thời điểm',
    rangeStartTimeInputPlaceholder: 'bắt đầu công việc thời điểm',
    rangeEndTimeInputPlaceholder: 'cuối cùng thời điểm',
    nowDateButton: 'hiện nay',
    confirmDateButton: 'quyết định',
    cancelTimeButton: 'hủy bỏ',
    clearButton: 'trong suốt'
  };
}, window.jQuery);
