$(function () {
  // global chart objects so we can update instead of creating a new one when a new call is made to the server
  var radar;
  var bar;
  // keep a global map of the modules selected to get the module name
  var modNames = {}
  // keep a global map of the modules selected to get the module name
  var qCategories = {};
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
  // We have to listen on the body because the autocomplete items don't exist on document ready.
  // $(selector).on() can take a second parameter that is a context for the click event, 
  // which works very well for cases like this
  $('body').on('click', '.autocomplete .autocomplete-item', function (e) {
    var clicked = $(this);
    modNames[clicked.data('code')] = clicked.text().split(' - ')[1];
    clicked.parent().parent().find('input').val(clicked.data('code'));
  });

  // GO Button click
  $('#get-results').on('click', function (e) {
    // Build the radar chart
    $('#radar').parent().find('h5').removeClass('hide')
    $.getJSON('module?mod1=' + $('#mod-1-in').val() + '&mod2=' + $('#mod-2-in').val(), function (data) {
      radar = radarChart(radar, $('#radar'), {
        // get the questions
        labels: data[Object.keys(data)[0]].map(function (i) { return i.q }),
        datasets: Object.keys(data).map(function (mod, i) {
          var r = rand255();
          var g = rand255();
          var b = rand255();
          return {
            label: modNames[mod] || mod,
            data: data[mod].map(function (q) { return q.value }),
            backgroundColor: 'rgba(' + r + ',' + g + ',' + b + ',0.3)',
            borderColor: 'rgba(' + r + ',' + g + ',' + b + ',1)'
          }
        }),
      },
        {
          scale: {
            ticks: {
              stepSize: 0.5,
              max: 5,
              beginAtZero: true
            }
          },
          tooltips: {
            callbacks: {
              title: function (tooltipItem, data) {
                var qCode = data.labels[tooltipItem[0].index]
                var question = globalData.questions.find(function (item) { return item.QUE_CODE == qCode });
                return question.QUE_CODE + ' : ' + question.QUE_NAME;
              },
            }
          }
        })
    });
    // Build the bar chart
    $.getJSON('category?mod1=' + $('#mod-1-in').val() + '&mod2=' + $('#mod-2-in').val(), function (data) {
      $('#bar').parent().find('h5').removeClass('hide')
      bar = barChart(bar, $('#bar'), {
        // get the questions
        labels: data[Object.keys(data)[0]].map(function (i) { return i.c }),
        datasets: Object.keys(data).map(function (mod, i) {
          var r = rand255();
          var g = rand255();
          var b = rand255();
          data[mod].forEach(function (cat) { qCategories[cat.c] = cat.cName; });
          return {
            label: modNames[mod] || mod,
            data: data[mod].map(function (c) { return c.value }),
            backgroundColor: 'rgba(' + r + ',' + g + ',' + b + ',0.3)',
            borderColor: 'rgba(' + r + ',' + g + ',' + b + ',1)'
          }
        }),
      },
        {
          scales: {
            yAxes: [{
              ticks: {
                stepSize: 0.5,
                max: 5,
                beginAtZero: true
              }
            }]
          },
          tooltips: {
            callbacks: {
              title: function (tooltipItem, data) {
                var cCode = data.labels[tooltipItem[0].index]
                return cCode + ' : ' + qCategories[cCode];
              },
            }
          }
        })
    });
  });

  if (globalData.mod1) {
    $('#mod-1-in').val(globalData.mod1).change();
  }
  if (globalData.mod2) {
    $('#mod-2-in').val(globalData.mod2).change();
  }
  if (globalData.mod1 || globalData.mod2) {
    $('#get-results').trigger('click');
  }
});