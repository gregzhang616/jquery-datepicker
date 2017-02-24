/**
 * Created by Greg Zhang.
 */
(function ($, type) {
  var $datepicker;
  var datepicker;

  // init datepicker plugin
  switch (type) {
    case 'date':
      $datepicker = $('#gmi-datepicker-date--input').datepicker({
        startDate: new Date(2016, 11, 16),
        endDate: new Date(2017, 2, 15),
        onChange: function (newValue) {
          $('.callback-content[data-role=change]').text(newValue);
          $('.events-content[data-role=pick]').text(newValue);
          $('.gmi-datepicker-button--input').val(newValue);
        }
      });
      break;
    case 'datetime':
      $datepicker = $('#gmi-datepicker-datetime--input').datepicker({
        type: 'datetime',
        format: 'MM/dd/yyyy HH:mm:ss',
        startDate: new Date(2016, 11, 16),
        endDate: new Date(2017, 2, 15),
        defaultValue: '02/26/2017 08:26:32',
        align: 'right',
        onChange: function (newValue) {
          $('.callback-content[data-role=change]').text(newValue);
          $('.events-content[data-role=pick]').text(newValue);
          $('.gmi-datepicker-button--input').val(newValue);
        }
      });
      break;
    case 'month':
      $datepicker = $('#gmi-datepicker-month--input').datepicker({
        type: 'month',
        format: 'MM/yyyy',
        startDate: new Date(2016, 11, 16),
        endDate: new Date(2017, 2, 15),
        defaultValue: new Date(2017, 0, 15),
        placeholder: 'Please pick a month',
        onChange: function (newValue) {
          $('.callback-content[data-role=change]').text(newValue);
          $('.events-content[data-role=pick]').text(newValue);
          $('.gmi-datepicker-button--input').val(newValue);
        }
      });
      break;
    case 'year':
      $datepicker = $('#gmi-datepicker-year--input').datepicker({
        type: 'year',
        startDate: new Date(2009, 11, 16),
        endDate: new Date(2017, 2, 15),
        defaultValue: '2016',
        placeholder: 'Please pick a year',
        onChange: function (newValue) {
          $('.callback-content[data-role=change]').text(newValue);
          $('.events-content[data-role=pick]').text(newValue);
          $('.gmi-datepicker-button--input').val(newValue);
        }
      });
      break;
    case 'date-range':
      $datepicker = $('#gmi-datepicker-date-range--input').datepicker({
        type: 'date-range',
        startDate: new Date(2016, 11, 16),
        endDate: new Date(2017, 2, 15),
        defaultValue: '2016-12-26 - 2017-02-09',
        placeholder: 'Please pick a range date',
        onChange: function (newValue) {
          $('.callback-content[data-role=change]').text(newValue);
          $('.events-content[data-role=pick]').text(newValue);
          $('.gmi-datepicker-button--input').val(newValue);
        }
      });
      break;
    case 'datetime-range':
      $datepicker = $('#gmi-datepicker-datetime-range--input').datepicker({
        type: 'datetime-range',
        format: 'dd/MM/yyyy-HH:mm:ss',
        startDate: new Date(2016, 11, 16),
        endDate: new Date(2017, 2, 15),
        defaultValue: '26/12/2016-12:22:08 - 09/02/2017-20:08:06',
        placeholder: 'Please pick a range datetime',
        align: 'center',
        onChange: function (newValue) {
          $('.callback-content[data-role=change]').text(newValue);
          $('.events-content[data-role=pick]').text(newValue);
          $('.gmi-datepicker-button--input').val(newValue);
        }
      });
      break;
    default:
      break;
  }
  datepicker = $datepicker.data('datepicker');
  // show format attribute
  $('.attr-content[data-role=format]').text(datepicker.format);
  // show align attribute
  $('.attr-content[data-role=align]').text(datepicker.align);

  // bind events
  _bindEvent();

  function _bindEvent () {
    // bind show event
    $datepicker.on('show.datepicker', function (e) {
      var eventType = e.type;
      $('.events-content').filter('[data-role='+ eventType +']').text('true');
      $('.events-content').filter('[data-role=hide]').text('false');
    });

    // bind hide event
    $datepicker.on('hide.datepicker', function (e) {
      var eventType = e.type;
      $('.events-content').filter('[data-role='+ eventType +']').text('true');
      $('.events-content').filter('[data-role=show]').text('false');
    });

    // bind pick event
    $datepicker.on('pick.datepicker', function (e) {
      console.log(arguments);
    });

    $('.gmi-button').on('click', function (e) {
      var $self = $(this);
      var action = $self.data('action');
      var value;
      switch (action) {
        case 'setDate':
          value = $('.gmi-datepicker-button--input').filter('[data-action='+ action +']').val();
          $datepicker.datepicker('setDate', value);
          break;
        case 'getDate':
          value = $datepicker.datepicker('getDate');
          alert(value);
          break;
        case 'show':
          $datepicker.datepicker('show');
          break;
        case 'hide':
          $datepicker.datepicker('hide');
          break;
        case 'disable':
          $datepicker.datepicker('disable', true);
          break;
        case 'enable':
          $datepicker.datepicker('disable', false);
          break;
        case 'clear':
          $datepicker.datepicker('clear');
          break;
        default:
          break;
      }
      e.stopPropagation();
    });
  }
})(jQuery, currentType);
