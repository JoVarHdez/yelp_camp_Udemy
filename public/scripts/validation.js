$(document).ready(function(){
  $("#createUser").validate({
    rules:{
      username:{
        required: true,
        minlength: 6
      },
      email: "required",
      firstName:{
        required: true,
        rangelength: [3,45]
      },
      lastName:{
        required: true,
        rangelength: [3,45]
      },
      image: "required",
      password: {
        required: true,
        rangelength: [6,18]
      }
    },
    errorClass: "help-inline",
    errorElement: "span",
    highlight:function(element, errorClass, validClass){
      $(element).parents(".form-group").addClass("text-danger");
    },
    unhighligth:function(element, errorClass, validClass){
      $(element).parents(".form-group").removeClass("text-danger");
    },
  });
});
