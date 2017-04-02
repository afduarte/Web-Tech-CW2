$(function () {
  // autocomplete
  var ajax;
  $('.mod-code').on('input', function (e) {
    var input = $(this);
    var ul = input.parent().find('ul');
    ul.empty();
    if (input.val().length < 2) return;
    // abort a previously made request (still typing)
    if (ajax && ajax.readyState != 4) {
      ajax.abort();
    }
    ajax = $.ajax({
      type: 'GET',
      url: 'autocomplete?q=' + input.val(),
      dataType: "json",
      success: function (results) {
        ul.append(results.map(function (item) {
          return '<li class="autocomplete-item" data-code="' + item.MOD_CODE + '">' + item.MOD_CODE + ' - ' + item.MOD_NAME + '</li>'
        }));
        ul.foundation('open');
      },
      error: function (response) {
        var ul = input.parent().find('ul')
        ul.empty();
        ul.foundation('close');
      }
    });
  });

  // Event Handling
  // Autocomplete item click
  $('body').on('click','.autocomplete .autocomplete-item',function(e){
    var clicked = $(this);
    clicked.parent().parent().find('input').val(clicked.data('code'));
  });

});