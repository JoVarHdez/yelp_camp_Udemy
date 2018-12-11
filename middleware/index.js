var Campground = require("../models/campground");
var Comment = require("../models/comment");

var middlewareObj = {};

middlewareObj.checkCampgroundOwnership= function (req, res, next) {
  if(req.isAuthenticated()){
    Campground.findById(req.params.id, function(error, foundCampground){
      if(error){
        res.redirect("back");
      } else {
        if(foundCampground.author.id.equals(req.user.id)){
          next();
        } else {
          res.redirect("back");
        }
      }
    });
  } else {
    res.redirect("back");
  }
};

middlewareObj.checkCommentOwnership= function (req, res, next) {
  if(req.isAuthenticated()){
    Comment.findById(req.params.idComment, function(error, foundComment){
      if(error){
        res.redirect("back");
      } else {
        if(foundComment.author.id.equals(req.user.id)){
          next();
        } else {
          res.redirect("back");
        }
      }
    });
  } else {
    res.redirect("back");
  }
};

middlewareObj.isLoggedIn = function (req, res, next) {
    if(req.isAuthenticated()){
      return next();
    }
    res.redirect("/login");
};

module.exports = middlewareObj;
