$(function(){
  // Event Handling
  // -- Date changes
  $('.range.q-slider input').on('input change', function (e) {
    $(this).next('output').text(data.answers[$(this).val() - 1])
  });
  // Top slider
  $('.range.cat-slider input').on('input', function(e){
    var selected = $(this);
    selected.next('output').text(data.topAnswers[selected.val() - 1])
    console.log("running top slider event: "+selected.val());
    $(this).parent().parent().find('.range.q-slider input').val(selected.val()).change();
  })
})
