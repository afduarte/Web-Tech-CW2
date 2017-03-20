$(function () {
  $('#new-pledge').on('click', function (e) {
    $.ajax({
      url: "pledge",
      method: 'POST',
      data: {
        name: $('#name').val(),
        address: $('#address').val(),
        amount: $('#amount').val()
      },
      success: function (result) {
        updatePledges();
      }
    });
  });
  function updatePledges() {
    $.ajax({
      type: "GET",
      url: "pledge",
      dataType: "json",
      success: function (result) {
        $('#pledges ul').empty();
        console.log(result)
        $('#pledges ul').append(result.map(function (item) {
          return $('<li/>', {class:'list-group-item', text: 'Name: ' + item.name + ' Amount: ' + item.amount + '£' });
        }));
      }
    });
  }
})