$(function () {
  $('.nojs').remove();
  $('#modules').removeClass('hide');
  $('.main-row').addClass('expanded');
  $('.main-row').hide();
  $('.mod-info').addClass('large-12')
  showQuestions($('.main-row').first());
  $('.submit-btn').addClass('fixed-submit');
  $('.q-container').removeClass('large-12');
  $('.q-container').addClass('large-8');
  $('.mod-btn').first().addClass('active');
  $('.mod-info').each(function (i, el) {
    $(el).prependTo("nav[data-mod='" + $(el).data('mod') + "']");
  });
  // Event Handling

  // -- Value changes for question specific sliders
  $('.range.q-slider input').on('input change', function (e) {
    $(this).next('output').text(data.answers[$(this).val() - 1])
  });

  // -- Value changes for top level sliders
  $('.range.cat-slider input').on('input', function (e) {
    var selected = $(this);
    selected.next('output').text(data.topAnswers[selected.val() - 1]);
    $(".q-list[data-mod='" + $('.mod-btn.active').data('mod') + "']#" + selected.attr('id'))
      .find('.range.q-slider input').val(selected.val()).change();
  });

  // -- Submit handler
  $('.submit-btn').on('click', function (e) {
    // disable the default submit action
    e.preventDefault();
    // replace the icon with the loading one
    var icon = $(this).find('i');
    icon.removeClass('fa-floppy-o').addClass('fa-circle-o-notch fa-spin fa-fw');
    // Send the form data 
    $.post('save', $("form[data-mod='" + $('.mod-btn.active').data('mod') + "']").serialize())
      .done(function () {
        // replace the icons again
        icon.removeClass('fa-circle-o-notch fa-spin fa-fw').addClass('fa-check-circle-o');
        icon.parent().addClass('success');
        icon.next('span').text('Saved!')
        $('.mod-btn.active').addClass('success');
        setTimeout(function (args) {
          args[0].removeClass('fa-check-circle-o').addClass('fa-floppy-o');
          args[0].parent().removeClass('success');
          args[0].next('span').text('Submit');
        }, 1000, [icon])
      }).error(function () {
        icon.removeClass('fa-circle-o-notch fa-spin fa-fw').addClass('fa-times');
        icon.parent().addClass('alert');
        icon.next('span').text('Error!')
        setTimeout(function (args) {
          args[0].removeClass('fa-check-circle-o').addClass('fa-floppy-o');
          args[0].parent().removeClass('alert');
          args[0].next('span').text('Submit');
        }, 2000, [icon])
      });
  });

  // -- Module switcher
  $('.mod-btn').on('click', changeMod);

  function changeMod(e) {
    var mod = $(this);
    if (mod.hasClass('active')) return;
    $('.mod-btn').removeClass('active');
    mod.addClass('active');
    showQuestions($(".main-row[data-mod='" + mod.data('mod') + "']"));
  }
  // -- Category switcher
  $('.category').on('click', changeCat);
  // change the view when one of the sliders is moved
  $('.range.cat-slider input').on('input', changeCat);

  function changeCat(e) {
    var category;
    if (e.type == 'click') {
      // handle category click event
      category = $(this);
    } else if (e.type == 'input') {
      // handle input event by going 2 levels up
      category = $(this).parent().parent().parent();
    }
    if (category.hasClass('active')) return;
    $('.category').removeClass('active');
    category.addClass('active');
    var selected = category.find('input');
    $('.q-list').hide('fast')
    $('.q-list#' + selected.attr('id')).show('fast');
    $('html, body').animate({
        scrollTop: $('.q-list#' + selected.attr('id')).offset().top
    }, 500);
  }

  // // Manually trigger the change event on all inputs so the labels update
  // $('input').change();
});

function showQuestions($el) {
  $('.main-row').hide('fast');
  $el.show('fast')
  $el.find('nav').removeClass('hide');
  $el.find('.q-list').hide();
  $el.find('.q-list').first().show();
  $el.find('.category').first().trigger('click');
}
