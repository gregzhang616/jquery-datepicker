(function (factory) {
  if (typeof define === 'function' && define.amd) {
    define('datepicker.en-US', ['jquery'], factory);
  } else if (typeof exports === 'object') {
    factory(require('jquery'));
  } else {
    factory(jQuery);
  }
})(function ($) {
  $.fn.datepicker.lang['en-US'] = {
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
  };
});
