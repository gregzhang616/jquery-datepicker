(function (factory, jQuery) {
  if (typeof define === 'function' && define.amd) {
    define('datepicker.ru-RU', ['jquery'], factory);
  } else if (typeof exports === 'object') {
    factory(require('jquery'));
  } else {
    factory(jQuery);
  }
})(function ($) {
  $.fn.datepicker.lang['ru-RU'] = {
    days: ['Воскресенье', 'Понедельник', 'Вторник', 'Среда', 'Четверг', 'Пятница', 'Суббота'],
    daysMin: ['ВС', 'ПН', 'ВТ', 'СР', 'ЧТ', 'ПТ', 'СБ'],
    months: ['Январь', 'Февраль', 'Март', 'Апрель', 'Май', 'Июнь', 'Июль', 'Август', 'Сентябрь', 'Октябрь', 'Ноябрь', 'Декабрь'],
    monthsShort: ['Янв', 'Фев', 'Мар', 'Апр', 'Май', 'Июнь', 'Июль', 'Авг', 'Сен', 'Окт', 'Ноя', 'Дек'],
    yearSuffix: '',
    monthSuffix: '',
    todaySuffix: 'Сегодня',
    dateInputPlaceholder: 'Выберите дату',
    rangeStartInputPlaceholder: 'Начальная дата',
    rangeEndPlaceholder: 'Конечная дата',
    dateTimeInputPlaceholder: 'Выберите время',
    rangeStartTimeInputPlaceholder: 'Начальное время',
    rangeEndTimeInputPlaceholder: 'Конечное время',
    nowDateButton: 'Сейчас',
    confirmDateButton: 'Подтвердить',
    cancelTimeButton: 'Отмена',
    clearButton: 'Очистить'
  };
}, window.jQuery);
