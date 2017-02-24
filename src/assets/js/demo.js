/**
 * Created by Greg Zhang.
 */
(function ($) {
  var $tplEle;
  var $datepicker;
  var datepicker;
  var compileData = {
    title: 'Date',
    description: 'Basic date picker measured by "date".',
    format: '',
    align: ''
  };

  $('ul.datepicker-demo-guide__list').find('>li a').on('click', function() {
    var $a = $(this);
    var $indexContainer = $('.datepicker-index-container');
    var $insContainer = $('.datepicker-demo__main');
    var type = $a.data('role');
    var tpl;
    switch (type) {
      case 'datetime':
        compileData.title = 'Datetime';
        compileData.description = 'Basic date picker measured by "datetime".';
        compileData.format = 'MM/dd/yyyy HH:mm:ss';
        compileData.align = 'right';
        break;
      case 'year':
        compileData.title = 'Year';
        compileData.description = 'Basic date picker measured by "year".';
        compileData.format = 'yyyy';
        break;
      case 'month':
        compileData.title = 'Month';
        compileData.description = 'Basic date picker measured by "month".';
        compileData.format = 'MM/yyyy';
        break;
      case 'date-range':
        compileData.title = 'Range date';
        compileData.description = 'Basic date picker measured by "range date".';
        break;
      case 'datetime-range':
        compileData.title = 'Range datetime';
        compileData.description = 'Basic date picker measured by "range datetime".';
        compileData.format = 'dd/MM/yyyy-HH:mm:ss';
        compileData.align = 'center';
        break;
      default:
        break;
    }
    tpl = Handlebars.compile($('#tpl-datepicker').html())(compileData);
    if ($tplEle && $tplEle.length > 0) $tplEle.remove();
    $tplEle = $(tpl).appendTo($insContainer);
    $indexContainer.hide();
    // init datepicker
    $datepicker = $('#gmi-datepicker--input').datepicker({
      type: type,
      format: compileData.format,
      align: compileData.align !== '' ? compileData.align : 'left',
      startDate: new Date(2016, 11, 16),
      endDate: new Date(2017, 2, 15),
      onChange: function (newValue) {
        $('.callback-content[data-role=change]').text(newValue);
        $('.events-content[data-role=pick]').text(newValue);
        $('.gmi-datepicker-button--input').val(newValue);
      }
    });

    datepicker = $datepicker.data('datepicker');
    // show format attribute
    $('.attr-content[data-role=format]').text(compileData.format !== '' ? compileData.format : datepicker.format);
    // show align attribute
    $('.attr-content[data-role=align]').text(datepicker.align !== '' ? datepicker.align : datepicker.align);

    // bind events
    _bindEvent();
  });

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
})(jQuery);
