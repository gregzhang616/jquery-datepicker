(function (factory) {
  if (typeof define === 'function' && define.amd) {
    define('datepicker.zh-CN', ['jquery'], factory);
  } else if (typeof exports === 'object') {
    factory(require('jquery'));
  } else {
    factory(jQuery);
  }
})(function ($) {
  $.fn.datepicker.lang['zh-CN'] = {
    days: ['星期日', '星期一', '星期二', '星期三', '星期四', '星期五', '星期六'],
    daysShort: ['周日', '周一', '周二', '周三', '周四', '周五', '周六'],
    daysMin: ['日', '一', '二', '三', '四', '五', '六'],
    months: ['一月', '二月', '三月', '四月', '五月', '六月', '七月', '八月', '九月', '十月', '十一月', '十二月'],
    monthsShort: ['1 月', '2 月', '3 月', '4 月', '5 月', '6 月', '7 月', '8 月', '9 月', '10 月', '11 月', '12 月'],
    yearSuffix: '年',
    monthSuffix: '月',
    todaySuffix: '今天',
    dateInputPlaceholder: '当前日期',
    rangeStartInputPlaceholder: '开始日期',
    rangeEndPlaceholder: '结束日期',
    dateTimeInputPlaceholder: '当前时间',
    rangeStartTimeInputPlaceholder: '开始时间',
    rangeEndTimeInputPlaceholder: '结束时间',
    nowDateButton: '此刻',
    confirmDateButton: '确定',
    cancelTimeButton: '取消',
    clearButton: '清空'
  };
});
