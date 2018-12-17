$(document).ready(function(){
  $("#createUser").validate({
    rules:{
      firstName:{
        required: true,
        rangelength: [3,45]
      },
    },
    errorClass: "help-inline",
    errorElement: "span",
    highlight:function(element, errorClass, validClass){
      $(element).parents(".form-group").addClass("error");
    },
    unhighligth:function(element, errorClass, validClass){
      $(element).parents(".form-group").removeClass("error");
    },
  });
});
